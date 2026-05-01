import React from 'react';

export default function Press() {
  return (
    <div className="py-24 px-6 max-w-4xl mx-auto text-center">
       <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Press & Media</h1>
       <p className="text-xl text-slate-500 mb-16 max-w-2xl mx-auto">For media inquiries, interviews, and brand assets.</p>
       
       <div className="bg-white p-12 rounded-3xl border border-emerald-50 shadow-sm text-left">
          <h2 className="text-2xl font-bold mb-4">Media Contact</h2>
          <p className="text-slate-600 mb-2">Vineet Bhasin</p>
          <a href="mailto:vb528@georgetown.edu" className="text-brand font-bold hover:underline mb-8 inline-block">vb528@georgetown.edu</a>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Brand Guidelines</h2>
          <p className="text-slate-500 mb-4">Please download our press kit to access high-resolution logos, brand colors, and product screenshots.</p>
          <a
            href="mailto:vb528@georgetown.edu?subject=Press%20Kit%20Request"
            className="inline-block bg-slate-100 text-slate-700 font-bold py-2 px-6 rounded-full hover:bg-slate-200 transition-colors">
            Request Press Kit
          </a>
       </div>
    </div>
  );
}
