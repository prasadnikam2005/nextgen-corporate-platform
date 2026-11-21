'use client';

import React from 'react';
import { EnquiryStatus } from '@/lib/mock-data';
import { Check, Clock, Sparkles, Send, FileText, CheckCircle2 } from 'lucide-react';

interface StepperProps {
  currentStatus: EnquiryStatus;
  onStatusChange: (newStatus: EnquiryStatus) => void;
}

export const StatusWorkflowStepper: React.FC<StepperProps> = ({ currentStatus, onStatusChange }) => {
  const steps: { status: EnquiryStatus; label: string; icon: React.ReactNode }[] = [
    { status: 'NEW', label: 'New', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { status: 'CONTACTED', label: 'Contacted', icon: <Send className="w-3.5 h-3.5" /> },
    { status: 'IN DISCUSSION', label: 'In Discussion', icon: <Clock className="w-3.5 h-3.5" /> },
    { status: 'PROPOSAL SENT', label: 'Proposal Sent', icon: <FileText className="w-3.5 h-3.5" /> },
    { status: 'CONVERTED', label: 'Converted', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  const getStepIndex = (st: EnquiryStatus) => steps.findIndex(s => s.status === st);
  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-6 shadow-xs text-slate-900">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Enquiry Workflow Lifecycle
          </h4>
          <p className="text-xs text-slate-500 font-medium">Click any stage to update lifecycle status</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
          Current: {currentStatus}
        </span>
      </div>

      <div className="relative flex items-center justify-between">
        
        {/* Connector line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
        
        {/* Active fill line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-600 transition-all duration-300 z-0"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={step.status}
              onClick={() => onStatusChange(step.status)}
              className="relative z-10 flex flex-col items-center group focus:outline-none"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 border ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-4 ring-blue-600/10'
                    : isPassed
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-400 border-slate-300 hover:border-slate-400 hover:text-slate-700'
                }`}
              >
                {isPassed ? <Check className="w-4 h-4" /> : step.icon}
              </div>
              <span
                className={`mt-2 text-[11px] font-semibold transition-colors ${
                  isCurrent ? 'text-blue-700 font-bold' : isPassed ? 'text-emerald-700' : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

