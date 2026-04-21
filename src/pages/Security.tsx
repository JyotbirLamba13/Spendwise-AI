import React from 'react';
import { Shield, Lock, EyeOff } from 'lucide-react';

export default function Security() {
  return (
    <div className="py-24 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Security & Privacy</h1>
        <p className="text-xl text-slate-500">Your financial data is yours. We just help you understand it.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-2xl border border-emerald-50 shadow-sm text-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-brand mx-auto mb-4">
            <EyeOff size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Zero Storage</h3>
          <p className="text-slate-500 text-sm leading-relaxed">We process your statements in-memory and discard them immediately. Nothing is saved to a database.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-emerald-50 shadow-sm text-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-brand mx-auto mb-4">
            <Lock size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Encryption</h3>
          <p className="text-slate-500 text-sm leading-relaxed">All data in transit is encrypted using bank-grade TLS. Passwords for protected PDFs never leave your browser.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-emerald-50 shadow-sm text-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-brand mx-auto mb-4">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">No Training</h3>
          <p className="text-slate-500 text-sm leading-relaxed">We strictly prohibit using your financial data to train underlying foundational models.</p>
        </div>
      </div>
    </div>
  );
}
