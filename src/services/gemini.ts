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
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: `Analyze the following bank statement text and provide a financial health report based on our system instructions:\n\n${text}` }] }],
      generationConfig: { responseMimeType: "application/json" }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Failed to make request to Gemini");
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error("No response from AI");

  return JSON.parse(content) as AnalysisReport;
}
