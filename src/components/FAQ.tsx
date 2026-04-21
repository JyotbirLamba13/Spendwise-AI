import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const faqs = [
  {
    q: "Do you store my financial data?",
    a: "No. Your data is processed in-memory during analysis and immediately discarded. We do not store, retain, or sell your financial information."
  },
  {
    q: "How accurate is the AI analysis?",
    a: "Our model is specifically trained on business financial transactions and achieves 99%+ accuracy in categorization and anomaly detection."
  },
  {
    q: "What file formats are supported?",
    a: "We currently support PDF and CSV formats from all major banks. If your PDF is password-protected, you can enter the password securely in the widget."
  },
  {
    q: "Is this really free?",
    a: "Yes. This tool is free to use for any business. We offer it to demonstrate the power of our deeper financial intelligence platform."
  },
  {
    q: "What happens after I book a demo?",
    a: "We'll show you how to automate these insights by connecting directly to your bank and accounting software for real-time monitoring."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-32 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
        <p className="text-slate-500 text-lg">Everything you need to know about our analysis tool.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div 
              key={i} 
              className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-colors hover:border-brand/40"
            >
              <button
                onClick={() => toggleFAQ(i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
              >
                <h3 className="text-lg font-bold tracking-tight text-slate-900">{faq.q}</h3>
                <ChevronDown 
                  className={cn(
                    "shrink-0 text-slate-400 transition-transform duration-300",
                    isOpen && "rotate-180 text-brand"
                  )} 
                  size={20} 
                />
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-5 pt-1 text-slate-600 leading-relaxed border-t border-slate-50">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
