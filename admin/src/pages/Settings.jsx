import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../api/client';
import { ButtonLoader, ErrorState, PageLoader } from '../components/common/States';

export default function Settings() {
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

  const update = (path, value) => {
    setForm((current) => {
      const copy = JSON.parse(JSON.stringify(current ?? query.data ?? {}));
      const parts = path.split('.');
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) cur = (cur[parts[i]] = cur[parts[i]] || {});
      cur[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  const saveMutation = useMutation({
    mutationFn: (values) => api.put('/api/v1/settings', values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      toast.success('Settings saved');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Settings could not be saved'),
  });

  const field = (label, path, type = 'text') => (
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor={`setting-${path.replaceAll('.', '-')}`}>{label}</label>
      <input id={`setting-${path.replaceAll('.', '-')}`} type={type} value={path.split('.').reduce((o, k) => o?.[k], values) ?? ''} onChange={(e) => update(path, e.target.value)} className="w-full border rounded p-2.5" />
    </div>
  );

  if (query.isPending) return <PageLoader label="Loading company settings..." />;
  if (query.isError) return <ErrorState message="Company settings could not be loaded." onRetry={query.refetch} />;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-navy mb-6">Company Settings</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <h2 className="font-bold">Company Info</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {field('Company Name', 'companyName')}
          {field('Phone (primary)', 'phone')}
          {field('Phones (comma separated)', 'phones')}
          {field('WhatsApp (country code, no +)', 'whatsapp')}
          {field('Email', 'email')}
          {field('Working Hours', 'workingHours')}
        </div>
        <h2 className="font-bold">Social Links</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {field('Instagram', 'socialLinks.instagram')}
          {field('Facebook', 'socialLinks.facebook')}
        </div>
        {field('Office Address', 'officeAddress')}
        <h2 className="font-bold">Hero</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {field('Hero Title', 'hero.title')}
          {field('Hero Subtitle', 'hero.subtitle')}
          {field('Hero Image URL', 'hero.image')}
          {field('CTA Text', 'hero.ctaText')}
        </div>
        <button type="button" onClick={() => saveMutation.mutate(values)} disabled={saveMutation.isPending} className="bg-orange text-white px-5 py-2.5 rounded font-semibold disabled:opacity-60">{saveMutation.isPending ? <ButtonLoader /> : 'Save Changes'}</button>
      </div>
    </div>
  );
}