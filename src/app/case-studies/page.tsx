'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MOCK_CASE_STUDIES } from '@/lib/mock-data';
import { ArrowRight, Building, CheckCircle2, Cpu } from 'lucide-react';

export default function CaseStudiesPage() {
  return (
    <div className="py-12 lg:py-20 space-y-16">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Enterprise Case Studies & Outcomes
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
          See how leading enterprise organizations partner with Nexora to automate complex operations and modernize cloud infrastructure.
        </p>
      </div>

      {/* Case Studies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {MOCK_CASE_STUDIES.map((study) => (
          <Card key={study.id} className="bg-white border border-slate-200/80 shadow-xs p-8 space-y-6">
            
            {/* Header: Client & Industry */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{study.client}</h3>
                  <span className="text-xs text-slate-500 font-semibold">Industry: {study.industry}</span>
                </div>
              </div>

              {/* Technologies Used */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500 mr-1 font-semibold">Tech Stack:</span>
                {study.techUsed.map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded bg-slate-50 text-slate-700 text-xs font-mono border border-slate-200 font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <h4 className="text-2xl font-bold text-blue-700">{study.title}</h4>

            {/* Challenge & Solution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Operational Challenge</h5>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm font-medium">{study.challenge}</p>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Technical Solution</h5>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm font-medium">{study.solution}</p>
              </div>
            </div>

            {/* Measurable Outcome */}
            <div className="pt-4 border-t border-slate-200">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Quantifiable Outcomes</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {study.results.map((res) => (
                  <div key={res.label} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-2xl font-extrabold text-emerald-700 block">{res.metric}</span>
                    <span className="text-xs text-slate-700 font-semibold block">{res.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </Card>
        ))}
      </div>

      <div className="text-center">
        <Link href="/contact">
          <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Partner With Our Team
          </Button>
        </Link>
      </div>

    </div>
  );
}

