app.post('/api/parse-document', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { buffer, originalname } = req.file;
    let text = '';

    if (originalname.toLowerCase().endsWith('.pdf')) {
      try {
        const data = await pdf(buffer);
        text = data.text;
        
        // Error Detection: Scanned Image/Empty PDF
        if (!text || text.trim().length < 50) {
          return res.status(400).json({ 
            error: 'SCAN_DETECTED',
            message: 'This PDF appears to be a scanned image. ClearSpend requires a text-based PDF or CSV.' 
          });
        }
      } catch (error: any) {
        // Error Detection: Password Protected
        const msg = error.message || '';
        if (msg.includes('password') || msg.includes('encrypted')) {
          return res.status(401).json({ error: 'PASSWORD_REQUIRED' });
        }
        throw error;
      }
    } else if (originalname.toLowerCase().endsWith('.csv')) {
      text = buffer.toString('utf-8');
    }
    res.json({ text, fileName: originalname });
  } catch (error) {
    res.status(500).json({ error: 'Failed to parse document' });
  }
});
