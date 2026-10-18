import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardCheck,
  Package,
  Phone,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import './PackingService.css';

const packingPhotos = {
  hero: `${import.meta.env.BASE_URL}assets/packing/packing-hero.jpg`,
  assessment: `${import.meta.env.BASE_URL}assets/packing/packing-assessment.jpg`,
  quality: `${import.meta.env.BASE_URL}assets/packing/packing-quality.jpg`,
  labeling: `${import.meta.env.BASE_URL}assets/packing/packing-labeling.jpg`,
  care: `${import.meta.env.BASE_URL}assets/packing/packing-care.jpg`,
  transit: `${import.meta.env.BASE_URL}assets/packing/packing-transit.jpg`,
  cta: `${import.meta.env.BASE_URL}assets/packing/packing-cta.jpg`,
};

const steps = [
  {
    title: 'Assessment',
    description: 'We review your items and understand your packing requirements.',
    image: packingPhotos.assessment,
    alt: 'Mover assessing household belongings before packing',
  },
  {
    title: 'Quality Packing',
    description: 'Items are prepared with suitable packing materials and care.',
    image: packingPhotos.quality,
    alt: 'Mover carefully wrapping a sofa for relocation',
  },
  {
    title: 'Labeling',
    description: 'Boxes are labeled to help identify their contents.',
    image: packingPhotos.labeling,
    alt: 'Mover labeling a packed household box',
  },
  {
    title: 'Ready for Transit',
    description: 'Packed belongings are prepared for loading and transport.',
    image: packingPhotos.transit,
    alt: 'Movers loading wrapped furniture and packed boxes into a truck',
  },
];

const materials = [
  { type: 'bubble', title: 'Bubble Wrap', description: 'Cushioning for delicate items.' },
  { type: 'boxes', title: 'Corrugated Boxes', description: 'Sturdy packing for everyday items.' },
  { type: 'tape', title: 'Packing Tape', description: 'Helps keep cartons securely closed.' },
  { type: 'foam', title: 'Foam Sheets', description: 'A soft layer between fragile pieces.' },
  { type: 'stretch', title: 'Stretch Film', description: 'Helps protect furniture surfaces.' },
  { type: 'kraft', title: 'Kraft Paper', description: 'Flexible wrapping for household items.' },
];

const packingBenefits = [
  'High-quality packing materials',
  'Trained and professional packing team',
  'Special care for fragile and valuable items',
  'A safe and systematic packing process',
  'Clear labeling to help identify boxes',
  'Packing options for home, office and commercial items',
];

const comparisons = [
  { type: 'television', title: 'Television' },
  { type: 'sofa', title: 'Sofa' },
  { type: 'table', title: 'Dining table' },
];

const questions = [
  {
    question: 'What packing materials do you use?',
    answer: 'Packing needs vary by item. Options include bubble wrap, corrugated boxes, packing tape, foam sheets, stretch film and kraft paper.',
  },
  {
    question: 'Do you pack fragile items like glass or electronics?',
    answer: 'Share details about fragile or valuable belongings when requesting your quote so the packing requirements can be discussed.',
  },
  {
    question: 'Can you pack only selected items?',
    answer: 'Tell us which belongings need packing. We can discuss the requested scope and include it in your quotation.',
  },
  {
    question: 'How long does the packing process take?',
    answer: 'Packing time depends on the number and type of items, access at the property and the packing requirements. We can discuss an estimate after learning about your move.',
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

function MaterialIllustration({ type, label }) {
  return (
    <svg className={`packing-material-art packing-material-art-${type}`} viewBox="0 0 160 112" role="img" aria-label={label}>
      <ellipse cx="80" cy="98" rx="53" ry="8" fill="#d9e1e7" opacity=".55" />
      {type === 'bubble' && (
        <g>
          <path d="M36 33c0-9 7-16 16-16h55c9 0 16 7 16 16v44c0 9-7 16-16 16H52c-9 0-16-7-16-16z" fill="#e7f4f8" stroke="#b3d2dc" strokeWidth="2" />
          <path d="M40 34h80M40 44h80M40 54h80M40 64h80M40 74h80M40 84h80" stroke="#c6e3e9" strokeWidth="3" />
          <path d="M52 20v71M65 20v71M78 20v71M91 20v71M104 20v71M117 20v71" stroke="#d4ebef" strokeWidth="2" />
          {[0, 1, 2, 3, 4, 5].map((row) => [0, 1, 2, 3, 4].map((column) => (
            <circle key={`${row}-${column}`} cx={50 + column * 15} cy={34 + row * 10} r="3" fill="#f8ffff" stroke="#acd0db" />
          )))}
          <path d="M45 29c4-8 10-12 18-12h40" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
      {type === 'boxes' && (
        <g stroke="#a66b3c" strokeLinejoin="round" strokeWidth="2">
          <path d="M36 47 80 29l44 18-44 20z" fill="#d99c61" />
          <path d="M36 47v37l44 20V67z" fill="#c8874d" />
          <path d="M124 47v37l-44 20V67z" fill="#e5aa6f" />
          <path d="m36 47 22-9 44 20-22 9z" fill="#efbf87" />
          <path d="m80 67 22-9v30l-22 10z" fill="#f2cc9e" />
          <path d="m58 38 22-9 44 18-22 11z" fill="#e4aa70" />
          <path d="m69 34 22-9 34 14-22 11z" fill="#f0c28f" />
          <path d="m69 34 22-9v18l-11 5z" fill="#d99c61" />
        </g>
      )}
      {type === 'tape' && (
        <g>
          <path d="M46 33c0-10 15-18 34-18s34 8 34 18v43c0 10-15 18-34 18s-34-8-34-18z" fill="#d9b681" stroke="#b8915d" strokeWidth="2" />
          <ellipse cx="80" cy="33" rx="34" ry="18" fill="#f0d6a9" stroke="#b8915d" strokeWidth="2" />
          <ellipse cx="80" cy="33" rx="15" ry="8" fill="#fff8e9" stroke="#b8915d" strokeWidth="2" />
          <path d="M98 44c18 1 28 12 25 24l-32 4c-8 1-14-5-13-12 1-8 9-16 20-16z" fill="#e8c995" stroke="#b8915d" strokeWidth="2" />
          <path d="m112 65 21 12-34 6-14-11" fill="#f1d9ae" stroke="#b8915d" strokeWidth="2" />
        </g>
      )}
      {type === 'foam' && (
        <g stroke="#cbd3d8" strokeWidth="1.5">
          <path d="m34 67 68-29 27 11-68 30z" fill="#fbfcfc" />
          <path d="m34 67 27 12v12L34 79z" fill="#e4e9eb" />
          <path d="m61 79 68-30v12L61 92z" fill="#f2f5f6" />
          <path d="m34 52 68-29 27 11-68 30z" fill="#fff" />
          <path d="m34 52 27 12v12L34 64z" fill="#e7ecee" />
          <path d="m61 64 68-30v12L61 76z" fill="#f7f9fa" />
          <path d="m34 37 68-29 27 11-68 30z" fill="#fff" />
          <path d="m34 37 27 12v12L34 49z" fill="#eef1f2" />
          <path d="m61 49 68-30v12L61 61z" fill="#f9fbfb" />
        </g>
      )}
      {type === 'stretch' && (
        <g>
          <path d="M54 25h45c8 0 14 6 14 14v49c0 5-4 9-9 9H59c-5 0-9-4-9-9V31c0-3 1-6 4-6z" fill="#e8f2f4" stroke="#a8c3cb" strokeWidth="2" />
          <path d="M59 29h43v64H59z" fill="#f8fcfc" stroke="#c5dadd" strokeWidth="2" />
          <path d="M58 37h45M58 47h45M58 57h45M58 67h45M58 77h45M58 87h45" stroke="#d2e5e8" strokeWidth="3" />
          <ellipse cx="80" cy="27" rx="23" ry="8" fill="#f9ffff" stroke="#abc8ce" strokeWidth="2" />
          <ellipse cx="80" cy="27" rx="8" ry="3" fill="#dbe8ea" stroke="#abc8ce" strokeWidth="1.5" />
          <path d="m99 37 22-12v50c0 6-3 10-8 12l-14 7z" fill="#fff" opacity=".7" />
        </g>
      )}
      {type === 'kraft' && (
        <g>
          <path d="M43 41h41v38c0 8-9 14-20 14s-21-6-21-14z" fill="#c99868" stroke="#a77548" strokeWidth="2" />
          <ellipse cx="63.5" cy="41" rx="20.5" ry="11" fill="#dfb486" stroke="#a77548" strokeWidth="2" />
          <ellipse cx="63.5" cy="41" rx="8" ry="4.5" fill="#f7e5cf" stroke="#a77548" strokeWidth="2" />
          <path d="M80 57h39v31c0 7-9 12-20 12S80 95 80 88z" fill="#b98152" stroke="#96633c" strokeWidth="2" />
          <ellipse cx="99.5" cy="57" rx="19.5" ry="10" fill="#d7a477" stroke="#96633c" strokeWidth="2" />
          <ellipse cx="99.5" cy="57" rx="7.5" ry="4" fill="#f4e1c9" stroke="#96633c" strokeWidth="2" />
          <path d="M81 57c1 4 9 8 19 8s18-4 19-8" fill="none" stroke="#efc79f" strokeWidth="2" />
        </g>
      )}
    </svg>
  );
}

function ComparisonIllustration({ type, protectedItem, title }) {
  const patternId = `packing-film-${type}-${protectedItem ? 'after' : 'before'}`;
  const screenId = `packing-screen-${type}-${protectedItem ? 'after' : 'before'}`;

  return (
    <svg className="packing-comparison-art" viewBox="0 0 320 190" role="img" aria-label={`${title} ${protectedItem ? 'packed for moving' : 'before packing'}`}>
      <defs>
        <linearGradient id={screenId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#344b60" />
          <stop offset="1" stopColor="#101a25" />
        </linearGradient>
        <pattern id={patternId} width="13" height="13" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2" fill="#fff" opacity=".68" />
          <circle cx="10" cy="10" r="2" fill="#fff" opacity=".68" />
          <path d="M0 6.5h13M6.5 0v13" stroke="#fff" strokeOpacity=".18" />
        </pattern>
      </defs>
      <rect width="320" height="190" fill="#f5f2ed" />
      <rect x="0" y="0" width="320" height="133" fill="#f8f7f3" />
      <rect x="20" y="18" width="76" height="61" rx="4" fill="#e5f0f1" />
      <path d="M58 18v61M20 48h76" stroke="#fff" strokeWidth="5" />
      <path d="M0 134h320v56H0z" fill="#dfd5c8" />
      <path d="M34 157c52-18 185-18 253 0v20H34z" fill="#e9e1d7" />
      <path d="M271 85v47m0-47c0-11-7-17-14-17m14 20c7-12 16-14 21-12m-21 26c-7-9-15-10-21-7" fill="none" stroke="#718a65" strokeWidth="4" strokeLinecap="round" />
      <path d="M250 127h44l-6 14h-32z" fill="#bf8d62" />
      {type === 'television' && (
        <g>
          <rect x="106" y="48" width="137" height="76" rx="8" fill={protectedItem ? '#e9eff0' : '#222d39'} stroke={protectedItem ? '#9cacb3' : '#111a22'} strokeWidth="4" />
          <rect x="114" y="56" width="121" height="58" rx="4" fill={protectedItem ? `url(#${patternId})` : `url(#${screenId})`} />
          {!protectedItem && <path d="M129 56h50l-48 58h-17v-28z" fill="#536576" opacity=".72" />}
          <path d="M158 124v12m-27 0h54" stroke="#69737a" strokeWidth="5" strokeLinecap="round" />
          {protectedItem && <path d="M109 78h131m-65-27v68" stroke="#e3a25e" strokeWidth="5" opacity=".9" />}
        </g>
      )}
      {type === 'sofa' && (
        <g>
          <path d="M98 91c0-13 10-23 23-23h85c13 0 23 10 23 23v34H98z" fill={protectedItem ? '#dce5e7' : '#c8b7a4'} stroke="#806f5e" strokeWidth="4" />
          <path d="M87 91c0-9 6-15 14-15s14 6 14 15v42H87zm125 0c0-9 6-15 14-15s14 6 14 15v42h-28z" fill={protectedItem ? '#eaf0f1' : '#d9c9b7'} stroke="#806f5e" strokeWidth="4" />
          <path d="M110 90h56v35h-56zm61 0h37v35h-37z" fill={protectedItem ? '#e5edef' : '#d6c6b5'} stroke="#aa9784" strokeWidth="2" />
          <path d="M99 125h131v14H99zm14 14-3 18m105-18 3 18" fill="none" stroke="#705b48" strokeWidth="5" strokeLinecap="round" />
          {protectedItem && <path d="M91 95c21 12 36 23 52 37 16-13 30-27 50-43m-99 40c36-15 84-22 142-19m-136 1 116 25" fill="none" stroke="#fff" strokeWidth="3" opacity=".8" />}
        </g>
      )}
      {type === 'table' && (
        <g>
          <path d="m104 84 110-18 47 20-110 20z" fill={protectedItem ? '#e6ecee' : '#a8784d'} stroke="#70563f" strokeWidth="4" />
          <path d="m151 106-3 47m74-67 1 65m-1-63-14 6" fill="none" stroke="#70563f" strokeWidth="7" strokeLinecap="round" />
          <path d="m105 85 111-18 37 15-111 21z" fill={protectedItem ? `url(#${patternId})` : '#c18d5d'} opacity=".92" />
          {!protectedItem && (
            <g fill="#f0e5d7">
              <circle cx="145" cy="56" r="11" />
              <circle cx="205" cy="44" r="11" />
              <path d="M142 67h6v11h-6zm60-11h6v11h-6z" />
            </g>
          )}
          {protectedItem && <path d="m114 84 1 16m40-23 1 20m43-27 1 20m39-13 1 17" stroke="#e3a25e" strokeWidth="4" />}
        </g>
      )}
      {protectedItem && (
        <rect
          x={type === 'television' ? 112 : 92}
          y={type === 'television' ? 53 : 64}
          width={type === 'television' ? 125 : 147}
          height={type === 'television' ? 65 : 66}
          rx="6"
          fill={`url(#${patternId})`}
          opacity=".44"
          pointerEvents="none"
        />
      )}
    </svg>
  );
}

export default function PackingService() {
  const { settings } = useSite();
  const [openQuestion, setOpenQuestion] = useState(null);
  const phone = settings?.phones?.[0] || settings?.phone;
  const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : undefined;

  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription = document.querySelector('meta[name="description"]')?.content;
    const description = 'Professional packing services in Bhopal, with suitable materials, careful handling and organized preparation for your move.';
    const { meta, created } = setDescription(description);
    document.title = 'Professional Packing Services in Bhopal | Shri Gulab Packers & Movers';

    return () => {
      document.title = previousTitle;
      if (created) meta.remove();
      else if (previousDescription !== undefined) meta.content = previousDescription;
    };
  }, []);

  return (
    <main className="packing-page">
      <section className="packing-hero">
        <img className="packing-hero-image" src={packingPhotos.hero} alt="" fetchPriority="high" />
        <div className="packing-hero-shade" />
        <div className="packing-shell packing-hero-content">
          <nav className="packing-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span aria-hidden="true">›</span>
            <Link to="/services">Services</Link><span aria-hidden="true">›</span>
            <span aria-current="page">Packing</span>
          </nav>

          <div className="packing-hero-copy">
            <p className="packing-eyebrow"><span /> PACKING SERVICE</p>
            <h1>Professional Packing <span>Services in Bhopal</span></h1>
            <p className="packing-hero-description">
              We use quality packing materials and careful techniques to prepare your belongings for a move.
              From fragile items to furniture, each item is packed with attention.
            </p>
            <div className="packing-hero-actions">
              <Link className="packing-button packing-button-primary" to="/quote">Get Free Quote <ArrowRight aria-hidden="true" /></Link>
              {phoneHref && (
                <a className="packing-button packing-button-outline" href={phoneHref}>
                  <Phone aria-hidden="true" /> Call Now
                </a>
              )}
            </div>
            <ul className="packing-highlights" aria-label="Packing service benefits">
              <li><Package aria-hidden="true" /><span>High-Quality<br />Packing Materials</span></li>
              <li><Users aria-hidden="true" /><span>Trained &amp; Experienced<br />Team</span></li>
              <li><ShieldCheck aria-hidden="true" /><span>Safe &amp; Secure<br />Handling</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="packing-section packing-process-section">
        <div className="packing-shell">
          <header className="packing-section-heading">
            <p className="packing-eyebrow"><span /> HOW WE PACK</p>
            <h2>Our Packing Process</h2>
            <p>A simple and systematic process to prepare your belongings for the move.</p>
          </header>
          <ol className="packing-process-grid">
            {steps.map(({ title, description, image, alt }, index) => (
              <li className="packing-process-card" key={title}>
                <div className="packing-process-photo">
                  <img src={image} alt={alt} loading="lazy" />
                  <span className="packing-step-number">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                {index < steps.length - 1 && <ArrowRight className="packing-process-arrow" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="packing-section packing-materials-section">
        <div className="packing-shell">
          <header className="packing-section-heading">
            <p className="packing-eyebrow"><span /> PACKING SUPPLIES</p>
            <h2>Packing Materials We Use</h2>
            <p>Suitable materials help prepare different household items for a move.</p>
          </header>
          <div className="packing-material-grid">
            {materials.map(({ type, title, description }) => (
              <article className="packing-material-card" key={title}>
                <div className="packing-material-picture">
                  <MaterialIllustration type={type} label={title} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="packing-section packing-care-section">
        <div className="packing-shell packing-care-grid">
          <figure className="packing-care-photo">
            <img src={packingPhotos.care} alt="Movers carefully handling a sofa during a household move" loading="lazy" />
            <figcaption><span><Package aria-hidden="true" /></span><strong>Careful Packing<br />for a Safer Move</strong></figcaption>
          </figure>
          <div className="packing-benefit-panel">
            <p className="packing-eyebrow"><span /> CARE IN EVERY BOX</p>
            <h2>Why Choose Our Packing Service?</h2>
            <ul>
              {packingBenefits.map((benefit) => (
                <li key={benefit}><span><Check aria-hidden="true" /></span>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="packing-section packing-comparison-section">
        <div className="packing-shell">
          <header className="packing-section-heading packing-comparison-heading">
            <p className="packing-eyebrow"><span /> CAREFUL PREPARATION</p>
            <h2>Before &amp; After Packing</h2>
            <p>See how suitable wrapping can help prepare household belongings for a move.</p>
          </header>
          <div className="packing-comparison-grid">
            {comparisons.map(({ type, title }) => (
              <article className="packing-comparison-card" key={type}>
                <h3>{title}</h3>
                <div className="packing-comparison-pair">
                  {[false, true].map((protectedItem) => (
                    <figure key={protectedItem ? 'after' : 'before'}>
                      <ComparisonIllustration type={type} protectedItem={protectedItem} title={title} />
                      <figcaption className={protectedItem ? 'packing-label-after' : 'packing-label-before'}>
                        {protectedItem ? 'After' : 'Before'}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="packing-section packing-faq-cta-section">
        <div className="packing-shell packing-faq-cta-grid">
          <div className="packing-faq">
            <header className="packing-section-heading">
              <p className="packing-eyebrow"><span /> COMMON QUESTIONS</p>
              <h2>Frequently Asked Questions</h2>
              <p>Helpful details about our packing service.</p>
            </header>
            <div className="packing-faq-list">
              {questions.map(({ question, answer }, index) => {
                const isOpen = openQuestion === index;
                const answerId = `packing-faq-answer-${index}`;
                return (
                  <article className="packing-faq-item" key={question}>
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

          <aside className="packing-final-cta">
            <img src={packingPhotos.cta} alt="Packed moving boxes and protected furniture ready for a move" loading="lazy" />
            <div className="packing-final-cta-shade" />
            <div className="packing-final-cta-content">
              <p className="packing-eyebrow"><span /> GET YOUR FREE QUOTE</p>
              <h2>Need Professional Packing Service?</h2>
              <p>Tell us about your move and packing needs to request a quotation.</p>
              <Link className="packing-button packing-button-primary" to="/quote">Get Free Quote <ArrowRight aria-hidden="true" /></Link>
              <div className="packing-cta-note"><ClipboardCheck aria-hidden="true" /> Packing plans tailored to your move</div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
