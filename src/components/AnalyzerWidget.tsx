import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, Lock, Loader2, PlayCircle, AlertCircle, X, Eye, EyeOff } from 'lucide-react';
import { AnalysisReport } from '../types';
import { cn } from '../lib/utils';
import { SAMPLE_REPORT } from '../lib/sampleData';
import { extractTextFromFile, PasswordRequiredError, WrongPasswordError, ScannedPDFError } from '../lib/documentParser';

interface AnalyzerWidgetProps {
  onReportGenerated: (report: AnalysisReport) => void;
  onNonFinancialDocument?: () => void;
  showDemoOnly?: boolean;
}

export default function AnalyzerWidget({ onReportGenerated, onNonFinancialDocument, showDemoOnly = false }: AnalyzerWidgetProps) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectFile = (selected: File) => {
    setFile(selected);
    setError(null);
    setPassword('');
    setShowPassword(false);
    setNeedsPassword(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) selectFile(selected);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    if (!dropped.name.match(/\.(pdf|csv)$/i)) {
      setError('Only PDF or CSV files are supported.');
      return;
    }
    selectFile(dropped);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Extract text entirely in the browser — no file or password sent to server
      let text: string;
      try {
        text = await extractTextFromFile(file, needsPassword ? password : undefined);
      } catch (extractErr: any) {
        if (extractErr instanceof PasswordRequiredError) {
          setNeedsPassword(true);
          setIsLoading(false);
          return;
        }
        if (extractErr instanceof WrongPasswordError) {
          setNeedsPassword(true);
          setError('Incorrect password. Please try again.');
          setIsLoading(false);
          return;
        }
        if (extractErr instanceof ScannedPDFError) {
          throw new Error('This PDF looks like a scanned image. Please upload a text-based PDF or CSV.');
        }
        throw extractErr;
      }

      // Step 2: Send only the extracted text to the server for AI analysis
      const response = await fetch('/api/parse-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, fileName: file.name }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'NON_FINANCIAL_DOCUMENT') {
          onNonFinancialDocument?.();
          return;
        }
        throw new Error(data.message || 'Failed to analyze document.');
      }

      onReportGenerated(data.report);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const tryWithDemo = () => {
    setIsLoading(true);
    setTimeout(() => { onReportGenerated(SAMPLE_REPORT); setIsLoading(false); }, 1500);
  };

  const clearFile = () => {
    setFile(null);
    setPassword('');
    setShowPassword(false);
    setNeedsPassword(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (showDemoOnly) {
    return (
      <div className="text-center py-6">
        <div className="mb-4 flex justify-center">
          <div className="w-14 h-14 bg-brand-light rounded-full flex items-center justify-center text-brand">
            <FileText size={28} />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 text-slate-900">See the magic in action</h3>
        <p className="text-slate-500 text-sm mb-5 max-w-sm mx-auto">Try a sample dataset to see how analysis works.</p>
        <button
          onClick={tryWithDemo}
          disabled={isLoading}
          className="w-full h-12 rounded-full font-bold bg-brand text-white flex items-center justify-center gap-2 hover:bg-emerald-900 transition-colors"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <PlayCircle size={18} />}
          Load Sample Report
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl border border-emerald-50">
      <div className="space-y-4">

        {/* FILE DROP ZONE */}
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
              isDragging ? 'border-brand bg-brand/5 scale-[1.01]' : 'border-slate-200 hover:border-brand hover:bg-slate-50'
            )}
          >
            <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.csv" onChange={handleFileChange} />
            <Upload className={cn('mx-auto mb-3 transition-colors', isDragging ? 'text-brand' : 'text-slate-400')} size={28} />
            <p className="font-bold text-slate-700">{isDragging ? 'Drop it here' : 'Drag & drop or click to upload'}</p>
            <p className="text-sm text-slate-400 mt-1">PDF or CSV · Max 10MB</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shrink-0">
              <FileText size={18} className="text-white" />
            </div>
            <span className="flex-1 truncate text-sm font-semibold text-slate-700">{file.name}</span>
            <button onClick={clearFile} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-emerald-100 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={16} />
            </button>
          </div>
        )}

        {/* PASSWORD INPUT */}
        {needsPassword && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-3">
              <Lock size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-800">This PDF is password protected</p>
                <p className="text-xs text-blue-600 mt-0.5">Your password is used only in your browser to unlock the PDF. It is never sent to our servers.</p>
              </div>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                onKeyDown={(e) => e.key === 'Enter' && password && handleUpload()}
                placeholder="Enter PDF password"
                autoFocus
                className="w-full p-3 pr-11 border-2 border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand transition-colors bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>
        )}

        {/* ERROR */}
        {error && (
          <div className="flex gap-2 items-start text-red-600 text-sm bg-red-50 border border-red-100 rounded-2xl p-3">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex gap-3 pt-1">
          <button
            disabled={!file || isLoading}
            onClick={handleUpload}
            className="flex-1 h-12 bg-brand text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-emerald-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Analyze'}
          </button>
          <button
            onClick={tryWithDemo}
            disabled={isLoading}
            className="flex-1 h-12 border border-slate-200 rounded-full font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Demo
          </button>
        </div>
      </div>
    </div>
  );
}
