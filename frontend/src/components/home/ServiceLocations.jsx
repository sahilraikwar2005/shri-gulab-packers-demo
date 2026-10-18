import React from 'react';
import { useApiQuery } from '../../api/useApiQuery';
import { Empty, ErrorState, SkeletonGrid } from '../common/States';

export default function ServiceLocations() {
  const query = useApiQuery(['locations', 'active'], '/api/v1/locations?isActive=true');
  if (query.isPending) return <SkeletonGrid count={4} columns={4} />;
  if (query.isError) return <ErrorState message="Service locations could not be loaded." onRetry={query.refetch} />;
  const items = query.data || [];
  const shown = items.length ? items : [];
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-navy text-center mb-10">Service Locations</h2>
        {shown.length ? (
          <div className="flex flex-wrap justify-center gap-3">
            {shown.map((l) => (
              <span key={l._id} className="px-4 py-2 bg-white rounded-full shadow text-navy font-medium">{l.city}</span>
            ))}
          </div>
        ) : (
          <Empty label="Service locations will be updated soon." />
        )}
      </div>
    </section>
  );
}