import React from 'react';

export default function Pricing() {
  return (
    <div className="py-24 px-6 max-w-6xl mx-auto text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight break-words">Simple, transparent pricing</h1>
      <p className="text-xl text-slate-500 mb-16">Start for free. Scale when you need to.</p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-emerald-50 text-left shadow-sm">
          <h3 className="text-2xl font-bold mb-2">Free</h3>
          <p className="text-slate-500 mb-6">Perfect for evaluating the platform.</p>
          <div className="text-5xl font-bold mb-8">$0</div>
          <ul className="space-y-4 mb-8 text-slate-600">
            <li className="flex items-center gap-2">✓ 5 statement analyses per month</li>
            <li className="flex items-center gap-2">✓ Basic categorization</li>
            <li className="flex items-center gap-2">✓ In-browser processing</li>
          </ul>
          <button className="w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-full hover:bg-slate-200 transition-colors">Current Plan</button>
        </div>

        <div className="bg-brand p-8 rounded-3xl text-left shadow-xl text-white relative transform md:-translate-y-4">
          <div className="absolute top-0 p-1 px-4 text-xs font-bold bg-accent text-brand rounded-b-lg left-1/2 -translate-x-1/2">POPULAR</div>
          <h3 className="text-2xl font-bold mb-2 mt-4 text-accent">Pro</h3>
          <p className="text-emerald-100/80 mb-6 min-h-[48px]">For finance teams managing multiple entities.</p>
          <div className="text-5xl font-bold mb-8">$49<span className="text-xl text-emerald-100/80 font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8 text-emerald-100">
            <li className="flex items-center gap-2">✓ Unlimited statements</li>
            <li className="flex items-center gap-2">✓ Accounting software integration</li>
            <li className="flex items-center gap-2">✓ Custom categorization rules</li>
            <li className="flex items-center gap-2">✓ Priority email support</li>
          </ul>
          <a href="mailto:vb528@georgetown.edu" className="block text-center w-full bg-accent text-brand font-bold py-3 rounded-full hover:bg-[#c3e83b] transition-colors">Book a Demo</a>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-emerald-50 text-left shadow-sm">
          <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
          <p className="text-slate-500 mb-6">For large organizations with custom security needs.</p>
          <div className="text-5xl font-bold mb-8 text-slate-800">Custom</div>
          <ul className="space-y-4 mb-8 text-slate-600">
            <li className="flex items-center gap-2">✓ Dedicated account manager</li>
            <li className="flex items-center gap-2">✓ Custom SLAs and MSA</li>
            <li className="flex items-center gap-2">✓ APIs and Webhooks</li>
            <li className="flex items-center gap-2">✓ On-premise deployment options</li>
            <li className="flex items-center gap-2">✓ SOC2 compliance reports</li>
          </ul>
          <a href="mailto:vb528@georgetown.edu" className="block text-center w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-full hover:bg-slate-200 transition-colors">Contact Sales</a>
        </div>
      </div>
    </div>
  );
}
