'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, Mail, Phone, MapPin, ShieldCheck, Globe, Share2, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Hide footer on internal admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-wider text-white">NEXORA</span>
            </Link>

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Next-generation digital solutions powered by enterprise AI, cloud engineering, and modern software architecture. Partnering with global enterprises to automate digital operations.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <span className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer">
                <Globe className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer">
                <Share2 className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer">
                <Code2 className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-100">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/case-studies" className="hover:text-blue-400 transition-colors">Case Studies</Link></li>
              <li><Link href="/technologies" className="hover:text-blue-400 transition-colors">Technologies</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Capabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-100">Capabilities</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-blue-400 transition-colors">AI & Automation</Link></li>
              <li><Link href="/services" className="hover:text-blue-400 transition-colors">Cloud Engineering</Link></li>
              <li><Link href="/services" className="hover:text-blue-400 transition-colors">Data & Analytics</Link></li>
              <li><Link href="/services" className="hover:text-blue-400 transition-colors">Enterprise Software</Link></li>
              <li><Link href="/services" className="hover:text-blue-400 transition-colors">Cybersecurity</Link></li>
            </ul>
          </div>

          {/* Contact / Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-100">Headquarters</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Tech Park Tower, Business District, SF 94105</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>contact@nexora-tech.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+1 (800) 555-NEXORA</span>
              </li>
            </ul>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>SOC-2 Type II Certified & ISO 27001</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 NEXORA Technologies Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-200 cursor-pointer">Security Framework</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
