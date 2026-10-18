import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Camera,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Phone,
  Send,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSite } from '../context/SiteContext';
import api from '../api/client';
import { ButtonLoader } from '../components/common/States';
import './Contact.css';

export default function Contact() {
  const { settings } = useSite();
  const [form, setForm] = useState({ name: '', mobile: '', message: '' });
  const submitMutation = useMutation({
    mutationFn: (values) => api.post('/api/v1/inquiries', {
      movingType: 'fewItems',
      shipmentType: 'local',
      pickup: { city: 'N/A' },
      destination: { city: 'N/A' },
      fewItemsDescription: values.message,
      customer: { name: values.name, mobile: values.mobile },
    }),
    onSuccess: () => {
      toast.success('Message sent. We will contact you shortly.');
      setForm({ name: '', mobile: '', message: '' });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to send'),
  });
  const submit = (event) => {
    event.preventDefault();
    if (!submitMutation.isPending) submitMutation.mutate(form);
  };
  const phones = settings?.phones?.length ? settings.phones : settings?.phone ? [settings.phone] : [];
  const mapAddress = settings?.officeAddress || 'Mumbai';

  return (
    <main className="contact-page">
      <section
        className="contact-hero"
        aria-labelledby="contact-hero-heading"
        style={{
          '--contact-hero-image': `url("${import.meta.env.BASE_URL}assets/contact-hero-bg.png")`,
        }}
      >
        <div className="contact-hero-content">
          <p className="contact-hero-eyebrow"><span aria-hidden="true" />GET IN TOUCH</p>
          <h1 id="contact-hero-heading">Contact <span>Us</span></h1>
          <p className="contact-hero-description">
            Have questions or need a free quote? We&apos;re here to help with all your packing and moving needs.
          </p>
        </div>
      </section>

      <section className="contact-layout" aria-label="Contact information and message form">
        <div className="contact-card contact-details-card">
          <header className="contact-card-heading">
            <h2>Our Contact Details</h2>
            <p>Reach us anytime. Our team is ready to assist you.</p>
          </header>

          <div className="contact-details-grid">
            {phones.length > 0 && (
              <div className="contact-detail">
                <span className="contact-detail-icon"><Phone aria-hidden="true" /></span>
                <div>
                  <h3>Call Us</h3>
                  <div className="contact-detail-lines">
                    {phones.map((phone, index) => (
                      <a key={`${phone}-${index}`} href={`tel:${phone}`}>{phone}</a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {settings?.whatsapp && (
              <div className="contact-detail">
                <span className="contact-detail-icon contact-detail-icon-whatsapp"><MessageCircle aria-hidden="true" /></span>
                <div>
                  <h3>WhatsApp</h3>
                  <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">Chat with us on WhatsApp</a>
                </div>
              </div>
            )}

            {settings?.email && (
              <div className="contact-detail contact-detail-email">
                <span className="contact-detail-icon"><Mail aria-hidden="true" /></span>
                <div>
                  <h3>Email Us</h3>
                  <a className="contact-email" href={`mailto:${settings.email}`} title={settings.email}>{settings.email}</a>
                </div>
              </div>
            )}

            {settings?.officeAddress && (
              <div className="contact-detail">
                <span className="contact-detail-icon"><MapPin aria-hidden="true" /></span>
                <div>
                  <h3>Our Location</h3>
                  <p>{settings.officeAddress}</p>
                </div>
              </div>
            )}

            {settings?.workingHours && (
              <div className="contact-detail">
                <span className="contact-detail-icon"><Clock3 aria-hidden="true" /></span>
                <div>
                  <h3>Working Hours</h3>
                  <p>{settings.workingHours}</p>
                </div>
              </div>
            )}

            {settings?.socialLinks?.instagram && (
              <div className="contact-detail">
                <span className="contact-detail-icon contact-detail-icon-instagram"><Camera aria-hidden="true" /></span>
                <div>
                  <h3>Follow Us</h3>
                  <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer">Instagram</a>
                </div>
              </div>
            )}
          </div>

          <div className="contact-map">
            <iframe
              title="Shri Gulab Packers & Movers location map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapAddress)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              className="contact-map-link"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapAddress)}`}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin aria-hidden="true" /> Open in Maps
            </a>
          </div>
        </div>

        <form onSubmit={submit} className="contact-card contact-form">
          <header className="contact-form-heading">
            <span className="contact-form-heading-icon"><Send aria-hidden="true" /></span>
            <div>
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and our team will get back to you soon.</p>
            </div>
          </header>

          <div className="contact-form-fields">
            <label className="contact-input">
              <UserRound aria-hidden="true" />
              <span>
                <span className="contact-input-label">Name <b>*</b></span>
                <input
                  aria-label="Name"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </span>
            </label>
            <label className="contact-input">
              <Phone aria-hidden="true" />
              <span>
                <span className="contact-input-label">Mobile Number <b>*</b></span>
                <input
                  aria-label="Mobile"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Your mobile number"
                  required
                  value={form.mobile}
                  onChange={(event) => setForm({ ...form, mobile: event.target.value })}
                />
              </span>
            </label>
            <label className="contact-input contact-message-input">
              <MessageSquareText aria-hidden="true" />
              <span>
                <span className="contact-input-label">Your Message</span>
                <textarea
                  aria-label="Message"
                  placeholder="Tell us about your moving requirements..."
                  rows={5}
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                />
              </span>
            </label>
          </div>

          <button type="submit" disabled={submitMutation.isPending} className="contact-submit">
            {submitMutation.isPending ? <ButtonLoader label="Sending..." /> : <><Send aria-hidden="true" />Send Message</>}
          </button>
          <p className="contact-form-note">
            <ShieldCheck aria-hidden="true" />Your information is safe with us. We&apos;ll never share your details.
          </p>
        </form>
      </section>
    </main>
  );
}
