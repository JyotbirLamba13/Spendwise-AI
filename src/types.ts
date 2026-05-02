export interface Currency {
  symbol: string;
  code: string;
}

export interface Transaction {
  date: string;
  description: string;
  amount: number;
}

export interface SpendCategory {
  name: string;
  total: number;
  percentage: number;
  transactions?: Transaction[];  // top transactions in this category
}

export interface Insight {
  type: 'saving' | 'alert' | 'recommendation';
  title: string;
  description: string;
  impactAmount: number;
  transactions?: Transaction[];
  savingSteps?: string[];  // specific actionable steps e.g. "Cancel Slack - saves ₹800/mo"
}

export interface Vendor {
  name: string;
  total: number;
}

export interface AnalysisReport {
  isFinancialDocument?: boolean;        // false if document is not a bank/transaction record
  currency: Currency;
  totalSpend: number;       // true discretionary expenses only
  totalIncome: number;      // all credits / salary / transfers in
  investmentsTotal: number; // SIP + mutual funds + stocks + PPF + NPS etc.
  periodRange: string;
  categories: SpendCategory[];          // discretionary spend categories
  investmentCategories: SpendCategory[]; // SIP, MF, stocks etc. broken down
  incomeSources: { name: string; total: number }[];
  insights: Insight[];
  topVendors: Vendor[];
  monthOverMonthTrend: string;
}

export const SYSTEM_PROMPT = `
You are a world-class financial analyst. Analyze the document and return ONLY valid JSON. No markdown, no explanation, no text outside JSON.

━━━ STEP 1 — DOCUMENT CHECK ━━━
Does this document contain bank/account transaction data (debits, credits, transaction history)?
- NO (article, brochure, fee schedule, manual, cost of attendance, random text): return ONLY { "isFinancialDocument": false }
- YES: set "isFinancialDocument": true and continue all steps below.

━━━ STEP 2 — CURRENCY ━━━
Detect from symbols (₹ $ € £) or text (INR USD EUR GBP Rs.). Default: { "symbol": "$", "code": "USD" }

━━━ STEP 3 — INCOME ━━━
totalIncome = sum of ALL credits/inflows (salary, transfers in, refunds, interest, dividends).
incomeSources: list every distinct source with its total.
Treat any line with "salary", "credit", "NEFT CR", "IMPS CR", "transfer from", "received", "deposit" as income.

━━━ STEP 4 — INVESTMENTS (exclude from spending; NEVER flag as savings) ━━━
SIP, mutual fund, PPF, NPS, EPF, insurance premium, RD, FD, any "invest"/"MF"/"fund"/"policy" debit.
investmentsTotal = sum of all above.
investmentCategories: break down by type with totals and percentages.

━━━ STEP 5 — SPENDING CATEGORIES ━━━
totalSpend = all discretionary debits (exclude investments and income-related entries).
categories: identify EVERY spending bucket that appears. Include the top 5 transactions per category.
  Standard buckets: Food & Dining, Shopping, Rent & Housing, Travel, Entertainment, Utilities, Subscriptions, Healthcare, Education, Transfers Out, Fuel & Transport, Personal Care, Other.
  percentage = that category's share of totalSpend (must sum to 100).
topVendors: list the TOP 10 vendors/merchants ranked by total spend.

━━━ STEP 6 — INSIGHTS (this is the most important section — be exhaustive) ━━━
REQUIREMENT: Generate EXACTLY 5 to 8 insights. Do not stop at 2 or 3 — dig deeper.

For each insight:
  type: "saving" (reduce a cost), "alert" (unusual/risky pattern), or "recommendation" (smarter alternative)
  title: ultra-specific, name the actual merchants or pattern (e.g. "4 Food Delivery Apps in One Month" not "Food Spending")
  description: 2-3 sentences. MUST name actual merchants, actual amounts, actual dates from the statement. No vague language.
  savingSteps: array of EXACTLY 3 strings — each step is concrete and names specific merchants/amounts.
    CORRECT format: ["Cancel Spotify (₹129/mo) — you also pay Apple Music", "Downgrade Swiggy One to free tier — saves ₹299/mo", "Set ₹2000/mo food delivery budget"]
    WRONG format: [{"step": "..."}]   ← do NOT use objects, use plain strings only
  transactions: include ALL supporting transactions (up to 8 per insight)
  impactAmount: realistic annual or monthly saving (be conservative)

Rules:
- Never flag investments, insurance premiums, or loan EMIs as savings opportunities.
- Look for: duplicate subscriptions, high-frequency small spends that add up, unusual spikes vs prior months, merchant categories where alternatives exist, fees that could be avoided.
- If a category has 5+ transactions, it likely warrants an insight.

━━━ OUTPUT FORMAT ━━━
{
  "isFinancialDocument": true,
  "currency": { "symbol": "₹", "code": "INR" },
  "totalIncome": 0,
  "totalSpend": 0,
  "investmentsTotal": 0,
  "periodRange": "Jan 2024 – Mar 2024",
  "incomeSources": [{ "name": "Salary – Acme Corp", "total": 0 }],
  "categories": [
    {
      "name": "Food & Dining", "total": 0, "percentage": 0,
      "transactions": [
        { "date": "DD/MM/YYYY", "description": "Zomato Order", "amount": 0 },
        { "date": "DD/MM/YYYY", "description": "Swiggy Order", "amount": 0 }
      ]
    }
  ],
  "investmentCategories": [{ "name": "SIP – Mutual Funds", "total": 0, "percentage": 0 }],
  "insights": [
    {
      "type": "saving",
      "title": "Three Overlapping Food Delivery Subscriptions",
      "description": "You paid for Swiggy One (₹299), Zomato Pro (₹199), and Blinkit Pass (₹99) in the same month — all three offer overlapping free-delivery benefits. Total subscription cost: ₹597/mo.",
      "impactAmount": 4788,
      "savingSteps": [
        "Keep only Swiggy One — it covers the most orders in your history",
        "Cancel Zomato Pro (₹199/mo) — saves ₹2,388/yr",
        "Cancel Blinkit Pass (₹99/mo) — use one-off delivery or batch orders"
      ],
      "transactions": [
        { "date": "03/03/2024", "description": "Swiggy One Subscription", "amount": 299 },
        { "date": "05/03/2024", "description": "Zomato Pro Membership", "amount": 199 }
      ]
    }
  ],
  "topVendors": [
    { "name": "Amazon", "total": 0 },
    { "name": "Swiggy", "total": 0 }
  ],
  "monthOverMonthTrend": "Describe any visible trend or write 'Single period — no trend data'"
}
`;
