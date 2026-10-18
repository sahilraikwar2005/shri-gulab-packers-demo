import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Clock3, Package, Phone, Truck, Wallet } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import QuickQuoteInline from './QuickQuoteInline';
import defaultHeroImage from '../../assets/hero-movers.png';
import './Hero.css';

const features = [
  { icon: Package, label: 'Professional Packing' },
  { icon: Truck, label: 'Safe Transportation' },
  { icon: Clock3, label: 'On-Time Delivery' },
  { icon: Wallet, label: 'Affordable Pricing' },
];

export default function Hero() {
  const { settings } = useSite();
  const hero = settings?.hero || {};
  const reduced = useReducedMotion();
  const ctaLabel = hero.ctaText?.replace(/→\s*$/, '').trim() || 'Get Free Quote';
  const enter = (delay = 0) => reduced
    ? {}
    : {
      initial: { opacity: 0, y: 18 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.55, delay },
    };

  return (
    <section className="hero-section">
      <div className="hero-copy">
        <motion.div {...enter()} className="hero-copy-inner">
          <span className="hero-trust-badge">
            <BadgeCheck aria-hidden="true" />
            Trusted Packers &amp; Movers in Bhopal
          </span>

          <h1 className="hero-title">
            {hero.title ? hero.title : (
              <>
                Your Move,
                <span>Our Responsibility</span>
              </>
            )}
          </h1>
          <p className="hero-description">
            {hero.subtitle || 'Safe, reliable and hassle-free home, office and vehicle relocation services across India.'}
          </p>

          <div className="hero-features">
            {features.map(({ icon: Icon, label }, index) => (
              <motion.div key={label} {...enter(reduced ? 0 : index * 0.08)} className="hero-feature">
                <span className="hero-feature-icon">
                  <Icon aria-hidden="true" />
                </span>
                <span>{label}</span>
              </motion.div>
            ))}
          </div>

          <div className="hero-actions">
            <Link to="/quote" className="hero-button hero-button-primary">
              {ctaLabel}
              <ArrowRight aria-hidden="true" />
            </Link>
            <a
              href={`tel:${settings?.phone || '7694064778'}`}
              className="hero-button hero-button-secondary"
            >
              <Phone aria-hidden="true" />
              Call Now
            </a>
          </div>
        </motion.div>
      </div>

      <div className="hero-visual">
        <img
          src={hero.image || defaultHeroImage}
          alt="A professional mover carefully carrying a sofa through a bright home"
          className="hero-photo"
          fetchPriority="high"
        />
        <div className="hero-photo-wash" aria-hidden="true" />

        <motion.div
          {...enter(reduced ? 0 : 0.15)}
          className="hero-quote-card"
        >
          <h2>Get Your <span>Free Quote</span></h2>
          <p className="hero-quote-intro">Fill in a few details and we’ll get back to you with the best price.</p>
          <QuickQuoteInline />
        </motion.div>
      </div>
    </section>
  );
}
