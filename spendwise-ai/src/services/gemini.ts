import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT, AnalysisReport } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "dummy_key" });

export async function analyzeStatement(text: string): Promise<AnalysisReport> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [{ text: `Analyze the following bank statement text and provide a financial health report based on our system instructions:\n\n${text}` }]
      }
    ],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          totalSpend: { type: Type.NUMBER },
          periodRange: { type: Type.STRING },
          categories: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                total: { type: Type.NUMBER },
                percentage: { type: Type.NUMBER }
              },
              required: ["name", "total", "percentage"]
            }
          },
          insights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["saving", "alert", "recommendation"] },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impactUSD: { type: Type.NUMBER }
              },
              required: ["type", "title", "description", "impactUSD"]
            }
          },
          topVendors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                total: { type: Type.NUMBER }
              },
              required: ["name", "total"]
            }
          },
          monthOverMonthTrend: { type: Type.STRING }
        },
        required: ["totalSpend", "periodRange", "categories", "insights", "topVendors"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text) as AnalysisReport;
}
