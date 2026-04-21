import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, Lock, Loader2, PlayCircle, AlertCircle } from 'lucide-react';
import { analyzeStatement } from '../services/gemini';
import { AnalysisReport } from '../types';
import { cn } from '../lib/utils';
import { SAMPLE_REPORT } from '../lib/sampleData';

interface AnalyzerWidgetProps {
  onReportGenerated: (report: AnalysisReport) => void;
  showDemoOnly?: boolean;
}

export default function AnalyzerWidget({ onReportGenerated, showDemoOnly = false }: AnalyzerWidgetProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
      // For demo purposes, we manually show password if filename contains "protected"
      if (selected.name.toLowerCase().includes('protected')) {
        setIsPasswordProtected(true);
      } else {
        setIsPasswordProtected(false);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (password) formData.append('password', password);

      const response = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to parse file');
      }

      const { text } = await response.json();
      const report = await analyzeStatement(text);
      onReportGenerated(report);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const tryWithDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      onReportGenerated(SAMPLE_REPORT);
      setIsLoading(false);
    }, 1500);
  };

  if (showDemoOnly) {
    return (
      <div className="text-center py-6">
        <div className="mb-6 flex justify-center">
           <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand">
             <FileText size={32} />
           </div>
        </div>
        <h3 className="text-xl font-bold mb-2 text-slate-900">See the magic in action</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
          Don't have a statement handy? See what a full analysis looks like using our sample dataset.
        </p>
        <button 
          onClick={tryWithDemo}
          disabled={isLoading}
          className="w-full h-12 rounded-full font-bold bg-brand text-white hover:bg-emerald-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <PlayCircle size={18} />}
          Load Sample Report
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl text-slate-900 border border-emerald-50">
      <div className="space-y-8">
        {!file ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-emerald-100 rounded-2xl p-12 text-center hover:border-brand hover:bg-brand-light/20 cursor-pointer transition-all group"
          >
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept=".pdf,.csv"
              onChange={handleFileChange}
            />
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6 text-brand group-hover:scale-110 transition-transform">
              <Upload size={24} />
            </div>
            <p className="text-xl font-bold mb-2">Drop your statement here</p>
            <p className="text-slate-400 text-sm">Supports PDF and CSV (Max 10MB)</p>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 bg-paper rounded-xl border border-emerald-50">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-brand border border-emerald-100">
               <FileText size={24} />
            </div>
            <div className="flex-1 overflow-hidden">
               <p className="font-bold truncate">{file.name}</p>
               <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Ready to analyze</p>
            </div>
            <button 
              onClick={() => {setFile(null); setPassword(''); setIsPasswordProtected(false);}}
              className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1"
            >
              Remove
            </button>
          </div>
        )}

        {isPasswordProtected && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Lock size={14} />
              PDF Password
            </label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter file password..."
              className="w-full px-4 py-3 bg-paper rounded-xl border border-emerald-100 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
            />
            <p className="text-xs text-slate-400">Passwords are used only for local decryption and are never stored.</p>
          </motion.div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
             <AlertCircle className="shrink-0" size={18} />
             <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <button 
             disabled={!file || isLoading}
             onClick={handleUpload}
             className={cn(
               "h-14 rounded-full font-bold flex items-center justify-center gap-2 transition-all",
               file && !isLoading ? "bg-brand text-white hover:bg-emerald-900 shadow-lg shadow-emerald-900/10" : "bg-slate-100 text-slate-400 cursor-not-allowed"
             )}
           >
             {isLoading ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
             Analyze Statement
           </button>
           <button 
             onClick={tryWithDemo}
             disabled={isLoading}
             className="h-14 rounded-full font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
           >
             <PlayCircle size={18} />
             Try with Demo Data
           </button>
        </div>
      </div>
    </div>
  );
}
