const mongoose = require('mongoose');

const SiteSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    companyName: String,
    logo: String,
    phone: String,
    phones: { type: [String], default: [] },
    whatsapp: String,
    email: String,
    officeAddress: String,
    workingHours: String,
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String,
      linkedin: String,
    },
    footerText: String,
    favicon: String,
    // Homepage
    hero: {
      title: String,
      subtitle: String,
      image: String,
      ctaText: String,
      ctaLink: String,
    },
    sectionsVisibility: { type: Map, of: Boolean, default: {} },
    trustIndicators: [{ icon: String, label: String, value: String }],
    reasonsToChoose: [{ title: String, description: String, icon: String }],
    howItWorks: [{ step: Number, title: String, description: String }],
    notifications: {
      emailEnabled: Boolean,
      emailRecipients: [String],
      whatsappEnabled: Boolean,
      whatsappNumbers: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSetting', SiteSettingSchema);