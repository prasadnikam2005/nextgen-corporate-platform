'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { useEnquiries } from '@/context/EnquiriesContext';
import { Enquiry } from '@/lib/mock-data';
import {
  Mail,
  ExternalLink,
  Clock,
  CheckCircle2,
  RefreshCw,
  Send,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Inbox
} from 'lucide-react';

interface EnquiryEmailRecord {
  id: string;
  enquiry_id: string;
  stage: string;
  recipient_email: string;
  recipient_name: string;
  subject: string;
  body: string;
  status: string;
  message_id?: string;
  sent_at?: string;
  created_at: string;
}

export const EnquiryEmailCornerWidget: React.FC<{ enquiry: Enquiry }> = ({ enquiry }) => {
  const { getEnquiryEmails } = useEnquiries();
  const [emails, setEmails] = useState<EnquiryEmailRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchEmails = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getEnquiryEmails(enquiry.id);
      setEmails(data || []);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [enquiry.id, getEnquiryEmails]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails, enquiry.status]);

  const webmailSearchUrl = `https://mail.google.com/mail/u/0/#search/to%3A${encodeURIComponent(enquiry.email)}`;

  return (
    <Card className="bg-white border border-slate-200/80 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Client Correspondence
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">Stage emails & thread history</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={fetchEmails}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Refresh communications"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <a
            href={webmailSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-[10px] font-semibold text-slate-600 transition-colors"
            title="Open thread in Gmail / Webmail"
          >
            <span>Open Mail</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Email List */}
      {isLoading && emails.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading correspondence...
        </div>
      ) : emails.length === 0 ? (
        <div className="py-6 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
            <Inbox className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-700">No stage emails sent yet</p>
          <p className="text-[10px] text-slate-500 max-w-[200px] mx-auto">
            Click any stage above to generate and send an automated update to <strong className="text-slate-700">{enquiry.email}</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {emails.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {item.stage}
                  </span>

                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span
                      className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        item.status === 'SENT' || item.status === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'REPLIED'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200 font-extrabold'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="font-semibold text-slate-900 leading-tight">
                  {item.subject}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 font-bold"
                  >
                    <span>{isExpanded ? 'Hide' : 'Read'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-2 p-3 rounded-lg bg-white border border-slate-200 text-slate-700 font-sans text-xs whitespace-pre-wrap leading-relaxed animate-fade-in">
                    {item.body}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Webmail Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span className="text-slate-500 font-medium">Redirect to inbox:</span>
        <a
          href={webmailSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 hover:underline"
        >
          <span>Search client replies</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </Card>
  );
};
