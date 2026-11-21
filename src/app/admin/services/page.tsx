'use client';

import React from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Card } from '@/components/ui/Card';
import { INITIAL_SERVICES } from '@/lib/mock-data';
import { Layers, Users, Cpu, CheckCircle2 } from 'lucide-react';

export default function AdminServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 flex">
      <AdminSidebar />

      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <AdminHeader />

        <div className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          <div className="pb-2 border-b border-slate-200">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-600" />
              <span>Services & Team Routing Rules</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage automated enquiry routing targets across corporate service offerings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INITIAL_SERVICES.map((srv) => (
              <Card key={srv.id} className="bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="text-base font-bold text-slate-900">{srv.title}</h3>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Active Route
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium">{srv.shortDesc}</p>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Target Technical Team</span>
                  <span className="font-bold text-indigo-700 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" /> {srv.title.split('&')[0]} Technical Team
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

