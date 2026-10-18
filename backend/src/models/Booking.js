const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    inquiry: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry' },
    quotation: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' },
    scheduleDate: Date,
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'FleetVehicle' },
    driverName: String,
    driverPhone: String,
    status: { type: String, enum: ['scheduled', 'inTransit', 'completed', 'cancelled'], default: 'scheduled' },
    notes: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);