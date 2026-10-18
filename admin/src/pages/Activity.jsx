import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { EmptyState, ErrorState, TableSkeleton } from '../components/common/States';

export default function Activity() {
  const query = useQuery({
    queryKey: ['admin', 'activity-logs'],
    queryFn: async () => {
      const response = await api.get('/api/v1/activity-logs');
      return response.data.data || [];
    },
  });

  if (query.isPending) return <TableSkeleton rows={6} columns={4} />;
  if (query.isError) return <ErrorState message="Activity logs could not be loaded." onRetry={query.refetch} />;
  const items = query.data;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Activity Logs</h1>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="p-3">When</th><th className="p-3">Actor</th><th className="p-3">Action</th><th className="p-3">Entity</th></tr></thead>
          <tbody>
            {items.map((log) => (
              <tr key={log._id} className="border-t">
                <td className="p-3">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="p-3">{log.actorEmail}</td>
                <td className="p-3">{log.action}</td>
                <td className="p-3">{log.entityType} {log.entityId}</td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan={4}><EmptyState message="No activity has been recorded." /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
