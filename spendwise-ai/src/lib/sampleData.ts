import { AnalysisReport } from '../types';

export const SAMPLE_REPORT: AnalysisReport = {
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
      description: "You are paying for Slack, Discord, and Zoom. Switching to a unified tool could save $450/month.", 
      impactUSD: 5400 
    },
    { 
      type: "alert", 
      title: "Marketing CPC Spike", 
      description: "Your LinkedIn Ad spend increased 42% last month with no corresponding increase in conversion.", 
      impactUSD: 1800 
    },
    { 
      type: "recommendation", 
      title: "AWS Reserved Instances", 
      description: "Based on stable traffic, switching to reserved instances could save 30% on compute costs.", 
      impactUSD: 3200 
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
