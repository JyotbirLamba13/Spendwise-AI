import React from 'react';
import { Link } from 'react-router-dom';

const BLOG_POSTS = [
  {
    id: "reduce-saas-spend-2026",
    title: "How to Reduce SaaS Spend by 30% Without Losing Productivity in 2026",
    excerpt: "SaaS creep is real. Discover the 5-step framework CFOs are using to audit and eliminate redundant software subscriptions.",
    date: "April 18, 2026"
  },
  {
    id: "privacy-first-ai-finance",
    title: "Why Privacy-First AI is the Future of Financial Analysis",
    excerpt: "Uploading sensitive bank statements to generic LLMs is a massive risk. Learn why ephemeral, in-memory processing is becoming the enterprise standard.",
    date: "April 10, 2026"
  },
  {
    id: "identifying-hidden-burn",
    title: "The Silent Killers of Startup Runways: Identifying Hidden Burn",
    excerpt: "Month-over-month increases in cloud infrastructure and marketing CPCs can silently destroy your margin. Here's how to spot them early.",
    date: "March 28, 2026"
  },
  {
    id: "cost-cutting-operator-guide",
    title: "An Operator's Guide to CFO-Level Cost Cutting",
    excerpt: "You don't need to be a CPA to optimize your P&L. Use these three automated checks to keep your operational expenses lean.",
    date: "March 15, 2026"
  },
  {
    id: "vendor-negotiation-data",
    title: "Leveraging Transaction Data for Better Vendor Negotiation",
    excerpt: "When you know your exact historical spend, negotiating enterprise contracts becomes much easier. A guide to data-driven renewals.",
    date: "March 2, 2026"
  }
];

export default function Blog() {
  return (
    <div className="py-24 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">The SpendWise Blog</h1>
        <p className="text-xl text-slate-500">Insights on financial operations, AI, and enterprise cost optimization.</p>
      </div>

      <div className="space-y-8">
        {BLOG_POSTS.map((post) => (
          <Link key={post.id} to={`/blog/${post.id}`} className="block group bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm hover:shadow-md transition-all">
            <span className="text-sm font-bold text-slate-400 mb-2 block uppercase tracking-wider">{post.date}</span>
            <h2 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-brand transition-colors">{post.title}</h2>
            <p className="text-slate-600 leading-relaxed">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
