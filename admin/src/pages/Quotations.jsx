import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../api/client';
import { ButtonLoader, EmptyState, ErrorState, TableSkeleton } from '../components/common/States';

export default function Quotations() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ inquiryId: '', estimateAmount: '', notes: '' });
  const quotationsQuery = useQuery({
    queryKey: ['admin', 'quotations'],
    queryFn: async () => {
      const response = await api.get('/api/v1/quotations');
      return response.data.data || [];
    },
  });
  const inquiriesQuery = useQuery({
    queryKey: ['admin', 'inquiries', 'quote-options'],
    queryFn: async () => {
      const response = await api.get('/api/v1/inquiries?limit=100');
      return response.data.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (values) => api.post('/api/v1/quotations', {
      inquiryId: values.inquiryId,
      estimateAmount: Number(values.estimateAmount),
      notes: values.notes,
    }),
    onSuccess: async () => {
      setForm({ inquiryId: '', estimateAmount: '', notes: '' });
      await queryClient.invalidateQueries({ queryKey: ['admin', 'quotations'] });
      toast.success('Quotation created');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Quotation could not be created'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/api/v1/quotations/${id}`, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'quotations'] });
      toast.success('Quotation status updated');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Quotation status could not be updated'),
  });

  if (quotationsQuery.isPending || inquiriesQuery.isPending) return <TableSkeleton rows={6} columns={4} />;
  if (quotationsQuery.isError) {
    return <ErrorState message="Quotations could not be loaded." onRetry={quotationsQuery.refetch} />;
  }
  if (inquiriesQuery.isError) {
    return <ErrorState message="Inquiry options could not be loaded." onRetry={inquiriesQuery.refetch} />;
  }

  const items = quotationsQuery.data;
  const inquiries = inquiriesQuery.data;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Quotations</h1>
      <div className="bg-white rounded-xl shadow p-4 mb-6 grid md:grid-cols-4 gap-3">
        <select aria-label="Select inquiry" className="border rounded p-2" value={form.inquiryId} onChange={(e) => setForm({ ...form, inquiryId: e.target.value })}>
          <option value="">Select inquiry</option>
          {inquiries.map((inquiry) => <option key={inquiry._id} value={inquiry._id}>{inquiry.referenceId} - {inquiry.customer?.name}</option>)}
        </select>
        <input aria-label="Amount" placeholder="Amount" type="number" min="0" className="border rounded p-2" value={form.estimateAmount} onChange={(e) => setForm({ ...form, estimateAmount: e.target.value })} />
        <input aria-label="Notes" placeholder="Notes" className="border rounded p-2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button
          type="button"
          onClick={() => createMutation.mutate(form)}
          disabled={!form.inquiryId || !form.estimateAmount || createMutation.isPending}
          className="bg-orange text-white rounded px-4 disabled:opacity-60"
        >
          {createMutation.isPending ? <ButtonLoader label="Creating..." /> : 'Create Quote'}
        </button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="p-3">Inquiry</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
          <tbody>
            {items.map((quotation) => (
              <tr key={quotation._id} className="border-t">
                <td className="p-3">{quotation.inquiry?.referenceId || quotation.inquiry}</td>
                <td className="p-3">{quotation.estimateAmount} {quotation.currency}</td>
                <td className="p-3">{quotation.status}</td>
                <td className="p-3 space-x-2">
                  {['draft', 'sent', 'accepted', 'rejected'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={statusMutation.isPending}
                      onClick={() => statusMutation.mutate({ id: quotation._id, status })}
                      className="text-xs text-blue-600 disabled:opacity-50"
                    >
                      {status}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan={4}><EmptyState message="No quotations have been created." /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
