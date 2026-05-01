import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  AlertTriangle, Lightbulb, CheckCircle2,
  Calendar, Building2, ChevronDown, Receipt, PiggyBank, Wallet, ListChecks,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { AnalysisReport, Insight, Currency, SpendCategory } from '../types';
import { cn } from '../lib/utils';

interface Props { report: AnalysisReport }

const COLORS = ['#13261c', '#10b981', '#d2f34c', '#3b82f6', '#f59e0b', '#ec4899'];
const INV_COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

function fmt(amount: number, currency: Currency) {
  return `${currency.symbol}${amount.toLocaleString()}`;
}

export default function ReportDashboard({ report }: Props) {
  const { currency } = report;
  const insightsRef = useRef<HTMLDivElement>(null);
  const totalSavings = report.insights.reduce((a, b) => a + b.impactAmount, 0);
  const netFlow = report.totalIncome - report.totalSpend - report.investmentsTotal;

  const scrollToInsights = () => {
    insightsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Row 1: Income / Spend / Net Flow ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Income */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Income</span>
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-emerald-700 truncate">
            {fmt(report.totalIncome, currency)}
          </p>
          <div className="mt-4 space-y-1">
            {report.incomeSources.slice(0, 2).map((s, i) => (
              <div key={i} className="flex justify-between text-xs text-slate-500">
                <span className="truncate max-w-[150px]">{s.name}</span>
                <span className="font-semibold">{fmt(s.total, currency)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Spend */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Expenses</span>
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-400">
              <TrendingDown size={20} />
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

        {/* Net Flow */}
        <div className={cn(
          'p-6 rounded-3xl shadow-sm',
          netFlow >= 0 ? 'bg-brand text-white' : 'bg-red-600 text-white'
        )}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/60 text-sm font-bold uppercase tracking-wider">Net Cash Flow</span>
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              {netFlow >= 0
                ? <ArrowUpRight size={20} className="text-accent" />
                : <ArrowDownRight size={20} className="text-red-200" />}
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight truncate">
            {netFlow >= 0 ? '+' : ''}{fmt(netFlow, currency)}
          </p>
          <p className="mt-4 text-sm text-white/70">
            {netFlow >= 0
              ? 'Income exceeds spending this period — good health.'
              : 'Spending exceeds income this period. Review expenses.'}
          </p>
        </div>
      </div>

      {/* ── Row 2: Savings Pot + Investments ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Potential Savings — clickable */}
        <button
          onClick={scrollToInsights}
          className="group text-left bg-accent/10 border-2 border-accent/30 hover:border-accent hover:bg-accent/20 p-6 rounded-3xl transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-brand text-sm font-bold uppercase tracking-wider">Potential Savings</span>
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
              <Wallet size={20} />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-brand truncate">
            {fmt(totalSavings, currency)}
          </p>
          <p className="mt-3 text-sm text-brand/70 flex items-center gap-2">
            <span>Click to see optimisation breakdown</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </p>
        </button>

        {/* Investments & Savings */}
        <div className="bg-purple-50 border border-purple-100 p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-purple-700 text-sm font-bold uppercase tracking-wider">Investments & Savings</span>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              <PiggyBank size={20} />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-purple-900 truncate">
            {fmt(report.investmentsTotal, currency)}
          </p>
          <div className="mt-3 space-y-1">
            {report.investmentCategories.map((inv, i) => (
              <div key={i} className="flex justify-between text-xs text-purple-700">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: INV_COLORS[i % INV_COLORS.length] }} />
                  <span className="truncate max-w-[160px]">{inv.name}</span>
                </div>
                <span className="font-semibold">{fmt(inv.total, currency)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content: Insights + Charts ── */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left: Insights */}
        <div className="lg:col-span-2 space-y-6" ref={insightsRef}>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">Intelligence & Recommendations</h3>
            <p className="text-sm text-slate-400 mt-1">
              Based on discretionary spend only. Investments are excluded.
              Click any card to see supporting transactions.
            </p>
          </div>
          <div className="space-y-4">
            {report.insights.map((insight, idx) => (
              <InsightCard key={idx} insight={insight} currency={currency} />
            ))}
          </div>

          <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div>
                <h3 className="text-2xl font-bold mb-2">Want deeper analysis?</h3>
                <p className="text-slate-600">Connect your accounting software for full historical trends and automated payroll auditing.</p>
              </div>
              <a href="mailto:vb528@georgetown.edu" className="bg-brand text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-emerald-900 transition-all whitespace-nowrap shadow-xl shadow-emerald-900/10">
                Book a Demo <ArrowUpRight size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Charts */}
        <div className="space-y-6">

          {/* Expense breakdown */}
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">Expense Breakdown</h3>
          <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm space-y-2">
            <div className="h-48 w-full mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={report.categories} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="total" stroke="none">
                    {report.categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmt(v, currency)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {report.categories.map((cat, i) => (
              <CategoryRow key={i} cat={cat} color={COLORS[i % COLORS.length]} currency={currency} />
            ))}
          </div>

          {/* Top Vendors */}
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 pt-4">Top Vendors</h3>
          <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm space-y-4">
            <div className="h-48 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.topVendors} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(v: number) => fmt(v, currency)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={20}>
                    {report.topVendors.map((_, i) => <Cell key={i} fill={i === 0 ? '#13261c' : '#10b981'} />)}
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

// ─── Category Row ────────────────────────────────────────────────────────────

function CategoryRow({ cat, color, currency }: { cat: SpendCategory; color: string; currency: Currency }) {
  const [expanded, setExpanded] = useState(false);
  const hasTransactions = !!cat.transactions?.length;

  return (
    <div className="border-b border-slate-50 last:border-0">
      <button
        onClick={() => hasTransactions && setExpanded(!expanded)}
        className={cn('w-full flex justify-between items-center py-2.5 text-sm font-bold', hasTransactions && 'cursor-pointer hover:bg-slate-50 rounded-xl px-2 -mx-2 transition-colors')}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-slate-700 truncate max-w-[130px]">{cat.name}</span>
          {hasTransactions && <ChevronDown size={12} className={cn('text-slate-300 transition-transform duration-150', expanded && 'rotate-180')} />}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-900">{fmt(cat.total, currency)}</span>
          <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full w-14 text-center">{cat.percentage}%</span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && hasTransactions && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
            <div className="mb-2 mx-1 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
              <table className="w-full text-xs">
                <tbody>
                  {cat.transactions!.map((tx, i) => (
                    <tr key={i} className="border-t border-slate-100 first:border-0">
                      <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{tx.date}</td>
                      <td className="px-3 py-2 text-slate-600 font-medium truncate max-w-[120px]">{tx.description}</td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-slate-800">{fmt(tx.amount, currency)}</td>
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
}

// ─── Insight Card ─────────────────────────────────────────────────────────────

function InsightCard({ insight, currency }: { insight: Insight; currency: Currency }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = insight.type === 'saving' ? CheckCircle2 : insight.type === 'alert' ? AlertTriangle : Lightbulb;
  const hasTransactions = !!insight.transactions?.length;
  const hasSteps = !!insight.savingSteps?.length;
  const isExpandable = hasTransactions || hasSteps;

  const colors = {
    saving: { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700', table: 'bg-emerald-100 text-emerald-700', hint: 'text-emerald-600' },
    alert: { bg: 'bg-pink-50', border: 'border-pink-100', icon: 'bg-pink-500', badge: 'bg-pink-100 text-pink-700', table: 'bg-pink-100 text-pink-700', hint: 'text-pink-600' },
    recommendation: { bg: 'bg-blue-50', border: 'border-blue-100', icon: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700', table: 'bg-blue-100 text-blue-700', hint: 'text-blue-600' },
  }[insight.type];

  return (
    <div className={cn('rounded-2xl border shadow-sm overflow-hidden', colors.bg, colors.border)}>
      <button
        onClick={() => isExpandable && setExpanded(!expanded)}
        className={cn('w-full text-left p-5 sm:p-6 flex gap-4 sm:gap-6 items-start', isExpandable && 'cursor-pointer hover:brightness-95 transition-all')}
      >
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white', colors.icon)}>
          <Icon size={24} />
        </div>
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">{insight.title}</h4>
            <div className="flex items-center gap-2 shrink-0">
              <span className={cn('px-3 py-1 rounded-full text-xs font-bold', colors.badge)}>
                Save {fmt(insight.impactAmount, currency)}
              </span>
              {isExpandable && (
                <ChevronDown size={16} className={cn('text-slate-400 transition-transform duration-200', expanded && 'rotate-180')} />
              )}
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed text-sm">{insight.description}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {hasTransactions && (
              <p className={cn('text-xs font-medium flex items-center gap-1', colors.hint)}>
                <Receipt size={12} />
                {insight.transactions!.length} transaction{insight.transactions!.length !== 1 ? 's' : ''}
              </p>
            )}
            {insight.savingSteps?.length ? (
              <p className={cn('text-xs font-medium flex items-center gap-1', colors.hint)}>
                <ListChecks size={12} />
                {insight.savingSteps.length} action steps
              </p>
            ) : null}
            {(hasTransactions || insight.savingSteps?.length) && (
              <p className={cn('text-xs font-medium', colors.hint)}>· click to expand</p>
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && isExpandable && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="mx-5 mb-5 space-y-3">
              {/* Action steps */}
              {insight.savingSteps?.length ? (
                <div className={cn('rounded-xl overflow-hidden border', colors.border)}>
                  <div className={cn('px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2', colors.table)}>
                    <ListChecks size={12} /> Action Steps
                  </div>
                  <ul className="bg-white divide-y divide-slate-50">
                    {insight.savingSteps.map((step, i) => (
                      <li key={i} className="px-4 py-2.5 text-sm text-slate-700 flex items-start gap-2">
                        <span className={cn('font-bold shrink-0 mt-0.5', colors.hint)}>{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Transactions */}
              {hasTransactions && (
                <div className={cn('rounded-xl overflow-hidden border', colors.border, 'bg-white')}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={cn('text-xs font-bold uppercase tracking-wider', colors.table)}>
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
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
