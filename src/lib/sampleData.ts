import { AnalysisReport } from '../types';

export const SAMPLE_REPORT: AnalysisReport = {
  currency: { symbol: '$', code: 'USD' },
  totalSpend: 42350,
  periodRange: "March 2026",
  categories: [
    { name: "SaaS & Software", total: 12400, percentage: 29 },
    { name: "Payroll", total: 22000, percentage: 52 },
    { name: "Marketing", total: 5400, percentage: 13 },
    { name: "Office & Utilities", total: 2550, percentage: 6 }
  ],
  insights: [
    {
      type: "saving",
      title: "Consolidate Communication Tools",
      description: "You are paying for Slack, Discord, and Zoom separately. Switching to a unified tool could save $450/month.",
      impactAmount: 5400,
      transactions: [
        { date: "03/03/2026", description: "Slack Technologies Monthly", amount: 125 },
        { date: "03/03/2026", description: "Zoom Video Communications", amount: 200 },
        { date: "03/03/2026", description: "Discord Nitro Business", amount: 125 },
      ]
    },
    {
      type: "alert",
      title: "Marketing CPC Spike",
      description: "Your LinkedIn Ad spend increased 42% last month with no corresponding increase in conversion.",
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
      description: "Based on stable traffic, switching to reserved instances could save 30% on compute costs.",
      impactAmount: 3200,
      transactions: [
        { date: "01/03/2026", description: "Amazon Web Services EC2", amount: 4200 },
        { date: "01/03/2026", description: "Amazon Web Services S3", amount: 800 },
        { date: "01/03/2026", description: "Amazon Web Services RDS", amount: 1200 },
      ]
    }
  ],
  topVendors: [
    { name: "Amazon Web Services", total: 8200 },
    { name: "Gusto Payroll", total: 6400 },
    { name: "LinkedIn Ads", total: 5400 },
    { name: "Slack Technologies", total: 1200 }
  ],
  monthOverMonthTrend: "Total spend increased by 8% relative to February, driven by marketing seasonal spend."
};
