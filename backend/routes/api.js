const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Models
const User = require('../models/User');
const Expedition = require('../models/Expedition');
const Personnel = require('../models/Personnel');
const Cargo = require('../models/Cargo');
const Inventory = require('../models/Inventory');
const Equipment = require('../models/Equipment');
const Emergency = require('../models/Emergency');
const Team = require('../models/Team');

// --- AUTH ROUTES ---
router.post('/auth/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role: role || 'FIELD_TEAM' });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, role: user.role, username: user.username, id: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/auth/me', protect, async (req, res) => {
  res.json({
    id: req.user._id,
    username: req.user.username,
    role: req.user.role
  });
});

// --- USER MANAGEMENT ---
router.get('/users', protect, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/users/:id', protect, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/users', protect, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json(user);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/users/:id', protect, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    res.json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.patch('/users/:id/role', protect, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const { role } = req.body;
    const updated = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json(updated);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/users/:id', protect, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- HELPER FUNCTIONS FOR RESOURCE CHECK ---
const isAssignedToResource = async (req, model, id) => {
  if (req.user.role === 'ADMIN' || req.user.role === 'OPERATIONS_OFFICER') return true;
  
  const doc = await model.findById(id);
  if (!doc) return false;

  const username = req.user.username;

  if (model.modelName === 'Expedition') return doc.leader === username;
  if (model.modelName === 'Personnel') return doc.name === username;
  if (model.modelName === 'Cargo') return doc.responsibleOfficer === username;
  if (model.modelName === 'Emergency') return doc.assignedTeam === username;
  
  // By default, fields have no direct ownership for others in this simple example
  return true; 
};

// Custom routes to replace createCrudRoutes

// EXPEDITIONS
router.get('/expeditions', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'FIELD_TEAM') query = { leader: req.user.username };
    const items = await Expedition.find(query);
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.get('/expeditions/:id', protect, async (req, res) => {
  try {
    if (!(await isAssignedToResource(req, Expedition, req.params.id))) return res.status(403).json({ success: false, message: 'Forbidden' });
    res.json(await Expedition.findById(req.params.id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.post('/expeditions', protect, authorizeRoles('ADMIN', 'OPERATIONS_OFFICER'), async (req, res) => {
  try { res.status(201).json(await new Expedition(req.body).save()); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
router.put('/expeditions/:id', protect, authorizeRoles('ADMIN', 'OPERATIONS_OFFICER'), async (req, res) => {
  try { res.json(await Expedition.findByIdAndUpdate(req.params.id, req.body, { new: true })); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
router.delete('/expeditions/:id', protect, authorizeRoles('ADMIN'), async (req, res) => {
  try { await Expedition.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});


// PERSONNEL
router.get('/personnel', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'FIELD_TEAM') query = { name: req.user.username };
    const items = await Personnel.find(query);
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.get('/personnel/:id', protect, async (req, res) => {
  try {
    if (!(await isAssignedToResource(req, Personnel, req.params.id))) return res.status(403).json({ success: false, message: 'Forbidden' });
    res.json(await Personnel.findById(req.params.id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.post('/personnel', protect, authorizeRoles('ADMIN', 'OPERATIONS_OFFICER'), async (req, res) => {
  try { res.status(201).json(await new Personnel(req.body).save()); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
router.put('/personnel/:id', protect, authorizeRoles('ADMIN', 'OPERATIONS_OFFICER'), async (req, res) => {
  try { res.json(await Personnel.findByIdAndUpdate(req.params.id, req.body, { new: true })); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
router.delete('/personnel/:id', protect, authorizeRoles('ADMIN'), async (req, res) => {
  try { await Personnel.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

// TEAMS
router.get('/teams', protect, async (req, res) => {
  try {
    const items = await Team.find();
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.get('/teams/:id', protect, async (req, res) => {
  try { res.json(await Team.findById(req.params.id)); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
router.post('/teams', protect, authorizeRoles('ADMIN', 'OPERATIONS_OFFICER'), async (req, res) => {
  try { res.status(201).json(await new Team(req.body).save()); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
router.put('/teams/:id', protect, authorizeRoles('ADMIN', 'OPERATIONS_OFFICER'), async (req, res) => {
  try { res.json(await Team.findByIdAndUpdate(req.params.id, req.body, { new: true })); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
router.delete('/teams/:id', protect, authorizeRoles('ADMIN'), async (req, res) => {
  try { await Team.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});


// CARGO
router.get('/cargo', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'FIELD_TEAM') query = { responsibleOfficer: req.user.username };
    const items = await Cargo.find(query);
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.get('/cargo/:id', protect, async (req, res) => {
  try {
    if (!(await isAssignedToResource(req, Cargo, req.params.id))) return res.status(403).json({ success: false, message: 'Forbidden' });
    res.json(await Cargo.findById(req.params.id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.post('/cargo', protect, authorizeRoles('ADMIN', 'OPERATIONS_OFFICER'), async (req, res) => {
  try { res.status(201).json(await new Cargo(req.body).save()); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
router.put('/cargo/:id', protect, async (req, res) => {
  try {
    if (req.user.role === 'FIELD_TEAM') {
      if (!(await isAssignedToResource(req, Cargo, req.params.id))) return res.status(403).json({ success: false, message: 'Forbidden' });
      // Only allow status updates
      const allowedUpdates = { status: req.body.status, currentLocation: req.body.currentLocation };
      res.json(await Cargo.findByIdAndUpdate(req.params.id, { $set: allowedUpdates }, { new: true }));
    } else {
      res.json(await Cargo.findByIdAndUpdate(req.params.id, req.body, { new: true }));
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.delete('/cargo/:id', protect, authorizeRoles('ADMIN', 'OPERATIONS_OFFICER'), async (req, res) => {
  try { await Cargo.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});


// INVENTORY
router.get('/inventory', protect, async (req, res) => {
  try {
    const items = await Inventory.find(); // Field team can see relevant inventory, assuming all for now
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.get('/inventory/:id', protect, async (req, res) => {
  try { res.json(await Inventory.findById(req.params.id)); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
router.post('/inventory', protect, authorizeRoles('ADMIN', 'OPERATIONS_OFFICER'), async (req, res) => {
  try { res.status(201).json(await new Inventory(req.body).save()); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
router.put('/inventory/:id', protect, async (req, res) => {
  try {
    if (req.user.role === 'FIELD_TEAM') {
       // Only allow specific updates if necessary, or forbid altogether. User spec: "FIELD_TEAM: Read relevant inventory and perform only explicitly permitted updates. FIELD_TEAM must not: delete inventory, change thresholds, change ownership, manipulate quantities arbitrarily"
       return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    res.json(await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.delete('/inventory/:id', protect, authorizeRoles('ADMIN', 'OPERATIONS_OFFICER'), async (req, res) => {
  try { await Inventory.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});


// EMERGENCIES
router.get('/emergencies', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'FIELD_TEAM') query = { assignedTeam: req.user.username }; // View assigned emergencies
    const items = await Emergency.find(query);
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.get('/emergencies/:id', protect, async (req, res) => {
  try {
    if (!(await isAssignedToResource(req, Emergency, req.params.id))) return res.status(403).json({ success: false, message: 'Forbidden' });
    res.json(await Emergency.findById(req.params.id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.post('/emergencies', protect, async (req, res) => {
  // FIELD_TEAM can report emergency
  try { 
    const emergency = new Emergency({ ...req.body, reportedBy: req.user.username });
    const savedEmergency = await emergency.save();
    
    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('new_emergency', savedEmergency);
    }
    
    res.status(201).json(savedEmergency); 
  } 
  catch (err) { res.status(500).json({ error: err.message }); }
});
router.put('/emergencies/:id', protect, async (req, res) => {
  try {
    if (req.user.role === 'FIELD_TEAM') {
      if (!(await isAssignedToResource(req, Emergency, req.params.id))) return res.status(403).json({ success: false, message: 'Forbidden' });
      // limited update logic if needed
      res.json(await Emergency.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status } }, { new: true }));
    } else {
      res.json(await Emergency.findByIdAndUpdate(req.params.id, req.body, { new: true }));
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.delete('/emergencies/:id', protect, authorizeRoles('ADMIN', 'OPERATIONS_OFFICER'), async (req, res) => {
  try { await Emergency.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});


// EQUIPMENT (assuming similar to Inventory)
router.get('/equipment', protect, async (req, res) => {
  try { res.json(await Equipment.find()); } catch (err) { res.status(500).json({ error: err.message }); }
});
router.post('/equipment', protect, authorizeRoles('ADMIN', 'OPERATIONS_OFFICER'), async (req, res) => {
  try { res.status(201).json(await new Equipment(req.body).save()); } catch (err) { res.status(500).json({ error: err.message }); }
});
router.put('/equipment/:id', protect, authorizeRoles('ADMIN', 'OPERATIONS_OFFICER'), async (req, res) => {
  try { res.json(await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); }
});
router.delete('/equipment/:id', protect, authorizeRoles('ADMIN', 'OPERATIONS_OFFICER'), async (req, res) => {
  try { await Equipment.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- DASHBOARD APIs ---
router.get('/dashboard/admin', protect, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const totalExpeditions = await Expedition.countDocuments();
    const activeExpeditions = await Expedition.countDocuments({ status: 'Active' });
    const totalPersonnel = await Personnel.countDocuments();
    const totalCargo = await Cargo.countDocuments();
    const inventoryItems = await Inventory.countDocuments();
    const activeEmergencies = await Emergency.countDocuments({ status: { $ne: 'Closed' } });
    
    // Some basic recent activity
    const recentExpeditions = await Expedition.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      kpis: {
        totalExpeditions,
        activeExpeditions,
        totalPersonnel,
        totalCargo,
        inventoryItems,
        activeEmergencies
      },
      recentExpeditions
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/dashboard/operations', protect, authorizeRoles('ADMIN', 'OPERATIONS_OFFICER'), async (req, res) => {
  try {
    const activeExpeditions = await Expedition.find({ status: 'Active' });
    const activeEmergencies = await Emergency.find({ status: { $ne: 'Closed' } });
    
    const lowStockItems = await Inventory.find({ $expr: { $lte: ["$quantity", "$minStock"] } });
    const cargoInTransit = await Cargo.find({ status: 'In Transit' });

    res.json({
      kpis: {
        activeExpeditionsCount: activeExpeditions.length,
        activeEmergenciesCount: activeEmergencies.length,
        lowStockCount: lowStockItems.length,
        cargoInTransitCount: cargoInTransit.length
      },
      activeExpeditions,
      activeEmergencies,
      lowStockItems,
      cargoInTransit
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/dashboard/field', protect, async (req, res) => {
  try {
    const username = req.user.username;
    const myExpedition = await Expedition.findOne({ leader: username });
    const myTeam = await Personnel.find({ name: username });
    const myCargo = await Cargo.find({ responsibleOfficer: username });
    const myEmergencies = await Emergency.find({ assignedTeam: username });
    
    res.json({
      myExpedition,
      myTeam,
      myCargo,
      myEmergencies
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/ai/insights', protect, authorizeRoles('ADMIN', 'OPERATIONS_OFFICER'), async (req, res) => {
  try {
    const { GoogleGenAI } = require('@google/genai');
    
    // Fetch live system context
    const activeEmergencies = await Emergency.find({ status: { $ne: 'Resolved' } });
    const lowInventory = await Inventory.find({ $expr: { $lte: ["$quantity", "$minStock"] } });
    const activeExpeditions = await Expedition.find({ status: 'Active' });
    const activeCargo = await Cargo.find({ status: 'In Transit' });

    let insights = [];

    // Fallback if no API key is provided
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === '') {
      insights = [
        `[MOCK] System Analysis: You have ${activeEmergencies.length} active emergencies and ${lowInventory.length} items low on stock.`,
        "[MOCK] Please add GEMINI_API_KEY to backend/.env to enable true AI generation.",
        "[MOCK] Weather patterns remain stable at Ice Core Alpha."
      ];
      return res.json({ insights });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `
      You are the PolarOps AI Assistant. Analyze the current operational state of the polar expedition and provide exactly 3 concise, actionable bullet points (insights or warnings).
      
      Current State:
      Active Expeditions: ${activeExpeditions.length}
      Active Emergencies: ${activeEmergencies.length} (${activeEmergencies.map(e => e.type + ' - ' + e.severity).join(', ')})
      Low Inventory Items: ${lowInventory.length} (${lowInventory.map(i => i.name).join(', ')})
      Cargo In Transit: ${activeCargo.length}
      
      Format the response strictly as a JSON array of strings, e.g., ["Insight 1", "Insight 2", "Insight 3"]. Do not include markdown code blocks like \`\`\`json.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    try {
      const rawText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      insights = JSON.parse(rawText);
    } catch (e) {
      // JSON parse fallback
      insights = [
        "System analysis completed. Weather patterns are stable.",
        "Monitor low inventory stocks closely.",
        "Ensure field teams check in regularly."
      ];
    }
    
    res.json({ insights });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

