import siteSettings from './backend-snapshot/siteSettings.json';
import services from './backend-snapshot/services.json';
import fleet from './backend-snapshot/fleetVehicles.json';
import testimonials from './backend-snapshot/testimonials.json';
import faqs from './backend-snapshot/faqs.json';
import gallery from './backend-snapshot/galleryImages.json';
import locations from './backend-snapshot/locations.json';
import api from '../api/client';

const isApiMode = import.meta.env.VITE_DATA_SOURCE === 'api';

function sortByOrder(items) {
  return [...items].sort((first, second) => (first.order ?? 0) - (second.order ?? 0));
}

function getLocalContent(endpoint) {
  const url = new URL(endpoint, globalThis.location?.origin || 'http://localhost');
  const path = url.pathname.replace(/^\/api\/v1/, '');

  if (path === '/settings') return siteSettings[0] || null;
  if (path === '/services') return sortByOrder(services.filter((service) => service.isPublished));
  if (path === '/fleet') return sortByOrder(fleet);
  if (path === '/testimonials') return sortByOrder(testimonials.filter((item) => item.isVisible));
  if (path === '/faqs') return sortByOrder(faqs.filter((item) => item.isVisible));
  if (path === '/gallery') return sortByOrder(gallery.filter((item) => item.isVisible));
  if (path === '/locations') return sortByOrder(locations.filter((item) => item.isActive));

  const serviceMatch = path.match(/^\/services\/(?:slug\/)?([^/]+)$/);
  if (serviceMatch) {
    const identifier = decodeURIComponent(serviceMatch[1]);
    return services.find((service) => service.slug === identifier || service._id === identifier) || null;
  }

  throw new Error(`No local frontend data is configured for "${path}".`);
}

export async function getContent(endpoint) {
  if (!isApiMode) return getLocalContent(endpoint);

  try {
    const response = await api.get(endpoint);
    return response.data.data;
  } catch (error) {
    if (!endpoint.includes('/services/slug/') || error.response?.status !== 404) throw error;
    const identifier = endpoint.split('/').pop();
    const response = await api.get(`/api/v1/services/${identifier}`);
    return response.data.data;
  }
}
