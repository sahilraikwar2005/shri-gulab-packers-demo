import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Clock3,
  Eye,
  Gem,
  MapPin,
  Quote,
  Target,
  Truck,
  Users,
} from 'lucide-react';
import heroMoversImage from '../assets/hero-movers.png';
import './About.css';

const principles = [
  { title: 'Mission', description: 'Hassle-free relocations.', Icon: Target },
  { title: 'Vision', description: "India's trusted mover.", Icon: Eye },
  { title: 'Values', description: 'Trust & transparency.', Icon: Gem },
];

const statistics = [
  { value: '5,000+', label: 'Happy Customers', Icon: Users },
  { value: '21+', label: 'Years Experience', Icon: Clock3 },
  { value: '100+', label: 'Cities Served', Icon: MapPin },
];

const benefits = [
  'Careful handling of your belongings',
  'Quality packing materials',
  'Punctual service and delivery',
  'Clear, transparent pricing',
  'Responsive customer support',
  'Local and all-India relocation services',
];

export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <img className="about-hero-image" src={heroMoversImage} alt="" fetchPriority="high" />
        <div className="about-container about-hero-inner">
          <div className="about-hero-copy">
            <p className="about-eyebrow"><span /> ABOUT US</p>
            <h1>About Shri Gulab <span>Packers &amp; Movers</span></h1>
            <p className="about-hero-description">
              Shri Gulab Packers &amp; Movers provides packing, loading, unloading, and relocation services from Bhopal.
              We focus on careful handling, punctual service, and responsive customer support to make every move
              simpler and stress-free.
            </p>
          </div>

          <div className="about-principles" aria-label="Our mission, vision, and values">
            {principles.map(({ title, description, Icon }) => (
              <article className="about-principle-card" key={title}>
                <span className="about-icon-circle"><Icon aria-hidden="true" /></span>
                <span className="about-principle-copy">
                  <strong>{title}</strong>
                  <span>{description}</span>
                </span>
              </article>
            ))}
          </div>

          <div className="about-stats" aria-label="Company highlights">
            {statistics.map(({ value, label, Icon }) => (
              <div className="about-stat" key={label}>
                <Icon aria-hidden="true" />
                <span className="about-stat-copy">
                  <strong>{value}</strong>
                  <span>{label}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-why" aria-labelledby="about-why-title">
        <div className="about-container about-why-panel">
          <div className="about-team-photo">
            <img
              src="https://images.pexels.com/photos/7464722/pexels-photo-7464722.jpeg?auto=compress&cs=tinysrgb&w=1000"
              alt="Professional movers carefully protecting furniture during a home relocation"
              loading="lazy"
            />
            <div className="about-photo-badge">
              <span><Truck aria-hidden="true" /></span>
              <strong>Reliable Packing,<br />Moving &amp; Storage Solutions</strong>
            </div>
          </div>

          <div className="about-benefits">
            <p className="about-eyebrow"><span /> WHY CHOOSE US</p>
            <h2 id="about-why-title">Your Trusted Moving Partner in Bhopal and Beyond</h2>
            <ul>
              {benefits.map((benefit) => (
                <li key={benefit}><Check aria-hidden="true" /><span>{benefit}</span></li>
              ))}
            </ul>
          </div>

          <aside className="about-commitment">
            <Quote className="about-quote-icon" aria-hidden="true" />
            <p className="about-eyebrow"><span /> OUR COMMITMENT</p>
            <h2>We Move Your World, Carefully</h2>
            <p className="about-commitment-description">
              Every move matters. We take care when handling your belongings and support you throughout your relocation.
            </p>
            <Link className="about-quote-button" to="/quote">
              Get a Free Quote <ArrowRight aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
