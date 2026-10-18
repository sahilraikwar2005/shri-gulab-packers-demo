import React from 'react';
import SimpleCrud from '../components/SimpleCrud';
export default function Services() {
  return <SimpleCrud title="Services" endpoint="/api/v1/services" fields={[
    { name: 'title', label: 'Title' },
    { name: 'slug', label: 'Slug' },
    { name: 'shortDescription', label: 'Short Description' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image', label: 'Image URL' },
    { name: 'order', label: 'Order', type: 'number' },
    { name: 'isPublished', label: 'Published', type: 'boolean' },
    { name: 'seoTitle', label: 'SEO Title' },
    { name: 'seoDescription', label: 'SEO Description' },
  ]} />;
}