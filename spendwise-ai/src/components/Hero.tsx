import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play, Upload } from 'lucide-react';

interface HeroProps {
  onStartAnalysis: () => void;
  onLoadSample: () => void;
}

export default function Hero({ onStartAnalysis, onLoadSample }: HeroProps) {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-brand-light text-brand rounded-full text-xs font-bold tracking-wider uppercase mb-8 border border-emerald-900/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Now analyzing PDF statements
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1] md:leading-[0.95] break-words"
          >
            Know Exactly Where Your Business Is <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-emerald-600">Overspending.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Privacy-first AI spend analysis in seconds. Get a CFO-level report by simply uploading your statement. No sign-up required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}
              className="group bg-brand text-white px-8 py-4 rounded-full text-lg font-bold flex items-center gap-3 hover:bg-emerald-900 transition-all shadow-2xl shadow-emerald-900/20 w-full sm:w-auto justify-center"
            >
              <Upload size={20} className="group-hover:-translate-y-1 transition-transform" />
              Upload Statement
            </button>
            <button 
              onClick={onLoadSample}
              className="group px-8 py-4 rounded-full text-lg font-bold text-slate-700 bg-accent hover:bg-[#c3e83b] transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Play size={18} fill="currentColor" />
              See Sample Report
            </button>
          </motion.div>
        </div>
      </div>

      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[10%] w-[1000px] h-[1000px] bg-emerald-100 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[800px] h-[800px] bg-accent/40 rounded-full blur-[120px]" />
      </div>
    </section>
  );
}
