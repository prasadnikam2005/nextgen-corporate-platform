'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { AIAnalysis } from '@/lib/mock-data';
import { PriorityBadge } from '@/components/ui/Badge';
import { Sparkles, Brain, CheckCircle, Users, Zap, DollarSign, Calendar, RefreshCw } from 'lucide-react';

interface AIAnalysisCardProps {
  aiAnalysis: AIAnalysis;
  onReanalyze?: () => void;
  isReanalyzing?: boolean;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({
  aiAnalysis,
  onReanalyze,
  isReanalyzing = false,
}) => {
  return (
    <Card className="border border-slate-200/80 bg-white shadow-xs relative overflow-hidden">

      {/* Clean blue header stripe */}
      <div className="absolute top-0 inset-x-0 h-1 bg-blue-600" />

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>AI Automated Triage & Analysis</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Confidence: {Math.round(aiAnalysis.confidenceScore * 100)}%
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Extracted by Nexora LLM Intent & Categorization Pipeline</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onReanalyze && (
            <button
              onClick={onReanalyze}
              disabled={isReanalyzing}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors disabled:opacity-60"
              title="Re-run AI analysis on this enquiry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReanalyzing ? 'animate-spin text-blue-600' : ''}`} />
              <span>{isReanalyzing ? 'Analyzing...' : 'Re-run AI'}</span>
            </button>
          )}
          <PriorityBadge priority={aiAnalysis.priority} />
        </div>
      </div>

      {/* Grid of Key AI Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-5">

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">
            Category
          </span>
          <span className="text-xs font-bold text-blue-700">{aiAnalysis.category}</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">
            Subcategory
          </span>
          <span className="text-xs font-bold text-slate-900">{aiAnalysis.subcategory}</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">
            Customer Intent
          </span>
          <span className="text-xs font-bold text-slate-900">{aiAnalysis.intent}</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block mb-1">
            Suggested Team
          </span>
          <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {aiAnalysis.suggestedTeam}
          </span>
        </div>
      </div>

      {/* AI Summary */}
      <div className="space-y-4">
        <div className="p-3.5 rounded-lg bg-blue-50/80 border border-blue-200">
          <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            AI Executive Summary
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed font-sans">{aiAnalysis.summary}</p>
        </div>

        {/* Recommended Next Action */}
        <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            Recommended Next Action
          </h4>
          <p className="text-xs text-amber-900 font-semibold">{aiAnalysis.recommendedAction}</p>
        </div>

        {/* Requirements & Estimates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">

          {/* Key Requirements Extracted */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Extracted Requirements
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {aiAnalysis.keyRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Budget & Timeline Estimates */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              AI Commercial Estimates
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
                {/* <DollarSign className="w-4 h-4 text-emerald-600" /> */}
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Estimated Deal Size</span>
                  <span className="font-bold text-slate-900">{aiAnalysis.estimatedBudgetRange || '40,000 - 70,000'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
                <Calendar className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Est. Implementation Timeline</span>
                  <span className="font-bold text-slate-900">{aiAnalysis.timelineEstimate || '6 - 8 Weeks'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Card>
  );
};
