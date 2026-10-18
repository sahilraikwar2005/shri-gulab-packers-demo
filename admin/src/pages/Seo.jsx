import React from 'react';
import SimpleCrud from '../components/SimpleCrud';
export default function Seo() {
  return <SimpleCrud title="SEO" endpoint="/api/v1/seo" fields={[
    { name: 'page', label: 'Page key (home, services, ...)' },
    { name: 'title', label: 'Title' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'slug', label: 'Slug' },
    { name: 'ogImage', label: 'OG Image URL' },
    { name: 'keywords', label: 'Keywords' },
  ]} />;
}