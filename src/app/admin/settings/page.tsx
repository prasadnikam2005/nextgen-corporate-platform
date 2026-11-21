'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Card } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Settings, Sparkles, Shield, Bell, Key, Save, Check } from 'lucide-react';

export default function AdminSettingsPage() {
  const [savedToast, setSavedToast] = useState(false);
  const [confidence, setConfidence] = useState('85');
  const [autoRouting, setAutoRouting] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 flex">
      <AdminSidebar />

      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <AdminHeader />

        <div className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Settings className="w-6 h-6 text-blue-600" />
                <span>System Settings & AI Configuration</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Configure AI Triage thresholds, routing rules, and enterprise integrations.</p>
            </div>
          </div>

          {savedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Configuration saved successfully! AI Routing engine updated.</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
            
            {/* AI Triage Engine Config */}
            <Card className="bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  AI Triage Engine Controls
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    Minimum AI Confidence Threshold for Automatic Team Routing ({confidence}%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="99"
                    value={confidence}
                    onChange={(e) => setConfidence(e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    Enquiries with AI classification confidence below this threshold will be flagged for manual admin review.
                  </p>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-900 block">Automated Team Dispatch</span>
                    <span className="text-slate-500 font-medium text-[11px]">Automatically assign incoming enquiries to target technical leads</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoRouting}
                    onChange={(e) => setAutoRouting(e.target.checked)}
                    className="w-4 h-4 rounded bg-white border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Bell className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Real-Time Notification Dispatch
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-900 block">CRITICAL Priority Alerts</span>
                    <span className="text-slate-500 font-medium text-[11px]">Send immediate email notification for high priority enterprise enquiries</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="w-4 h-4 rounded bg-white border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <div>
              <Button type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />}>
                Save Settings
              </Button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}

