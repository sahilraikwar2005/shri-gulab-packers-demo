import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../api/client';
import { ButtonLoader, EmptyState, ErrorState, TableSkeleton } from '../components/common/States';

const STATUSES = ['new', 'contacted', 'quoted', 'booked', 'closed', 'lost'];

export default function Inquiries() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const query = useQuery({
    queryKey: ['admin', 'inquiries', status],
    queryFn: async () => {
      const response = await api.get(`/api/v1/inquiries?limit=100${status ? `&status=${status}` : ''}`);
      return response.data.data || [];
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, value }) => api.put(`/api/v1/inquiries/${id}`, { status: value }),
    onSuccess: async (response, variables) => {
      setSelected((current) => (
        current?._id === variables.id ? { ...current, ...response.data.data } : current
      ));
      await queryClient.invalidateQueries({ queryKey: ['admin', 'inquiries'] });
      toast.success('Inquiry status updated');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Inquiry status could not be updated'),
  });

  const noteMutation = useMutation({
    mutationFn: async ({ id, text }) => {
      await api.put(`/api/v1/inquiries/${id}`, { notes: text });
      const response = await api.get(`/api/v1/inquiries/${id}`);
      return response.data.data;
    },
    onSuccess: async (item) => {
      setSelected(item);
      setNote('');
      await queryClient.invalidateQueries({ queryKey: ['admin', 'inquiries'] });
      toast.success('Note added');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Note could not be added'),
  });

  if (query.isPending) return <TableSkeleton rows={7} columns={6} />;
  if (query.isError) return <ErrorState message="Inquiries could not be loaded." onRetry={query.refetch} />;
  const items = query.data;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Inquiries</h1>
      <div className="mb-4">
        <label className="sr-only" htmlFor="inquiry-status-filter">Filter by status</label>
        <select id="inquiry-status-filter" className="border rounded p-2" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr>
            <th className="p-3 text-left">Ref</th><th className="p-3 text-left">Customer</th><th className="p-3 text-left">Route</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Actions</th>
          </tr></thead>
          <tbody>
            {items.map((inquiry) => (
              <tr key={inquiry._id} className="border-t">
                <td className="p-3">{inquiry.referenceId}</td>
                <td className="p-3">{inquiry.customer?.name}<br /><span className="text-xs text-gray-500">{inquiry.customer?.mobile}</span></td>
                <td className="p-3">{inquiry.pickup?.city} → {inquiry.destination?.city}</td>
                <td className="p-3">{inquiry.movingType}</td>
                <td className="p-3">
                  <select
                    aria-label={`Status for ${inquiry.referenceId}`}
                    value={inquiry.status}
                    disabled={statusMutation.isPending}
                    onChange={(e) => statusMutation.mutate({ id: inquiry._id, value: e.target.value })}
                    className="border rounded p-1 text-xs disabled:opacity-60"
                  >
                    {STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                </td>
                <td className="p-3"><button type="button" onClick={() => setSelected(inquiry)} className="text-blue-600">View</button></td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan={6}><EmptyState message="No inquiries match this filter." /></td></tr>}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-dialog-title"
            className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-auto"
          >
            <h2 id="inquiry-dialog-title" className="font-bold text-navy mb-2">{selected.referenceId}</h2>
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(selected, null, 2)}</pre>
            <label className="sr-only" htmlFor="inquiry-note">Add note</label>
            <input
              id="inquiry-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add note"
              className="w-full border rounded p-2"
            />
            <button
              type="button"
              disabled={!note.trim() || noteMutation.isPending}
              onClick={() => noteMutation.mutate({ id: selected._id, text: note.trim() })}
              className="mt-2 bg-orange text-white px-3 py-1.5 rounded disabled:opacity-60"
            >
              {noteMutation.isPending ? <ButtonLoader label="Adding..." /> : 'Add Note'}
            </button>
            <button type="button" onClick={() => setSelected(null)} className="mt-4 ml-3 text-gray-600">Close</button>
          </section>
        </div>
      )}
    </div>
  );
}
