import React from 'react';

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
  return (
    <section className="py-32 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
        <p className="text-slate-500 text-lg">Everything you need to know about our analysis tool.</p>
      </div>

      <div className="space-y-8">
        {faqs.map((faq, i) => (
          <div key={i} className="pb-8 border-b border-slate-100 last:border-0">
            <h3 className="text-xl font-bold mb-4 tracking-tight">{faq.q}</h3>
            <p className="text-slate-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
