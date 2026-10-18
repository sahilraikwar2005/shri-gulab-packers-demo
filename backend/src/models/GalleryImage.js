const mongoose = require('mongoose');

const GalleryImageSchema = new mongoose.Schema(
  {
    title: String,
    image: { type: String, required: true },
    category: String,
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryImage', GalleryImageSchema);