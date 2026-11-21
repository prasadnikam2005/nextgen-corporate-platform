'use client';

import React, { useState, useEffect } from 'react';
import { Enquiry, EnquiryStatus } from '@/lib/mock-data';
import { useEnquiries } from '@/context/EnquiriesContext';
import { Button } from '@/components/ui/Button';
import {
  Mail,
  Sparkles,
  Send,
  CheckCircle2,
  X,
  AlertCircle,
  Zap,
  Edit3,
  Bot
} from 'lucide-react';

interface StageEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiry: Enquiry;
  targetStatus: EnquiryStatus;
  onComplete: () => void;
}

export const StageEmailModal: React.FC<StageEmailModalProps> = ({
  isOpen,
  onClose,
  enquiry,
  targetStatus,
  onComplete,
}) => {
  const { generateEmailDraft, updateStatusWithEmail } = useEnquiries();

  const [sendEmailChecked, setSendEmailChecked] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [autoSendZeroTouch, setAutoSendZeroTouch] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Groq draft automatically when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsGenerating(true);
    setErrorMsg('');

    generateEmailDraft(enquiry.id, targetStatus)
      .then((draft) => {
        if (isMounted) {
          setSubject(draft.subject);
          setBody(draft.body);
          setIsGenerating(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMsg('Failed to load Groq draft. Default template loaded.');
          setIsGenerating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, enquiry.id, targetStatus]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await updateStatusWithEmail(
        enquiry.id,
        targetStatus,
        sendEmailChecked,
        subject,
        body
      );
      onComplete();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipEmail = async () => {
    setIsSubmitting(true);
    try {
      await updateStatusWithEmail(
        enquiry.id,
        targetStatus,
        false
      );
      onComplete();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Update Stage & Client Communication
                </h3>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {targetStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Moving <strong className="text-slate-800">{enquiry.fullName}</strong> ({enquiry.company || 'Client'}) from <span className="font-semibold">{enquiry.status}</span> &rarr; <span className="font-semibold text-blue-600">{targetStatus}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">

          {errorMsg && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Automated Mail Checkbox */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="flex items-start sm:items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sendEmailChecked}
                onChange={(e) => setSendEmailChecked(e.target.checked)}
                className="mt-0.5 sm:mt-0 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Send automated stage notification email to client
                </span>
                <span className="text-[11px] text-slate-500">
                  Dispatches tailored email to <strong className="text-slate-700">{enquiry.email}</strong> via n8n automation.
                </span>
              </div>
            </label>

            {sendEmailChecked && (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0 self-start sm:self-auto">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Powered</span>
              </div>
            )}
          </div>

          {/* Email Draft Area */}
          {sendEmailChecked && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                  Review & Customize Email Draft
                </span>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoSendZeroTouch}
                      onChange={(e) => setAutoSendZeroTouch(e.target.checked)}
                      className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300"
                    />
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Zero-Touch Auto-Send</span>
                    </span>
                  </label>
                </div>
              </div>

              {isGenerating ? (
                <div className="p-8 rounded-xl border border-blue-100 bg-blue-50/50 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                  <p className="text-xs font-semibold text-blue-900">
                    Generating stage-specific draft with Groq LLM...
                  </p>
                  <p className="text-[11px] text-blue-600 max-w-sm">
                    Analyzing client requirements, company context, and stage objectives to write a high-precision response.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 animate-fade-in">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                      placeholder="Email subject line..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center justify-between">
                      <span>Message Content</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Editable — Formatted for B2B presentation
                      </span>
                    </label>
                    <textarea
                      rows={7}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full text-xs font-sans leading-relaxed p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-y"
                      placeholder="Email body text..."
                    />
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Recipient: <strong className="text-slate-800">{enquiry.fullName}</strong> &lt;{enquiry.email}&gt;</span>
                    <span className="font-mono text-[10px]">Ref: {enquiry.id}</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {sendEmailChecked && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleSkipEmail}
                disabled={isSubmitting || isGenerating}
                className="text-xs"
              >
                Update Status Without Email
              </Button>
            )}

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleConfirm}
              isLoading={isSubmitting}
              disabled={isGenerating || (sendEmailChecked && (!subject || !body))}
              rightIcon={<Send className="w-3.5 h-3.5" />}
              className="w-full sm:w-auto font-bold"
            >
              {sendEmailChecked ? 'Confirm & Send Email' : 'Update Status'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
