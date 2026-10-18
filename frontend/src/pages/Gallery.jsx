import React from 'react';
import { useApiQuery } from '../api/useApiQuery';
import { Empty, ErrorState, SkeletonGrid } from '../components/common/States';

export default function Gallery() {
  const query = useApiQuery(['gallery', 'visible'], '/api/v1/gallery?isVisible=true');
  if (query.isPending) return <SkeletonGrid count={8} columns={4} />;
  if (query.isError) return <ErrorState message="The gallery could not be loaded." onRetry={query.refetch} />;
  const items = query.data || [];
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-navy mb-8">Gallery</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((g) => (
          <div key={g._id} className="rounded-xl overflow-hidden shadow">
            <img src={g.image} alt={g.title} className="w-full h-40 object-cover" />
            {g.title && <p className="text-sm p-2 text-gray-600">{g.title}</p>}
          </div>
        ))}
      </div>
      {!items.length && <Empty label="No images yet." />}
    </div>
  );
}