const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  members: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Deployed', 'In Transit', 'Standby'],
    default: 'Standby'
  }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
