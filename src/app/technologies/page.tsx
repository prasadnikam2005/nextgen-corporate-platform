'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Cpu, Layout, Server, Cloud, Database, Terminal, ShieldCheck } from 'lucide-react';

export default function TechnologiesPage() {
  const groups = [
    {
      name: 'AI & Machine Learning',
      icon: Cpu,
      techs: [
        { name: 'PyTorch & NLP Models', desc: 'Custom text classification and sentiment extraction' },
        { name: 'Vector DB Indexing', desc: 'Semantic document retrieval and embeddings' },
        { name: 'LLM Agent Orchestration', desc: 'Automated intent categorization and lead routing' },
      ]
    },
    {
      name: 'Frontend Engineering',
      icon: Layout,
      techs: [
        { name: 'Next.js (App Router)', desc: 'React 19 framework with SSR component rendering' },
        { name: 'TypeScript', desc: 'Strict static type safety across schemas and UI props' },
        { name: 'Tailwind CSS', desc: 'Enterprise design tokens and responsive utility styling' },
      ]
    },
    {
      name: 'Backend Services',
      icon: Server,
      techs: [
        { name: 'FastAPI (Python)', desc: 'High concurrency async REST APIs' },
        { name: 'Node.js / Express', desc: 'Scalable microservice API gateways' },
        { name: 'PostgreSQL Relational DB', desc: 'Multi-tenant transactional data store' },
      ]
    },
    {
      name: 'Cloud Infrastructure',
      icon: Cloud,
      techs: [
        { name: 'AWS EKS & EC2', desc: 'Multi-region container orchestration' },
        { name: 'Docker Containers', desc: 'Isolated lightweight application packaging' },
        { name: 'Serverless Functions', desc: 'Event-driven on-demand compute' },
      ]
    },
    {
      name: 'Data Engineering',
      icon: Database,
      techs: [
        { name: 'Snowflake Warehouse', desc: 'Enterprise data lake ingestion' },
        { name: 'Apache Kafka', desc: 'Real-time telemetry event streaming' },
        { name: 'Recharts BI', desc: 'Interactive telemetry dashboards' },
      ]
    },
    {
      name: 'DevOps & Automation',
      icon: Terminal,
      techs: [
        { name: 'Terraform IaC', desc: 'Declarative infrastructure provisioning' },
        { name: 'GitHub Actions CI/CD', desc: 'Automated testing and zero-downtime deployment' },
        { name: 'Kubernetes Ingress', desc: 'Load balancing and dynamic pod scaling' },
      ]
    },
    {
      name: 'Security & Compliance',
      icon: ShieldCheck,
      techs: [
        { name: 'Zero-Trust IAM', desc: 'Granular identity and access policy enforcement' },
        { name: 'AES-256 Encryption', desc: 'End-to-end data encryption at rest and in transit' },
        { name: 'SOC-2 / HIPAA Auditing', desc: 'Automated security compliance tracking' },
      ]
    },
  ];

  return (
    <div className="py-12 lg:py-20 space-y-16">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Technology Stack & Ecosystem
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
          Engineered using industry-standard open technologies and robust frameworks built for stability, security, and high-concurrency enterprise demands.
        </p>
      </div>

      {/* Tech Groups Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((group) => {
            const Icon = group.icon;
            return (
              <Card key={group.name} className="bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                  <div className="p-2 rounded bg-blue-50 text-blue-600 border border-blue-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{group.name}</h3>
                </div>

                <div className="space-y-3">
                  {group.techs.map((tech) => (
                    <div key={tech.name} className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                      <span className="font-mono font-bold text-xs text-blue-700 block">{tech.name}</span>
                      <p className="text-[11px] text-slate-600 leading-normal font-medium">{tech.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link href="/contact">
          <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Discuss Architecture Requirements
          </Button>
        </Link>
      </div>

    </div>
  );
}

