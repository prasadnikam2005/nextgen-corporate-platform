'use client';

import React from 'react';
import { PriorityLevel, EnquiryStatus } from '@/lib/mock-data';
import { AlertTriangle, Clock, CheckCircle2, FileText, Send, Sparkles, AlertCircle } from 'lucide-react';

export const PriorityBadge: React.FC<{ priority: PriorityLevel; className?: string }> = ({ priority, className = '' }) => {
  const styles: Record<PriorityLevel, string> = {
    LOW: 'bg-slate-100 text-slate-700 border-slate-200 font-medium',
    MEDIUM: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
    HIGH: 'bg-orange-50 text-orange-800 border-orange-200 font-semibold',
    CRITICAL: 'bg-red-50 text-red-800 border-red-200 font-bold shadow-xs',
  };

  const icons: Record<PriorityLevel, React.ReactNode> = {
    LOW: <Clock className="w-3 h-3 mr-1 shrink-0 text-slate-500" />,
    MEDIUM: <AlertCircle className="w-3 h-3 mr-1 shrink-0 text-amber-600" />,
    HIGH: <AlertTriangle className="w-3 h-3 mr-1 shrink-0 text-orange-600" />,
    CRITICAL: <AlertTriangle className="w-3 h-3 mr-1 shrink-0 text-red-600" />,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider border select-none ${styles[priority] || styles.MEDIUM} ${className}`}
    >
      {icons[priority]}
      {priority}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: EnquiryStatus; className?: string }> = ({ status, className = '' }) => {
  const styles: Record<EnquiryStatus, string> = {
    NEW: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
    CONTACTED: 'bg-sky-50 text-sky-700 border-sky-200',
    'IN DISCUSSION': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'PROPOSAL SENT': 'bg-purple-50 text-purple-700 border-purple-200',
    CONVERTED: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    ARCHIVED: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const icons: Record<EnquiryStatus, React.ReactNode> = {
    NEW: <Sparkles className="w-3 h-3 mr-1.5 shrink-0 text-blue-600" />,
    CONTACTED: <Send className="w-3 h-3 mr-1.5 shrink-0 text-sky-600" />,
    'IN DISCUSSION': <Clock className="w-3 h-3 mr-1.5 shrink-0 text-indigo-600" />,
    'PROPOSAL SENT': <FileText className="w-3 h-3 mr-1.5 shrink-0 text-purple-600" />,
    CONVERTED: <CheckCircle2 className="w-3 h-3 mr-1.5 shrink-0 text-emerald-600" />,
    ARCHIVED: null,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium uppercase tracking-wider border select-none ${styles[status] || styles.NEW} ${className}`}
    >
      {icons[status]}
      {status}
    </span>
  );
};
