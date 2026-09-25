import React, { useState, useEffect } from 'react';
import { MapPin, Users, Package, AlertOctagon, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FieldDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/field', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch field dashboard data');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-white text-center py-10 animate-pulse">Loading Field Dashboard...</div>;
  if (error) return (
    <div className="text-center py-10">
      <p className="text-red-400 mb-4">{error}</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 rounded text-white">Retry</button>
    </div>
  );

  const { myExpedition, myTeam, myCargo, myEmergencies } = data;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome, {user?.username}</h2>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="bg-slate-900 p-3 rounded border border-slate-700 flex-1 min-w-[200px]">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Assigned Expedition</p>
            <p className="font-bold text-blue-400 text-lg">{myExpedition ? myExpedition.name : 'None'}</p>
          </div>
          <div className="bg-slate-900 p-3 rounded border border-slate-700 flex-1 min-w-[200px]">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Status</p>
            <p className="font-bold text-emerald-400 text-lg">{myExpedition ? myExpedition.status : 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
          <Users className="h-6 w-6 text-indigo-400 mx-auto mb-2" />
          <h3 className="text-xl font-bold text-white">{myTeam.length}</h3>
          <p className="text-xs text-slate-400">Team Members</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
          <MapPin className="h-6 w-6 text-blue-400 mx-auto mb-2" />
          <h3 className="text-xl font-bold text-white text-sm truncate">{myExpedition ? myExpedition.destination : 'N/A'}</h3>
          <p className="text-xs text-slate-400">Location</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
          <Package className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
          <h3 className="text-xl font-bold text-white">{myCargo.length}</h3>
          <p className="text-xs text-slate-400">Assigned Cargo</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
          <AlertOctagon className={`h-6 w-6 mx-auto mb-2 ${myEmergencies.length > 0 ? 'text-red-500' : 'text-slate-500'}`} />
          <h3 className="text-xl font-bold text-white">{myEmergencies.length}</h3>
          <p className="text-xs text-slate-400">Open Emergencies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-emerald-400" /> My Tasks
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-slate-900 rounded border border-slate-700 flex justify-between items-center">
              <span className="text-sm text-slate-300">Set up base camp communications</span>
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Pending</span>
            </div>
            <div className="p-3 bg-slate-900 rounded border border-slate-700 flex justify-between items-center">
              <span className="text-sm text-slate-300">Verify inventory levels</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Completed</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-red-900/50 p-6 flex flex-col justify-center items-center text-center">
          <AlertOctagon className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Emergency Report</h3>
          <p className="text-sm text-slate-400 mb-6">Use this to immediately alert Operations Command of any critical incidents.</p>
          <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded font-bold shadow-lg shadow-red-900/20">
            🚨 REPORT EMERGENCY
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldDashboard;
