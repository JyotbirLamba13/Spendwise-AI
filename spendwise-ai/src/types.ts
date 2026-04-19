export interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface SpendCategory {
  name: string;
  total: number;
  percentage: number;
}

export interface Insight {
  type: 'saving' | 'alert' | 'recommendation';
  title: string;
  description: string;
  impactUSD: number;
}

export interface AnalysisReport {
  totalSpend: number;
  periodRange: string;
  categories: SpendCategory[];
  insights: Insight[];
  topVendors: { name: string; total: number }[];
  monthOverMonthTrend?: string;
}

export const SYSTEM_PROMPT = `
You are a world-class fractional CFO and business financial analyst. 
Your task is to analyze bank statement data (PDF text or CSV) and provide a structured financial health report.

RULES:
1. Identify spend categories (SaaS, Payroll, Marketing, Rent, Utilities, etc.)
2. Detect month-over-month trends if sufficient data is present.
3. Identify duplicate subscriptions or overlapping tools.
4. Flag unusually high increases in vendor pricing.
5. Provide actionable cost-cutting recommendations with estimated USD savings.
6. All calculations must be in USD ($).
7. Be sharp, ROI-driven, and executive-level in your tone.

EXPECTED OUTPUT:
A JSON object matching the AnalysisReport interface:
{
  "totalSpend": number,
  "periodRange": "MM/YYYY - MM/YYYY",
  "categories": [{ "name": string, "total": number, "percentage": number }],
  "insights": [{ "type": "saving" | "alert" | "recommendation", "title": string, "description": string, "impactUSD": number }],
  "topVendors": [{ "name": string, "total": number }],
  "monthOverMonthTrend": string (summary sentence)
}
`;
