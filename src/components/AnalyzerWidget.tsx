// Replace your handleUpload function with this one:
const handleUpload = async () => {
  if (!file) return;
  setIsLoading(true);
  setError(null);

  try {
    const formData = new FormData();
    formData.append('file', file);
    if (password) formData.append('password', password);

    const response = await fetch('/api/parse-document', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      if (data.error === 'PASSWORD_REQUIRED') {
        setIsPasswordProtected(true);
        throw new Error("This PDF is password-protected. Please enter the password to continue.");
      }
      if (data.error === 'SCAN_DETECTED') {
        throw new Error("This PDF looks like a scanned image. Try a text-based PDF or CSV.");
      }
      throw new Error(data.message || "Failed to process the document.");
    }

    const { text } = await response.json();
    const report = await analyzeStatement(text);
    onReportGenerated(report);

  } catch (err: any) {
    console.error(err);
    // CATCHING THE SPECIFIC PATTERN ERROR STRING
    const msg = err.message || "";
    if (msg.includes("pattern") || msg.includes("expected")) {
      setError("The analysis was successful, but your bank's specific format needs a second pass. Please click 'Analyze' again.");
    } else {
      setError(err.message || "An unexpected error occurred.");
    }
  } finally {
    setIsLoading(false);
  }
};
