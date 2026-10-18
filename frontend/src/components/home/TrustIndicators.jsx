import React, { useEffect, useRef, useState } from 'react';
import { Clock3, MapPin, Trophy, Users } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

const defaults = [
  { value: '21+', label: 'Years of Experience' },
  { value: '5,000+', label: 'Happy Customers' },
  { value: '100+', label: 'Cities Covered' },
  { value: '99%', label: 'On-Time Delivery' },
];

const icons = [Trophy, Users, MapPin, Clock3];
const animationDuration = 1800;

export default function TrustIndicators() {
  const { loading } = useSite();
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);
  const [progress, setProgress] = useState(0);
  const items = defaults;

  useEffect(() => {
    if (loading || !sectionRef.current || hasAnimated.current) return undefined;

    const section = sectionRef.current;
    let animationFrame;
    let startTime;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasAnimated.current) return;
      hasAnimated.current = true;
      observer.disconnect();

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setProgress(1);
        return;
      }

      const animate = (timestamp) => {
        if (startTime === undefined) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const linearProgress = Math.min(elapsed / animationDuration, 1);
        setProgress(1 - (1 - linearProgress) ** 3);
        if (linearProgress < 1) animationFrame = requestAnimationFrame(animate);
      };

      animationFrame = requestAnimationFrame(animate);
    }, { threshold: 0.25 });

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
    };
  }, [loading]);

  if (loading) return null;

  return (
    <section ref={sectionRef} className="trust-strip bg-white py-5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-5">
        {items.map((item, index) => {
          const Icon = icons[index % icons.length];
          const match = item.value.match(/^([\d,]+)(.*)$/);
          const target = Number(match[1].replaceAll(',', ''));
          const suffix = match[2];
          const value = Math.round(target * progress).toLocaleString('en-US');
          return (
            <div key={item.label || index} className="flex items-center justify-center gap-3 text-left">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange/10 text-orange">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <div className="text-2xl font-extrabold leading-tight text-navy tabular-nums">{value}{suffix}</div>
                <div className="mt-1 text-sm leading-snug text-gray-600">{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}