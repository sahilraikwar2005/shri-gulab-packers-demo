import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/settings', label: 'Company Settings' },
  { to: '/homepage', label: 'Homepage' },
  { to: '/services', label: 'Services' },
  { to: '/locations', label: 'Locations' },
  { to: '/fleet', label: 'Fleet' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/faqs', label: 'FAQs' },
  { to: '/seo', label: 'SEO' },
  { to: '/inquiries', label: 'Inquiries' },
  { to: '/quotations', label: 'Quotations' },
  { to: '/bookings', label: 'Bookings' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/reviews', label: 'Google Reviews' },
  { to: '/users', label: 'Admin Users' },
  { to: '/activity', label: 'Activity Logs' },
  { to: '/reports', label: 'Reports' },
];

export default function Sidebar({ open = false, onNavigate = () => {}, onClose = () => {} }) {
  return (
    <aside
      id="admin-navigation"
      className={`admin-sidebar${open ? ' admin-sidebar-open' : ''}`}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose();
      }}
    >
      <div className="flex items-center justify-between text-xl font-bold text-orange mb-6">
        <span>Shri Gulab Admin</span>
        <button type="button" className="admin-sidebar-close" onClick={onClose} aria-label="Close navigation">
          <X aria-hidden="true" />
        </button>
      </div>
      <nav className="space-y-1" aria-label="Admin navigation">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={onNavigate} className={({ isActive }) => `block px-3 py-2 rounded transition-colors ${isActive ? 'bg-orange' : 'hover:bg-navy-light'}`}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}