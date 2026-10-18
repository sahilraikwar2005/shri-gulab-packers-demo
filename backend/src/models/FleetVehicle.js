const mongoose = require('mongoose');

const FleetVehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ['mini', 'medium', 'large', 'other'], default: 'medium' },
    image: String,
    dimensions: String,
    capacity: String,
    description: String,
    availability: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FleetVehicle', FleetVehicleSchema);