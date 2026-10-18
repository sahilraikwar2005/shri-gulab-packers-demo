import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useApiQuery } from '../../api/useApiQuery';
import { Empty, ErrorState, SkeletonGrid } from '../common/States';
import CTA from './CTA';
import './FAQSection.css';

export default function FAQSection() {
  const [open, setOpen] = useState(null);
  const reduced = useReducedMotion();
  const query = useApiQuery(['faqs', 'visible'], '/api/v1/faqs?isVisible=true');
  const items = query.data || [];
  const shown = items.slice(0, 4);
  return (
    <section className="faq-cta-section">
      <div className="faq-cta-layout">
        <div className="faq-panel">
          <h2>Frequently Asked Questions</h2>
          {query.isPending ? (
            <SkeletonGrid count={3} columns={1} />
          ) : query.isError ? (
            <ErrorState message="Frequently asked questions could not be loaded." onRetry={query.refetch} />
          ) : shown.length ? (
            <div className="faq-list">
              {shown.map((f) => (
                <div key={f._id} className="faq-item">
                  <button
                    type="button"
                    className="faq-question"
                    aria-expanded={open === f._id}
                    aria-controls={`home-faq-${f._id}`}
                    onClick={() => setOpen(open === f._id ? null : f._id)}
                  >
                    <span className="faq-question-mark" aria-hidden="true">i</span>
                    <span className="faq-question-text">{f.question}</span>
                    <span className={`faq-chevron${open === f._id ? ' is-open' : ''}`} aria-hidden="true">⌄</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open === f._id && (
                      <motion.p
                        id={`home-faq-${f._id}`}
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.25 }}
                        className="faq-answer"
                      >
                        {f.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <Link className="faq-more-link" to="/faq">View all FAQs</Link>
            </div>
          ) : (
            <Empty label="FAQs will be added soon." />
          )}
        </div>
        <CTA />
      </div>
    </section>
  );
}