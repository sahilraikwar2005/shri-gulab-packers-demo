import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../api/client';
import { ButtonLoader, EmptyState, ErrorState, TableSkeleton } from '../components/common/States';

const blankForm = () => ({ city: '', state: '', pincodes: '', isActive: true, order: 0 });

export default function Locations() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankForm);
  const query = useQuery({
    queryKey: ['admin', '/api/v1/locations'],
    queryFn: async () => {
      const response = await api.get('/api/v1/locations');
      return response.data.data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, values }) => {
      const payload = { ...values, pincodes: values.pincodes.split(',').map((pin) => pin.trim()).filter(Boolean) };
      return id
        ? api.put(`/api/v1/locations/${id}`, payload)
        : api.post('/api/v1/locations', payload);
    },
    onSuccess: async () => {
      setEditing(null);
      setForm(blankForm());
      await queryClient.invalidateQueries({ queryKey: ['admin', '/api/v1/locations'] });
      toast.success(editing ? 'Location updated' : 'Location created');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Location could not be saved'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/v1/locations/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', '/api/v1/locations'] });
      toast.success('Location deleted');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Location could not be deleted'),
  });

  const reset = () => { setEditing(null); setForm(blankForm()); };
  const edit = (item) => {
    setEditing(item._id);
    setForm({
      city: item.city || '',
      state: item.state || '',
      pincodes: (item.pincodes || []).join(', '),
      isActive: !!item.isActive,
      order: item.order || 0,
    });
  };

  if (query.isPending) return <TableSkeleton rows={6} columns={5} />;
  if (query.isError) return <ErrorState message="Locations could not be loaded." onRetry={query.refetch} />;
  const items = query.data;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Locations</h1>
      <div className="bg-white rounded-xl shadow p-4 mb-6 grid md:grid-cols-3 gap-3">
        <input aria-label="City" placeholder="City" className="border rounded p-2" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input aria-label="State" placeholder="State" className="border rounded p-2" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        <input aria-label="Pincodes" placeholder="Pincodes (comma)" className="border rounded p-2" value={form.pincodes} onChange={(e) => setForm({ ...form, pincodes: e.target.value })} />
        <input aria-label="Order" type="number" placeholder="Order" className="border rounded p-2" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
        <div className="flex gap-2">
          <button type="button" onClick={() => saveMutation.mutate({ id: editing, values: form })} disabled={saveMutation.isPending} className="bg-navy text-white px-4 py-2 rounded disabled:opacity-60">
            {saveMutation.isPending ? <ButtonLoader /> : editing ? 'Update' : 'Create'}
          </button>
          {editing && <button type="button" onClick={reset} className="px-4 py-2 border rounded">Cancel</button>}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="p-3">City</th><th className="p-3">State</th><th className="p-3">Pincodes</th><th className="p-3">Active</th><th className="p-3">Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-3">{item.city}</td><td className="p-3">{item.state}</td><td className="p-3">{(item.pincodes || []).join(', ')}</td><td className="p-3">{String(item.isActive)}</td>
                <td className="p-3 space-x-2">
                  <button type="button" onClick={() => edit(item)} className="text-blue-600">Edit</button>
                  <button type="button" onClick={() => { if (window.confirm('Delete this location?')) deleteMutation.mutate(item._id); }} disabled={deleteMutation.isPending} className="text-red-600 disabled:opacity-50">Delete</button>
                </td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan={5}><EmptyState message="No service locations have been added." /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
