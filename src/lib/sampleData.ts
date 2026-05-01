import { AnalysisReport } from '../types';

export const SAMPLE_REPORT: AnalysisReport = {
  currency: { symbol: '$', code: 'USD' },
  totalIncome: 18500,
  totalSpend: 12350,
  investmentsTotal: 3200,
  periodRange: "March 2026",
  incomeSources: [
    { name: "Salary - Acme Corp", total: 16000 },
    { name: "Freelance Income", total: 2000 },
    { name: "Interest Income", total: 500 },
  ],
  categories: [
    { name: "SaaS & Software", total: 2400, percentage: 19, transactions: [
      { date: "03/03/2026", description: "Slack Technologies", amount: 125 },
      { date: "03/03/2026", description: "Zoom Video", amount: 200 },
      { date: "03/03/2026", description: "GitHub Pro", amount: 80 },
    ]},
    { name: "Payroll", total: 5000, percentage: 41, transactions: [
      { date: "01/03/2026", description: "Gusto Payroll - March", amount: 5000 },
    ]},
    { name: "Marketing", total: 3000, percentage: 24, transactions: [
      { date: "01/03/2026", description: "LinkedIn Ads", amount: 1800 },
      { date: "15/03/2026", description: "LinkedIn Ads", amount: 1200 },
    ]},
    { name: "Office & Utilities", total: 1950, percentage: 16, transactions: [
      { date: "05/03/2026", description: "WeWork Office", amount: 1500 },
      { date: "10/03/2026", description: "Electricity Bill", amount: 450 },
    ]},
  ],
  investmentCategories: [
    { name: "SIP - Mutual Funds", total: 2000, percentage: 63 },
    { name: "Stock Purchases", total: 800, percentage: 25 },
    { name: "PPF Contribution", total: 400, percentage: 12 },
  ],
  insights: [
    {
      type: "saving",
      title: "Consolidate Communication Tools",
      description: "You're paying for Slack ($125), Discord ($125), and Zoom ($200) separately — 3 overlapping tools totalling $450/month. All three handle messaging and video calls.",
      impactAmount: 5400,
      savingSteps: [
        "Keep Zoom for external client calls ($200/mo — keep)",
        "Cancel Slack and use Discord for internal comms — saves $125/mo",
        "Cancel Discord Nitro and use free tier — saves $125/mo",
      ],
      transactions: [
        { date: "03/03/2026", description: "Slack Technologies Monthly", amount: 125 },
        { date: "03/03/2026", description: "Zoom Video Communications", amount: 200 },
        { date: "03/03/2026", description: "Discord Nitro Business", amount: 125 },
      ]
    },
    {
      type: "alert",
      title: "LinkedIn Ads — No ROI Signal",
      description: "You spent $5,400 on LinkedIn Ads across 3 payments this month — up 42% vs February ($3,800). No corresponding increase in trial signups or inbound leads detected.",
      impactAmount: 1800,
      savingSteps: [
        "Pause LinkedIn Ads for 2 weeks and measure impact on leads",
        "Reallocate 30% of budget to organic content ($1,620 saving)",
        "Set a hard monthly cap of $3,600 — saves $1,800/mo at current trend",
      ],
      transactions: [
        { date: "01/03/2026", description: "LinkedIn Campaign Manager", amount: 1800 },
        { date: "15/03/2026", description: "LinkedIn Campaign Manager", amount: 2100 },
        { date: "28/03/2026", description: "LinkedIn Campaign Manager", amount: 1500 },
      ]
    },
    {
      type: "recommendation",
      title: "AWS Reserved Instances",
      description: "Stable traffic patterns suggest switching to reserved instances could cut compute costs by 30%.",
      impactAmount: 3200,
      transactions: [
        { date: "01/03/2026", description: "Amazon Web Services EC2", amount: 4200 },
        { date: "01/03/2026", description: "Amazon Web Services S3", amount: 800 },
        { date: "01/03/2026", description: "Amazon Web Services RDS", amount: 1200 },
      ]
    }
  ],
  topVendors: [
    { name: "Amazon Web Services", total: 6200 },
    { name: "LinkedIn Ads", total: 5400 },
    { name: "Gusto Payroll", total: 5000 },
    { name: "Slack Technologies", total: 1200 }
  ],
  monthOverMonthTrend: "Expenses up 8% vs February, driven by increased marketing spend."
};
