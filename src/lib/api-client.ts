import { getAuthToken } from './supabase';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject authentication token if available or required
  const token = await getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData: any = null;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      const message = errorData?.detail || `HTTP error ${response.status}`;
      throw new ApiError(response.status, message, errorData);
    }

    if (response.status === 204) {
      return null as T;
    }

    return await response.json();
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(0, err.message || 'Network error occurred connecting to FastAPI');
  }
}

export const apiClient = {
  // Health
  async checkHealth() {
    return request<{ status: string; database?: string }>('/health');
  },

  // Auth
  async getMe() {
    return request<{
      id: string;
      email: string;
      full_name: string;
      role: string;
      is_active: boolean;
    }>('/api/v1/auth/me', { requiresAuth: true });
  },

  // Public Enquiry Submission
  async submitEnquiry(data: {
    full_name: string;
    email: string;
    phone?: string;
    company_name?: string;
    subject?: string;
    message: string;
    service_interest?: string;
    honeypot?: string;
  }) {
    return request<any>('/api/v1/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Admin Enquiry Operations
  async getEnquiries(params?: {
    status?: string;
    priority?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'ALL') query.set('status', params.status);
    if (params?.priority && params.priority !== 'ALL') query.set('priority', params.priority);
    if (params?.category && params.category !== 'ALL') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{
      items: any[];
      total: number;
      page: number;
      limit: number;
      total_pages: number;
    }>(`/api/v1/enquiries${qs}`, { requiresAuth: true });
  },

  async getEnquiryById(id: string) {
    return request<any>(`/api/v1/enquiries/${id}`, { requiresAuth: true });
  },

  async updateStatus(id: string, status: string) {
    return request<any>(`/api/v1/enquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      requiresAuth: true,
    });
  },

  async updateAssignment(id: string, assignedTo?: string, assignedTeam?: string) {
    return request<any>(`/api/v1/enquiries/${id}/assignment`, {
      method: 'PATCH',
      body: JSON.stringify({ assigned_to: assignedTo, assigned_team: assignedTeam }),
      requiresAuth: true,
    });
  },

  async addNote(id: string, content: string) {
    return request<any>(`/api/v1/enquiries/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content }),
      requiresAuth: true,
    });
  },

  async reanalyze(id: string) {
    return request<any>(`/api/v1/enquiries/${id}/analyze`, {
      method: 'POST',
      requiresAuth: true,
    });
  },

  async generateEmailDraft(
    id: string,
    targetStatus: string,
    context?: {
      contextNote?: string;
      recipientName?: string;
      recipientEmail?: string;
      companyName?: string;
      serviceInterest?: string;
      message?: string;
    }
  ) {
    return request<{ target_status: string; subject: string; body: string }>(
      `/api/v1/enquiries/${id}/generate-email-draft`,
      {
        method: 'POST',
        body: JSON.stringify({
          target_status: targetStatus,
          context_note: context?.contextNote,
          recipient_name: context?.recipientName,
          recipient_email: context?.recipientEmail,
          company_name: context?.companyName,
          service_interest: context?.serviceInterest,
          message: context?.message,
        }),
        requiresAuth: true,
      }
    );
  },

  async updateStatusWithEmail(
    id: string,
    data: {
      newStatus: string;
      sendEmail: boolean;
      subject?: string;
      body?: string;
      recipientName?: string;
      recipientEmail?: string;
      companyName?: string;
      serviceInterest?: string;
      message?: string;
    }
  ) {
    return request<any>(`/api/v1/enquiries/${id}/status-with-email`, {
      method: 'POST',
      body: JSON.stringify({
        new_status: data.newStatus,
        send_email: data.sendEmail,
        subject: data.subject,
        body: data.body,
        recipient_name: data.recipientName,
        recipient_email: data.recipientEmail,
        company_name: data.companyName,
        service_interest: data.serviceInterest,
        message: data.message,
      }),
      requiresAuth: true,
    });
  },

  async getEnquiryEmails(id: string) {
    return request<
      Array<{
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
      }>
    >(`/api/v1/enquiries/${id}/emails`, { requiresAuth: true });
  },

  async getEvents(id: string) {
    return request<any[]>(`/api/v1/enquiries/${id}/events`, { requiresAuth: true });
  },

  // Analytics
  async getAnalyticsOverview() {
    return request<{
      total_enquiries: number;
      pending_review: number;
      high_priority_count: number;
      converted_count: number;
      conversion_rate: number;
      avg_response_hours: number;
    }>('/api/v1/analytics/overview', { requiresAuth: true });
  },

  async getEnquiriesOverTime(days = 14) {
    return request<{ date: string; count: number }[]>(
      `/api/v1/analytics/enquiries-over-time?days=${days}`,
      { requiresAuth: true }
    );
  },

  async getByCategory() {
    return request<{ category: string; count: number; percentage: number }[]>(
      '/api/v1/analytics/by-category',
      { requiresAuth: true }
    );
  },

  async getByStatus() {
    return request<{ status: string; count: number }[]>(
      '/api/v1/analytics/by-status',
      { requiresAuth: true }
    );
  },

  async getByPriority() {
    return request<{ priority: string; count: number }[]>(
      '/api/v1/analytics/by-priority',
      { requiresAuth: true }
    );
  },
};
