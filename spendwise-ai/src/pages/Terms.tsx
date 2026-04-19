import React from 'react';

export default function Terms() {
  return (
    <div className="py-24 px-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 tracking-tight">Terms of Service & Privacy Policy</h1>
      
      <div className="prose prose-emerald lg:prose-lg text-slate-600">
         <h3>1. Data Processing</h3>
         <p>SpendWise AI does not permanently store, persist, or sell any financial data uploaded to the platform. All file parsing and AI analysis is conducted ephmerally in-memory. Once the session ends or the report is generated, the source data is discarded.</p>
         
         <h3>2. Usage Limits</h3>
         <p>The free tier of the Analyzer tool is provided "as is" and is subject to rate limiting and fair use policies to ensure stability for all customers.</p>
         
         <h3>3. AI Accuracy</h3>
         <p>While our models are highly tuned for financial analysis, all AI-generated insights, categorizations, and savings recommendations should be reviewed by a qualified financial professional before taking action. SpendWise AI is a tooling layer, not a replacement for legal or financial advising.</p>
         
         <h3>4. Contact</h3>
         <p>For questions about these terms, please contact us at vb528@georgetown.edu.</p>
      </div>
    </div>
  );
}
