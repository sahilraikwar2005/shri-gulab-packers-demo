import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Globe, Clock, Package, Phone, Menu, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useSite } from '../../context/SiteContext';
import brandLogo from '../../assets/logo.jpg';
import './Navbar.css';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About Us' },
  { to: '/fleet', label: 'Our Fleet' },
  { to: '/locations', label: 'Service Locations' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/faq', label: 'FAQs' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const { settings } = useSite();
  const reduced = useReducedMotion();

  const phones = settings?.phones?.length ? settings.phones : (settings?.phone ? [settings.phone] : []);
  const primaryPhone = phones[0];
  const whatsapp = settings?.whatsapp;
  const logoSrc = settings?.logo || brandLogo;
  const companyName = settings?.companyName || 'Shri Gulab Packers & Movers';

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Utility bar */}
      <div className="site-utility-bar bg-navy-dark text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-9 flex items-center justify-between gap-3">
          <div className="hidden sm:flex items-center gap-5 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <Package className="w-3.5 h-3.5 text-orange flex-shrink-0" />
              <span>Safe Packaging</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-orange flex-shrink-0" />
              <span>On-Time Delivery</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <Globe className="w-3.5 h-3.5 text-orange flex-shrink-0" />
              <span>All India Service</span>
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 ml-auto whitespace-nowrap">
            {primaryPhone && (
              <a
                href={`tel:${primaryPhone}`}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm hover:text-orange focus:outline-none focus:ring-2 focus:ring-orange rounded"
                aria-label={`Call ${primaryPhone}`}
              >
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">{primaryPhone}</span>
                <span className="sm:hidden">Call</span>
              </a>
            )}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm hover:text-orange focus:outline-none focus:ring-2 focus:ring-orange rounded"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            )}
            <Link
              to="/quote"
              className="inline-flex items-center bg-orange text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded hover:bg-orange-dark focus:outline-none focus:ring-2 focus:ring-orange whitespace-nowrap"
            >
              Get Free Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 lg:h-[88px] flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center shrink-0" aria-label={companyName}>
            {!logoFailed ? (
              <img
                src={logoSrc}
                alt={companyName}
                className="h-12 sm:h-14 lg:h-[76px] w-auto max-w-[220px] object-contain"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span className="text-navy font-bold text-sm tracking-tight">{companyName}</span>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Primary">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative inline-flex items-center text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive ? 'text-orange' : 'text-navy hover:text-orange'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-orange" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 text-navy rounded focus:outline-none focus:ring-2 focus:ring-orange"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              className="lg:hidden overflow-hidden border-t border-gray-200 bg-white"
            >
              <nav className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex flex-col gap-1" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-2 text-sm font-medium whitespace-nowrap ${isActive ? 'text-orange' : 'text-navy'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                  {primaryPhone && (
                    <a href={`tel:${primaryPhone}`} className="inline-flex items-center gap-2 text-sm font-medium text-navy">
                      <Phone className="w-4 h-4 text-orange" />
                      {primaryPhone}
                    </a>
                  )}
                  {whatsapp && (
                    <a
                      href={`https://wa.me/${whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-navy"
                    >
                      <FaWhatsapp className="w-4 h-4 text-orange" aria-hidden="true" />
                      WhatsApp
                    </a>
                  )}
                  <Link
                    to="/quote"
                    onClick={() => setMenuOpen(false)}
                    className="mt-1 inline-flex justify-center bg-orange text-white text-sm font-semibold px-4 py-2 rounded"
                  >
                    Get Free Quote
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}