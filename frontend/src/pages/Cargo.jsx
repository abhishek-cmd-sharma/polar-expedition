import React, { useState, useEffect } from 'react';
import { Truck, Ship, CheckCircle, PackageSearch, Plus, X } from 'lucide-react';

const Cargo = () => {
  const [cargoList, setCargoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: `CRG-${Math.floor(Math.random() * 10000)}`,
    name: '',
    category: 'Equipment',
    weight: '500kg',
    status: 'Prepared',
    origin: 'Base Camp',
    destination: 'Ice Core Alpha',
    currentLoc: 'Warehouse A',
    responsibleOfficer: ''
  });

  const fetchCargo = () => {
    fetch('http://localhost:5000/api/cargo', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setCargoList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching cargo:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCargo();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/cargo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowModal(false);
        setFormData({ ...formData, id: `CRG-${Math.floor(Math.random() * 10000)}`, name: '', responsibleOfficer: '' });
        fetchCargo();
      }
    } catch (err) {
      console.error('Error creating cargo:', err);
    }
  };

  const statuses = ['Prepared', 'Loaded', 'In Transit', 'Arrived', 'Delivered'];
  const getStatusIndex = (status) => Math.max(0, statuses.indexOf(status));

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Cargo Tracking</h2>
        <div className="flex space-x-2">
          <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md flex items-center transition-colors">
            <PackageSearch className="w-4 h-4 mr-2" />
            Scan QR
          </button>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-1" /> New Cargo
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-600 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Create New Cargo Manifest</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Cargo Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Drill Equipment" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                    <option value="Equipment">Equipment</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Scientific">Scientific</option>
                    <option value="Food">Food</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Weight</label>
                  <input required type="text" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Origin</label>
                  <input required type="text" name="origin" value={formData.origin} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Destination</label>
                  <input required type="text" name="destination" value={formData.destination} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Responsible Officer</label>
                <input required type="text" name="responsibleOfficer" value={formData.responsibleOfficer} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Username of officer" />
              </div>
              <div className="flex justify-end pt-4 space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold">Save Cargo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {cargoList.map((cargo) => (
          <div key={cargo._id || cargo.id} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">{cargo.name}</h3>
                <div className="text-sm text-slate-400 mt-1 flex space-x-4">
                  <span>ID: {cargo.id}</span>
                  <span>Cat: {cargo.category}</span>
                  <span>Wt: {cargo.weight}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">Current Location</div>
                <div className="text-md font-semibold text-blue-400 flex items-center justify-end">
                  <Ship className="w-4 h-4 mr-1" />
                  {cargo.currentLoc}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-700">
                <div style={{ width: `${(getStatusIndex(cargo.status) / (statuses.length - 1)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                {statuses.map((step, idx) => (
                  <div key={step} className={`flex flex-col items-center ${idx <= getStatusIndex(cargo.status) ? 'text-blue-400' : ''}`}>
                    <CheckCircle className={`w-4 h-4 mb-1 ${idx <= getStatusIndex(cargo.status) ? 'text-blue-500' : 'text-slate-600'}`} />
                    {step}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between text-sm text-slate-400">
              <div>Route: {cargo.origin} &rarr; {cargo.destination}</div>
              <a href="#" className="text-blue-400 hover:text-blue-300">View Details</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cargo;
