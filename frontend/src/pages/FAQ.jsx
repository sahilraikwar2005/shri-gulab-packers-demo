import React, { useState } from 'react';
import { useApiQuery } from '../api/useApiQuery';
import { Empty, ErrorState, SkeletonGrid } from '../components/common/States';

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const query = useApiQuery(['faqs', 'visible'], '/api/v1/faqs?isVisible=true');
  if (query.isPending) return <SkeletonGrid count={5} columns={1} />;
  if (query.isError) return <ErrorState message="FAQs could not be loaded." onRetry={query.refetch} />;
  const items = query.data || [];
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-navy mb-8">FAQs</h1>
      <div className="space-y-3">
        {items.map((f) => (
          <div key={f._id} className="bg-white rounded-xl shadow p-4">
            <button
              type="button"
              className="w-full text-left font-semibold text-navy flex justify-between"
              aria-expanded={open === f._id}
              aria-controls={`faq-${f._id}`}
              onClick={() => setOpen(open === f._id ? null : f._id)}
            >
              <span>{f.question}</span><span aria-hidden="true">{open === f._id ? '−' : '+'}</span>
            </button>
            {open === f._id && <p id={`faq-${f._id}`} className="mt-2 text-sm text-gray-600">{f.answer}</p>}
          </div>
        ))}
      </div>
      {!items.length && <Empty label="No FAQs are available yet." />}
    </div>
  );
}