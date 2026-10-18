import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../api/client';
import { ButtonLoader, EmptyState, ErrorState, TableSkeleton } from '../components/common/States';

export default function Bookings() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ inquiry: '', scheduleDate: '', driverName: '', driverPhone: '', notes: '' });

  const bookingsQuery = useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: async () => {
      const response = await api.get('/api/v1/bookings');
      return response.data.data || [];
    },
  });
  const vehiclesQuery = useQuery({
    queryKey: ['admin', 'fleet'],
    queryFn: async () => {
      const response = await api.get('/api/v1/fleet');
      return response.data.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload) => api.post('/api/v1/bookings', payload),
    onSuccess: async () => {
      setForm({ inquiry: '', scheduleDate: '', driverName: '', driverPhone: '', notes: '' });
      await queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      toast.success('Booking created');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Booking could not be created'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/api/v1/bookings/${id}`, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      toast.success('Booking status updated');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Booking status could not be updated'),
  });

  const create = () => createMutation.mutate({ ...form, vehicle: form.vehicle });
  const updateStatus = (id, status) => statusMutation.mutate({ id, status });

  if (bookingsQuery.isPending || vehiclesQuery.isPending) return <TableSkeleton rows={6} columns={4} />;
  if (bookingsQuery.isError) {
    return <ErrorState message="Bookings could not be loaded." onRetry={bookingsQuery.refetch} />;
  }
  if (vehiclesQuery.isError) {
    return <ErrorState message="Vehicle options could not be loaded." onRetry={vehiclesQuery.refetch} />;
  }

  const items = bookingsQuery.data;
  const vehicles = vehiclesQuery.data;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Bookings</h1>
      <div className="bg-white rounded-xl shadow p-4 mb-6 grid md:grid-cols-4 gap-3">
        <input aria-label="Inquiry ID (optional)" placeholder="Inquiry ID (optional)" className="border rounded p-2" value={form.inquiry} onChange={(e) => setForm({ ...form, inquiry: e.target.value })} />
        <input aria-label="Scheduled date" type="date" className="border rounded p-2" value={form.scheduleDate} onChange={(e) => setForm({ ...form, scheduleDate: e.target.value })} />
        <select aria-label="Vehicle" className="border rounded p-2" value={form.vehicle || ''} onChange={(e) => setForm({ ...form, vehicle: e.target.value })}>
          <option value="">Vehicle</option>
          {vehicles.map((vehicle) => <option key={vehicle._id} value={vehicle._id}>{vehicle.name}</option>)}
        </select>
        <button
          type="button"
          onClick={create}
          disabled={createMutation.isPending}
          className="bg-orange text-white rounded px-4 disabled:opacity-60"
        >
          {createMutation.isPending ? <ButtonLoader label="Creating..." /> : 'Create Booking'}
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-3 mb-6">
        <input aria-label="Driver name" placeholder="Driver Name" className="border rounded p-2" value={form.driverName} onChange={(e) => setForm({ ...form, driverName: e.target.value })} />
        <input aria-label="Driver phone" placeholder="Driver Phone" className="border rounded p-2" value={form.driverPhone} onChange={(e) => setForm({ ...form, driverPhone: e.target.value })} />
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="p-3">Booking ID</th><th className="p-3">Scheduled</th><th className="p-3">Status</th><th className="p-3">Update</th></tr></thead>
          <tbody>
            {items.map((booking) => (
              <tr key={booking._id} className="border-t">
                <td className="p-3">{booking.bookingId}</td>
                <td className="p-3">{booking.scheduleDate ? new Date(booking.scheduleDate).toLocaleDateString() : '-'}</td>
                <td className="p-3">{booking.status}</td>
                <td className="p-3 space-x-2">
                  {['scheduled', 'inTransit', 'completed', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={statusMutation.isPending}
                      onClick={() => updateStatus(booking._id, status)}
                      className="text-xs text-blue-600 disabled:opacity-50"
                    >
                      {status}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan={4}><EmptyState message="No bookings found." /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
