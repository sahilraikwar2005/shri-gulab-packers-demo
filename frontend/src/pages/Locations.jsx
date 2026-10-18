import React from 'react';
import { useApiQuery } from '../api/useApiQuery';
import { Empty, ErrorState, SkeletonGrid } from '../components/common/States';

export default function Locations() {
  const query = useApiQuery(['locations', 'active'], '/api/v1/locations?isActive=true');
  if (query.isPending) return <SkeletonGrid count={6} columns={3} />;
  if (query.isError) return <ErrorState message="Service locations could not be loaded." onRetry={query.refetch} />;
  const items = query.data || [];
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-navy mb-8">Service Locations</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((l) => (
          <div key={l._id} className="card">
            <h3 className="font-bold text-navy">{l.city}{l.state ? `, ${l.state}` : ''}</h3>
            {l.pincodes?.length ? <p className="text-sm text-gray-600 mt-2">PIN: {l.pincodes.join(', ')}</p> : null}
            <p className="text-xs mt-2 text-green-600">Active</p>
          </div>
        ))}
      </div>
      {!items.length && <Empty label="No service locations are available yet." />}
    </div>
  );
}