import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Hero from './Hero';
import AnalyzerWidget from './AnalyzerWidget';
import ReportDashboard from './ReportDashboard';
import Features from './Features';
import FAQ from './FAQ';
import { AnalysisReport } from '../types';
import { ShieldCheck, ArrowRight, Hexagon, Triangle, Circle, Square, Box } from 'lucide-react';
import { SAMPLE_REPORT } from '../lib/sampleData';

export default function Home() {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleReportGenerated = (newReport: AnalysisReport) => {
    setReport(newReport);
    setIsAnalyzing(false);
    // Smooth scroll to report
    setTimeout(() => {
      document.getElementById('report-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const loadSampleReport = () => {
    handleReportGenerated(SAMPLE_REPORT);
  };

  return (
    <>
      <AnimatePresence>
        {!report && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onStartAnalysis={() => setIsAnalyzing(true)} onLoadSample={loadSampleReport} />
            
            <section className="py-20 px-6 max-w-7xl mx-auto">
              <p className="text-center text-sm font-bold tracking-widest text-slate-400 uppercase mb-8">Trusted by modern finance teams at</p>
              <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 mb-20 text-slate-800">
                <div className="flex items-center gap-2"><Hexagon fill="currentColor" size={28} /> <span className="text-xl font-bold tracking-tight">Acme Corp</span></div>
                <div className="flex items-center gap-2"><Triangle fill="currentColor" size={28} /> <span className="text-xl font-bold tracking-tight">Globex</span></div>
                <div className="flex items-center gap-2"><Circle fill="currentColor" size={28} /> <span className="text-xl font-bold tracking-tight">Initech</span></div>
                <div className="flex items-center gap-2"><Box fill="currentColor" size={28} /> <span className="text-xl font-bold tracking-tight">Massive Dynamic</span></div>
                <div className="flex items-center gap-2"><Square fill="currentColor" size={28} /> <span className="text-xl font-bold tracking-tight">Umbrella</span></div>
              </div>

              <Features />
            </section>

            <section id="analyzer" className="py-24 bg-brand text-white overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px]" />
                 <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
              </div>
              
              <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight break-words">Analyze your statement now</h2>
                  <p className="text-emerald-100/80 text-lg max-w-2xl mx-auto">
                    Upload your business bank statement. We'll surface insights, overlapping subscriptions, 
                    and cost-saving opportunities in seconds.
                  </p>
                </div>

                <AnalyzerWidget onReportGenerated={handleReportGenerated} />
                
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center text-emerald-200/80 text-sm font-medium">
                  <div className="flex items-center gap-2">
                     <ShieldCheck size={16} className="text-accent" />
                     <span>Zero-Data Retention</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <ShieldCheck size={16} className="text-accent" />
                     <span>Ephemeral In-Memory Processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <ShieldCheck size={16} className="text-accent" />
                     <span>Strictly No LLM Training</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-24 px-6 max-w-7xl mx-auto">
               <div className="grid md:grid-cols-2 gap-16 items-center">
                 <div>
                   <h2 className="text-3xl sm:text-4xl font-bold mb-8 tracking-tight break-words">Built for operators, loved by CFOs.</h2>
                   <div className="space-y-8">
                     {[
                       { quote: "We uncovered $15K/year in unnecessary SaaS spend in minutes.", author: "Sarah Chen", role: "Founder, Zenith AI" },
                       { quote: "This gave us clarity we didn’t get from our accounting tools.", author: "James Miller", role: "CFO, CloudScale" }
                     ].map((t, i) => (
                       <div key={i} className="border-l-2 border-accent pl-6">
                         <p className="text-xl italic text-slate-700 mb-4 leading-relaxed">"{t.quote}"</p>
                         <p className="font-bold">{t.author}</p>
                         <p className="text-sm text-slate-500">{t.role}</p>
                       </div>
                     ))}
                   </div>
                 </div>
                 <div className="bg-white p-8 rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-50">
                    <div className="space-y-4">
                       <AnalyzerWidget onReportGenerated={handleReportGenerated} showDemoOnly />
                    </div>
                 </div>
               </div>
            </section>

            <FAQ />
          </motion.div>
        )}
      </AnimatePresence>

      {report && (
        <motion.div
          id="report-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-24 bg-slate-50 min-h-screen"
        >
          <div className="max-w-7xl mx-auto px-6 pt-12">
            <button 
              onClick={() => setReport(null)}
              className="mb-8 flex items-center gap-2 text-slate-500 hover:text-brand transition-colors text-sm font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100"
            >
              <ArrowRight className="rotate-180" size={16} />
              Back to analyzer
            </button>
            <ReportDashboard report={report} />
          </div>
        </motion.div>
      )}
    </>
  );
}
