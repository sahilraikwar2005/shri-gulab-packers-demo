const db = require('../storage/jsonDb');
const asyncHandler = require('../utils/asyncHandler');
const logActivity = require('../utils/logActivity');

const SETTINGS_COLLECTION = 'siteSettings';

const get = asyncHandler(async (req, res) => {
  let doc = await db.findOne(SETTINGS_COLLECTION, { key: 'global' });
  if (!doc) doc = await db.create(SETTINGS_COLLECTION, { key: 'global' });
  res.json({ success: true, data: doc });
});

const update = asyncHandler(async (req, res) => {
  let doc = await db.findOne(SETTINGS_COLLECTION, { key: 'global' });
  if (!doc) doc = await db.create(SETTINGS_COLLECTION, { key: 'global' });
  if (typeof req.body.phones === 'string') {
    req.body.phones = req.body.phones.split(',').map((s) => s.trim()).filter(Boolean);
  }
  const updated = await db.update(SETTINGS_COLLECTION, doc._id, { ...req.body, key: 'global' });
  await logActivity(req, 'update site settings', 'SiteSetting', updated._id);
  res.json({ success: true, data: updated });
});

module.exports = { get, update };