import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Star, UserRound } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { useApiQuery } from '../../api/useApiQuery';
import { Empty, ErrorState, SkeletonGrid } from '../common/States';
import './Testimonials.css';

function getVisibleCount() {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

export default function Testimonials() {
  const query = useApiQuery(['testimonials', 'visible'], '/api/v1/testimonials?isVisible=true');
  const reducedMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(getVisibleCount);
  const [slideIndex, setSlideIndex] = useState(() => getVisibleCount());
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const transitionFrame = useRef(null);
  const items = useMemo(() => {
    const reviews = query.data || [];
    return [...reviews].sort((first, second) => (first.order ?? 0) - (second.order ?? 0));
  }, [query.data]);

  useEffect(() => {
    const updateVisibleCount = () => {
      const nextCount = getVisibleCount();
      if (nextCount === visibleCount) return;
      setVisibleCount(nextCount);
      setSlideIndex(nextCount);
      setTransitionEnabled(false);
      transitionFrame.current = window.requestAnimationFrame(() => setTransitionEnabled(true));
    };
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [visibleCount]);

  useEffect(() => () => {
    if (transitionFrame.current !== null) window.cancelAnimationFrame(transitionFrame.current);
  }, []);

  const advance = useCallback((direction) => {
    setSlideIndex((current) => {
      if (reducedMotion && items.length) {
        const active = current - visibleCount;
        const next = ((active + direction) % items.length + items.length) % items.length;
        return visibleCount + next;
      }
      return current + direction;
    });
  }, [items.length, reducedMotion, visibleCount]);

  useEffect(() => {
    if (paused || items.length <= visibleCount) return undefined;
    const timer = window.setInterval(() => advance(1), 4500);
    return () => window.clearInterval(timer);
  }, [advance, paused, visibleCount, items.length]);

  if (query.isPending) return <SkeletonGrid count={3} columns={3} />;
  if (query.isError) return <ErrorState message="Customer reviews could not be loaded." onRetry={query.refetch} />;

  const trackReviews = items.length > visibleCount
    ? [
      ...items.slice(-visibleCount).map((review, index) => ({ review, key: `before-${index}`, clone: true })),
      ...items.map((review) => ({ review, key: review._id, clone: false })),
      ...items.slice(0, visibleCount).map((review, index) => ({ review, key: `after-${index}`, clone: true })),
    ]
    : items.map((review) => ({ review, key: review._id, clone: false }));
  const activeDot = items.length ? ((slideIndex - visibleCount) % items.length + items.length) % items.length : 0;

  const handleTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || items.length <= visibleCount) return;
    if (slideIndex >= visibleCount + items.length) {
      setTransitionEnabled(false);
      setSlideIndex(visibleCount);
      transitionFrame.current = window.requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
    } else if (slideIndex < visibleCount) {
      setTransitionEnabled(false);
      setSlideIndex(visibleCount + items.length - 1);
      transitionFrame.current = window.requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
    }
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(distance) > 40) advance(distance < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <section className="testimonials-section" aria-labelledby="testimonials-heading">
      <div className="testimonials-container">
        <header className="testimonials-heading">
          <p className="testimonials-eyebrow"><span /> CUSTOMER FEEDBACK</p>
          <h2 id="testimonials-heading">What Our <span>Customers</span> Say</h2>
          <p>Here&apos;s what some of our customers have to say about their experience with our<br className="testimonials-desktop-break" /> packing and moving services.</p>
        </header>

        {items.length ? (
          <>
            <div
              className="testimonials-viewport"
              role="region"
              aria-label="Customer testimonials"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className={`testimonials-track${transitionEnabled && !reducedMotion ? ' testimonials-track-animated' : ''}`}
                style={{
                  '--testimonials-visible': visibleCount,
                  transform: `translate3d(-${(items.length > visibleCount ? slideIndex : 0) * (100 / visibleCount)}%, 0, 0)`,
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {trackReviews.map(({ review, key, clone }) => {
                  const isDemo = review.isDemo || review.text?.includes('DEMO — NOT VERIFIED');
                  return (
                    <div
                      className="testimonials-slide"
                      key={key}
                      aria-hidden={clone || undefined}
                    >
                      <article className="testimonial-card">
                        <div className="testimonial-card-topline">
                          {isDemo && <span className="testimonial-demo-label">DEMO — NOT VERIFIED</span>}
                          <span className="testimonial-quote-mark" aria-hidden="true">“</span>
                        </div>
                        <div className="testimonial-stars" aria-label={`${review.rating || 5} out of 5 stars`}>
                          {Array.from({ length: Math.max(0, Math.min(5, review.rating || 5)) }, (_, index) => (
                            <Star key={index} aria-hidden="true" fill="currentColor" />
                          ))}
                        </div>
                        <p className="testimonial-review-text">{review.text}</p>
                        <div className="testimonial-customer">
                          <span className="testimonial-avatar"><UserRound aria-hidden="true" /></span>
                          <span className="testimonial-customer-details">
                            <strong>{review.name}</strong>
                            <small>{review.city}{review.source === 'google' ? ' · Google Review' : ''}</small>
                          </span>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>

            {items.length > visibleCount && (
              <div className="testimonials-controls">
                <button
                  className="testimonials-arrow"
                  type="button"
                  aria-label="Show previous customer review"
                  onClick={() => advance(-1)}
                >
                  <ArrowLeft aria-hidden="true" />
                </button>
                <div className="testimonials-dots" role="group" aria-label="Choose a customer review">
                  {items.map((item, index) => (
                    <button
                      className={`testimonials-dot${activeDot === index ? ' is-active' : ''}`}
                      type="button"
                      key={item._id}
                      aria-label={`Show review ${index + 1} of ${items.length}`}
                      aria-current={activeDot === index ? 'true' : undefined}
                      onClick={() => setSlideIndex(visibleCount + index)}
                    />
                  ))}
                </div>
                <button
                  className="testimonials-arrow"
                  type="button"
                  aria-label="Show next customer review"
                  onClick={() => advance(1)}
                >
                  <ArrowRight aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        ) : (
          <Empty label="Customer reviews will be added after verification." />
        )}
      </div>
    </section>
  );
}
