import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../api/client';
import { ButtonLoader, ErrorState, PageLoader } from '../components/common/States';

export default function Homepage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(null);
  const query = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const response = await api.get('/api/v1/settings');
      return response.data.data || {};
    },
  });
  const values = form ?? query.data ?? {};
  const update = (p, v) => setForm((current) => {
    const c = JSON.parse(JSON.stringify(current ?? query.data ?? {}));
    const parts = p.split('.'); let cur = c;
    for (let i = 0; i < parts.length - 1; i++) cur = (cur[parts[i]] = cur[parts[i]] || {});
    cur[parts[parts.length - 1]] = v; return c;
  });
  const saveMutation = useMutation({
    mutationFn: (values) => api.put('/api/v1/settings', values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      toast.success('Homepage settings saved');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Homepage settings could not be saved'),
  });
  if (query.isPending) return <PageLoader label="Loading homepage settings..." />;
  if (query.isError) return <ErrorState message="Homepage settings could not be loaded." onRetry={query.refetch} />;
  const field = (label, path) => (
    <div><label className="block text-sm font-medium mb-1">{label}</label>
    <input className="w-full border rounded p-2.5" value={path.split('.').reduce((o,k)=>o?.[k], values) ?? ''} onChange={(e)=>update(path,e.target.value)} /></div>
  );
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-navy mb-6">Homepage Editor</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        {field('Hero Title', 'hero.title')}
        {field('Hero Subtitle', 'hero.subtitle')}
        {field('Hero Image URL', 'hero.image')}
        {field('CTA Text', 'hero.ctaText')}
        {field('CTA Link', 'hero.ctaLink')}
        {field('Footer Text', 'footerText')}
        <button type="button" onClick={() => saveMutation.mutate(values)} disabled={saveMutation.isPending} className="bg-orange text-white px-5 py-2.5 rounded font-semibold disabled:opacity-60">{saveMutation.isPending ? <ButtonLoader /> : 'Save'}</button>
      </div>
    </div>
  );
}