import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import multer from 'multer';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { SYSTEM_PROMPT, AnalysisReport } from './src/types.ts';

const _require = createRequire(import.meta.url);
const workerPath = _require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = `file://${workerPath}`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── PDF TEXT EXTRACTION ─────────────────────────────────────────────────────

async function extractTextFromPDF(buffer: Buffer, password?: string): Promise<string> {
  const data = new Uint8Array(buffer);
  const loadingTask = (pdfjsLib as any).getDocument({
    data,
    password: password || undefined,
    useSystemFonts: true,
    disableFontFace: true,
  });

  try {
    const pdf = await loadingTask.promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => ('str' in item ? item.str : '')).join(' ') + '\n';
    }
    return text;
  } catch (err: any) {
    if (err.name === 'PasswordException') throw new Error('PASSWORD_REQUIRED');
    throw err;
  }
}

// ─── GEMINI AI ANALYSIS ───────────────────────────────────────────────────────

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('AI returned an unreadable response. Please try again.');
  }
}

async function analyzeWithGemini(text: string): Promise<AnalysisReport> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set in Render environment variables.');

  const cleanedText = text.slice(0, 12000);

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
          { role: 'user', content: `Analyze this bank statement and return STRICT JSON only:\n\n${cleanedText}` },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
    });
  } catch {
    throw new Error('Could not reach the AI service. Please try again.');
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as any;
    const msg = err?.error?.message || '';
    console.error('Groq API error — HTTP:', response.status, '|', msg);
    if (response.status === 429) throw new Error('AI service is busy. Please wait a moment and try again.');
    if (response.status === 401) throw new Error('Invalid Groq API key. Check GROQ_API_KEY in Render → Environment.');
    throw new Error(`AI request failed (${response.status}): ${msg || 'Please try again.'}`);
  }

  const data = await response.json() as any;
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('AI returned an empty response. Please try again.');

  return safeJsonParse(content) as AnalysisReport;
}

// ─── EXPRESS SERVER ───────────────────────────────────────────────────────────

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  });

  app.use(express.urlencoded({ extended: true }));

  app.post(
    '/api/parse-document',
    upload.fields([
      { name: 'file', maxCount: 1 },
      { name: 'password', maxCount: 1 },
    ]),
    async (req: any, res) => {
      try {
        const file = req.files?.file?.[0];
        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        const { buffer, originalname, mimetype, size } = file;

        if (size > 10 * 1024 * 1024)
          return res.status(400).json({ error: 'File too large (max 10MB)' });

        if (mimetype !== 'application/pdf' && !originalname.toLowerCase().endsWith('.csv'))
          return res.status(400).json({ error: 'Unsupported file format. Upload PDF or CSV only.' });

        // ── Extract text ──
        let text = '';

        if (originalname.toLowerCase().endsWith('.pdf')) {
          const password = req.body?.password || undefined;
          try {
            text = await extractTextFromPDF(buffer, password);
            if (!text || text.trim().length < 30) {
              return res.status(400).json({
                error: 'SCAN_DETECTED',
                message: 'This PDF appears to be scanned or image-based. Please upload a text-based PDF.',
              });
            }
          } catch (error: any) {
            if (error.message === 'PASSWORD_REQUIRED') {
              return res.status(401).json({
                error: 'PASSWORD_REQUIRED',
                message: 'This PDF is password protected. Please enter the password.',
              });
            }
            console.error('PDF parsing error:', error.message);
            return res.status(500).json({
              error: 'PDF parsing failed',
              message: `Could not read this PDF: ${error.message}`,
            });
          }
        } else {
          text = buffer.toString('utf-8');
        }

        // ── Analyze with Gemini ──
        try {
          const report = await analyzeWithGemini(text);
          res.json({ report, fileName: originalname });
        } catch (aiError: any) {
          console.error('AI analysis error:', aiError.message);
          return res.status(500).json({ error: 'AI analysis failed', message: aiError.message });
        }
      } catch (error: any) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Failed to process document' });
      }
    }
  );

  if (process.env.NODE_ENV !== 'production') {
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
