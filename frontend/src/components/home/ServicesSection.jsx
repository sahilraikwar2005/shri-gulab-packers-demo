import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useApiQuery } from '../../api/useApiQuery';
import { ErrorState, SkeletonGrid } from '../common/States';
import './ServicesSection.css';

const featuredServices = [
  {
    slug: 'household-shifting',
    title: 'Home Shifting',
    description: 'Safe and smooth household relocation.',
    image: 'https://images.pexels.com/photos/7464722/pexels-photo-7464722.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: 'Professional movers carefully carrying a sofa',
  },
  {
    slug: 'office-shifting',
    title: 'Office Shifting',
    description: 'Hassle-free office relocation with minimal downtime.',
    image: 'https://images.pexels.com/photos/6169056/pexels-photo-6169056.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: 'Office belongings packed and ready to move',
  },
  {
    slug: 'packing',
    title: 'Packing & Unpacking',
    description: 'High quality packing materials and professional team.',
    image: 'https://images.pexels.com/photos/4569340/pexels-photo-4569340.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: 'A mover packing household items into boxes',
  },
  {
    slug: 'vehicle-transportation',
    title: 'Vehicle Transportation',
    description: 'Car & bike transportation across India.',
    image: 'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: 'Transport trucks carrying vehicles along a highway',
  },
];

export default function ServicesSection() {
  const reduced = useReducedMotion();
  const query = useApiQuery(['services', 'published'], '/api/v1/services?isPublished=true');
  if (query.isPending) return <SkeletonGrid count={4} columns={4} />;
  if (query.isError) return <ErrorState message="Services could not be loaded." onRetry={query.refetch} />;
  const services = query.data || [];

  return (
    <section className="services-section">
      <div className="services-container">
        <header className="home-section-heading">
          <h2>Our Services</h2>
          <p>Complete relocation services for home, office and vehicles.</p>
        </header>

        <div className="service-cards">
          {featuredServices.map((featured, index) => {
            const service = services.find((item) => item.slug === featured.slug);
            return (
              <motion.article
                key={featured.slug}
                className="service-card"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={reduced ? false : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={reduced ? { duration: 0 } : { duration: 0.4, delay: index * 0.05 }}
                whileHover={reduced ? {} : { y: -4 }}
              >
                <Link to={`/services/${service?.slug || featured.slug}`} className="service-card-link">
                  <img
                    className="service-card-image"
                    src={featured.image}
                    alt={featured.imageAlt}
                    loading="lazy"
                  />
                  <div className="service-card-content">
                    <h3>{featured.title}</h3>
                    <p>{featured.description}</p>
                    <span className="service-card-cta">
                      Learn More <ArrowRight aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
