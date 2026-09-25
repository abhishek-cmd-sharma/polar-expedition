const mongoose = require('mongoose');

const expeditionSchema = new mongoose.Schema({
  expeditionId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  missionType: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date,
  origin: String,
  destination: String,
  station: String,
  leader: String,
  status: { 
    type: String, 
    enum: ['Planned', 'Preparing', 'Active', 'Completed', 'Cancelled'],
    default: 'Planned'
  }
}, { timestamps: true });

module.exports = mongoose.model('Expedition', expeditionSchema);
