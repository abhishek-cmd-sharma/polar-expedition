import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Users, Map as MapIcon, Package, AlertTriangle, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const KPICard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex items-center justify-between">
    <div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
    <div className={`p-4 rounded-full ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/admin', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch admin dashboard data');
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

  if (loading) return <div className="text-white text-center py-10 animate-pulse">Loading Admin Command Center...</div>;
  if (error) return (
    <div className="text-center py-10">
      <p className="text-red-400 mb-4">{error}</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 rounded text-white">Retry</button>
    </div>
  );

  const { kpis, recentExpeditions } = data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Admin Command Center</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">Manage Users</button>
          <button className="px-4 py-2 bg-slate-700 text-white rounded text-sm font-medium hover:bg-slate-600">View Reports</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Expeditions" value={kpis.totalExpeditions} icon={MapIcon} color="bg-blue-500" />
        <KPICard title="Total Personnel" value={kpis.totalPersonnel} icon={Users} color="bg-indigo-500" />
        <KPICard title="Cargo Modules" value={kpis.totalCargo} icon={Package} color="bg-emerald-500" />
        <KPICard title="Active Emergencies" value={kpis.activeEmergencies} icon={AlertTriangle} color={kpis.activeEmergencies > 0 ? "bg-red-500" : "bg-slate-600"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Activity className="mr-2 h-5 w-5 text-blue-400" /> System Overview
          </h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-slate-600 rounded bg-slate-900/50">
            <p className="text-slate-500 text-sm">System Resource Utilization Chart</p>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Expeditions</h3>
          <div className="space-y-4">
            {recentExpeditions && recentExpeditions.length > 0 ? recentExpeditions.map(exp => (
              <div key={exp._id} className="p-3 bg-slate-700/50 rounded flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-white">{exp.name}</p>
                  <p className="text-xs text-slate-400">{exp.missionType}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-400">{exp.status}</span>
              </div>
            )) : <p className="text-sm text-slate-400">No recent expeditions.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
