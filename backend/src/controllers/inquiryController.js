const db = require('../storage/jsonDb');
const asyncHandler = require('../utils/asyncHandler');
const logActivity = require('../utils/logActivity');

const create = asyncHandler(async (req, res) => {
  const data = req.body;
  const required = ['movingType', 'shipmentType', 'customer'];
  for (const r of required) if (!data[r]) return res.status(400).json({ success: false, message: `Missing ${r}` });
  if (!data.customer?.name || !data.customer?.mobile) {
    return res.status(400).json({ success: false, message: 'Customer name and mobile required' });
  }
  if (!data.pickup?.city || !data.destination?.city) {
    return res.status(400).json({ success: false, message: 'Pickup and destination cities required' });
  }

  const fingerprint = `${data.customer.mobile}|${data.pickup.city}|${data.destination.city}|${data.movingDate || ''}`;
  const recentResult = await db.list('inquiries', { duplicateFingerprint: fingerprint }, {});
  const recent = recentResult.data.find((i) => new Date(i.createdAt) > new Date(Date.now() - 10 * 60 * 1000));
  if (recent) {
    return res.status(429).json({ success: false, message: 'Duplicate submission detected. Please wait before retrying.', referenceId: recent.referenceId });
  }

  const now = new Date();
  const prefix = `ME${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const count = await db.count('inquiries', {});
  const referenceId = `${prefix}-${String(count + 1).padStart(5, '0')}`;

  const inquiry = await db.create('inquiries', {
    ...data,
    referenceId,
    status: data.status || 'new',
    ipAddress: req.ip,
    duplicateFingerprint: fingerprint,
  });

  try {
    const { notifyNewInquiry } = require('../services/notificationService');
    notifyNewInquiry(inquiry).catch(() => {});
  } catch (e) {}

  res.status(201).json({ success: true, referenceId: inquiry.referenceId, message: 'Inquiry received. We will contact you shortly.' });
});

const list = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search, assignedTo } = req.query;
  const q = {};
  if (status) q.status = status;
  if (assignedTo) q.assignedTo = assignedTo;
  if (search) {
    q.$or = [
      { referenceId: { $regex: search, $options: 'i' } },
      { 'customer.name': { $regex: search, $options: 'i' } },
      { 'customer.mobile': { $regex: search, $options: 'i' } },
      { 'pickup.city': { $regex: search, $options: 'i' } },
      { 'destination.city': { $regex: search, $options: 'i' } },
    ];
  }
  const result = await db.list('inquiries', q, { page: Number(page), limit: Number(limit), sort: { createdAt: -1 } });
  // inflate assignedTo
  const usersResult = await db.list('adminUsers', {}, { limit: 1000 });
  const userMap = Object.fromEntries(usersResult.data.map((u) => [u._id, { _id: u._id, name: u.name, email: u.email }]));
  const data = result.data.map((i) => ({ ...i, assignedTo: i.assignedTo ? userMap[i.assignedTo] || i.assignedTo : null }));
  res.json({ success: true, data, pagination: { page: Number(page), limit: Number(limit), total: result.total, pages: Math.ceil(result.total / Number(limit)) } });
});

const getOne = asyncHandler(async (req, res) => {
  const inquiry = await db.findById('inquiries', req.params.id);
  if (!inquiry) return res.status(404).json({ success: false, message: 'Not found' });
  const quot = inquiry.quotation ? await db.findById('quotations', inquiry.quotation) : null;
  const usersResult = await db.list('adminUsers', {}, { limit: 1000 });
  const userMap = Object.fromEntries(usersResult.data.map((u) => [u._id, { _id: u._id, name: u.name, email: u.email }]));
  if (inquiry.assignedTo) inquiry.assignedTo = userMap[inquiry.assignedTo] || inquiry.assignedTo;
  if (quot) inquiry.quotation = quot;
  res.json({ success: true, data: inquiry });
});

const update = asyncHandler(async (req, res) => {
  const inquiry = await db.findById('inquiries', req.params.id);
  if (!inquiry) return res.status(404).json({ success: false, message: 'Not found' });
  const { status, assignedTo, notes } = req.body;
  const patch = {};
  if (status) patch.status = status;
  if (assignedTo !== undefined) patch.assignedTo = assignedTo || null;
  if (notes) {
    const existingNotes = Array.isArray(inquiry.notes) ? inquiry.notes : [];
    existingNotes.push({ author: req.user?.email, text: notes, createdAt: new Date().toISOString() });
    patch.notes = existingNotes;
  }
  const updated = await db.update('inquiries', req.params.id, patch);
  await logActivity(req, 'update inquiry', 'Inquiry', updated._id, { status });
  res.json({ success: true, data: updated });
});

module.exports = { create, list, getOne, update };