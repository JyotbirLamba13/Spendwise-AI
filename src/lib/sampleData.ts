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
    { name: "SaaS & Software", total: 2400, percentage: 19 },
    { name: "Payroll", total: 5000, percentage: 41 },
    { name: "Marketing", total: 3000, percentage: 24 },
    { name: "Office & Utilities", total: 1950, percentage: 16 },
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
      description: "You are paying for Slack, Discord, and Zoom separately. Consolidating to one tool saves ~$450/month.",
      impactAmount: 5400,
      transactions: [
        { date: "03/03/2026", description: "Slack Technologies Monthly", amount: 125 },
        { date: "03/03/2026", description: "Zoom Video Communications", amount: 200 },
        { date: "03/03/2026", description: "Discord Nitro Business", amount: 125 },
      ]
    },
    {
      type: "alert",
      title: "Marketing Spend Spike",
      description: "LinkedIn Ad spend increased 42% last month with no measurable increase in conversions.",
      impactAmount: 1800,
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
