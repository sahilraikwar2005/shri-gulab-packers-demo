import React from 'react';
import { Link } from 'react-router-dom';

export default function DetailedQuote() {
  return (
    <section className="py-16 bg-navy text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Need a Detailed Quotation?</h2>
        <p className="text-gray-200 mb-6">Complete our short multi-step form and receive a customized moving estimate without listing every item.</p>
        <Link to="/quote" className="btn-primary">Start Detailed Quote</Link>
      </div>
    </section>
  );
}