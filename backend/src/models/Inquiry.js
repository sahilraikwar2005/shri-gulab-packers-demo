const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema(
  {
    referenceId: { type: String, required: true, unique: true },
    movingType: { type: String, enum: ['home', 'office', 'fewItems', 'vehicle'], required: true },
    shipmentType: { type: String, enum: ['local', 'outstation'], required: true },
    pickup: {
      city: String, pincode: String, address: String, floor: String, lift: Boolean,
    },
    destination: {
      city: String, pincode: String, address: String, floor: String, lift: Boolean,
    },
    bhk: String,
    vehiclePreference: { type: String, enum: ['mini', 'medium', 'large', 'recommend'], default: 'recommend' },
    movingDate: Date,
    fewItemsDescription: String,
    fewItemsPhotos: [String],
    customer: { name: String, mobile: String },
    status: { type: String, enum: ['new', 'contacted', 'quoted', 'booked', 'closed', 'lost'], default: 'new' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    notes: [{ author: String, text: String, createdAt: { type: Date, default: Date.now } }],
    quotation: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' },
    ipAddress: String,
    duplicateFingerprint: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', InquirySchema);