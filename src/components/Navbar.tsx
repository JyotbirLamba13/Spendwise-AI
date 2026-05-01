import React from 'react';
import { ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-paper/80 backdrop-blur-md border-b border-emerald-900/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" reloadDocument className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <ScanLine className="text-accent" size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight text-brand">ClearSpend</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-brand transition-colors">Analyzer</Link>
          <Link to="/security" className="hover:text-brand transition-colors">Security</Link>
          <Link to="/pricing" className="hover:text-brand transition-colors">Pricing</Link>
          <Link to="/blog" className="hover:text-brand transition-colors">Blog</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/pricing" className="hidden sm:block text-sm font-medium text-slate-700 hover:text-brand px-4 py-2 transition-colors">
            Login
          </Link>
          <a href="mailto:vb528@georgetown.edu" className="bg-accent text-brand text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#c3e83b] transition-all shadow-lg shadow-emerald-900/10">
            Book a Demo
          </a>
        </div>
      </div>
    </nav>
  );
}
