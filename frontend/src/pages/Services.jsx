import React from 'react';
import { Link } from 'react-router-dom';
import {
  Archive,
  ArrowDownToLine,
  ArrowRight,
  Building2,
  Car,
  House,
  Package,
  PackageOpen,
  Truck,
  Warehouse,
} from 'lucide-react';
import { useApiQuery } from '../api/useApiQuery';
import { Empty, ErrorState, SkeletonGrid } from '../components/common/States';
import heroImage from '../assets/hero-movers.png';
import movingBoxesImage from '../assets/navbar-moving-boxes.png';
import vehicleTransportImage from '../assets/why-choose-vehicle-transport.png';
import './Services.css';

const servicePresentation = {
  packing: {
    icon: Package,
    description: 'High-quality packing materials to keep your belongings safe during transit.',
    image: 'https://images.pexels.com/photos/4569340/pexels-photo-4569340.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: 'Household belongings being packed into a moving box',
  },
  loading: {
    icon: Truck,
    description: 'A trained team carefully loads your belongings for a secure move.',
    image: 'https://images.pexels.com/photos/6169056/pexels-photo-6169056.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: 'Movers preparing household items for transportation',
  },
  unloading: {
    icon: ArrowDownToLine,
    description: 'Careful unloading and placement at your new destination.',
    image: 'https://images.pexels.com/photos/7464722/pexels-photo-7464722.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: 'Movers handling a protected sofa during relocation',
  },
  unpacking: {
    icon: PackageOpen,
    description: 'We help unpack and arrange your belongings at your new location.',
    image: 'https://images.pexels.com/photos/4503735/pexels-photo-4503735.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: 'Moving boxes and household items ready to be unpacked',
  },
  'household-shifting': {
    icon: House,
    description: 'Complete home relocation, handled with care from start to finish.',
    image: heroImage,
    imageAlt: 'Movers transporting protected furniture from a home',
  },
  'office-shifting': {
    icon: Building2,
    description: 'Organized office relocation designed to help minimize downtime.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Modern office interior prepared for relocation',
  },
  warehouse: {
    icon: Warehouse,
    description: 'Reliable warehouse support for your goods and business inventory.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Organized warehouse shelving and goods',
  },
  'vehicle-transportation': {
    icon: Car,
    description: 'Secure transportation for cars and two-wheelers across India.',
    image: vehicleTransportImage,
    imageAlt: 'Vehicle secured for transportation on a carrier truck',
  },
  storage: {
    icon: Archive,
    description: 'Short- and long-term storage options for household and business goods.',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Clean storage facility with organized moving goods',
  },
};

export default function Services() {
  const query = useApiQuery(['services', 'published'], '/api/v1/services?isPublished=true');

  if (query.isPending) return <SkeletonGrid count={9} columns={3} />;
  if (query.isError) return <ErrorState message="Services could not be loaded." onRetry={query.refetch} />;

  const services = [...(query.data || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <main className="services-page">
      <header className="services-page-hero" style={{ '--services-hero-image': `url(${heroImage})` }}>
        <div className="services-page-container">
          <p className="services-page-eyebrow"><span /> WHAT WE OFFER</p>
          <h1>Reliable Moving &amp; Relocation <span>Services</span></h1>
          <p className="services-page-intro">
            Complete packing, shifting, and transportation solutions for your moving needs.
          </p>
        </div>
      </header>

      <section className="services-page-list" aria-label="Moving and relocation services">
        <div className="services-page-container">
          {services.length ? (
            <div className="services-page-grid">
              {services.map((service) => {
                const presentation = servicePresentation[service.slug] || {};
                const Icon = presentation.icon || Package;
                const servicePath = `/services/${service.slug || service._id}`;
                return (
                  <article className="services-page-card" key={service._id}>
                    <Link className="services-page-card-link" to={servicePath}>
                      <span className="services-page-icon"><Icon aria-hidden="true" /></span>
                      <span className="services-page-card-copy">
                        <span className="services-page-card-title">{service.title}</span>
                        <span className="services-page-card-description">
                          {service.shortDescription || presentation.description || 'Explore our professional moving and relocation support.'}
                        </span>
                        <span className="services-page-card-action">Explore Service <ArrowRight aria-hidden="true" /></span>
                      </span>
                      {presentation.image && (
                        <img
                          className="services-page-card-image"
                          src={presentation.image}
                          alt={presentation.imageAlt || ''}
                          loading="lazy"
                        />
                      )}
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <Empty label="No services available." />
          )}

          <aside className="services-page-cta">
            <img
              className="services-page-cta-image"
              src={movingBoxesImage}
              alt=""
              loading="lazy"
            />
            <div className="services-page-cta-copy">
              <p className="services-page-eyebrow"><span /> NEED HELP CHOOSING A SERVICE?</p>
              <h2>Get a Free Quote Today!</h2>
              <p>Share your requirements and our team will help you find the best solution.</p>
            </div>
            <Link className="services-page-cta-button" to="/quote">
              Get Free Quote <ArrowRight aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
