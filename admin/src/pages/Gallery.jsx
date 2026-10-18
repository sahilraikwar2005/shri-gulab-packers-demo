import React from 'react';
import SimpleCrud from '../components/SimpleCrud';
export default function Gallery() {
  return <SimpleCrud title="Gallery" endpoint="/api/v1/gallery" fields={[
    { name: 'title', label: 'Title' },
    { name: 'image', label: 'Image URL' },
    { name: 'category', label: 'Category' },
    { name: 'order', label: 'Order', type: 'number' },
    { name: 'isVisible', label: 'Visible', type: 'boolean', default: true },
  ]} />;
}