'use client';

import React from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { RecentEnquiriesTable } from '@/components/dashboard/RecentEnquiriesTable';
import { AIInsightsCard } from '@/components/dashboard/AIInsightsCard';
import { Sparkles, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const currentHour = new Date().toLocaleString('en-US', {
  hour: 'numeric',
  hour12: false,
  timeZone: 'Asia/Kolkata',
});

const hour = Number(currentHour);

const greeting =
  hour >= 5 && hour < 12
    ? 'Good morning'
    : hour >= 12 && hour < 17
      ? 'Good afternoon'
      : hour >= 17 && hour < 21
        ? 'Good evening'
        : 'Good night';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 flex">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">

        {/* Top Header */}
        <AdminHeader />

        {/* Dashboard Body */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">

          {/* Greeting Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>{greeting}, Prajwal</span>
                <span className="text-xl">👋</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Here's what's happening with your enquiries across all technical teams today.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-mono shadow-xs">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  Today: {new Date().toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'Asia/Kolkata',
                  })}
                </span>
              </span>
            </div>
          </div>

          {/* 1. KPI CARDS */}
          <KpiCards />

          {/* 2. RECHARTS ANALYTICS CHARTS */}
          <AnalyticsCharts />

          {/* 3. AI INSIGHTS & RECENT ENQUIRIES GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <RecentEnquiriesTable />
            </div>
            <div className="lg:col-span-4">
              <AIInsightsCard />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

