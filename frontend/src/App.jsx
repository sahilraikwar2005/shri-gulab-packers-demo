import React, { lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { SiteProvider } from './context/SiteContext';
import { PageLoader } from './components/common/States';

const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const About = lazy(() => import('./pages/About'));
const Fleet = lazy(() => import('./pages/Fleet'));
const Locations = lazy(() => import('./pages/Locations'));
const Gallery = lazy(() => import('./pages/Gallery'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Quote = lazy(() => import('./pages/Quote'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

export default function App() {
  return (
    <SiteProvider>
      <Toaster position="top-right" richColors />
      <Layout>
        <Suspense fallback={<PageLoader label="Loading page..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </Suspense>
      </Layout>
    </SiteProvider>
  );
}