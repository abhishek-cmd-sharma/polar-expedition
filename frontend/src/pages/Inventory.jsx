import React, { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import axios from 'axios';

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    itemId: `INV-${Math.floor(Math.random() * 10000)}`,
    name: '',
    category: 'Food',
    quantity: 1000,
    unit: 'kg',
    minStock: 200,
    consumptionRate: 50,
    location: 'Base Camp',
    lastUpdated: new Date()
  });

  const fetchInventory = () => {
    fetch('http://localhost:5000/api/inventory', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setInventoryItems(data);
      })
      .catch(err => console.error('Error fetching inventory:', err));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowModal(false);
        setFormData({ ...formData, itemId: `INV-${Math.floor(Math.random() * 10000)}`, name: '' });
        fetchInventory();
      }
    } catch (err) {
      console.error('Error adding inventory:', err);
    }
  };

  const getStatus = (item) => {
    const qty = item.quantity || item.qty;
    const cons = item.consumptionRate || item.consumption;
    const daysRemaining = cons > 0 ? qty / cons : 999;
    
    if (qty <= item.minStock || daysRemaining < 7) {
      return { label: 'CRITICAL', color: 'bg-red-900 text-red-200', msg: `Replenish! Only ${Math.floor(daysRemaining)} days left.` };
    } else if (daysRemaining < 20) {
      return { label: 'WARNING', color: 'bg-yellow-900 text-yellow-200', msg: 'Schedule replenishment soon.' };
    }
    return { label: 'HEALTHY', color: 'bg-green-900 text-green-200', msg: 'Stock levels optimal.' };
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:border-blue-500"
            />
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center font-bold">
            <Plus className="w-4 h-4 mr-1" /> New Item
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-600 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Add Inventory Item</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Item Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Diesel Fuel" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                    <option value="Food">Food</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Medical">Medical</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Unit</label>
                  <input required type="text" name="unit" value={formData.unit} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="kg, L, boxes" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Initial Quantity</label>
                  <input required type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Min Stock Threshold</label>
                  <input required type="number" name="minStock" value={formData.minStock} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Daily Consumption</label>
                  <input required type="number" name="consumptionRate" value={formData.consumptionRate} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Location</label>
                  <input required type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                </div>
              </div>
              <div className="flex justify-end pt-4 space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inventoryItems.map((item) => {
          const status = getStatus(item);
          return (
            <div key={item._id || item.id} className="bg-slate-800 rounded-lg border border-slate-700 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <span className="text-sm text-slate-400">{item.category} | {item.itemId || item.id}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider">Current Stock</div>
                    <div className="text-2xl font-bold text-white mt-1">{item.quantity || item.qty} <span className="text-sm font-normal text-slate-400">{item.unit}</span></div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider">Min Stock</div>
                    <div className="text-xl font-medium text-slate-300 mt-1">{item.minStock} {item.unit}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider">Daily Usage</div>
                    <div className="text-lg text-slate-300 mt-1">~{item.consumptionRate || item.consumption} {item.unit}/day</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider">Est. Remaining</div>
                    <div className="text-lg text-slate-300 mt-1">{Math.floor((item.quantity || item.qty) / (item.consumptionRate || item.consumption || 1))} days</div>
                  </div>
                </div>
              </div>
              
              <div className={`mt-6 p-3 rounded text-sm ${status.label === 'CRITICAL' ? 'bg-red-900/30 border border-red-900/50 text-red-300' : 'bg-slate-900 text-slate-400'}`}>
                {status.msg}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Inventory;
