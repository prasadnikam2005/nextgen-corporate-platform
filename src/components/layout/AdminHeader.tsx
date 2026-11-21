'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, MonitorPlay, Database, RefreshCw, LogOut } from 'lucide-react';
import { useEnquiries } from '@/context/EnquiriesContext';
import { supabase } from '@/lib/supabase';

export const AdminHeader: React.FC = () => {
  const router = useRouter();
  const { enquiries, isBackendConnected, refreshEnquiries } = useEnquiries();
  const [query, setQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const highPriorityCount = enquiries.filter(e => e.priority === 'HIGH' || e.priority === 'CRITICAL').length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/admin/enquiries?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/admin/enquiries');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshEnquiries();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleSignOut = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch {
      // ignore
    }
    localStorage.removeItem('nexora_admin_auth');
    router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search enquiries by ID, customer name, company..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-12 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            aria-label="Global Admin Search"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 border border-slate-300">
            ↵
          </span>
        </form>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3 ml-auto">

          {/* Dynamic Backend Status Badge */}
          {isBackendConnected ? (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-semibold select-none">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>LIVE</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-mono font-semibold select-none">
              <MonitorPlay className="w-3.5 h-3.5 text-amber-700" />
              <span>DEMO MODE // Local Fallback</span>
            </div>
          )}

          {/* Sync / Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Refresh from Backend"
            aria-label="Refresh from Backend"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Quick Notification Bell */}
          <Link
            href="/admin/enquiries"
            className="relative p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            title={`${highPriorityCount} High Priority Enquiries`}
          >
            <Bell className="w-4 h-4" />
            {highPriorityCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                {highPriorityCount}
              </span>
            )}
          </Link>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs select-none shadow-xs">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-slate-900 block leading-tight">Admin Portal</span>
              <span className="text-[10px] text-slate-500 font-medium">Operations Lead</span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleSignOut}
              className="ml-1 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
