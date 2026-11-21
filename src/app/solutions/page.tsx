'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2, Cpu, Cloud, BarChart3, ShieldCheck, Zap, Layers, RefreshCcw } from 'lucide-react';

export default function SolutionsPage() {
  const solutions = [
    {
      title: 'Intelligent Customer Operations',
      tagline: 'Automated enquiry triage & intent classification',
      desc: 'Transform incoming unstructured emails, web inquiries, and customer requests into structured, categorized, and prioritized lead routes within seconds.',
      benefits: ['96% Intent Recognition Accuracy', 'Sub-second Processing Speed', 'Automated Department Routing']
    },
    {
      title: 'Digital Commerce Engine',
      tagline: 'High-concurrency B2B platforms',
      desc: 'Architect resilient B2B digital commerce portals handling high order concurrency, ERP inventory streaming, and multi-currency checkout workflows.',
      benefits: ['Sub-100ms API Latency', 'SAP & Oracle ERP Integrations', 'Multi-tenant Access Control']
    },
    {
      title: 'Enterprise Modernization',
      tagline: 'Monolith to cloud microservices',
      desc: 'Refactor monolithic legacy codebases into modular, containerized Docker microservices on AWS/Azure with zero downtime during cutover.',
      benefits: ['Zero-Downtime Deployment', 'Infrastructure as Code (Terraform)', '35% Reduced Cloud Overhead']
    },
    {
      title: 'Data Intelligence Architecture',
      tagline: 'Real-time telemetry & BI streaming',
      desc: 'Stream operational telemetry across multi-region databases into Snowflake data warehouses for instant executive dashboard analytics.',
      benefits: ['Kafka Real-time Ingestion', 'Interactive Recharts Dashboards', 'Predictive Demand Modeling']
    },
    {
      title: 'Workflow Automation',
      tagline: 'End-to-end operational automation',
      desc: 'Eliminate repetitive manual document parsing, invoice extraction, and inter-department approval handoffs using autonomous AI agent workflows.',
      benefits: ['88% Workload Reduction', 'PDF Financial Statement Extraction', 'Audit Log Traceability']
    },
    {
      title: 'Cloud Transformation & Security',
      tagline: 'Zero-Trust multi-cloud governance',
      desc: 'Implement Zero-Trust identity access frameworks, automated vulnerability patching, and SOC-2 privacy controls across global cloud environments.',
      benefits: ['SOC-2 Type II Ready', 'Zero-Trust IAM Policy', '24/7 Security Auditing']
    },
  ];

  return (
    <div className="py-12 lg:py-20 space-y-20">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Enterprise Industry Solutions
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
          Strategic digital architecture solutions engineered to solve complex operational challenges across global enterprises.
        </p>
      </div>

      {/* Solutions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((sol) => (
            <Card key={sol.title} className="bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider block">
                  {sol.tagline}
                </span>
                <h3 className="text-xl font-bold text-slate-900">{sol.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{sol.desc}</p>

                <div className="pt-2 space-y-1.5 border-t border-slate-200">
                  {sol.benefits.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link href="/contact">
                  <Button variant="outline" size="sm" className="w-full justify-between" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Explore Architecture
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Link href="/contact">
          <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Discuss Your Enterprise Solution
          </Button>
        </Link>
      </div>

    </div>
  );
}

