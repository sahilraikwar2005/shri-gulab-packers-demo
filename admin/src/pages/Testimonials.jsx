import React from 'react';
import SimpleCrud from '../components/SimpleCrud';
export default function Testimonials() {
  return <SimpleCrud title="Testimonials" endpoint="/api/v1/testimonials" fields={[
    { name: 'name', label: 'Name' },
    { name: 'city', label: 'City' },
    { name: 'rating', label: 'Rating', type: 'number' },
    { name: 'text', label: 'Text', type: 'textarea' },
    { name: 'source', label: 'Source', type: 'select', options: ['manual','google'], default: 'manual' },
    { name: 'isVerified', label: 'Verified', type: 'boolean' },
    { name: 'isVisible', label: 'Visible', type: 'boolean', default: true },
    { name: 'order', label: 'Order', type: 'number' },
  ]} />;
}