import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { DashboardSkeleton, EmptyState, ErrorState } from '../components/common/States';

export default function Dashboard() {
  const query = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const [inq, quot, book] = await Promise.all([
        api.get('/api/v1/inquiries?limit=5'),
        api.get('/api/v1/quotations'),
        api.get('/api/v1/bookings'),
      ]);
      const inquiries = inq.data.data || [];
      const quotations = quot.data.data || [];
      const bookings = book.data.data || [];
      return {
        stats: {
          inquiries: inq.data.pagination?.total ?? inquiries.length,
          quotations: quotations.length,
          bookings: bookings.length,
          pending: inquiries.filter((inquiry) => inquiry.status === 'new').length,
        },
        recent: inquiries,
      };
    },
  });

  if (query.isPending) return <DashboardSkeleton />;
  if (query.isError) return <ErrorState message="Dashboard data could not be loaded." onRetry={query.refetch} />;

  const { stats, recent } = query.data;
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="bg-white rounded-xl shadow p-5 transition-shadow hover:shadow-md">
            <div className="text-sm text-gray-500 capitalize">{k}</div>
            <div className="text-3xl font-bold text-navy mt-1">{v}</div>
          </div>
        ))}
      </div>
      <h2 className="text-lg font-bold text-navy mb-3">Recent Inquiries</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr>
            <th className="text-left p-3">Ref</th><th className="text-left p-3">Customer</th><th className="text-left p-3">Route</th><th className="text-left p-3">Status</th>
          </tr></thead>
          <tbody>
            {recent.map((i) => (
              <tr key={i._id} className="border-t"><td className="p-3">{i.referenceId}</td><td className="p-3">{i.customer?.name}</td><td className="p-3">{i.pickup?.city} → {i.destination?.city}</td><td className="p-3">{i.status}</td></tr>
            ))}
            {!recent.length && (
              <tr><td colSpan={4}><EmptyState message="There are no recent inquiries." /></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}