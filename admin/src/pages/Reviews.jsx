import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../api/client';
import { ButtonLoader, ErrorState, PageLoader } from '../components/common/States';

export default function Reviews() {
  const queryClient = useQueryClient();
  const [placeIdDraft, setPlaceIdDraft] = useState(null);
  const query = useQuery({
    queryKey: ['admin', 'reviews-status'],
    queryFn: async () => {
      const response = await api.get('/api/v1/reviews');
      return response.data.data;
    },
  });
  const placeId = placeIdDraft ?? query.data?.placeId ?? '';

  const saveMutation = useMutation({
    mutationFn: (value) => api.put('/api/v1/reviews/config', { placeId: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'reviews-status'] });
      toast.success('Review source configured');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Review source could not be configured'),
  });

  const fetchMutation = useMutation({
    mutationFn: (value) => api.post('/api/v1/reviews/fetch', { placeId: value }),
    onSuccess: (response) => toast.success(`Imported ${response.data.imported} reviews`),
    onError: (error) => toast.error(error.response?.data?.message || 'Reviews could not be fetched'),
  });

  if (query.isPending) return <PageLoader label="Loading review configuration..." />;
  if (query.isError) return <ErrorState message="Review configuration could not be loaded." onRetry={query.refetch} />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-navy mb-6">Google Reviews</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <p className="text-sm text-gray-600">Requires GOOGLE_PLACES_API_KEY env on backend. Place ID configures source.</p>
        <div>
          <label htmlFor="google-place-id" className="block text-sm font-medium mb-1">Place ID</label>
          <input id="google-place-id" className="w-full border rounded p-2.5" value={placeId} onChange={(e) => setPlaceIdDraft(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => saveMutation.mutate(placeId)} disabled={saveMutation.isPending} className="bg-navy text-white px-4 py-2 rounded disabled:opacity-60">
            {saveMutation.isPending ? <ButtonLoader /> : 'Save'}
          </button>
          <button type="button" onClick={() => fetchMutation.mutate(placeId)} disabled={!placeId || fetchMutation.isPending} className="bg-orange text-white px-4 py-2 rounded disabled:opacity-60">
            {fetchMutation.isPending ? <ButtonLoader label="Fetching..." /> : 'Fetch Reviews'}
          </button>
        </div>
        {query.data && (
          <p className="text-sm">
            Status: {query.data.status} | Configured: {String(query.data.apiKeyConfigured)} | Last fetched: {query.data.lastFetchedAt || 'never'}
          </p>
        )}
      </div>
    </div>
  );
}
