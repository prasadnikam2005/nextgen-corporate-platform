'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MOCK_CASE_STUDIES } from '@/lib/mock-data';
import {
  ArrowRight,
  Cpu,
  Cloud,
  BarChart3,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Server,
  Award
} from 'lucide-react';

export default function HomePage() {
  const capabilityStrip = [
    { title: 'AI & Automation', desc: 'Autonomous LLM Triage', icon: Cpu },
    { title: 'Cloud Engineering', desc: 'Multi-Region Microservices', icon: Cloud },
    { title: 'Data Intelligence', desc: 'Real-time Streaming BI', icon: BarChart3 },
    { title: 'Enterprise Software', desc: 'High-Concurrency SaaS', icon: Layers },
  ];

  const servicesList = [
    {
      num: '01',
      title: 'AI & Intelligent Automation',
      desc: 'Deploy custom natural language processing and document extraction models that convert unstructured communications into structured operational workflows.',
      tags: ['NLP Triage', 'Agentic Workflows', 'Document AI', 'RAG Engines'],
      href: '/services#ai-automation'
    },
    {
      num: '02',
      title: 'Enterprise Application Development',
      desc: 'Architect resilient B2B SaaS web applications, customer portals, and enterprise backends designed for SOC-2 security and global concurrency.',
      tags: ['Next.js Architecture', 'Microservices', 'REST & GraphQL', 'Role-Based Auth'],
      href: '/services#enterprise-software'
    },
    {
      num: '03',
      title: 'Cloud Engineering & Modernization',
      desc: 'Migrate on-premise monolithic legacy systems to cloud-native AWS / Azure microservices with guaranteed zero-downtime cutover.',
      tags: ['Kubernetes', 'Docker Orchestration', 'Terraform IaC', '99.99% Availability'],
      href: '/services#cloud-engineering'
    },
    {
      num: '04',
      title: 'Data & Analytics Pipelines',
      desc: 'Build real-time ETL streaming pipelines that aggregate multi-region telemetry into executive dashboards and predictive modeling engines.',
      tags: ['Snowflake Warehouse', 'Kafka Streaming', 'Recharts Telemetry', 'Sub-second Latency'],
      href: '/services#data-analytics'
    },
    {
      num: '05',
      title: 'Cybersecurity & Compliance Auditing',
      desc: 'Implement Zero-Trust identity frameworks, automated vulnerability scanning, and end-to-end encryption for regulated industries.',
      tags: ['Zero-Trust IAM', 'SOC-2 Compliance', 'HIPAA Audits', 'Vulnerability Pen Testing'],
      href: '/services#cybersecurity'
    },
    {
      num: '06',
      title: 'Digital Transformation Consulting',
      desc: 'Partner with enterprise leadership to map technical architecture roadmaps, digitize manual processes, and accelerate delivery velocity.',
      tags: ['Architecture Strategy', 'DevOps Transformation', 'API Integration', 'ROI Governance'],
      href: '/services#digital-transformation'
    },
  ];

  const metrics = [
    { value: '40+', label: 'Enterprise Projects Delivered' },
    { value: '99.9%', label: 'Platform Reliability SLA' },
    { value: '24/7', label: 'Automated Operations' },
    { value: 'Global', label: 'Technology Expertise' },
  ];

  const whyNexora = [
    {
      title: 'Engineering Excellence',
      desc: 'Our architects bring deep experience in high-throughput cloud infrastructure and deterministic AI pipeline development.',
      icon: Cpu
    },
    {
      title: 'Enterprise Security Built-In',
      desc: 'Zero-Trust architecture standards, SOC-2 readiness, and strict multi-tenant encryption compliance on every deployment.',
      icon: ShieldCheck
    },
    {
      title: 'Proven Business Impact',
      desc: 'We measure success in quantifiable business outcomes: 10x faster response velocity, 99.99% uptime, and reduced operational overhead.',
      icon: Award
    }
  ];

  return (
    <div className="space-y-24 pb-20 bg-slate-50 text-slate-900">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Enterprise Technology Solutions</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Transforming Business Through{' '}
                <span className="text-blue-600">
                  Intelligent Technology
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
                Next-generation digital solutions powered by AI, automation, cloud and modern engineering.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link href="/contact">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Start a Conversation
                  </Button>
                </Link>

                <Link href="/services">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore Our Capabilities
                  </Button>
                </Link>
              </div>

              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Enterprise Scale</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600" /> SOC-2 Compliant</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 99.99% Uptime</span>
              </div>

            </div>

            {/* Right Visual Element (Clean Architecture Graphic) */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono font-bold text-slate-800">ENTERPRISE_SYSTEMS // ACTIVE</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                    SLA 99.99%
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-slate-800 font-sans">Customer Communication Layer</span>
                    </div>
                    <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">INGRESS</span>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-50/80 border border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-4 h-4 text-blue-700 shrink-0" />
                      <span className="text-blue-900 font-sans font-bold">AI Intent & Routing Engine</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">AUTOMATED</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Server className="w-4 h-4 text-slate-700 shrink-0" />
                      <span className="text-slate-800 font-sans">Microservices Infrastructure</span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">CLOUD NATIVE</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                  <span>Architecture: High-Concurrency Async API</span>
                  <span className="text-blue-600 font-sans font-semibold">SOC-2 Ready</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CAPABILITY STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {capabilityStrip.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="p-4.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <span className="text-[11px] text-slate-500 font-medium">{item.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. ENGINEERING WHAT'S NEXT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Modern Operations
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineering What's Next
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Nexora helps organizations modernize legacy software operations through intelligent enterprise automation, resilient cloud infrastructure, and data telemetry.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Automated Customer Communications</h4>
                  <p className="text-xs text-slate-500">Eliminate manual email sorting with NLP intent classification engines.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Cloud Architecture & Scaling</h4>
                  <p className="text-xs text-slate-500">Transition monolithic core platforms into cloud microservices with zero downtime.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Enterprise Core Stack Architecture
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-blue-700 block">FastAPI / Node.js</span>
                  <span className="text-[11px] text-slate-500">Async backend services</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-sky-700 block">PostgreSQL</span>
                  <span className="text-[11px] text-slate-500">Relational data store</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-indigo-700 block">Next.js App Router</span>
                  <span className="text-[11px] text-slate-500">Server component web</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-emerald-700 block">Vector Indexing</span>
                  <span className="text-[11px] text-slate-500">Semantic AI retrieval</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SERVICES SECTION (Structured Editorial Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">Capabilities Overview</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">Full-Spectrum Technology Services</h3>
          <p className="text-xs sm:text-sm text-slate-600">Tailored digital solutions engineered for complex corporate operational needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((srv) => (
            <div key={srv.num} className="p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between group">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 block mb-2">{srv.num}</span>
                <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{srv.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{srv.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {srv.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <Link href={srv.href} className="inline-flex items-center text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                Learn More <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ENTERPRISE METRICS */}
      <section className="bg-white border-y border-slate-200 py-16 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((m) => (
              <div key={m.label} className="text-center space-y-1">
                <span className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight block">
                  {m.value}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CASE STUDIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Proven Results</h2>
            <h3 className="text-3xl font-extrabold text-slate-900">Client Impact & Case Studies</h3>
          </div>
          <Link href="/case-studies">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All Case Studies
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_CASE_STUDIES.map((study) => (
            <Card key={study.id} className="bg-white border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-blue-600 block">{study.client} • {study.industry}</span>
                <h4 className="text-base font-bold text-slate-900 leading-snug">{study.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{study.summary}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-xl font-extrabold text-emerald-600 block">{study.results[0]?.metric}</span>
                <span className="text-[11px] text-slate-500 block">{study.results[0]?.label}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. WHY NEXORA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">Why Nexora</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">Built for Enterprise Reliability</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyNexora.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="bg-white border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-8 sm:p-12 text-center space-y-6 text-slate-900">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Let's build what's next.
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Partner with our engineering team to map out your digital infrastructure roadmap and automate core business workflows.
          </p>

          <div className="pt-2 flex justify-center">
            <Link href="/contact">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start a Conversation
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
