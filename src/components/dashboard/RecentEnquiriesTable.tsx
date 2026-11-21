'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { useEnquiries } from '@/context/EnquiriesContext';
import { ArrowUpRight, Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const RecentEnquiriesTable: React.FC = () => {
  const { enquiries } = useEnquiries();
  const recentList = enquiries.slice(0, 5);

  return (
    <Card className="overflow-hidden p-0 border border-slate-200/80 bg-white shadow-xs">
      
      {/* Table Header */}
      <div className="p-5 bg-white border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Recent Incoming Enquiries</span>
            <span className="px-2 py-0.5 text-xs bg-blue-50 border border-blue-200 text-blue-700 rounded-full font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Auto-triaged
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Real-time enterprise enquiries & AI assignment</p>
        </div>

        <Link href="/admin/enquiries">
          <Button variant="outline" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
            View All ({enquiries.length})
          </Button>
        </Link>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-bold">
              <th className="py-3 px-4">Enquiry ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Service</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">AI Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assigned Team</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {recentList.map((enquiry) => (
              <tr key={enquiry.id} className="hover:bg-slate-50/80 transition-colors group">
                
                {/* ID */}
                <td className="py-3.5 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                  <Link href={`/admin/enquiries/${enquiry.id}`} className="hover:underline">
                    {enquiry.id}
                  </Link>
                </td>

                {/* Customer */}
                <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                  {enquiry.fullName}
                  <span className="block text-[10px] text-slate-500 font-normal">{enquiry.email}</span>
                </td>

                {/* Company */}
                <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                  {enquiry.company}
                </td>

                {/* Service */}
                <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                  {enquiry.service}
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <PriorityBadge priority={enquiry.priority} />
                </td>

                {/* AI Category */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200 font-medium">
                    {enquiry.aiCategory}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={enquiry.status} />
                </td>

                {/* Team */}
                <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                  {enquiry.assignedTeam}
                </td>

                {/* Action */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <Link href={`/admin/enquiries/${enquiry.id}`}>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                      <Eye className="w-3.5 h-3.5 mr-1" /> View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

