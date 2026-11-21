'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Enquiry, EnquiryStatus, PriorityLevel, INITIAL_ENQUIRIES, AIAnalysis } from '@/lib/mock-data';
import { apiClient } from '@/lib/api-client';

interface EnquiryContextType {
  enquiries: Enquiry[];
  isBackendConnected: boolean;
  addEnquiry: (formData: {
    fullName: string;
    email: string;
    company: string;
    phone: string;
    service: string;
    message: string;
  }) => Promise<Enquiry>;
  updateStatus: (id: string, status: EnquiryStatus) => Promise<void>;
  assignTeam: (id: string, team: string, employee?: string) => Promise<void>;
  addNote: (id: string, text: string, author?: string) => Promise<void>;
  reanalyzeEnquiry: (id: string) => Promise<void>;
  generateEmailDraft: (id: string, targetStatus: EnquiryStatus) => Promise<{ subject: string; body: string }>;
  updateStatusWithEmail: (id: string, newStatus: EnquiryStatus, sendEmail: boolean, subject?: string, body?: string) => Promise<void>;
  getEnquiryEmails: (id: string) => Promise<any[]>;
  getEnquiryById: (id: string) => Enquiry | undefined;
  refreshEnquiries: () => Promise<void>;
  resetToDefault: () => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

function normalizeBackendStatus(status: string): EnquiryStatus {
  const s = status.replace('_', ' ');
  if (s === 'CLOSED') return 'ARCHIVED';
  return s as EnquiryStatus;
}

function toBackendStatus(status: string): string {
  if (status === 'ARCHIVED') return 'CLOSED';
  return status.replace(' ', '_');
}

function mapBackendToFrontend(item: any): Enquiry {
  const analysis = item.ai_analysis;
  return {
    id: item.reference_id || item.id,
    fullName: item.full_name,
    email: item.email,
    company: item.company_name || 'Not provided',
    phone: item.phone || '',
    service: item.service_interest || item.category || 'Enterprise Solution',
    message: item.message,
    createdAt: item.created_at,
    status: normalizeBackendStatus(item.status),
    priority: (item.priority as PriorityLevel) || 'MEDIUM',
    aiCategory: item.category || 'General Enquiry',
    assignedTeam: item.assigned_team || 'Solutions Architecture',
    assignedEmployee: 'Lead Architect',
    aiAnalysis: {
      category: analysis?.category || item.category || 'Enterprise Solution',
      subcategory: analysis?.subcategory || 'Enterprise Engineering',
      intent: analysis?.intent || 'Enterprise Service Requirement',
      priority: (analysis?.priority as PriorityLevel) || item.priority || 'MEDIUM',
      suggestedTeam: analysis?.suggested_team || item.assigned_team || 'Solutions Architecture',
      confidenceScore: analysis?.confidence || 0.95,
      summary: analysis?.summary || item.message.substring(0, 150),
      recommendedAction: analysis?.routing_reason || 'Review project requirements and schedule technical scoping.',
      keyRequirements: Array.isArray(analysis?.extracted_requirements) ? analysis.extracted_requirements : ['Technical scoping & architecture evaluation'],
      estimatedBudgetRange: 'Rs.45,000 - Rs.95,000',
      timelineEstimate: '6 - 10 Weeks'
    },
    notes: (item.notes || []).map((n: any) => ({
      id: n.id,
      author: n.author_name || 'Admin',
      text: n.content,
      createdAt: n.created_at
    })),
    activities: (item.events || []).map((e: any) => ({
      id: e.id,
      timestamp: e.created_at,
      author: e.actor_user_id ? 'Admin User' : 'System',
      action: e.event_type.replace(/_/g, ' '),
      details: e.description || '',
      type: e.event_type.includes('AI') ? 'ai' : 'user'
    }))
  };
}

export const EnquiryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexora_enquiries');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return INITIAL_ENQUIRIES;
        }
      }
    }
    return INITIAL_ENQUIRIES;
  });

  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexora_enquiries', JSON.stringify(enquiries));
    }
  }, [enquiries]);

  // Initial load from live FastAPI backend
  const refreshEnquiries = useCallback(async () => {
    try {
      const health = await apiClient.checkHealth();
      if (health.status === 'healthy') {
        setIsBackendConnected(true);
        const data = await apiClient.getEnquiries({ limit: 100 });
        if (data && data.items && data.items.length > 0) {
          const mapped = data.items.map(mapBackendToFrontend);
          // Combine server items with any existing local items without duplicate reference ids
          setEnquiries(prev => {
            const serverIds = new Set(mapped.map(m => m.id));
            const remainingLocal = prev.filter(p => !serverIds.has(p.id));
            return [...mapped, ...remainingLocal];
          });
        }
      }
    } catch {
      // Backend not running yet or offline; fallback cleanly to local state
      setIsBackendConnected(false);
    }
  }, []);

  useEffect(() => {
    refreshEnquiries();
  }, [refreshEnquiries]);

  const addEnquiry = async (formData: {
    fullName: string;
    email: string;
    company: string;
    phone: string;
    service: string;
    message: string;
  }): Promise<Enquiry> => {
    const nextNum = 428 + (enquiries.length - INITIAL_ENQUIRIES.length);
    const localId = `ENQ-2026-${String(nextNum).padStart(5, '0')}`;
    const now = new Date().toISOString();

    // Optimistic / Local Item
    let createdItem: Enquiry = {
      id: localId,
      fullName: formData.fullName,
      email: formData.email,
      company: formData.company,
      phone: formData.phone || '+91 98765 00000',
      service: formData.service,
      message: formData.message,
      createdAt: now,
      status: 'NEW',
      priority: 'MEDIUM',
      aiCategory: formData.service,
      assignedTeam: 'Solutions Architecture',
      assignedEmployee: 'Unassigned',
      aiAnalysis: {
        category: formData.service,
        subcategory: 'Enterprise Digital Solution',
        intent: 'Enterprise Service Requirement',
        priority: 'MEDIUM',
        suggestedTeam: 'Solutions Architecture',
        confidenceScore: 0.95,
        summary: `Client requested ${formData.service} implementation: "${formData.message.substring(0, 100)}..."`,
        recommendedAction: 'Schedule technical discovery call and evaluate enterprise specifications.',
        keyRequirements: [`${formData.service} scoping`, 'Security & SLA alignment'],
        estimatedBudgetRange: '$45,000 - $85,000',
        timelineEstimate: '6 - 10 Weeks'
      },
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'Nexora AI Engine',
          text: `Enquiry submitted via public portal. Automated triage initiated.`,
          createdAt: now
        }
      ],
      activities: [
        {
          id: `act-1-${Date.now()}`,
          timestamp: now,
          author: formData.fullName,
          action: 'Enquiry Submitted',
          details: 'Form submitted on public contact page.',
          type: 'user'
        }
      ]
    };

    // Attempt live API submission
    try {
      const serverResult = await apiClient.submitEnquiry({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.company,
        subject: `${formData.service} Engagement Inquiry`,
        message: formData.message,
        service_interest: formData.service,
      });

      if (serverResult && serverResult.reference_id) {
        createdItem = mapBackendToFrontend(serverResult);
        setIsBackendConnected(true);
      }
    } catch (err) {
      console.warn('FastAPI unavailable, using client-side persistence:', err);
    }

    setEnquiries(prev => [createdItem, ...prev]);
    return createdItem;
  };

  const updateStatus = async (id: string, status: EnquiryStatus) => {
    // Optimistic UI update
    setEnquiries(prev =>
      prev.map(item => {
        if (item.id === id) {
          const now = new Date().toISOString();
          const activity = {
            id: `act-${Date.now()}`,
            timestamp: now,
            author: 'Admin User',
            action: `Status Updated to ${status}`,
            details: `Enquiry status changed from ${item.status} to ${status}.`,
            type: 'user' as const
          };
          return {
            ...item,
            status,
            activities: [activity, ...item.activities]
          };
        }
        return item;
      })
    );

    // Sync with FastAPI
    try {
      await apiClient.updateStatus(id, toBackendStatus(status));
    } catch (err) {
      console.warn('Could not sync status update to FastAPI:', err);
    }
  };

  const assignTeam = async (id: string, team: string, employee?: string) => {
    setEnquiries(prev =>
      prev.map(item => {
        if (item.id === id) {
          const now = new Date().toISOString();
          const activity = {
            id: `act-${Date.now()}`,
            timestamp: now,
            author: 'Admin User',
            action: 'Reassigned Team / Lead',
            details: `Assigned team: ${team}. Lead: ${employee || 'Unassigned'}.`,
            type: 'user' as const
          };
          return {
            ...item,
            assignedTeam: team,
            assignedEmployee: employee || item.assignedEmployee,
            activities: [activity, ...item.activities]
          };
        }
        return item;
      })
    );

    try {
      await apiClient.updateAssignment(id, undefined, team);
    } catch (err) {
      console.warn('Could not sync assignment to FastAPI:', err);
    }
  };

  const addNote = async (id: string, text: string, author: string = 'Admin User') => {
    if (!text.trim()) return;
    setEnquiries(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newNote = {
            id: `note-${Date.now()}`,
            author,
            text,
            createdAt: new Date().toISOString()
          };
          return {
            ...item,
            notes: [newNote, ...item.notes]
          };
        }
        return item;
      })
    );

    try {
      await apiClient.addNote(id, text);
    } catch (err) {
      console.warn('Could not sync note to FastAPI:', err);
    }
  };

  const reanalyzeEnquiry = async (id: string) => {
    try {
      const serverResult = await apiClient.reanalyze(id);
      if (serverResult) {
        const updated = mapBackendToFrontend(serverResult);
        setEnquiries(prev => prev.map(item => item.id === id ? updated : item));
      }
    } catch (err) {
      console.warn('Reanalysis failed on FastAPI:', err);
    }
  };

  const generateEmailDraft = async (id: string, targetStatus: EnquiryStatus): Promise<{ subject: string; body: string }> => {
    const enq = getEnquiryById(id);
    try {
      const backendStatus = toBackendStatus(targetStatus);
      return await apiClient.generateEmailDraft(id, backendStatus, {
        recipientName: enq?.fullName,
        recipientEmail: enq?.email,
        companyName: enq?.company,
        serviceInterest: enq?.service,
        message: enq?.message
      });
    } catch (err) {
      console.warn('Failed to generate draft on backend, using fallback:', err);
      const name = enq?.fullName || 'Client';
      const company = enq?.company || 'your team';
      return {
        subject: `Nexora Technologies Update: ${targetStatus} (Ref: ${enq?.id || id})`,
        body: `Dear ${name},\n\nWe wanted to inform you that your project enquiry for ${company} has progressed to the '${targetStatus}' stage.\n\nOur solutions architecture team is actively coordinating next steps.\n\nBest regards,\nNexora Technologies Team`
      };
    }
  };

  const updateStatusWithEmail = async (
    id: string,
    newStatus: EnquiryStatus,
    sendEmail: boolean,
    subject?: string,
    body?: string
  ) => {
    const backendStatus = toBackendStatus(newStatus);
    const now = new Date().toISOString();

    // Optimistic UI update
    setEnquiries(prev =>
      prev.map(item => {
        if (item.id === id) {
          const activities = [...item.activities];
          activities.unshift({
            id: `act-${Date.now()}`,
            timestamp: now,
            author: 'Admin User',
            action: `Status Updated to ${newStatus}`,
            details: `Enquiry status changed from ${item.status} to ${newStatus}.`,
            type: 'user' as const
          });
          if (sendEmail && subject) {
            activities.unshift({
              id: `act-email-${Date.now()}`,
              timestamp: now,
              author: 'Nexora AI Communications',
              action: `Automated Stage Email Dispatched (${newStatus})`,
              details: `Sent to ${item.email} — Subject: ${subject}`,
              type: 'ai' as const
            });
          }
          return {
            ...item,
            status: newStatus,
            activities
          };
        }
        return item;
      })
    );

    // Sync with FastAPI
    try {
      const enq = getEnquiryById(id);
      await apiClient.updateStatusWithEmail(id, {
        newStatus: backendStatus,
        sendEmail,
        subject,
        body,
        recipientName: enq?.fullName,
        recipientEmail: enq?.email,
        companyName: enq?.company,
        serviceInterest: enq?.service,
        message: enq?.message
      });
    } catch (err) {
      console.warn('Could not sync status with email to FastAPI:', err);
    }
  };

  const getEnquiryEmails = async (id: string) => {
    try {
      return await apiClient.getEnquiryEmails(id);
    } catch (err) {
      console.warn('Failed to fetch enquiry emails:', err);
      return [];
    }
  };

  const getEnquiryById = (id: string) => {
    return enquiries.find(e => e.id.toLowerCase() === id.toLowerCase());
  };

  const resetToDefault = () => {
    setEnquiries(INITIAL_ENQUIRIES);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nexora_enquiries');
    }
  };

  return (
    <EnquiryContext.Provider
      value={{
        enquiries,
        isBackendConnected,
        addEnquiry,
        updateStatus,
        assignTeam,
        addNote,
        reanalyzeEnquiry,
        generateEmailDraft,
        updateStatusWithEmail,
        getEnquiryEmails,
        getEnquiryById,
        refreshEnquiries,
        resetToDefault
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
};

export const useEnquiries = () => {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error('useEnquiries must be used within an EnquiryProvider');
  }
  return context;
};
