const db = require('../storage/jsonDb');
const Inquiry = null;
const asyncHandler = require('../utils/asyncHandler');
const logActivity = require('../utils/logActivity');

const inflateInquiryRef = (q) => {
  return (async () => {
    const inq = q.inquiry ? await db.findById('inquiries', q.inquiry) : null;
    return { ...q, inquiry: inq ? { _id: inq._id, referenceId: inq.referenceId, customer: inq.customer, pickup: inq.pickup, destination: inq.destination } : q.inquiry };
  })();
};

const create = asyncHandler(async (req, res) => {
  const { inquiryId, estimateAmount, currency, breakdown, notes } = req.body;
  const inquiry = await db.findById('inquiries', inquiryId);
  if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
  const q = await db.create('quotations', { inquiry: inquiryId, estimateAmount, currency: currency || 'INR', breakdown: breakdown || [], notes, status: 'draft', createdBy: req.user?._id });
  await db.update('inquiries', inquiryId, { quotation: q._id, status: 'quoted' });
  await logActivity(req, 'create quotation', 'Quotation', q._id);
  res.status(201).json({ success: true, data: await inflateInquiryRef(q) });
});

const list = asyncHandler(async (req, res) => {
  const result = await db.list('quotations', {}, { sort: { createdAt: -1 }, limit: 1000 });
  const data = await Promise.all(result.data.map(inflateInquiryRef));
  res.json({ success: true, data });
});

const getOne = asyncHandler(async (req, res) => {
  const q = await db.findById('quotations', req.params.id);
  if (!q) return res.status(404).json({ success: false, message: 'Not found' });
  const data = await inflateInquiryRef(q);
  res.json({ success: true, data });
});

const update = asyncHandler(async (req, res) => {
  let q = await db.findById('quotations', req.params.id);
  if (!q) return res.status(404).json({ success: false, message: 'Not found' });
  const patch = { ...req.body };
  if (patch.status === 'sent' && !q.sentAt) patch.sentAt = new Date().toISOString();
  if (patch.status === 'accepted' || patch.status === 'rejected') patch.respondedAt = new Date().toISOString();
  q = await db.update('quotations', req.params.id, patch);
  await logActivity(req, 'update quotation', 'Quotation', q._id);
  res.json({ success: true, data: await inflateInquiryRef(q) });
});

module.exports = { create, list, getOne, update };