'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ANALYTICS_DATA } from '@/lib/mock-data';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const AIInsightsCard: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <Card className="border border-slate-200/80 bg-white shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Automated AI Insights & Triage Recommendations
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Generated in real-time by Nexora NLP Triage Model (Simulated Demo Dataset)
            </p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
          Demo Insights
        </span>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {ANALYTICS_DATA.aiInsights.map((insight) => (
          <div
            key={insight.id}
            className="p-3.5 rounded-lg bg-slate-50/90 border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0">{getIcon(insight.type)}</div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">{insight.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{insight.description}</p>
                <div className="pt-1 flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                  <ArrowRight className="w-3 h-3" />
                  <span>Recommended Action: {insight.action}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Demo notice note */}
      <p className="mt-4 text-[10px] text-slate-400 italic text-center">
        * Note: These insights are automatically compiled from the mock enquiry dataset for UI demonstration purposes.
      </p>
    </Card>
  );
};

