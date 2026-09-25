import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, Activity, ShieldAlert, X } from 'lucide-react';

const Emergencies = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    emergencyId: `EMG-${Math.floor(Math.random() * 10000)}`,
    type: 'Medical',
    severity: 'MEDIUM',
    location: '',
    description: '',
    time: new Date(),
    status: 'Reported',
    assignedTeam: 'Unassigned',
    recommendation: 'Awaiting AI Analysis'
  });

  const fetchEmergencies = () => {
    fetch('http://localhost:5000/api/emergencies', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setEmergencies(data);
      })
      .catch(err => console.error('Error fetching emergencies:', err));
  };

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/emergencies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowModal(false);
        setFormData({ ...formData, emergencyId: `EMG-${Math.floor(Math.random() * 10000)}`, location: '', description: '' });
        fetchEmergencies();
      } else {
        const errorData = await response.json();
        console.error('Error from server:', errorData);
      }
    } catch (err) {
      console.error('Error reporting emergency:', err);
    }
  };

  const resolveEmergency = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/emergencies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'Resolved' })
      });
      fetchEmergencies();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center text-red-500">
          <ShieldAlert className="w-6 h-6 mr-2" />
          Emergency Response Center
        </h2>
        <button onClick={() => setShowModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-bold transition-colors animate-pulse">
          REPORT EMERGENCY
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg border border-red-500 w-full max-w-lg shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-400">Report Critical Emergency</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Emergency Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                  <option value="Medical">Medical</option>
                  <option value="Weather">Weather Alert</option>
                  <option value="Equipment Failure">Equipment Failure</option>
                  <option value="Lost Personnel">Lost Personnel</option>
                  <option value="Fire">Fire</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Severity</label>
                <select name="severity" value={formData.severity} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Location</label>
                <input required type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Coordinate or Base name" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Describe the situation..." rows="3"></textarea>
              </div>
              <div className="flex justify-end pt-4 space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-bold">SEND ALERT</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {emergencies.length === 0 && (
        <div className="text-center py-10 bg-slate-800 rounded border border-slate-700 text-slate-400">
          No active emergencies.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {emergencies.map((em) => (
          <div key={em._id || em.id} className={`bg-slate-800 rounded-lg border ${em.severity === 'CRITICAL' && em.status !== 'Resolved' ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-slate-700'} p-6`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${em.severity === 'CRITICAL' ? 'bg-red-900/50 text-red-500' : 'bg-yellow-900/50 text-yellow-500'}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{em.type} Emergency</h3>
                  <span className="text-sm text-slate-400">Incident ID: {em.id || em._id}</span>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${em.severity === 'CRITICAL' ? 'bg-red-600 text-white' : (em.status === 'Resolved' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white')}`}>
                {em.status === 'Resolved' ? 'RESOLVED' : em.severity}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-slate-300">
                <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                {em.location}
              </div>
              <div className="flex items-center text-slate-300">
                <Clock className="w-4 h-4 mr-2 text-slate-500" />
                {em.time || new Date(em.createdAt).toLocaleTimeString()}
              </div>
              <div className="flex items-center text-slate-300">
                <Activity className="w-4 h-4 mr-2 text-slate-500" />
                Status: <span className="ml-1 text-white font-medium">{em.status}</span>
              </div>
            </div>

            <div className={`p-4 rounded-md border ${em.severity === 'CRITICAL' && em.status !== 'Resolved' ? 'bg-red-900/20 border-red-900/50' : 'bg-slate-900 border-slate-700'}`}>
              <div className="text-sm font-semibold text-slate-300 mb-1">Description / Recommendation:</div>
              <div className={`text-sm ${em.severity === 'CRITICAL' && em.status !== 'Resolved' ? 'text-red-400' : 'text-slate-400'}`}>
                {em.description || em.recommendation}
              </div>
              
              {em.status !== 'Resolved' && (
                <div className="mt-4 flex space-x-3">
                  <button onClick={() => resolveEmergency(em._id)} className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded transition-colors">
                    Mark Resolved
                  </button>
                  <button className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-4 py-2 rounded transition-colors">
                    Acknowledge
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Emergencies;
