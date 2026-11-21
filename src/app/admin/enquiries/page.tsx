'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Card } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { useEnquiries } from '@/context/EnquiriesContext';
import { EnquiryStatus, PriorityLevel } from '@/lib/mock-data';
import {
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  X,
  Inbox
} from 'lucide-react';

function EnquiriesTableContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams ? searchParams.get('search') : null;

  const { enquiries, resetToDefault } = useEnquiries();

  const [searchTerm, setSearchTerm] = useState(urlSearch || '');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'priority'>('newest');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [exportToast, setExportToast] = useState(false);

  useEffect(() => {
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [urlSearch]);

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || serviceFilter !== 'ALL';

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setServiceFilter('ALL');
    setSortOrder('newest');
    setCurrentPage(1);
  };

  // Filtering & Sorting logic
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        item.id.toLowerCase().includes(search) ||
        item.fullName.toLowerCase().includes(search) ||
        item.company.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.service.toLowerCase().includes(search);

      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;
      const matchesService = serviceFilter === 'ALL' || item.service === serviceFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesService;
    }).sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        const priorityScore: Record<PriorityLevel, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0);
      }
    });
  }, [enquiries, searchTerm, statusFilter, priorityFilter, serviceFilter, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage) || 1;
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEnquiries.slice(start, start + itemsPerPage);
  }, [filteredEnquiries, currentPage]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Customer', 'Email', 'Company', 'Phone', 'Service', 'Priority', 'AI Category', 'Status', 'Assigned Team', 'Date'];
    const rows = filteredEnquiries.map(e => [
      e.id,
      `"${e.fullName}"`,
      e.email,
      `"${e.company}"`,
      e.phone,
      `"${e.service}"`,
      e.priority,
      `"${e.aiCategory}"`,
      e.status,
      `"${e.assignedTeam}"`,
      new Date(e.createdAt).toLocaleDateString()
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexora_enquiries_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportToast(true);
    setTimeout(() => setExportToast(false), 3000);
  };

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Enquiries Management</span>
            <span className="px-2.5 py-0.5 text-xs bg-blue-50 border border-blue-200 text-blue-700 rounded-full font-bold">
              {filteredEnquiries.length} Records
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Filter, inspect, and manage inbound customer enquiries and AI triage records.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
            title="Reset mock data to initial state"
          >
            Reset Mock Data
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      {exportToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>CSV Export File generated and downloaded successfully!</span>
        </div>
      )}

      {/* Filter Bar Controls */}
      <Card className="bg-white border border-slate-200/80 shadow-xs p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search input */}
          <div className="lg:col-span-2 relative">
            <Input
              placeholder="Search by ID, name, email or company..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              leftIcon={<Search className="w-4 h-4" />}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <Select
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'NEW', label: 'NEW' },
              { value: 'CONTACTED', label: 'CONTACTED' },
              { value: 'IN DISCUSSION', label: 'IN DISCUSSION' },
              { value: 'PROPOSAL SENT', label: 'PROPOSAL SENT' },
              { value: 'CONVERTED', label: 'CONVERTED' },
            ]}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          />

          {/* Priority Filter */}
          <Select
            options={[
              { value: 'ALL', label: 'All Priorities' },
              { value: 'CRITICAL', label: 'CRITICAL' },
              { value: 'HIGH', label: 'HIGH' },
              { value: 'MEDIUM', label: 'MEDIUM' },
              { value: 'LOW', label: 'LOW' },
            ]}
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
          />

          {/* Sort Order */}
          <Select
            options={[
              { value: 'newest', label: 'Sort: Newest First' },
              { value: 'oldest', label: 'Sort: Oldest First' },
              { value: 'priority', label: 'Sort: Highest Priority' },
            ]}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
          />

        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-500 font-medium">
            <span>Active filters applied</span>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:underline flex items-center gap-1 font-bold"
            >
              <X className="w-3 h-3" /> Clear All Filters
            </button>
          </div>
        )}
      </Card>

      {/* Data Table */}
      <Card className="p-0 overflow-hidden border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Enquiry ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Company</th>
                <th className="py-3.5 px-4">Service Required</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">AI Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned Team</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                      <Link href={`/admin/enquiries/${item.id}`} className="hover:underline">
                        {item.id}
                      </Link>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4 text-slate-900 font-semibold whitespace-nowrap">
                      {item.fullName}
                      <span className="block text-[10px] text-slate-500 font-normal">{item.email}</span>
                    </td>

                    {/* Company */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {item.company}
                    </td>

                    {/* Service */}
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {item.service}
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={item.priority} />
                    </td>

                    {/* AI Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200 font-medium">
                        {item.aiCategory}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Team */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {item.assignedTeam}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link href={`/admin/enquiries/${item.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                        </Button>
                      </Link>
                    </td>

                  </tr>
                ))
              ) : (
                /* EXPLICIT EMPTY STATE */
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mx-auto">
                        <Inbox className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">No Matching Enquiries</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        No enquiry records matched your criteria. Try adjusting your search query or clear filters.
                      </p>
                      {hasActiveFilters && (
                        <Button variant="outline" size="sm" onClick={clearFilters}>
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 font-medium gap-3">
          <span>
            Showing Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong> ({filteredEnquiries.length} total records)
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>

      </Card>

    </div>
  );
}

export default function AdminEnquiriesPage() {
  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 flex">
      <AdminSidebar />
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <AdminHeader />
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <Suspense fallback={<Card className="p-12 text-center text-slate-500 bg-white">Loading Enquiries Database...</Card>}>
            <EnquiriesTableContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

