const db = require('../storage/jsonDb');
const asyncHandler = require('../utils/asyncHandler');

const exportInquiriesCsv = asyncHandler(async (req, res) => {
  const result = await db.list('inquiries', {}, { limit: 100000, sort: { createdAt: -1 } });
  const items = result.data;
  const header = ['Reference', 'Date', 'MovingType', 'Shipment', 'PickupCity', 'DestCity', 'Customer', 'Mobile', 'Status'];
  const rows = items.map((i) => [
    i.referenceId, i.createdAt, i.movingType, i.shipmentType, i.pickup?.city, i.destination?.city, i.customer?.name, i.customer?.mobile, i.status,
  ]);
  const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="inquiries.csv"');
  res.send(csv);
});

module.exports = { exportInquiriesCsv };