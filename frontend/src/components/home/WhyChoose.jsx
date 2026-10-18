import React from 'react';
import { Clock3, Headset, MapPin, PackageCheck, Users, Wallet } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import whyChooseImage from '../../assets/why-choose-vehicle-transport.png';
import './WhyChoose.css';

const defaults = [
  { title: 'Experienced Team', description: 'Trained & professional staff' },
  { title: 'Safe & Secure Packing', description: 'High-quality packing materials' },
  { title: 'Affordable Pricing', description: 'Transparent and competitive rates' },
  { title: 'On-Time Delivery', description: 'We value your time' },
  { title: 'All India Service', description: 'Door-to-door relocation' },
  { title: 'Customer Support', description: 'Always here to help' },
];

const icons = [Users, PackageCheck, Wallet, Clock3, MapPin, Headset];

export default function WhyChoose() {
  const { settings } = useSite();
  const items = settings?.reasonsToChoose?.length ? settings.reasonsToChoose : defaults;

  return (
    <section className="why-choose-section">
      <div className="why-choose-layout">
        <div className="why-choose-photo">
          <img
            src={whyChooseImage}
            alt="Shri Gulab Packers & Movers team loading a car into a transport truck"
            loading="lazy"
          />
        </div>
        <div className="why-choose-content">
          <h2>Why Choose Us?</h2>
          <div className="why-choose-grid">
            {items.map((reason, index) => {
              const Icon = icons[index % icons.length];
              return (
                <article className="why-choose-item" key={`${reason.title}-${index}`}>
                  <span className="why-choose-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{reason.title}</h3>
                    <p>{reason.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
