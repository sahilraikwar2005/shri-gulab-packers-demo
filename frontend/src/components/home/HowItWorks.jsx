import React, { useEffect } from 'react';
import {
  ArrowRight,
  Calculator,
  Check,
  ClipboardList,
  FileText,
  IndianRupee,
  Package,
  Truck,
} from 'lucide-react';
import { motion, useAnimate, useReducedMotion } from 'framer-motion';
import './HowItWorks.css';

const steps = [
  {
    title: 'Request a Quote',
    description: 'Fill in your moving details in our quick and easy form.',
    illustration: 'quote',
    Icon: ClipboardList,
  },
  {
    title: 'Get a Free Estimate',
    description: 'Our team will review your details and share the best and transparent price.',
    illustration: 'estimate',
    Icon: FileText,
  },
  {
    title: 'Packing & Pickup',
    description: 'We carefully pack, load and ensure safe transportation of your belongings.',
    illustration: 'packing',
    Icon: Package,
  },
  {
    title: 'Delivery at Your Doorstep',
    description: 'Your items are delivered safely, on time and in perfect condition to your new home.',
    illustration: 'delivery',
    Icon: Truck,
  },
];

function Illustration({ type, Icon }) {
  if (type === 'quote') {
    return (
      <div className="how-illustration how-illustration-quote" aria-hidden="true">
        <span className="how-clipboard-clip" />
        <ClipboardList />
        <span className="how-clipboard-lines"><i /><i /><i /></span>
        <Check className="how-clipboard-check" />
      </div>
    );
  }

  if (type === 'estimate') {
    return (
      <div className="how-illustration how-illustration-estimate" aria-hidden="true">
        <span className="how-estimate-sheet"><FileText /><i /><i /><i /></span>
        <span className="how-estimate-rupee"><IndianRupee /></span>
        <span className="how-estimate-calculator"><Calculator /></span>
      </div>
    );
  }

  if (type === 'packing') {
    return (
      <div className="how-illustration how-illustration-packing" aria-hidden="true">
        <span className="how-box how-box-back"><Package /></span>
        <span className="how-box how-box-front"><Package /></span>
        <span className="how-box how-box-side"><Package /></span>
        <span className="how-packing-tape" />
      </div>
    );
  }

  return (
    <div className="how-illustration how-illustration-delivery" aria-hidden="true">
      <span className="how-delivery-box"><Package /></span>
      <Icon className="how-delivery-truck" />
      <span className="how-delivery-road" />
    </div>
  );
}

export default function HowItWorks() {
  const reducedMotion = useReducedMotion();
  const skipAnimation = reducedMotion || typeof IntersectionObserver === 'undefined';
  const [scope, animateInScope] = useAnimate();

  useEffect(() => {
    if (skipAnimation) return undefined;

    const section = scope.current;
    if (!section) return undefined;

    let playback;
    let started = false;
    let completed = false;
    let disposed = false;

    let revealPastSection = () => {};
    const revealImmediately = () => {
      section.querySelectorAll('.how-steps-heading, .how-step-card, .how-steps-arrow').forEach((element) => {
        element.style.opacity = '1';
        element.style.removeProperty('transform');
      });
      section.querySelector('.how-steps-connectors')?.style.removeProperty('transform');
      completed = true;
      observer.disconnect();
      window.removeEventListener('scroll', revealPastSection);
    };
    revealPastSection = () => {
      if (!started && !completed && section.getBoundingClientRect().bottom <= 0) {
        revealImmediately();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      const inView = entry.isIntersecting && entry.intersectionRatio >= 0.25;

      if (!inView && section.getBoundingClientRect().bottom <= 0) {
        revealImmediately();
        return;
      }

      if (!started && inView) {
        started = true;
        window.removeEventListener('scroll', revealPastSection);
        try {
          playback = animateInScope([
            ['.how-steps-heading', { opacity: 1, y: 0 }, { duration: 0.7, ease: 'easeOut' }],
            ['.how-step-card:nth-of-type(1)', { opacity: 1, y: 0 }, { duration: 0.7, at: 0.7, ease: 'easeOut' }],
            ['.how-step-card:nth-of-type(2)', { opacity: 1, y: 0 }, { duration: 0.7, at: 0.94, ease: 'easeOut' }],
            ['.how-step-card:nth-of-type(3)', { opacity: 1, y: 0 }, { duration: 0.7, at: 1.18, ease: 'easeOut' }],
            ['.how-step-card:nth-of-type(4)', { opacity: 1, y: 0 }, { duration: 0.7, at: 1.42, ease: 'easeOut' }],
            ['.how-steps-connectors', { scaleX: 1 }, { duration: 1.45, at: 0.7, ease: 'easeOut' }],
            ['.how-steps-arrow:nth-of-type(1)', { opacity: 1 }, { duration: 0.35, at: 0.94, ease: 'easeOut' }],
            ['.how-steps-arrow:nth-of-type(2)', { opacity: 1 }, { duration: 0.35, at: 1.18, ease: 'easeOut' }],
            ['.how-steps-arrow:nth-of-type(3)', { opacity: 1 }, { duration: 0.35, at: 1.42, ease: 'easeOut' }],
          ]);
          playback.finished.then(() => {
            completed = true;
            observer.disconnect();
          }).catch((error) => {
            if (!disposed) {
              console.error('How It Works animation did not complete.', error);
              revealImmediately();
            }
          });
        } catch (error) {
          console.error('How It Works animation failed to start.', error);
          revealImmediately();
          observer.disconnect();
        }
      }

      if (started && !completed && playback) {
        if (inView) {
          playback.play();
        } else {
          playback.pause();
        }
      }

    }, { threshold: [0, 0.25] });

    window.addEventListener('scroll', revealPastSection, { passive: true });
    revealPastSection();
    try {
      if (!completed) observer.observe(section);
    } catch (error) {
      console.error('How It Works visibility observer failed to start.', error);
      revealImmediately();
      observer.disconnect();
    }

    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('scroll', revealPastSection);
      playback?.stop();
    };
  }, [animateInScope, scope, skipAnimation]);

  return (
    <section className="how-steps-section" ref={scope}>
      <div className="how-steps-container">
        <motion.header
          className="how-steps-heading"
          initial={skipAnimation ? false : { opacity: 0, y: 18 }}
        >
          <p className="how-steps-eyebrow"><span /> HOW IT WORKS</p>
          <h2>Book Your Move in Just a <span>Few Simple Steps</span></h2>
          <p className="how-steps-subtitle">A smooth and hassle-free moving experience from start to finish.</p>
        </motion.header>

        <div className="how-steps-grid">
          <motion.svg
            className="how-steps-connectors"
            viewBox="0 0 1120 200"
            preserveAspectRatio="none"
            aria-hidden="true"
            initial={skipAnimation ? false : { scaleX: 0 }}
            style={{ originX: 0 }}
          >
            <path d="M228 100 C250 76 300 124 322 100 M513 100 C535 76 585 124 607 100 M798 100 C820 76 870 124 892 100" />
          </motion.svg>
          {['calc(25% - 5px)', '50%', 'calc(75% + 5px)'].map((position) => (
            <motion.span
              className="how-steps-arrow"
              style={{ left: position }}
              initial={skipAnimation ? false : { opacity: 0 }}
              key={position}
              aria-hidden="true"
            >
              <ArrowRight />
            </motion.span>
          ))}

          {steps.map(({ title, description, illustration, Icon }, index) => (
            <motion.article
              className="how-step-card"
              initial={skipAnimation ? false : { opacity: 0, y: 18 }}
              key={title}
            >
              <div className="how-step-visual">
                <span className="how-step-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="how-step-orb">
                  <Illustration type={illustration} Icon={Icon} />
                </div>
              </div>
              <div className="how-step-content">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
