import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Users, UserPlus, X } from 'lucide-react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    teamId: '',
    name: '',
    location: '',
    members: 0,
    status: 'Standby'
  });

  const fetchTeams = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/teams`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowModal(false);
        setFormData({ teamId: '', name: '', location: '', members: 0, status: 'Standby' });
        fetchTeams();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create team');
      }
    } catch (err) {
      console.error('Error creating team:', err);
    }
  };

  return (
    <div className="space-y-6 text-white relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Users className="w-6 h-6 mr-2 text-indigo-400" />
          Field Teams
        </h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold flex items-center transition-colors"
        >
          <UserPlus className="w-4 h-4 mr-2" /> Create Team
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create New Team</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Team ID</label>
                <input required type="text" name="teamId" value={formData.teamId} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="T-Delta" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Team Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Engineering Team" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Location</label>
                <input required type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="Base Camp" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Personnel Count</label>
                  <input required type="number" name="members" value={formData.members} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                    <option value="Standby">Standby</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Deployed">Deployed</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-4 space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold">Create Team</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {teams.length === 0 ? (
        <div className="text-center py-10 bg-slate-800 rounded-lg border border-slate-700 text-slate-400">
          No teams found. Click "Create Team" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teams.map(team => (
            <div key={team._id || team.id} className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{team.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                    team.status === 'Deployed' ? 'bg-purple-900/50 text-purple-400' :
                    team.status === 'In Transit' ? 'bg-blue-900/50 text-blue-400' :
                    'bg-green-900/50 text-green-400'
                  }`}>
                    {team.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-300">
                  <p><span className="text-slate-500">Team ID:</span> {team.teamId || team.id}</p>
                  <p><span className="text-slate-500">Location:</span> {team.location}</p>
                  <p><span className="text-slate-500">Personnel Count:</span> {team.members}</p>
                </div>
              </div>
              <button className="mt-6 w-full py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors text-sm font-medium">
                Manage Roster
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
