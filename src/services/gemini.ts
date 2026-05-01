import { SYSTEM_PROMPT, AnalysisReport } from "../types";

const MAX_INPUT_CHARS = 12000; // prevent token overflow

function truncateText(text: string) {
  if (text.length <= MAX_INPUT_CHARS) return text;
  return text.slice(0, MAX_INPUT_CHARS);
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    // محاولة تنظيف الرد (Gemini sometimes wraps JSON in text)
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("INVALID_JSON_RESPONSE");
  }
}

export async function analyzeStatement(text: string): Promise<AnalysisReport> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "dummy_key") {
    throw new Error("Missing Gemini API key");
  }

  // 🔴 CRITICAL: prevent huge payloads
  const cleanedText = truncateText(text);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const body = {
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      {
        parts: [
          {
            text: `Analyze this bank statement and return STRICT JSON only:\n\n${cleanedText}`,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  };

  let response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Network error while connecting to AI service");
  }

  if (!response.ok) {
    let err;
    try {
      err = await response.json();
    } catch {
      throw new Error("Could not connect to the AI service. Please try again.");
    }

    const msg = err.error?.message || '';
    if (response.status === 400) throw new Error("The statement text could not be processed. Try a different file.");
    if (response.status === 401 || response.status === 403) throw new Error("Invalid API key. Please check your Gemini API key in settings.");
    if (response.status === 429) throw new Error("Too many requests. Please wait a moment and try again.");
    if (msg.includes('not found') || msg.includes('deprecated')) throw new Error("AI model unavailable. Please contact support.");
    throw new Error("AI analysis failed. Please try again in a moment.");
  }

  const data = await response.json();

  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error("Empty response from AI");
  }

  try {
    return safeJsonParse(content) as AnalysisReport;
  } catch (err) {
    console.error("Raw Gemini response:", content);
    throw new Error("AI returned invalid JSON format");
  }
}
