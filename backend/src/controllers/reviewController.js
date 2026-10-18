const db = require('../storage/jsonDb');
const Testimonial = null;
const asyncHandler = require('../utils/asyncHandler');
const logActivity = require('../utils/logActivity');

const getStatus = asyncHandler(async (req, res) => {
  const docs = await db.list('reviewSources', {}, { limit: 1 });
  let doc = docs.data[0];
  if (!doc) doc = await db.create('reviewSources', { provider: 'google', apiKeyConfigured: !!process.env.GOOGLE_PLACES_API_KEY, status: 'not_configured' });
  doc.apiKeyConfigured = !!process.env.GOOGLE_PLACES_API_KEY;
  const updated = await db.update('reviewSources', doc._id, { apiKeyConfigured: doc.apiKeyConfigured });
  res.json({ success: true, data: updated });
});

const configure = asyncHandler(async (req, res) => {
  const docs = await db.list('reviewSources', {}, { limit: 1 });
  let doc = docs.data[0];
  if (!doc) doc = await db.create('reviewSources', { provider: 'google' });
  const updated = await db.update('reviewSources', doc._id, { placeId: req.body?.placeId || doc.placeId, apiKeyConfigured: !!process.env.GOOGLE_PLACES_API_KEY });
  await logActivity(req, 'configure review source', 'ReviewSource', updated._id);
  res.json({ success: true, data: updated });
});

const fetchGoogle = asyncHandler(async (req, res) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const docs = await db.list('reviewSources', {}, { limit: 1 });
  let doc = docs.data[0];
  if (!doc) doc = await db.create('reviewSources', { provider: 'google' });
  const placeId = (req.body && req.body.placeId) || doc.placeId;
  if (!apiKey || !placeId) {
    const updated = await db.update('reviewSources', doc._id, { status: 'not_configured', apiKeyConfigured: !!apiKey });
    return res.status(400).json({ success: false, message: 'Google Places API key or Place ID missing' });
  }
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;
    const r = await fetch(url);
    const json = await r.json();
    if (json.status !== 'OK') throw new Error(json.error_message || json.status);
    const reviews = json.result?.reviews || [];
    let imported = 0;
    for (const rv of reviews) {
      const existing = await db.findOne('testimonials', { googleReviewId: String(rv.time) + '|' + rv.author_name });
      if (existing) continue;
      await db.create('testimonials', {
        name: rv.author_name,
        rating: rv.rating,
        text: rv.text,
        source: 'google',
        googleReviewId: String(rv.time) + '|' + rv.author_name,
        isVerified: true,
        isVisible: false,
      });
      imported++;
    }
    const updated = await db.update('reviewSources', doc._id, { lastFetchedAt: new Date().toISOString(), status: 'ok', placeId, apiKeyConfigured: true });
    await logActivity(req, 'fetch google reviews', 'ReviewSource', updated._id, { imported });
    res.json({ success: true, imported, totalFetched: reviews.length });
  } catch (e) {
    await db.update('reviewSources', doc._id, { status: 'error' });
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = { getStatus, configure, fetchGoogle };