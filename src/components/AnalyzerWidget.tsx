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
  const [password, setPassword] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // =========================
  // FILE SELECT
  // =========================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setError(null);
    setPassword('');
    setNeedsPassword(false);
  };

  // =========================
  // UPLOAD HANDLER
  // =========================
  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Only send password if required
      if (needsPassword && password) {
        formData.append('password', password);
      }

      const response = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // 🔐 PASSWORD FLOW
        if (data.error === 'PASSWORD_REQUIRED') {
          setNeedsPassword(true);
          setIsLoading(false);
          return; // 👈 IMPORTANT: stop execution, don't throw
        }

        // 📄 SCAN ERROR
        if (data.error === 'SCAN_DETECTED') {
          throw new Error(
            'This PDF looks like a scanned image. Please upload a text-based PDF or CSV.'
          );
        }

        throw new Error(data.message || data.error || 'Failed to parse file');
      }

      // =========================
      // AI ANALYSIS
      // =========================
      try {
        const report = await analyzeStatement(data.text);
        onReportGenerated(report);
      } catch (aiErr: any) {
        if (aiErr.message?.includes('pattern') || aiErr.message?.includes('schema')) {
          throw new Error(
            'We hit a formatting issue while analyzing your file. Please try again.'
          );
        }
        throw aiErr;
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // DEMO MODE
  // =========================
  const tryWithDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      onReportGenerated(SAMPLE_REPORT);
      setIsLoading(false);
    }, 1500);
  };

  // =========================
  // DEMO ONLY VIEW
  // =========================
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
          Try a sample dataset to see how analysis works.
        </p>
        <button
          onClick={tryWithDemo}
          disabled={isLoading}
          className="w-full h-12 rounded-full font-bold bg-brand text-white flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <PlayCircle size={18} />}
          Load Sample Report
        </button>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl border border-emerald-50">
      <div className="space-y-5">

        {/* FILE UPLOAD */}
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-brand rounded-2xl p-8 text-center cursor-pointer transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.csv"
              onChange={handleFileChange}
            />
            <Upload className="mx-auto mb-3 text-slate-400" size={28} />
            <p className="font-bold text-slate-700">Upload your statement</p>
            <p className="text-sm text-slate-400 mt-1">PDF or CSV · Max 10MB</p>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 border rounded-xl">
            <FileText />
            <span className="flex-1 truncate">{file.name}</span>
            <button
              onClick={() => {
                setFile(null);
                setPassword('');
                setNeedsPassword(false);
              }}
            >
              Remove
            </button>
          </div>
        )}

        {/* PASSWORD INPUT */}
        {needsPassword && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <label className="flex items-center gap-2 text-sm font-bold">
              <Lock size={14} />
              Enter PDF Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 border rounded-xl"
            />
          </motion.div>
        )}

        {/* ERROR */}
        {error && (
          <div className="flex gap-2 text-red-500 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex gap-4">
          <button
            disabled={!file || isLoading}
            onClick={handleUpload}
            className="flex-1 h-12 bg-brand text-white rounded-full"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Analyze'}
          </button>

          <button
            onClick={tryWithDemo}
            className="flex-1 h-12 border rounded-full"
          >
            Demo
          </button>
        </div>
      </div>
    </div>
  );
}
