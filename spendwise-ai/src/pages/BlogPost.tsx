import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BlogPost() {
  const { id } = useParams();

  // Placeholder content for blog posts based on ID
  const title = id?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="py-24 px-6 max-w-3xl mx-auto">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand mb-12 transition-colors">
        <ArrowLeft size={16} /> Back to Blog
      </Link>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight text-slate-900">{title}</h1>
      
      <div className="prose prose-emerald lg:prose-lg max-w-none text-slate-600">
        <p className="lead text-xl text-slate-500 mb-8">
          This is a placeholder for the full SEO-optimized article content. In a production environment, this would be fetched from a CMS like Sanity, Contentful, or directly from markdown files.
        </p>
        <p>
          With SpendWise AI, financial teams can ensure their data remains private while leveraging the power of large language models to categorize, analyze, and optimize business spending.
        </p>
        <h2>The Core Problem</h2>
        <p>
          Many companies suffer from "SaaS Creep"—the gradual accumulation of overlapping tools across different departments. A marketing team might use Asana, while engineering uses Jira, and product uses Linear. This fragmentation leads to massive capital inefficiencies.
        </p>
        <h2>The Solution</h2>
        <p>
          By regularly analyzing raw transaction data securely, finance leaders can spot these anomalies instantly. Our privacy-first model guarantees that sensitive vendor lists and pricing tiers are never stored or used to train public instances.
        </p>
      </div>
    </div>
  );
}
