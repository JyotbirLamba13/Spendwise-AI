import React, { useState } from 'react';
import { Target, TrendingDown, Repeat, Zap, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const features = [
  {
    icon: Target,
    title: "Automatic Categorization",
    description: "SaaS, payroll, marketing, and operations—instantly sorted with 99% accuracy.",
    details: "Our NLP engine processes transaction descriptions and maps them against a proprietary taxonomy. It automatically identifies merchant names, strips out location data, and categorizes the spend accurately without needing manual rules."
  },
  {
    icon: TrendingDown,
    title: "Trend Detection",
    description: "Surface month-over-month costs that are quietly creeping up.",
    details: "By analyzing your historical run-rate, SpendWise AI detects subtle percentage increases in usage-based pricing models (like AWS or Stripe) and alerts you before they become massive budget overruns."
  },
  {
    icon: Repeat,
    title: "Duplicate Alerts",
    description: "Identify redundant software tools and duplicate billings instantly.",
    details: "We cross-reference categories across your organization to find overlapping tools (e.g., paying for both Asana and Jira) and detect duplicate subscriptions charged to different corporate cards."
  },
  {
    icon: Zap,
    title: "AI Recommendations",
    description: "Personalized advice to reduce your burn rate and improve margins.",
    details: "SpendWise AI doesn't just show you data; it provides actionable steps. Like recommending a switch to Annual billing for a 20% discount on a vendor you've used consistently for 8 months."
  }
];

export default function Features() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFeature = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((f, i) => {
        const isOpen = openIndex === i;
        return (
          <div 
            key={i} 
            onClick={() => toggleFeature(i)}
            className="group p-6 rounded-2xl border border-transparent hover:border-emerald-50 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 cursor-pointer flex flex-col h-full"
          >
            <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center mb-6 text-brand">
              <f.icon size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight flex items-center justify-between">
              {f.title}
              <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand' : ''}`} />
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-2">{f.description}</p>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-slate-100">
                     <p className="text-sm text-slate-600 leading-relaxed font-medium">
                       {f.details}
                     </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
