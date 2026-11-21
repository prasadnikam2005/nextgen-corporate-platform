'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { useEnquiries } from '@/context/EnquiriesContext';
import { Inbox, Sparkles, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

export const KpiCards: React.FC = () => {
  const { enquiries } = useEnquiries();

  const total = enquiries.length;
  const newCount = enquiries.filter(e => e.status === 'NEW').length;
  const highPriorityCount = enquiries.filter(e => e.priority === 'HIGH' || e.priority === 'CRITICAL').length;
  const convertedCount = enquiries.filter(e => e.status === 'CONVERTED').length;

  const kpis = [
    {
      title: 'Total Enquiries',
      value: total,
      trend: '+18.4% vs last month',
      trendUp: true,
      icon: Inbox,
      iconColor: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      title: 'New Enquiries',
      value: newCount,
      trend: `${newCount} awaiting triage`,
      trendUp: true,
      icon: Sparkles,
      iconColor: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    },
    {
      title: 'High Priority',
      value: highPriorityCount,
      trend: 'Requires action',
      trendUp: false,
      icon: AlertTriangle,
      iconColor: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      title: 'Converted',
      value: convertedCount,
      trend: `${((convertedCount / (total || 1)) * 100).toFixed(1)}% Conversion rate`,
      trendUp: true,
      icon: CheckCircle2,
      iconColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.title} hoverEffect className="relative overflow-hidden bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {kpi.title}
              </span>
              <div className={`p-2 rounded-lg border ${kpi.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {kpi.value}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs">
              <TrendingUp className={`w-3.5 h-3.5 ${kpi.trendUp ? 'text-emerald-600' : 'text-amber-600'}`} />
              <span className={kpi.trendUp ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                {kpi.trend}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

