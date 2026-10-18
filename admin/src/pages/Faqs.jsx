import React from 'react';
import SimpleCrud from '../components/SimpleCrud';
export default function Faqs() {
  return <SimpleCrud title="FAQs" endpoint="/api/v1/faqs" fields={[
    { name: 'question', label: 'Question' },
    { name: 'answer', label: 'Answer', type: 'textarea' },
    { name: 'order', label: 'Order', type: 'number' },
    { name: 'isVisible', label: 'Visible', type: 'boolean', default: true },
  ]} />;
}