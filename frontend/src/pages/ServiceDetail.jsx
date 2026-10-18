import React from 'react';
import { useParams } from 'react-router-dom';
import { ErrorState, PageLoader } from '../components/common/States';
import { useApiQuery } from '../api/useApiQuery';
import HouseholdShifting from './HouseholdShifting';
import PackingService from './PackingService';

export default function ServiceDetail() {
  const { slug } = useParams();
  const query = useApiQuery(
    ['service', slug],
    `/api/v1/services/slug/${slug}`,
    { enabled: Boolean(slug) && !['household-shifting', 'packing'].includes(slug) },
  );
  if (slug === 'packing') return <PackingService />;
  if (slug === 'household-shifting') return <HouseholdShifting />;
  if (query.isPending) return <PageLoader label="Loading service..." />;
  if (query.isError && query.error?.response?.status !== 404) {
    return <ErrorState message="Service details could not be loaded." onRetry={query.refetch} />;
  }
  const item = query.data;
  if (!item) return <div className="max-w-3xl mx-auto px-4 py-12">Service not found.</div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-navy">{item.title}</h1>
      {item.image && <img src={item.image} alt={item.title} className="mt-4 rounded-xl w-full" />}
      <p className="mt-4 text-gray-700 whitespace-pre-line">{item.description || item.shortDescription}</p>
    </div>
  );
}