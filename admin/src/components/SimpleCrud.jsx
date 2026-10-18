import React, { useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { ButtonLoader, EmptyState, ErrorState, TableSkeleton } from './common/States';

export default function SimpleCrud({ title, endpoint, fields }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const query = useQuery({
    queryKey: ['admin', endpoint],
    queryFn: async () => {
      const r = await api.get(endpoint);
      return r.data.data || [];
    },
  });

  const reset = () => { setEditing(null); setForm({}); };

  const saveMutation = useMutation({
    mutationFn: ({ id, values }) => id
      ? api.put(`${endpoint}/${id}`, values)
      : api.post(endpoint, values),
    onSuccess: async () => {
      reset();
      await queryClient.invalidateQueries({ queryKey: ['admin', endpoint] });
      toast.success(editing ? 'Updated' : 'Created');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Save failed'),
  });

  const edit = (item) => { setEditing(item._id); setForm({ ...item }); };

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`${endpoint}/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', endpoint] });
      toast.success('Deleted');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Delete failed'),
  });

  const save = () => saveMutation.mutate({ id: editing, values: form });
  const remove = (id) => {
    if (window.confirm('Delete this record?')) deleteMutation.mutate(id);
  };

  if (query.isPending) return <TableSkeleton rows={6} columns={5} />;
  if (query.isError) {
    return <ErrorState message="Records could not be loaded." onRetry={query.refetch} />;
  }
  const items = query.data;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        <button type="button" onClick={reset} className="bg-orange text-white px-4 py-2 rounded font-semibold">+ New</button>
      </div>
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="grid md:grid-cols-3 gap-3">
          {fields.map((f) => (
            <div key={f.name}>
              {f.type === 'boolean' ? (
                <label htmlFor={`crud-${f.name}`} className="flex items-center gap-2 text-sm">
                  <input id={`crud-${f.name}`} type="checkbox" checked={!!form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })} /> {f.label}
                </label>
              ) : (
                <>
                  <label htmlFor={`crud-${f.name}`} className="block text-xs font-medium mb-1">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea id={`crud-${f.name}`} className="w-full border rounded p-2" rows={3} value={form[f.name] ?? ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                  ) : f.type === 'select' ? (
                    <select id={`crud-${f.name}`} className="w-full border rounded p-2" value={form[f.name] ?? f.default ?? ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                      {(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === 'number' ? (
                    <input id={`crud-${f.name}`} type="number" className="w-full border rounded p-2" value={form[f.name] ?? ''} onChange={(e) => setForm({ ...form, [f.name]: Number(e.target.value) })} />
                  ) : (
                    <input id={`crud-${f.name}`} className="w-full border rounded p-2" value={form[f.name] ?? ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={saveMutation.isPending}
            className="bg-navy text-white px-4 py-2 rounded font-semibold disabled:opacity-60"
          >
            {saveMutation.isPending ? <ButtonLoader /> : editing ? 'Update' : 'Create'}
          </button>
          {editing && <button type="button" onClick={reset} className="px-4 py-2 border rounded">Cancel</button>}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr>
            {fields.slice(0, 4).map((f) => <th key={f.name} className="text-left p-3">{f.label}</th>)}
            <th className="text-left p-3">Actions</th>
          </tr></thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id} className="border-t">
                {fields.slice(0, 4).map((f) => <td key={f.name} className="p-3">{String(it[f.name] ?? '')}</td>)}
                <td className="p-3 space-x-2">
                  <button type="button" onClick={() => edit(it)} className="text-blue-600">Edit</button>
                  <button type="button" onClick={() => remove(it._id)} disabled={deleteMutation.isPending} className="text-red-600 disabled:opacity-50">Delete</button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr><td colSpan={Math.min(fields.length, 4) + 1}><EmptyState /></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}