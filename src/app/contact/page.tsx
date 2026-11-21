'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useEnquiries } from '@/context/EnquiriesContext';
import { Enquiry } from '@/lib/mock-data';
import {
  Send,
  CheckCircle2,
  ShieldCheck,
  User,
  Mail,
  Building,
  Phone,
  Wand2,
  MessageSquare,
  Clock,
  ArrowRight
} from 'lucide-react';

function ContactFormContent() {
  const searchParams = useSearchParams();
  const prefilledService = searchParams ? searchParams.get('service') : null;

  const { addEnquiry } = useEnquiries();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    service: prefilledService || 'AI & Intelligent Automation',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    if (prefilledService) {
      setFormData(prev => ({ ...prev, service: prefilledService }));
    }
  }, [prefilledService]);

  const serviceOptions = [
    { value: 'AI & Intelligent Automation', label: 'AI & Intelligent Automation' },
    { value: 'Cloud & Digital Engineering', label: 'Cloud & Digital Engineering' },
    { value: 'Data & Analytics', label: 'Data & Analytics' },
    { value: 'Enterprise Software', label: 'Enterprise Software' },
    { value: 'Cybersecurity', label: 'Cybersecurity' },
    { value: 'Digital Transformation', label: 'Digital Transformation' },
  ];

  const handleAutoFillDemo = () => {
    setFormData({
      fullName: 'Siddharth Malhotra',
      email: 'siddharth@cloudmatrix.io',
      company: 'CloudMatrix Technologies',
      phone: '+91 98990 12345',
      service: 'AI & Intelligent Automation',
      message: 'We are seeking an AI-based automated enquiry management system to categorize incoming B2B customer requests, extract technical requirements via NLP, and automatically assign priority and teams across 4 engineering departments.'
    });
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid business email is required.';
    if (!formData.company.trim()) errs.company = 'Company name is required.';
    if (!formData.message.trim() || formData.message.length < 15) errs.message = 'Please share at least 15 characters about your requirements.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const created = await addEnquiry(formData);
      setSubmittedEnquiry(created);
    } catch (err) {
      console.error('Error submitting enquiry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedEnquiry) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <Card className="border border-slate-200/80 bg-white shadow-xs p-8 sm:p-10 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Thank you. Your enquiry has been received.
            </h1>
            <p className="text-slate-600 text-sm font-medium">
              We'll review your requirements and get back to you shortly.
            </p>
          </div>

          {/* Customer Reference Badge */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 inline-block min-w-[280px]">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 block">
              Enquiry Reference Number
            </span>
            <span className="text-2xl font-mono font-extrabold text-blue-700 block tracking-wider">
              {submittedEnquiry.id}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-700 text-left space-y-2 max-w-lg mx-auto font-medium">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>What Happens Next?</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              A copy of your enquiry reference has been logged. Our technical solutions engineering team will evaluate your project details and contact you via email within 24 business hours.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setSubmittedEnquiry(null);
                setFormData({
                  fullName: '',
                  email: '',
                  company: '',
                  phone: '',
                  service: 'AI & Intelligent Automation',
                  message: ''
                });
              }}
            >
              Submit Another Enquiry
            </Button>

            <Link href="/">
              <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Return to Homepage
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <Card className="lg:col-span-7 bg-white border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Project Requirement Details
          </span>

          <button
            type="button"
            onClick={handleAutoFillDemo}
            className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-900 font-bold bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md transition-colors"
            title="Auto-fill with sample enterprise enquiry"
          >
            <Wand2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Auto-fill Demo Data</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              placeholder="e.g. Rahul Sharma"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors.fullName}
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Business Email *"
              type="email"
              placeholder="rahul@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name *"
              placeholder="e.g. TechNova Inc."
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              error={errors.company}
              leftIcon={<Building className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Phone Number"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <Select
            label="Interested Service *"
            options={serviceOptions}
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
          />

          <Textarea
            label="Project Requirements / Message *"
            placeholder="Describe your technical requirements, goals, current challenges, or target timeline..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            error={errors.message}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Submit Enquiry
            </Button>
          </div>
        </form>
      </Card>

      <div className="lg:col-span-5 space-y-6">
        <Card className="bg-white border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              Consultation Process
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0 mt-0.5">
                1
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Submit your requirement</h4>
                <p className="text-xs text-slate-600 font-medium">Provide details about your technical project scope and company goals.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0 mt-0.5">
                2
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Engineering Review</h4>
                <p className="text-xs text-slate-600 font-medium">Our specialized domain architects review your architecture requirements.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0 mt-0.5">
                3
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Discovery Consultation</h4>
                <p className="text-xs text-slate-600 font-medium">A technical discovery call is scheduled within 24 business hours.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0 mt-0.5">
                4
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Proposal & Roadmap</h4>
                <p className="text-xs text-slate-600 font-medium">Receive a structured technical solution proposal and implementation timeline.</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-50 border border-slate-200 p-4 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">Enterprise Security Standard</span>
            <span className="text-slate-600 font-medium">Your information is protected by 256-bit encryption and strict SOC-2 privacy controls.</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Tell Us What You're Building
        </h1>

        <p className="text-slate-600 text-base leading-relaxed font-medium">
          Share your requirements with our team and we'll connect you with the right expertise.
        </p>
      </div>

      <Suspense fallback={
        <Card className="p-12 text-center text-slate-500 bg-white">
          Loading Enquiry Portal...
        </Card>
      }>
        <ContactFormContent />
      </Suspense>
    </div>
  );
}

