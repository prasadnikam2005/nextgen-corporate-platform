'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { INITIAL_SERVICES } from '@/lib/mock-data';
import {
  Cpu,
  Cloud,
  BarChart3,
  Layers,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function ServicesPage() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-6 h-6 text-blue-600" />;
      case 'Cloud': return <Cloud className="w-6 h-6 text-cyan-600" />;
      case 'BarChart3': return <BarChart3 className="w-6 h-6 text-indigo-600" />;
      case 'Layers': return <Layers className="w-6 h-6 text-emerald-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-amber-600" />;
      case 'Zap': return <Zap className="w-6 h-6 text-rose-600" />;
      default: return <Cpu className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <div className="py-12 lg:py-20 space-y-20">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Capabilities & Technical Services
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
          From custom machine learning triage engines to zero-downtime multi-cloud migrations, we deliver scalable digital solutions designed for enterprise governance.
        </p>
      </div>

      {/* Alternating Service Rows */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {INITIAL_SERVICES.map((service, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={service.id}
              id={service.id}
              className={`p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                !isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              
              {/* Left Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    {getIcon(service.iconName)}
                  </div>
                  <div>
                    <span className="text-xs font-mono text-blue-700 font-bold block">SERVICE 0{index + 1}</span>
                    <h2 className="text-2xl font-bold text-slate-900">{service.title}</h2>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {service.fullDesc}
                </p>

                {/* Capabilities grid */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Core Capabilities</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                    {service.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <Link href={`/contact?service=${encodeURIComponent(service.title)}`}>
                    <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Request Technical Consultation
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Impact & Tech Stack Box */}
              <div className="lg:col-span-5 bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-5">
                
                {/* Tech Stack Pills */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Core Technologies
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map(t => (
                      <span key={t} className="px-2.5 py-1 rounded bg-white text-slate-700 text-xs font-mono font-medium border border-slate-200 shadow-2xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics Impact */}
                <div className="space-y-2 pt-4 border-t border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Measurable Business Impact
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {service.metrics.map(m => (
                      <div key={m.label} className="p-3 rounded bg-white border border-slate-200 shadow-2xs">
                        <span className="font-extrabold text-base text-blue-700 block">{m.value}</span>
                        <span className="text-[11px] text-slate-500 font-medium block">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-slate-900">Need a Custom Technical Architecture?</h3>
          <p className="text-sm text-slate-600 max-w-xl mx-auto font-medium">
            Share your technical requirements with our engineering team for a discovery call and architecture roadmap.
          </p>
          <div>
            <Link href="/contact">
              <Button variant="primary" size="md">
                Start a Conversation
              </Button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

