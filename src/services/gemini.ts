import { SYSTEM_PROMPT, AnalysisReport } from "../types";

export async function analyzeStatement(text: string): Promise<AnalysisReport> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === "dummy_key") {
    throw new Error("Please set VITE_GEMINI_API_KEY in your Vercel Environment Variables");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: [{
        parts: [{ text: `Analyze this text. If it is NOT a bank statement, or if no transactions are visible, please respond with a JSON object containing an "error" field explaining why. Otherwise, provide the full report as requested:\n\n${text}` }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Cloud processing error. Please try again.");
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!content) throw new Error("No response from AI engine.");

  const parsed = JSON.parse(content);
  
  // If the AI returned its own error message (e.g., "I can't read this")
  if (parsed.error) {
    throw new Error(parsed.error);
  }

  return parsed as AnalysisReport;
}
