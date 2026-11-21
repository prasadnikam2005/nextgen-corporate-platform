'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Cpu, Target, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const leadership = [
    { name: 'Dr. Vikram Sengupta', role: 'Head of Enterprise AI & NLP Systems', background: 'Ex-AI Research Lead, Ph.D. in Machine Learning' },
    { name: 'Neha Kulkarni', role: 'Director of Cloud & Infrastructure', background: 'Architected multi-region cloud for Fortune 500 fintech' },
    { name: 'Arjun Verma', role: 'VP of Enterprise Software Engineering', background: '12+ years in B2B SaaS architecture & zero-downtime platforms' },
  ];

  return (
    <div className="py-12 lg:py-20 space-y-20 bg-slate-50 text-slate-900">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Architecting Enterprise Digital Systems
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Nexora partners with forward-thinking enterprises to modernize operations, automate high-volume communications, and build high-concurrency digital platforms.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="space-y-3 bg-white border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            To empower global organizations by converting manual, unstructured communication streams into categorized, actionable operational intelligence.
          </p>
        </Card>

        <Card className="space-y-3 bg-white border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Engineering Quality Standard</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            We deliver deterministic, enterprise-grade AI triage pipelines with 96%+ classification precision, full auditability, and strict SOC-2 security compliance.
          </p>
        </Card>
      </div>

      {/* Leadership */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Engineering Leadership</h2>
          <p className="text-xs sm:text-sm text-slate-600">Pioneers in artificial intelligence, distributed systems, and cloud architecture.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadership.map((member) => (
            <Card key={member.name} className="space-y-3 bg-white border-slate-200">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h4 className="text-base font-bold text-slate-900">{member.name}</h4>
              <span className="text-xs font-semibold text-blue-600 block">{member.role}</span>
              <p className="text-xs text-slate-600">{member.background}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Link href="/contact">
          <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Work With Our Team
          </Button>
        </Link>
      </div>

    </div>
  );
}
