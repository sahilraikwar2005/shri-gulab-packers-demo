import React from 'react';
import { Link } from 'react-router-dom';
import { Clock3, Mail, MapPin, Phone } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { useSite } from '../../context/SiteContext';
import brandLogo from '../../assets/logo.jpg';
import './Footer.css';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About Us', to: '/about' },
  { label: 'Our Fleet', to: '/fleet' },
  { label: 'Service Locations', to: '/locations' },
  { label: 'FAQs', to: '/faq' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Get a Quote', to: '/quote' },
];

const services = [
  { label: 'Home Shifting', to: '/services/household-shifting' },
  { label: 'Office Shifting', to: '/services/office-shifting' },
  { label: 'Packing & Unpacking', to: '/services/packing' },
  { label: 'Vehicle Transportation', to: '/services/vehicle-transportation' },
];

const socialNetworks = [
  { key: 'facebook', label: 'Facebook', Icon: FaFacebookF },
  { key: 'instagram', label: 'Instagram', Icon: FaInstagram },
  { key: 'youtube', label: 'YouTube', Icon: FaYoutube },
  { key: 'linkedin', label: 'LinkedIn', Icon: FaLinkedinIn },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  const { settings } = useSite();
  const phones = settings?.phones?.length ? settings.phones : settings?.phone ? [settings.phone] : [];
  const logoSrc = settings?.logo || brandLogo;
  const companyName = settings?.companyName || 'Shri Gulab Packers & Movers';
  const socialLinks = [
    ...socialNetworks
      .filter(({ key }) => settings?.socialLinks?.[key])
      .map((network) => ({
        ...network,
        href: settings.socialLinks[network.key],
        external: true,
      })),
    ...(settings?.whatsapp
      ? [{
        key: 'whatsapp',
        label: 'WhatsApp',
        Icon: FaWhatsapp,
        href: `https://wa.me/${settings.whatsapp}`,
        external: true,
      }]
      : []),
    ...(settings?.email
      ? [{
        key: 'email',
        label: 'Email',
        Icon: Mail,
        href: `mailto:${settings.email}`,
        external: false,
      }]
      : []),
  ];

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <section className="footer-brand">
          <Link to="/" className="footer-logo-link" aria-label={`${companyName} home`}>
            <img className="footer-logo" src={logoSrc} alt={companyName} />
          </Link>
          <p>{settings?.footerText || 'Your trusted partner for home, office and vehicle relocation. Safe, reliable and hassle-free moving across India.'}</p>
          {socialLinks.length > 0 && (
            <nav className="footer-socials" aria-label="Social media">
              {socialLinks.map(({ key, label, Icon, href, external }) => (
                <a
                  key={key}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                  aria-label={label}
                  title={label}
                >
                  <Icon aria-hidden="true" />
                </a>
              ))}
            </nav>
          )}
        </section>

        <nav className="footer-column" aria-label="Quick links">
          <h2>Quick Links</h2>
          <ul>
            {quickLinks.map(({ label, to }) => (
              <li key={to}><Link to={to}>{label}</Link></li>
            ))}
          </ul>
        </nav>

        <nav className="footer-column" aria-label="Moving services">
          <h2>Our Services</h2>
          <ul>
            {services.map(({ label, to }) => (
              <li key={to}><Link to={to}>{label}</Link></li>
            ))}
            <li><Link to="/services">Local Shifting</Link></li>
            <li><Link to="/services">Outstation Shifting</Link></li>
          </ul>
        </nav>

        <section className="footer-column footer-contact">
          <h2>Contact Us</h2>
          <ul>
            {settings?.officeAddress && (
              <li><MapPin aria-hidden="true" /><span>{settings.officeAddress}</span></li>
            )}
            {phones.map((phone) => (
              <li key={phone}><Phone aria-hidden="true" /><a href={`tel:${phone}`}>{phone}</a></li>
            ))}
            {settings?.whatsapp && (
              <li><FaWhatsapp aria-hidden="true" /><a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a></li>
            )}
            {settings?.email && (
              <li><Mail aria-hidden="true" /><a href={`mailto:${settings.email}`}>{settings.email}</a></li>
            )}
            {settings?.workingHours && (
              <li><Clock3 aria-hidden="true" /><span>{settings.workingHours}</span></li>
            )}
          </ul>
        </section>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} {companyName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
