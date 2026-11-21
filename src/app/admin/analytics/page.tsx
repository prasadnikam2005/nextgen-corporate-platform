'use client';

import React, { useState, useMemo } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Input';
import { AIInsightsCard } from '@/components/dashboard/AIInsightsCard';
import { useEnquiries } from '@/context/EnquiriesContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const { enquiries } = useEnquiries();

  // Dynamically extract service filter options from actual database records
  const serviceOptions = useMemo(() => {
    const serviceSet = new Set<string>();
    enquiries.forEach((e) => {
      const s = e.service || e.aiCategory;
      if (s && typeof s === 'string' && s.trim()) {
        serviceSet.add(s.trim());
      }
    });

    const list = Array.from(serviceSet);
    if (list.length === 0) {
      return [
        { value: 'ALL', label: 'All Services' },
        { value: 'AI & Automation', label: 'AI & Automation' },
        { value: 'Cloud Engineering', label: 'Cloud Engineering' },
        { value: 'Data & Analytics', label: 'Data & Analytics' },
      ];
    }

    return [
      { value: 'ALL', label: 'All Services' },
      ...list.map((s) => ({ value: s, label: s })),
    ];
  }, [enquiries]);

  // Filter enquiries according to selected date range and service
  const filteredEnquiries = useMemo(() => {
    const now = Date.now();
    const days = dateRange === '7d' ? 7 : dateRange === '90d' ? 90 : 30;
    const cutoff = now - days * 24 * 60 * 60 * 1000;

    return enquiries.filter((e) => {
      // Date filter
      const createdTime = e.createdAt ? new Date(e.createdAt).getTime() : 0;
      if (createdTime && createdTime < cutoff) {
        return false;
      }

      // Service filter
      if (serviceFilter !== 'ALL') {
        const s = (e.service || e.aiCategory || '').toLowerCase();
        const target = serviceFilter.toLowerCase();
        if (!s.includes(target) && !target.includes(s)) {
          return false;
        }
      }

      return true;
    });
  }, [enquiries, dateRange, serviceFilter]);

  // Dynamic team capacity & active workload calculated from filtered database enquiries
  const teamWorkload = useMemo(() => {
    const DEFAULT_TEAMS = [
      { team: 'Solutions Architecture', capacity: 20 },
      { team: 'Enterprise AI Group', capacity: 20 },
      { team: 'Cloud Engineering', capacity: 15 },
      { team: 'Data Engineering', capacity: 15 },
      { team: 'Strategic Advisory', capacity: 10 },
    ];

    const activeCounts: Record<string, number> = {};
    filteredEnquiries.forEach((e) => {
      const status = (e.status || '').toUpperCase();
      if (status !== 'CONVERTED' && status !== 'ARCHIVED' && status !== 'CLOSED') {
        const team = e.assignedTeam || 'Solutions Architecture';
        activeCounts[team] = (activeCounts[team] || 0) + 1;
      }
    });

    return DEFAULT_TEAMS.map((t) => ({
      team: t.team,
      active: activeCounts[t.team] || 0,
      capacity: t.capacity,
    }));
  }, [filteredEnquiries]);

  // Dynamic timeline trends calculated for the active date range
  const enquiriesOverTime = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '90d' ? 90 : 30;
    const now = new Date();
    const stepDays = days > 30 ? 3 : 1;
    const totalSteps = Math.ceil(days / stepDays);

    const buckets: Record<string, { date: string; enquiries: number; converted: number; timestamp: number }> = {};

    for (let i = totalSteps - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * stepDays * 24 * 60 * 60 * 1000);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      buckets[label] = {
        date: label,
        enquiries: 0,
        converted: 0,
        timestamp: d.getTime(),
      };
    }

    filteredEnquiries.forEach((e) => {
      if (!e.createdAt) return;
      const d = new Date(e.createdAt);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

      if (buckets[label]) {
        buckets[label].enquiries += 1;
        if ((e.status || '').toUpperCase() === 'CONVERTED') {
          buckets[label].converted += 1;
        }
      } else {
        const time = d.getTime();
        let nearestKey = '';
        let minDiff = Infinity;
        Object.entries(buckets).forEach(([key, val]) => {
          const diff = Math.abs(val.timestamp - time);
          if (diff < minDiff) {
            minDiff = diff;
            nearestKey = key;
          }
        });
        if (nearestKey && minDiff <= stepDays * 24 * 60 * 60 * 1000) {
          buckets[nearestKey].enquiries += 1;
          if ((e.status || '').toUpperCase() === 'CONVERTED') {
            buckets[nearestKey].converted += 1;
          }
        }
      }
    });

    return Object.values(buckets).map(({ date, enquiries, converted }) => ({
      date,
      enquiries,
      converted,
    }));
  }, [filteredEnquiries, dateRange]);

  // Dynamic service distribution calculated from filtered enquiries
  const byService = useMemo(() => {
    const counts: Record<string, number> = {};

    filteredEnquiries.forEach((e) => {
      const s = e.service || e.aiCategory || 'General Enterprise';
      const shortName = s.length > 25 ? s.substring(0, 22) + '...' : s;
      counts[shortName] = (counts[shortName] || 0) + 1;
    });

    const list = Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    }));

    list.sort((a, b) => b.count - a.count);

    if (list.length === 0) {
      return [{ name: 'No data in range', count: 0 }];
    }

    return list.slice(0, 6);
  }, [filteredEnquiries]);

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 flex">
      <AdminSidebar />

      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <AdminHeader />

        <div className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <span>Enquiry Analytics & Intelligence</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Deep telemetry into lead conversion rates, team capacity, and service demands ({filteredEnquiries.length} enquiries matched).
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              <Select
                className="py-1 text-xs bg-white text-slate-900 border-slate-300"
                options={[
                  { value: '7d', label: 'Last 7 Days' },
                  { value: '30d', label: 'Last 30 Days' },
                  { value: '90d', label: 'Last Quarter' },
                ]}
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              />

              <Select
                className="py-1 text-xs bg-white text-slate-900 border-slate-300"
                options={serviceOptions}
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Team Workload Bars */}
          <Card className="bg-white border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Technical Team Active Workload & Capacity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {teamWorkload.map((team) => {
                const percentage = Math.min(100, Math.round((team.active / team.capacity) * 100));
                return (
                  <div key={team.team} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-900 block truncate">{team.team}</span>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>{team.active} Active Leads</span>
                      <span>{percentage}% Cap</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${percentage > 80 ? 'bg-amber-500' : 'bg-blue-600'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Volume & Conversion Over Time */}
            <Card className="bg-white border border-slate-200/80 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                Inbound Lead Volume vs Conversion Trend
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enquiriesOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                    <Line type="monotone" dataKey="enquiries" stroke="#2563eb" strokeWidth={2.5} name="Total Inbound" />
                    <Line type="monotone" dataKey="converted" stroke="#059669" strokeWidth={2} name="Converted Deals" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Enquiries by Service Bar Chart */}
            <Card className="bg-white border border-slate-200/80 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                Service Line Request Distribution
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byService}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-15} textAnchor="end" />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" name="Requests" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

          </div>

          {/* AI Insights Section */}
          <AIInsightsCard />

        </div>
      </div>
    </div>
  );
}

