const mongoose = require('mongoose');

const QuotationSchema = new mongoose.Schema(
  {
    inquiry: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry', required: true },
    estimateAmount: Number,
    currency: { type: String, default: 'INR' },
    breakdown: [{ label: String, amount: Number }],
    notes: String,
    status: { type: String, enum: ['draft', 'sent', 'accepted', 'rejected'], default: 'draft' },
    sentAt: Date,
    respondedAt: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quotation', QuotationSchema);