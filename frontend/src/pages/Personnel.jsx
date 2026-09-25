import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

const Personnel = () => {
  const [personnelList, setPersonnelList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: `P-${Math.floor(Math.random() * 10000)}`,
    name: '',
    role: 'Field Scientist',
    dept: 'Research',
    location: 'Base Camp',
    status: 'Stationed'
  });

  const fetchPersonnel = () => {
    fetch(`${API_BASE_URL}/api/personnel`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setPersonnelList(data);
      })
      .catch(err => console.error('Error fetching personnel:', err));
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/personnel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowModal(false);
        setFormData({ ...formData, id: `P-${Math.floor(Math.random() * 10000)}`, name: '' });
        fetchPersonnel();
      }
    } catch (err) {
      console.error('Error adding personnel:', err);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Personnel Management</h2>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-bold transition-colors flex items-center">
          <Plus className="w-5 h-5 mr-1" /> Add Personnel
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-600 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Add New Personnel</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Role</label>
                <input required type="text" name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Department</label>
                <input required type="text" name="dept" value={formData.dept} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Location</label>
                  <input required type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                    <option value="Stationed">Stationed</option>
                    <option value="Field Deployment">Field Deployment</option>
                    <option value="In Transit">In Transit</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-4 space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold">Save Personnel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID & Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role & Dept</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Current Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {personnelList.map((person) => (
              <tr key={person._id || person.id} className="hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{person.name}</div>
                  <div className="text-sm text-slate-400">{person.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-300">{person.role}</div>
                  <div className="text-xs text-slate-500">{person.dept}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{person.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${person.status === 'Field Deployment' ? 'bg-purple-900 text-purple-200' : 
                      person.status === 'In Transit' ? 'bg-blue-900 text-blue-200' : 
                      'bg-green-900 text-green-200'}`}>
                    {person.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Personnel;
