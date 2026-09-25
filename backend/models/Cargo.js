const mongoose = require('mongoose');

const cargoSchema = new mongoose.Schema({
  cargoId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: String,
  quantity: Number,
  weight: String,
  origin: String,
  destination: String,
  currentLocation: String,
  expedition: { type: mongoose.Schema.Types.ObjectId, ref: 'Expedition' },
  responsibleOfficer: String,
  expectedArrival: Date,
  status: { 
    type: String, 
    enum: ['Prepared', 'Loaded', 'In Transit', 'Arrived', 'Delivered'],
    default: 'Prepared'
  },
  movementHistory: [{
    location: String,
    status: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Cargo', cargoSchema);
