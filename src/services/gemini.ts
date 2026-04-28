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
        parts: [{ text: `Analyze this bank statement text and provide a financial health report. IMPORTANT: Output ONLY raw JSON, do not include markdown blocks or extra text.\n\n${text}` }]
      }],
      generationConfig: {
        // Switching to standard JSON mode without the strict pattern gate
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Financial analysis engine is currently busy. Please try again in 5 seconds.");
  }

  const data = await response.json();
  let content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!content) {
    throw new Error("The AI could not read the data from this file. Is it a scanned image?");
  }

  // Clean up any potential markdown formatting the AI might have added
  content = content.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(content) as AnalysisReport;
  } catch (parseError) {
    console.error("JSON Parsing Error:", content);
    throw new Error("We were able to analyze your statement, but we encountered a formatting glitch. Please try one more time.");
  }
}
