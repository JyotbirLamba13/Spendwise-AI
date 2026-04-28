import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  // Configure Multer for in-memory file storage
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  });

  // API Routes
  app.post('/api/parse-document', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { buffer, originalname } = req.file;
      let text = '';

      if (originalname.toLowerCase().endsWith('.pdf')) {
        try {
          const data = await pdf(buffer);
          text = data.text;
          
          // Check if extracted text is suspiciously short (usually indicates a scan/image)
          if (!text || text.trim().length < 50) {
            return res.status(400).json({ 
              error: 'SCAN_DETECTED',
              message: 'This PDF appears to be a scanned image. ClearSpend requires a text-based PDF or CSV to analyze transactions.' 
            });
          }
        } catch (error: any) {
          // Detect password protection (common error messages from pdf-parse/pdfjs)
          const errorMessage = error.message || '';
          if (errorMessage.includes('password') || errorMessage.includes('encrypted')) {
            return res.status(401).json({ 
              error: 'PASSWORD_REQUIRED',
              message: 'This PDF is password protected.' 
            });
          }
          throw error;
        }
      } else if (originalname.toLowerCase().endsWith('.csv')) {
        // Handle CSV (send as text, Papaparse can handle it on frontend or here)
        text = buffer.toString('utf-8');
      } else {
        return res.status(400).json({ error: 'Unsupported file format. Please upload PDF or CSV.' });
      }

      // Privacy: We are only returning the text to the client. No storage.
      res.json({ text, fileName: originalname });
    } catch (error) {
      console.error('Error parsing document:', error);
      res.status(500).json({ error: 'Failed to parse document' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
