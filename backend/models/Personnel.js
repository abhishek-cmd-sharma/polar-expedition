const mongoose = require('mongoose');

const personnelSchema = new mongoose.Schema({
  personnelId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: String,
  contact: String,
  expedition: { type: mongoose.Schema.Types.ObjectId, ref: 'Expedition' },
  currentLocation: String,
  status: { 
    type: String, 
    enum: ['Available', 'Assigned', 'In Transit', 'At Station', 'Field Deployment', 'Returned'],
    default: 'Available'
  },
  medicalClearance: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Personnel', personnelSchema);
