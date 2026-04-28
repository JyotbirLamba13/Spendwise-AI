import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function extractTextFromPDF(buffer: Buffer, password?: string) {
  const loadingTask = pdfjsLib.getDocument({
    data: buffer,
    password: password || undefined,
  });

  try {
    const pdf = await loadingTask.promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const pageText = content.items.map((item: any) => item.str).join(' ');
      text += pageText + '\n';
    }

    return text;
  } catch (err: any) {
    if (err.name === 'PasswordException') {
      throw new Error('PASSWORD_REQUIRED');
    }
    throw err;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Multer setup (memory storage)
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  });

  // IMPORTANT: needed for reading text fields like password
  app.use(express.urlencoded({ extended: true }));

  // ============================
  // API ROUTE
  // ============================
  app.post(
    '/api/parse-document',
    upload.fields([
      { name: 'file', maxCount: 1 },
      { name: 'password', maxCount: 1 },
    ]),
    async (req: any, res) => {
      try {
        const file = req.files?.file?.[0];

        if (!file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }

        const { buffer, originalname, mimetype, size } = file;

        // ✅ File validation
        if (size > 10 * 1024 * 1024) {
          return res.status(400).json({ error: 'File too large (max 10MB)' });
        }

        if (
          mimetype !== 'application/pdf' &&
          !originalname.toLowerCase().endsWith('.csv')
        ) {
          return res.status(400).json({
            error: 'Unsupported file format. Upload PDF or CSV only.',
          });
        }

        let text = '';

        // ============================
        // PDF HANDLING
        // ============================
        if (originalname.toLowerCase().endsWith('.pdf')) {
          const password = req.body?.password || undefined;

          try {
            text = await extractTextFromPDF(buffer, password);

            // Detect scanned PDFs
            if (!text || text.trim().length < 30) {
              return res.status(400).json({
                error: 'SCAN_DETECTED',
                message:
                  'This PDF appears to be scanned or unreadable. Please upload a text-based PDF.',
              });
            }
          } catch (error: any) {
            if (error.message === 'PASSWORD_REQUIRED') {
              return res.status(401).json({
                error: 'PASSWORD_REQUIRED',
                message: 'This PDF is password protected. Please enter password.',
              });
            }

            console.error('PDF parsing error:', error);
            return res.status(500).json({
              error: 'PDF parsing failed',
              details: error.message,
            });
          }
        }

        // ============================
        // CSV HANDLING
        // ============================
        else if (originalname.toLowerCase().endsWith('.csv')) {
          text = buffer.toString('utf-8');
        }

        // ============================
        // RESPONSE
        // ============================
        res.json({
          text,
          fileName: originalname,
        });
      } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Failed to process document' });
      }
    }
  );

  // ============================
  // VITE SETUP
  // ============================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
