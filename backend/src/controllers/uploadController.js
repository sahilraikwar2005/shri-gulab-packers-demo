const { uploadBuffer } = require('../config/cloudinary');
const asyncHandler = require('../utils/asyncHandler');

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
  const result = await uploadBuffer(req.file.buffer, req.body.folder || 'moveeasy');
  res.json({ success: true, url: result.secure_url, publicId: result.public_id });
});

module.exports = { uploadImage };