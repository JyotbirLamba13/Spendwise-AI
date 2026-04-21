import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
               <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                  <span className="text-accent font-black text-lg">C</span>
               </div>
               <span className="text-xl font-bold tracking-tight text-brand">ClearSpend</span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed mb-8">
              Enabling businesses to regain control of their capital through privacy-first financial intelligence.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-slate-400">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com/in/vineet-bhasin-cfa" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-slate-400">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-slate-400">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 tracking-tight uppercase text-xs text-slate-400 tracking-widest">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-600 font-medium">
              <li><Link to="/" className="hover:text-brand transition-colors">Analyzer</Link></li>
              <li><Link to="/pricing" className="hover:text-brand transition-colors">Pricing</Link></li>
              <li><Link to="/security" className="hover:text-brand transition-colors">Security</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 tracking-tight uppercase text-xs text-slate-400 tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-slate-600 font-medium">
              <li><Link to="/blog" className="hover:text-brand transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-brand transition-colors">Careers</Link></li>
              <li><Link to="/press" className="hover:text-brand transition-colors">Press</Link></li>
              <li><a href="mailto:vb528@georgetown.edu" className="hover:text-brand transition-colors">Contact</a></li>
              <li><Link to="/terms" className="hover:text-brand transition-colors">Terms & Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-widest">
           <span>© 2026 ClearSpend. All rights reserved.</span>
           <div className="flex gap-8">
             <Link to="/terms" className="hover:text-brand transition-colors">Legal</Link>
             <a href="mailto:vb528@georgetown.edu" className="hover:text-brand transition-colors">Support</a>
           </div>
        </div>
      </div>
    </footer>
  );
}
