import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import axios from 'axios';

const Expeditions = () => {
  const [expeditions, setExpeditions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    expeditionId: '',
    name: '',
    missionType: '',
    leader: '',
    status: 'Planned',
    startDate: '',
    endDate: ''
  });

  const fetchExpeditions = () => {
    fetch(`${API_BASE_URL}/api/expeditions`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setExpeditions(data);
      })
      .catch(err => console.error('Error fetching expeditions:', err));
  };

  useEffect(() => {
    fetchExpeditions();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/expeditions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowModal(false);
        setFormData({ expeditionId: '', name: '', missionType: '', leader: '', status: 'Planned', startDate: '', endDate: '' });
        fetchExpeditions();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create expedition');
      }
    } catch (err) {
      console.error('Error creating expedition:', err);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Expeditions</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Expedition
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create New Expedition</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Expedition ID</label>
                <input required type="text" name="expeditionId" value={formData.expeditionId} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="EXP-101" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Operation name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Mission Type</label>
                  <input required type="text" name="missionType" value={formData.missionType} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Scientific, Logistics..." />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Leader</label>
                  <input required type="text" name="leader" value={formData.leader} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Username of leader" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Start Date</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">End Date</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                  <option value="Planned">Planned</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end pt-4 space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold">Create Expedition</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Leader</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Dates</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {expeditions.map((exp) => (
              <tr key={exp._id || exp.id} className="hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{exp.expeditionId || exp.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{exp.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{exp.missionType || exp.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{exp.leader}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${exp.status === 'Active' ? 'bg-green-900 text-green-200' : 
                      exp.status === 'Preparing' ? 'bg-yellow-900 text-yellow-200' : 
                      'bg-slate-600 text-slate-200'}`}>
                    {exp.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : (exp.start || 'TBD')} to {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : (exp.end || 'TBD')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-blue-400 hover:text-blue-300">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expeditions;
