import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  ArrowUpRight,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Building2,
  ChevronDown,
  Receipt,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { AnalysisReport, Insight, Currency } from '../types';
import { cn } from '../lib/utils';

interface ReportDashboardProps {
  report: AnalysisReport;
}

const COLORS = ['#13261c', '#10b981', '#d2f34c', '#3b82f6', '#f59e0b', '#ec4899'];

function fmt(amount: number, currency: Currency) {
  return `${currency.symbol}${amount.toLocaleString()}`;
}

export default function ReportDashboard({ report }: ReportDashboardProps) {
  const { currency } = report;
  const totalSavings = report.insights.reduce((acc, curr) => acc + curr.impactAmount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Monthly Spend</span>
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-brand">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 truncate">
            {fmt(report.totalSpend, currency)}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-sm text-slate-500">{report.periodRange}</span>
          </div>
        </div>

        <div className="bg-brand p-6 rounded-3xl text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp size={80} />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-emerald-100/60 text-sm font-bold uppercase tracking-wider">Potential Savings</span>
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-accent">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight relative z-10 truncate">
            {fmt(totalSavings, currency)}
          </p>
          <p className="mt-4 text-sm text-emerald-100/80 relative z-10 leading-snug">
            Identified through redundant tools and pricing inefficiencies.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Top Merchant</span>
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
              <Building2 size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900 truncate" title={report.topVendors[0]?.name}>
            {report.topVendors[0]?.name}
          </p>
          <p className="mt-1 text-slate-500 font-medium">{fmt(report.topVendors[0]?.total, currency)} spent</p>
          <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-accent w-3/4 rounded-full" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Insights */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">Intelligence & Recommendations</h3>
          <p className="text-sm text-slate-400 -mt-4">Click any insight to see the transactions behind it.</p>
          <div className="space-y-4">
            {report.insights.map((insight, idx) => (
              <InsightCard key={idx} insight={insight} currency={currency} />
            ))}
          </div>

          <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100 mt-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div>
                <h3 className="text-2xl font-bold mb-2">Want deeper analysis?</h3>
                <p className="text-slate-600">Connect your accounting software for full historical trends and automated payroll auditing.</p>
              </div>
              <a href="mailto:vb528@georgetown.edu" className="bg-brand text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-emerald-900 transition-all whitespace-nowrap shadow-xl shadow-emerald-900/10">
                Book a Demo
                <ArrowUpRight size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Charts */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">Category Breakdown</h3>
          <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm space-y-4">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={report.categories} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="total" stroke="none">
                    {report.categories.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => fmt(value, currency)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {report.categories.map((cat, idx) => (
                <div key={idx} className="flex justify-between text-sm font-bold items-center py-2 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-slate-600 truncate max-w-[120px]">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{fmt(cat.total, currency)}</span>
                    <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-slate-900 pt-8">Top Vendors</h3>
          <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm space-y-4">
            <div className="h-48 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.topVendors} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    formatter={(value: number) => fmt(value, currency)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="total" fill="#13261c" radius={[0, 4, 4, 0]} barSize={20}>
                    {report.topVendors.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#13261c' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {report.topVendors.map((v, i) => (
              <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                <span className="font-bold text-slate-700 text-sm truncate">{v.name}</span>
                <span className="font-mono text-sm">{fmt(v.total, currency)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Insight Card ─────────────────────────────────────────────────────────────

const InsightCard = ({ insight, currency }: { insight: Insight; currency: Currency }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = insight.type === 'saving' ? CheckCircle2 : insight.type === 'alert' ? AlertTriangle : Lightbulb;
  const hasTransactions = insight.transactions && insight.transactions.length > 0;

  return (
    <div className={cn(
      'rounded-2xl border shadow-sm overflow-hidden transition-all',
      insight.type === 'saving' ? 'bg-emerald-50 border-emerald-100' :
      insight.type === 'alert' ? 'bg-pink-50 border-pink-100' :
      'bg-blue-50 border-blue-100'
    )}>
      {/* Main row — always visible */}
      <button
        onClick={() => hasTransactions && setExpanded(!expanded)}
        className={cn('w-full text-left p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start', hasTransactions && 'cursor-pointer hover:brightness-95 transition-all')}
      >
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
          insight.type === 'saving' ? 'bg-emerald-500 text-white' :
          insight.type === 'alert' ? 'bg-pink-500 text-white' :
          'bg-blue-500 text-white'
        )}>
          <Icon size={24} />
        </div>

        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">{insight.title}</h4>
            <div className="flex items-center gap-2 shrink-0">
              <span className={cn(
                'px-3 py-1 rounded-full text-xs font-bold',
                insight.type === 'saving' ? 'bg-emerald-100 text-emerald-700' :
                insight.type === 'alert' ? 'bg-pink-100 text-pink-700' :
                'bg-blue-100 text-blue-700'
              )}>
                Save {fmt(insight.impactAmount, currency)}
              </span>
              {hasTransactions && (
                <ChevronDown size={16} className={cn('text-slate-400 transition-transform duration-200', expanded && 'rotate-180')} />
              )}
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed text-sm">{insight.description}</p>
          {hasTransactions && (
            <p className="text-xs mt-2 font-medium flex items-center gap-1" style={{ color: insight.type === 'saving' ? '#059669' : insight.type === 'alert' ? '#db2777' : '#2563eb' }}>
              <Receipt size={12} />
              {insight.transactions!.length} transaction{insight.transactions!.length !== 1 ? 's' : ''} · click to view
            </p>
          )}
        </div>
      </button>

      {/* Expanded transaction table */}
      <AnimatePresence>
        {expanded && hasTransactions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={cn(
              'mx-5 mb-5 rounded-xl overflow-hidden border',
              insight.type === 'saving' ? 'border-emerald-200 bg-white' :
              insight.type === 'alert' ? 'border-pink-200 bg-white' :
              'border-blue-200 bg-white'
            )}>
              <table className="w-full text-sm">
                <thead>
                  <tr className={cn(
                    'text-xs font-bold uppercase tracking-wider',
                    insight.type === 'saving' ? 'bg-emerald-100 text-emerald-700' :
                    insight.type === 'alert' ? 'bg-pink-100 text-pink-700' :
                    'bg-blue-100 text-blue-700'
                  )}>
                    <th className="text-left px-4 py-2">Date</th>
                    <th className="text-left px-4 py-2">Description</th>
                    <th className="text-right px-4 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {insight.transactions!.map((tx, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">{tx.date}</td>
                      <td className="px-4 py-2.5 text-slate-700 font-medium">{tx.description}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">{fmt(tx.amount, currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
