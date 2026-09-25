const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  equipmentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: String,
  location: String,
  expedition: { type: mongoose.Schema.Types.ObjectId, ref: 'Expedition' },
  condition: String,
  status: { 
    type: String, 
    enum: ['Operational', 'Maintenance Due', 'Under Maintenance', 'Critical', 'Out of Service'],
    default: 'Operational'
  },
  lastMaintenance: Date,
  nextMaintenance: Date,
  responsiblePerson: String
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
