const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: String,
  quantity: { type: Number, required: true },
  unit: String,
  location: String,
  minStock: { type: Number, required: true },
  maxStock: Number,
  consumptionRate: { type: Number, default: 0 },
  expiryDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
