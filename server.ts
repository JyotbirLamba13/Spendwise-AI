import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { SYSTEM_PROMPT, AnalysisReport } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── AI Response Validation ────────────────────────────────────────────────────

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('AI returned an unreadable response. Please try again.');
  }
}

function isValidReport(obj: unknown): obj is AnalysisReport {
  if (!obj || typeof obj !== 'object') return false;
  const r = obj as Record<string, unknown>;
  return (
    typeof r.totalIncome === 'number' &&
    typeof r.totalSpend === 'number' &&
    Array.isArray(r.insights) &&
    Array.isArray(r.categories) &&
    typeof r.currency === 'object' &&
    r.currency !== null &&
    typeof (r.currency as any).symbol === 'string'
  );
}

// Only these messages may reach clients — all others become generic
const USER_SAFE_MESSAGES = new Set([
  'AI service is busy. Please wait a moment and try again.',
  'Could not reach the AI service. Please try again.',
  'AI returned an empty response. Please try again.',
  'AI returned an unreadable response. Please try again.',
]);

function userSafeError(msg: string): string {
  return USER_SAFE_MESSAGES.has(msg) ? msg : 'Analysis failed. Please try again.';
}

// ── Groq AI Analysis ──────────────────────────────────────────────────────────

async function analyzeWithGroq(text: string): Promise<AnalysisReport> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('Service configuration error.');

  // Keep more context for richer analysis — llama-3.3-70b supports 128k tokens
  const cleanedText = text.slice(0, 24_000);

  let response: Response;
  try {
    response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Analyze this bank statement thoroughly and return complete JSON only:\n\n${cleanedText}` },
        ],
        temperature: 0.1,
        max_tokens: 6000,
        response_format: { type: 'json_object' },
      }),
    });
  } catch {
    throw new Error('Could not reach the AI service. Please try again.');
  }

  if (!response.ok) {
    // Log status internally but never expose provider or key details to clients
    console.error(`[groq] HTTP ${response.status}`);
    if (response.status === 429) throw new Error('AI service is busy. Please wait a moment and try again.');
    throw new Error('Analysis failed. Please try again.');
  }

  const data = await response.json() as any;
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('AI returned an empty response. Please try again.');

  return safeJsonParse(content) as AnalysisReport;
}

// ── Express Server ────────────────────────────────────────────────────────────

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Trust reverse proxy (Render, etc.) for accurate client IPs in rate limiting
  app.set('trust proxy', 1);

  // ── Security headers (no CSP — SPA needs inline assets; add once routes are known) ──
  app.use(helmet({ contentSecurityPolicy: false }));

  // ── Rate limiting: 20 requests per 15 minutes per IP on the analysis endpoint ──
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1_000,
    max: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
      error: 'RATE_LIMITED',
      message: 'Too many requests. Please wait before trying again.',
    },
  });

  // ── Body parsers ──
  app.use(express.json({ limit: '512kb', strict: true }));
  app.use(express.urlencoded({ extended: false, limit: '4kb' }));

  // ── Analysis endpoint ─────────────────────────────────────────────────────
  // Accepts only JSON { text: string, fileName: string }
  // Raw files and passwords are handled entirely in the browser — never reach here
  app.post('/api/parse-document', apiLimiter, async (req, res) => {
    try {
      const body = req.body as Record<string, unknown>;
      const text = body?.text;
      const fileName = body?.fileName;

      // Input validation
      if (typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ error: 'INVALID_INPUT', message: 'No document text provided.' });
      }
      if (typeof fileName !== 'string') {
        return res.status(400).json({ error: 'INVALID_INPUT', message: 'Invalid request.' });
      }
      if (text.length > 100_000) {
        return res.status(400).json({ error: 'INVALID_INPUT', message: 'Document text is too long.' });
      }

      // AI analysis
      let report: AnalysisReport;
      try {
        report = await analyzeWithGroq(text);
      } catch (aiErr: any) {
        return res.status(500).json({
          error: 'ANALYSIS_FAILED',
          message: userSafeError(aiErr.message),
        });
      }

      // Non-financial document
      if ((report as any).isFinancialDocument === false) {
        return res.status(422).json({
          error: 'NON_FINANCIAL_DOCUMENT',
          message: 'This document does not appear to be a bank statement or financial transaction record.',
        });
      }

      // Schema validation — never forward an unstructured AI blob to the client
      if (!isValidReport(report)) {
        console.error('[analyze] AI returned invalid schema');
        return res.status(500).json({
          error: 'ANALYSIS_FAILED',
          message: 'Could not analyze this document. Please try again.',
        });
      }

      // Sanitize fileName before echoing it back
      const safeName = String(fileName).replace(/[^\w\s.\-]/g, '').slice(0, 255);
      res.json({ report, fileName: safeName });

    } catch (err: any) {
      console.error('[server] unexpected error:', err.message);
      res.status(500).json({ error: 'SERVER_ERROR', message: 'An unexpected error occurred. Please try again.' });
    }
  });

  // ── Vite dev / static production ──
  if (!isProd) {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));
}

startServer();
