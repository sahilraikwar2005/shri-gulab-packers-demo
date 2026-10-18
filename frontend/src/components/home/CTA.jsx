import React from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import { ArrowRight, Check, MapPin, Phone, Truck } from 'lucide-react';
import movingBoxesImage from '../../assets/navbar-moving-boxes.png';

export default function CTA() {
  const { settings } = useSite();
  return (
    <aside className="move-cta-card">
      <img src={movingBoxesImage} alt="" loading="lazy" />
      <div className="move-cta-copy">
        <p className="move-cta-eyebrow"><span /> READY TO MOVE?</p>
        <h2>Get a Free Quote Today!</h2>
        <p>Fill in your details and get a customized quotation for your moving requirements.</p>
        <Link to="/quote" className="move-cta-button">Get Free Quote <ArrowRight aria-hidden="true" /></Link>
        <div className="move-cta-notes">
          <span><Check aria-hidden="true" /> Safe &amp; Secure Packing</span>
          <span><Truck aria-hidden="true" /> On-Time Delivery</span>
          <span><MapPin aria-hidden="true" /> All India Service</span>
          {settings?.phone && (
            <a href={`tel:${settings.phone}`}><Phone aria-hidden="true" /> Call us: {settings.phone}</a>
          )}
        </div>
      </div>
    </aside>
  );
}