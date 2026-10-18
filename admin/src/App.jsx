import React, { lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import { ErrorState, PageLoader } from './components/common/States';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Homepage = lazy(() => import('./pages/Homepage'));
const Services = lazy(() => import('./pages/Services'));
const Locations = lazy(() => import('./pages/Locations'));
const Fleet = lazy(() => import('./pages/Fleet'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Faqs = lazy(() => import('./pages/Faqs'));
const Seo = lazy(() => import('./pages/Seo'));
const Inquiries = lazy(() => import('./pages/Inquiries'));
const Quotations = lazy(() => import('./pages/Quotations'));
const Bookings = lazy(() => import('./pages/Bookings'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Users = lazy(() => import('./pages/Users'));
const Activity = lazy(() => import('./pages/Activity'));
const Reports = lazy(() => import('./pages/Reports'));

function Protected({ children }) {
  const { user, loading, error, refresh } = useAuth();
  if (loading) return <PageLoader label="Checking admin session..." />;
  if (error) return <ErrorState message="Could not verify your admin session." onRetry={refresh} />;
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <Suspense fallback={<PageLoader label="Loading page..." />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/settings" element={<Protected><Settings /></Protected>} />
          <Route path="/homepage" element={<Protected><Homepage /></Protected>} />
          <Route path="/services" element={<Protected><Services /></Protected>} />
          <Route path="/locations" element={<Protected><Locations /></Protected>} />
          <Route path="/fleet" element={<Protected><Fleet /></Protected>} />
          <Route path="/gallery" element={<Protected><Gallery /></Protected>} />
          <Route path="/faqs" element={<Protected><Faqs /></Protected>} />
          <Route path="/seo" element={<Protected><Seo /></Protected>} />
          <Route path="/inquiries" element={<Protected><Inquiries /></Protected>} />
          <Route path="/quotations" element={<Protected><Quotations /></Protected>} />
          <Route path="/bookings" element={<Protected><Bookings /></Protected>} />
          <Route path="/testimonials" element={<Protected><Testimonials /></Protected>} />
          <Route path="/reviews" element={<Protected><Reviews /></Protected>} />
          <Route path="/users" element={<Protected><Users /></Protected>} />
          <Route path="/activity" element={<Protected><Activity /></Protected>} />
          <Route path="/reports" element={<Protected><Reports /></Protected>} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}