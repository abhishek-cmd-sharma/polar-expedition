const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['ADMIN', 'OPERATIONS_OFFICER', 'FIELD_TEAM'],
    default: 'FIELD_TEAM'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
