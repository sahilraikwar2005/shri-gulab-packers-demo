async function generateReferenceId(Model) {
  const date = new Date();
  const prefix = `ME${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const count = await Model.countDocuments();
  return `${prefix}-${String(count + 1).padStart(5, '0')}`;
}

async function generateBookingId(Model) {
  const prefix = 'BK';
  const count = await Model.countDocuments();
  return `${prefix}-${String(count + 1).padStart(5, '0')}`;
}

module.exports = { generateReferenceId, generateBookingId };