const db = require('../storage/jsonDb');
const asyncHandler = require('../utils/asyncHandler');
const logActivity = require('../utils/logActivity');

const inflate = async (b) => {
  const inquiry = b.inquiry ? await db.findById('inquiries', b.inquiry) : null;
  const vehicle = b.vehicle ? await db.findById('fleetVehicles', b.vehicle) : null;
  return { ...b, inquiry: inquiry || b.inquiry, vehicle: vehicle || b.vehicle };
};

const create = asyncHandler(async (req, res) => {
  const count = await db.count('bookings', {});
  const bookingId = `BK-${String(count + 1).padStart(5, '0')}`;
  const booking = await db.create('bookings', { ...req.body, bookingId, createdBy: req.user?._id, status: req.body.status || 'scheduled' });
  await logActivity(req, 'create booking', 'Booking', booking._id);
  res.status(201).json({ success: true, data: await inflate(booking) });
});

const list = asyncHandler(async (req, res) => {
  const result = await db.list('bookings', {}, { sort: { createdAt: -1 }, limit: 1000 });
  const data = await Promise.all(result.data.map(inflate));
  res.json({ success: true, data });
});

const getOne = asyncHandler(async (req, res) => {
  const b = await db.findById('bookings', req.params.id);
  if (!b) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: await inflate(b) });
});

const update = asyncHandler(async (req, res) => {
  const b = await db.update('bookings', req.params.id, req.body);
  if (!b) return res.status(404).json({ success: false, message: 'Not found' });
  await logActivity(req, 'update booking', 'Booking', b._id);
  res.json({ success: true, data: await inflate(b) });
});

module.exports = { create, list, getOne, update };