'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  BarChart3,
  Settings,
  Layers,
  Cpu,
  LogOut,
  Globe,
  Menu,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useEnquiries } from '@/context/EnquiriesContext';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { enquiries } = useEnquiries();

  const newCount = enquiries.filter(e => e.status === 'NEW').length;

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Enquiries', href: '/admin/enquiries', icon: Inbox, badge: newCount },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Services & Routing', href: '/admin/services', icon: Layers },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    router.push('/admin/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between bg-white border-r border-slate-200 w-64 p-4 text-slate-900">
      <div className="space-y-6">

        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">NEXORA</span>
              <span className="block text-[10px] uppercase tracking-widest text-blue-600 font-bold">
                Admin Portal
              </span>
            </div>
          </Link>

          <button
            className="md:hidden text-slate-500 hover:text-slate-900"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI System Status */}
        <div className="bg-blue-50/80 border border-blue-200/80 rounded-lg p-3 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-blue-950 block leading-tight">AI Triage Active</span>
            <span className="text-blue-700 text-[11px]">Enquiries classified automatically</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="pt-4 border-t border-slate-200 space-y-1.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium">Public Portal</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed inset-y-0 left-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between text-slate-900">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-slate-900 text-base">NEXORA Admin</span>
        </div>
        {newCount > 0 && (
          <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
            {newCount} New
          </span>
        )}
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-xs">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

