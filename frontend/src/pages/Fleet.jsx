import React from 'react';
import { useApiQuery } from '../api/useApiQuery';
import { Empty, ErrorState, SkeletonGrid } from '../components/common/States';

export default function Fleet() {
  const query = useApiQuery(['fleet'], '/api/v1/fleet');
  if (query.isPending) return <SkeletonGrid count={6} columns={3} />;
  if (query.isError) return <ErrorState message="Fleet details could not be loaded." onRetry={query.refetch} />;
  const items = query.data || [];
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-navy mb-8">Our Fleet</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((v) => (
          <div key={v._id} className="card">
            {v.image && <img src={v.image} alt={v.name} className="rounded-lg mb-3 w-full h-40 object-cover" />}
            <h3 className="font-bold text-navy">{v.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{v.category} • {v.capacity}</p>
            {v.dimensions && <p className="text-xs text-gray-500 mt-1">{v.dimensions}</p>}
            {v.description && <p className="text-sm text-gray-600 mt-2">{v.description}</p>}
            <p className="text-xs mt-2"><span className={v.availability ? 'text-green-600' : 'text-red-600'}>{v.availability ? 'Available' : 'Unavailable'}</span></p>
          </div>
        ))}
      </div>
      {!items.length && <Empty label="No vehicles are available at the moment." />}
    </div>
  );
}