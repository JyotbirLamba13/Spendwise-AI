import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker — runs in browser, password never leaves device
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href;

const MAX_PAGES = 50;
const MAX_CHARS = 120_000; // server truncates before AI; keep plenty here

export class PasswordRequiredError extends Error {
  constructor() {
    super('PASSWORD_REQUIRED');
    this.name = 'PasswordRequiredError';
  }
}

export class ScannedPDFError extends Error {
  constructor() {
    super('SCAN_DETECTED');
    this.name = 'ScannedPDFError';
  }
}

export async function extractTextFromFile(file: File, password?: string): Promise<string> {
  const ext = file.name.toLowerCase().split('.').pop();
  if (ext === 'pdf') return extractFromPDF(file, password);
  if (ext === 'csv') return extractFromCSV(file);
  throw new Error('Unsupported file type. Please upload a PDF or CSV.');
}

async function extractFromCSV(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') { reject(new Error('Failed to read CSV file.')); return; }
      resolve(text.slice(0, MAX_CHARS));
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file, 'utf-8');
  });
}

async function extractFromPDF(file: File, password?: string): Promise<string> {
  const data = new Uint8Array(await file.arrayBuffer());

  const loadingTask = (pdfjsLib as any).getDocument({
    data,
    password: password || undefined,
    isEvalSupported: false, // block embedded PDF JavaScript
    disableFontFace: false,
  });

  let pdf: any;
  try {
    pdf = await loadingTask.promise;
  } catch (err: any) {
    if (err.name === 'PasswordException') throw new PasswordRequiredError();
    throw new Error(`Could not read this PDF: ${err.message}`);
  }

  const pageCount = Math.min(pdf.numPages, MAX_PAGES);
  let fullText = '';

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    // Preserve line structure using hasEOL markers — critical for bank statement tables
    // where each transaction row must stay on its own line for the AI to parse correctly.
    let lineBuffer = '';
    for (const item of content.items as any[]) {
      if (!('str' in item)) continue;
      lineBuffer += item.str;
      if (item.hasEOL) {
        fullText += lineBuffer.trimEnd() + '\n';
        lineBuffer = '';
      } else {
        lineBuffer += ' ';
      }
    }
    if (lineBuffer.trim()) fullText += lineBuffer.trimEnd() + '\n';
    fullText += '\n'; // blank line between pages

    if (fullText.length >= MAX_CHARS) break;
  }

  const trimmed = fullText.trim();
  if (trimmed.length < 30) throw new ScannedPDFError();

  return trimmed.slice(0, MAX_CHARS);
}
