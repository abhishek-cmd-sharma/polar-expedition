const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  emergencyId: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  description: String,
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },
  location: String,
  reportedBy: String,
  time: { type: Date, default: Date.now },
  assignedTeam: String,
  status: {
    type: String,
    enum: ['Reported', 'Verified', 'Response Assigned', 'Response In Progress', 'Resolved', 'Closed'],
    default: 'Reported'
  }
}, { timestamps: true });

module.exports = mongoose.model('Emergency', emergencySchema);
