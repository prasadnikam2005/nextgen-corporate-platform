'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select, Textarea } from '@/components/ui/Input';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { AIAnalysisCard } from '@/components/enquiries/AIAnalysisCard';
import { StatusWorkflowStepper } from '@/components/enquiries/StatusWorkflowStepper';
import { StageEmailModal } from '@/components/enquiries/StageEmailModal';
import { EnquiryEmailCornerWidget } from '@/components/enquiries/EnquiryEmailCornerWidget';
import { useEnquiries } from '@/context/EnquiriesContext';
import { EnquiryStatus } from '@/lib/mock-data';
import {
  ArrowLeft,
  Building,
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Users,
  Send,
  History,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function EnquiryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getEnquiryById, updateStatus, assignTeam, addNote, reanalyzeEnquiry } = useEnquiries();

  const id = (params?.id as string) || 'ENQ-2026-00427';
  const enquiry = getEnquiryById(id);

  const [newNoteText, setNewNoteText] = useState('');
  const [teamSelection, setTeamSelection] = useState(enquiry?.assignedTeam || 'AI Solutions Team');
  const [employeeSelection, setEmployeeSelection] = useState(enquiry?.assignedEmployee || 'Vikram Sengupta');
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [pendingTargetStatus, setPendingTargetStatus] = useState<EnquiryStatus | null>(null);

  const handleStageClick = (newStatus: EnquiryStatus) => {
    setPendingTargetStatus(newStatus);
    setIsEmailModalOpen(true);
  };

  const handleReanalyze = async () => {
    if (!enquiry) return;
    setIsReanalyzing(true);
    await reanalyzeEnquiry(enquiry.id);
    setTimeout(() => setIsReanalyzing(false), 600);
  };

  if (!enquiry) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex">
        <AdminSidebar />
        <div className="flex-1 md:pl-64 flex flex-col">
          <AdminHeader />
          <div className="p-12 text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Enquiry Not Found</h2>
            <p className="text-xs text-slate-500 font-medium">The requested enquiry ID does not exist in mock records.</p>
            <Link href="/admin/enquiries">
              <Button variant="primary" size="sm">Back to Enquiries List</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus: EnquiryStatus) => {
    handleStageClick(newStatus);
  };

  const handleTeamSave = () => {
    assignTeam(enquiry.id, teamSelection, employeeSelection);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addNote(enquiry.id, newNoteText, 'Admin User');
    setNewNoteText('');
  };

  const teamsList = [
    { value: 'AI Solutions Team', label: 'AI Solutions Team' },
    { value: 'Cloud Engineering Team', label: 'Cloud Engineering Team' },
    { value: 'Data & Analytics Team', label: 'Data & Analytics Team' },
    { value: 'Enterprise Software Team', label: 'Enterprise Software Team' },
    { value: 'Security & Compliance Team', label: 'Security & Compliance Team' },
  ];

  const employeesList = [
    { value: 'Vikram Sengupta (Lead AI Engineer)', label: 'Vikram Sengupta (Lead AI Engineer)' },
    { value: 'Siddharth Rao (Senior Cloud Architect)', label: 'Siddharth Rao (Senior Cloud Architect)' },
    { value: 'Neha Kulkarni (Data Director)', label: 'Neha Kulkarni (Data Director)' },
    { value: 'Arjun Verma (VP Software)', label: 'Arjun Verma (VP Software)' },
    { value: 'Amitabh Sen (Security Lead)', label: 'Amitabh Sen (Security Lead)' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 flex">
      
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        
        {/* Top Header */}
        <AdminHeader />

        {/* Details Body */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between">
            <Link href="/admin/enquiries" className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-semibold hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Enquiries List</span>
            </Link>

            <span className="text-xs text-slate-500 font-mono font-medium">
              Received: {new Date(enquiry.createdAt).toLocaleString()}
            </span>
          </div>

          {/* Header Row: ID, Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200/80 rounded-xl shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-mono font-extrabold text-blue-600 tracking-wider">
                  {enquiry.id}
                </h1>
                <StatusBadge status={enquiry.status} />
                <PriorityBadge priority={enquiry.priority} />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Service requested: <strong className="text-slate-900">{enquiry.service}</strong>
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant={enquiry.status === 'CONVERTED' ? 'secondary' : 'accent'}
                size="sm"
                onClick={() => handleStageClick('CONVERTED')}
                disabled={enquiry.status === 'CONVERTED'}
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                {enquiry.status === 'CONVERTED' ? 'Marked Converted' : 'Mark as Converted'}
              </Button>
            </div>
          </div>

          {/* 1. WORKFLOW LIFECYCLE STEPPER */}
          <StatusWorkflowStepper
            currentStatus={enquiry.status}
            onStatusChange={handleStageClick}
          />

          {/* 2. MAIN GRID: AI Analysis & Customer Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: AI Analysis Card & Original Enquiry */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* AI Analysis Component */}
              <AIAnalysisCard
                aiAnalysis={enquiry.aiAnalysis}
                onReanalyze={handleReanalyze}
                isReanalyzing={isReanalyzing}
              />

              {/* Original Enquiry Box */}
              <Card className="bg-white border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Original Customer Message Text
                  </h3>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans italic font-medium">
                  "{enquiry.message}"
                </div>
              </Card>

              {/* Internal Notes Section */}
              <Card className="bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Internal Collaboration Notes ({enquiry.notes.length})
                  </h3>
                </div>

                <form onSubmit={handleAddNote} className="space-y-3">
                  <Textarea
                    placeholder="Add an internal note or update about this lead..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="min-h-[80px] text-xs bg-white text-slate-900 border-slate-300 focus:ring-blue-600"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
                      Post Note
                    </Button>
                  </div>
                </form>

                {/* Notes List */}
                <div className="space-y-3 pt-2">
                  {enquiry.notes.map((note) => (
                    <div key={note.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-500 font-medium">
                        <span className="font-bold text-blue-700">{note.author}</span>
                        <span className="text-[10px] font-mono">{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-800 font-medium">{note.text}</p>
                    </div>
                  ))}
                </div>
              </Card>

            </div>

            {/* Right Column: Customer Info, Team Assignee, Activity History */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Customer Info Card */}
              <Card className="bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <User className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Customer Details
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Name</span>
                    <span className="text-sm font-bold text-slate-900">{enquiry.fullName}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Email</span>
                    <a href={`mailto:${enquiry.email}`} className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> {enquiry.email}
                    </a>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Company</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-500" /> {enquiry.company}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Phone</span>
                    <span className="text-slate-700 font-medium flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-500" /> {enquiry.phone}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Client Correspondence Corner Widget */}
              <EnquiryEmailCornerWidget enquiry={enquiry} />

              {/* Assigned Team & Employee */}
              <Card className="bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <Users className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Routing & Ownership
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <Select
                    label="Assigned Team"
                    options={teamsList}
                    value={teamSelection}
                    onChange={(e) => setTeamSelection(e.target.value)}
                  />

                  <Select
                    label="Assigned Lead Engineer"
                    options={employeesList}
                    value={employeeSelection}
                    onChange={(e) => setEmployeeSelection(e.target.value)}
                  />

                  <Button variant="outline" size="sm" className="w-full" onClick={handleTeamSave}>
                    Save Routing Assignment
                  </Button>
                </div>
              </Card>

              {/* Activity Timeline */}
              <Card className="bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <History className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Activity Timeline
                  </h3>
                </div>

                <div className="space-y-3 text-xs relative pl-3 border-l border-slate-200">
                  {enquiry.activities.map((act) => (
                    <div key={act.id} className="relative group">
                      <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-blue-600" />
                      <span className="font-bold text-slate-900 block">{act.action}</span>
                      <p className="text-[11px] text-slate-600 font-medium">{act.details}</p>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {act.author} • {new Date(act.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

            </div>

          </div>

        </div>

      </div>

      {/* Automated Stage Email & Draft Review Modal */}
      {pendingTargetStatus && (
        <StageEmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          enquiry={enquiry}
          targetStatus={pendingTargetStatus}
          onComplete={() => {
            setIsEmailModalOpen(false);
          }}
        />
      )}

    </div>
  );
}

