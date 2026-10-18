import React from 'react';
import Hero from '../components/home/Hero';
import TrustIndicators from '../components/home/TrustIndicators';
import ServicesSection from '../components/home/ServicesSection';
import HowItWorks from '../components/home/HowItWorks';
import DetailedQuote from '../components/home/DetailedQuote';
import FleetSection from '../components/home/FleetSection';
import WhyChoose from '../components/home/WhyChoose';
import Testimonials from '../components/home/Testimonials';
import ServiceLocations from '../components/home/ServiceLocations';
import FAQSection from '../components/home/FAQSection';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustIndicators />
      <ServicesSection />
      <HowItWorks />
      <DetailedQuote />
      <FleetSection />
      <WhyChoose />
      <Testimonials />
      <ServiceLocations />
      <FAQSection />
    </>
  );
}