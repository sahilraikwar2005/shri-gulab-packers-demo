const mongoose = require('mongoose');

const SEOSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, unique: true }, // e.g. home, services, about
    title: String,
    description: String,
    slug: String,
    ogImage: String,
    keywords: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('SEO', SEOSchema);