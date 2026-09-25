const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Expedition = require('./models/Expedition');
const Inventory = require('./models/Inventory');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding...');
    
    // Clear existing
    await Expedition.deleteMany({});
    await Inventory.deleteMany({});
    await User.deleteMany({});
    
    // Create Users
    const passwordHash = await bcrypt.hash('password123', 10);
    
    await User.create([
      { username: 'admin', password: passwordHash, role: 'ADMIN' },
      { username: 'officer', password: passwordHash, role: 'OPERATIONS_OFFICER' },
      { username: 'field', password: passwordHash, role: 'FIELD_TEAM' }
    ]);

    // Create Expeditions
    const e1 = await Expedition.create({
      expeditionId: 'EXP-42', name: 'Operation Deep Freeze', missionType: 'Scientific', leader: 'field', status: 'Active'
    });
    
    // Create Inventory
    await Inventory.create([
      { itemId: 'INV-001', name: 'Aviation Fuel', category: 'Fuel', quantity: 1200, minStock: 500, consumptionRate: 80 },
      { itemId: 'INV-002', name: 'Emergency Rations', category: 'Food', quantity: 450, minStock: 100, consumptionRate: 5 }
    ]);
    
    console.log('Database seeded with Users, Expeditions, and Inventory!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
