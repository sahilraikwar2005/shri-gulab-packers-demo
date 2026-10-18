import React from 'react';
import SimpleCrud from '../components/SimpleCrud';
export default function Fleet() {
  return <SimpleCrud title="Fleet" endpoint="/api/v1/fleet" fields={[
    { name: 'name', label: 'Name' },
    { name: 'category', label: 'Category', type: 'select', options: ['mini','medium','large','other'], default: 'medium' },
    { name: 'image', label: 'Image URL' },
    { name: 'dimensions', label: 'Dimensions' },
    { name: 'capacity', label: 'Capacity' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'availability', label: 'Available', type: 'boolean', default: true },
    { name: 'order', label: 'Order', type: 'number' },
  ]} />;
}