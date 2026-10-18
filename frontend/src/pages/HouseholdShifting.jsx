import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Armchair,
  Check,
  ChevronDown,
  ClipboardList,
  FileText,
  Headset,
  House,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  ShieldCheck,
  Truck,
  Users,
  Wallet,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import householdHandlingImage from '../assets/hero-movers.png';
import movingBoxesImage from '../assets/navbar-moving-boxes.png';
import './HouseholdShifting.css';

const services = [
  { icon: Package, title: 'Packing & Unpacking', description: 'Quality packing materials to help keep your belongings safe.' },
  { icon: Armchair, title: 'Furniture Shifting', description: 'Careful handling and safe transportation of your furniture.' },
  { icon: Truck, title: 'Loading & Unloading', description: 'A trained team for organized loading and unloading.' },
  { icon: House, title: 'Local Home Shifting', description: 'Reliable shifting within Bhopal and nearby locations.' },
  { icon: MapPin, title: 'Outstation Relocation', description: 'Planned household moves to destinations across India.' },
];

const steps = [
  { icon: FileText, title: 'Share Your Details', description: 'Tell us about your move and household requirements.' },
  { icon: ClipboardList, title: 'Get a Quotation', description: 'Receive a clear quotation for the services you need.' },
  { icon: PackageCheck, title: 'Packing & Loading', description: 'Our team prepares and loads your belongings with care.' },
  { icon: Truck, title: 'Transportation & Delivery', description: 'Your household goods are transported to your new home.' },
];

const benefits = [
  { icon: ShieldCheck, title: 'Careful Handling', description: 'We treat your belongings with care throughout the move.' },
  { icon: Users, title: 'Professional Team', description: 'Experienced moving staff support your household relocation.' },
  { icon: Wallet, title: 'Transparent Quotations', description: 'Understand the services and costs before you book.' },
  { icon: Headset, title: 'Relocation Support', description: 'Get assistance as you plan and complete your move.' },
];

const questions = [
  {
    question: 'What factors affect household shifting charges?',
    answer: 'The quotation depends on the distance, size of your household, packing requirements, access at each location and any additional services requested.',
  },
  {
    question: 'Do you provide packing materials?',
    answer: 'Packing materials can be included as part of the packing service. Share your requirements so they can be included in your quotation.',
  },
  {
    question: 'How early should I book my home shifting service?',
    answer: 'Contact us as soon as your moving date is known. This gives time to discuss your requirements and plan the move.',
  },
  {
    question: 'Can you handle fragile items like glass, electronics or antiques?',
    answer: 'Tell us about fragile or special-care items before the move so packing and handling requirements can be discussed.',
  },
  {
    question: 'Do you provide outstation household shifting services?',
    answer: 'Yes. We handle household relocation between cities. Share your pickup and destination cities to request a quotation.',
  },
  {
    question: 'How long does it take to complete the shifting process?',
    answer: 'Timing depends on the distance, inventory and move requirements. The team can discuss an estimated schedule when preparing your quotation.',
  },
];

function setDescription(content) {
  let meta = document.querySelector('meta[name="description"]');
  const created = !meta;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = content;
  return { meta, created };
}

export default function HouseholdShifting() {
  const { settings } = useSite();
  const [openQuestion, setOpenQuestion] = useState(null);
  const phone = settings?.phones?.[0] || settings?.phone;
  const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : undefined;

  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription = document.querySelector('meta[name="description"]')?.content;
    const description = 'Reliable household shifting services in Bhopal, including careful packing, furniture handling, local moves and outstation relocation.';
    const { meta, created } = setDescription(description);
    document.title = 'Household Shifting Services in Bhopal | Shri Gulab Packers & Movers';

    return () => {
      document.title = previousTitle;
      if (created) meta.remove();
      else if (previousDescription !== undefined) meta.content = previousDescription;
    };
  }, []);

  return (
    <div className="household-page">
      <section className="household-hero">
        <div className="household-hero-inner">
          <nav className="household-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span aria-hidden="true">›</span>
            <Link to="/services">Services</Link><span aria-hidden="true">›</span>
            <span aria-current="page">Household Shifting</span>
          </nav>

          <div className="household-hero-copy">
            <p className="household-eyebrow"><span /> SAFE • SECURE • STRESS-FREE</p>
            <h1>Household Shifting <span>Services in Bhopal</span></h1>
            <p className="household-hero-description">
              Make your next move simple and stress-free with reliable household relocation.
              From careful packing to safe delivery, we handle your belongings with care.
            </p>
            <div className="household-hero-actions">
              <Link className="household-button household-button-primary" to="/quote">Get Free Quote <ArrowRight aria-hidden="true" /></Link>
              {phoneHref && <a className="household-button household-button-outline" href={phoneHref}><Phone aria-hidden="true" /> Call Now</a>}
            </div>
            <div className="household-hero-highlights">
              <div><ShieldCheck aria-hidden="true" /><span><b>Safe Handling</b><small>Your belongings, our care</small></span></div>
              <div><Users aria-hidden="true" /><span><b>Experienced Team</b><small>Skilled &amp; professional</small></span></div>
              <div><Package aria-hidden="true" /><span><b>End-to-End Support</b><small>Packing to delivery</small></span></div>
            </div>
          </div>

          <div className="household-hero-image">
            <img
              src="https://images.pexels.com/photos/7464722/pexels-photo-7464722.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt="Movers carefully carrying a sofa during a household relocation"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      <section className="household-services household-section">
        <div className="household-container">
          <header className="household-section-heading">
            <p className="household-eyebrow"><span /> OUR HOUSEHOLD SHIFTING SERVICES</p>
            <h2>Complete Home Relocation Solutions</h2>
            <p>We provide end-to-end household shifting services to make your move smooth, safe and hassle-free.</p>
          </header>
          <div className="household-service-grid">
            {services.map(({ icon: Icon, title, description }) => (
              <article className="household-service-card" key={title}>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="household-process household-section">
        <div className="household-container">
          <header className="household-section-heading">
            <p className="household-eyebrow"><span /> HOW OUR SHIFTING PROCESS WORKS</p>
            <h2>A Simple &amp; Transparent Process</h2>
            <p>We follow a structured process to help make your move smooth and hassle-free.</p>
          </header>
          <ol className="household-process-grid">
            {steps.map(({ icon: Icon, title, description }, index) => (
              <li className="household-process-step" key={title}>
                <div className="household-process-marker">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span className="household-process-icon"><Icon aria-hidden="true" /></span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="household-trust">
        <div className="household-trust-image">
          <img
            src={householdHandlingImage}
            alt="Moving team carefully protecting furniture with wrapping before transport"
            loading="lazy"
          />
        </div>
        <div className="household-trust-content">
          <p className="household-eyebrow"><span /> WHY CHOOSE SHRI GULAB PACKERS &amp; MOVERS?</p>
          <h2>Your Trusted Moving Partner</h2>
          <p className="household-trust-intro">
            We focus on safety, reliability and helpful support to make your household shifting experience smooth and worry-free.
          </p>
          <div className="household-benefits">
            {benefits.map(({ icon: Icon, title, description }) => (
              <article className="household-benefit" key={title}>
                <span><Icon aria-hidden="true" /></span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="household-faq-cta household-section">
        <div className="household-container household-faq-cta-grid">
          <div className="household-faq">
            <header className="household-section-heading">
              <p className="household-eyebrow"><span /> FREQUENTLY ASKED QUESTIONS</p>
              <h2>Household Shifting FAQs</h2>
              <p>Get answers to some common questions about our household shifting services.</p>
            </header>
            <div className="household-faq-list">
              {questions.map(({ question, answer }, index) => {
                const isOpen = openQuestion === index;
                const answerId = `household-faq-answer-${index}`;
                return (
                  <article className="household-faq-item" key={question}>
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        onClick={() => setOpenQuestion(isOpen ? null : index)}
                      >
                        <span>{question}</span><ChevronDown aria-hidden="true" />
                      </button>
                    </h3>
                    {isOpen && <p id={answerId}>{answer}</p>}
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="household-final-cta">
            <div className="household-final-cta-copy">
              <p className="household-eyebrow"><span /> READY TO MOVE?</p>
              <h2>Get a Free Quote Today!</h2>
              <p>Fill in your details and get a customized quotation for your household shifting requirements.</p>
              <Link className="household-button household-button-primary" to="/quote">Get Free Quote <ArrowRight aria-hidden="true" /></Link>
              <div className="household-cta-notes">
                <span><Check aria-hidden="true" /> Safe &amp; Secure Packing</span>
                <span><Truck aria-hidden="true" /> On-Time Delivery</span>
                <span><MapPin aria-hidden="true" /> All India Service</span>
              </div>
            </div>
            <img
              src={movingBoxesImage}
              alt="Neatly arranged household moving boxes and protected furniture"
              loading="lazy"
            />
          </aside>
        </div>
      </section>
    </div>
  );
}
