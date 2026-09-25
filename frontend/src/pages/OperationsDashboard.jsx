import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Package, AlertTriangle, Archive, Navigation, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const OperationsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/operations', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch operations data');
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

  if (loading) return <div className="text-white text-center py-10 animate-pulse">Loading Operations Control Center...</div>;
  if (error) return (
    <div className="text-center py-10">
      <p className="text-red-400 mb-4">{error}</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 rounded text-white">Retry</button>
    </div>
  );

  const { kpis, activeExpeditions, activeEmergencies, lowStockItems } = data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Operations Control Center</h2>
        <button onClick={() => navigate('/emergencies')} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-bold flex items-center transition-colors">
          <AlertTriangle className="mr-2 h-4 w-4" /> Report Emergency
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Active Expeditions</p>
          <h3 className="text-2xl font-bold text-blue-400">{kpis.activeExpeditionsCount}</h3>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Cargo In Transit</p>
          <h3 className="text-2xl font-bold text-yellow-400">{kpis.cargoInTransitCount}</h3>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Low Stock Items</p>
          <h3 className="text-2xl font-bold text-orange-400">{kpis.lowStockCount}</h3>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Open Emergencies</p>
          <h3 className="text-2xl font-bold text-red-500">{kpis.activeEmergenciesCount}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Center & Alerts */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" /> Operational Risk Center
          </h3>
          
          <div className="space-y-3">
            {activeEmergencies.length > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
                <p className="text-sm text-red-400 font-medium">Critical: {activeEmergencies.length} Active Emergencies</p>
              </div>
            )}
            {lowStockItems.length > 0 && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded">
                <p className="text-sm text-orange-400 font-medium">Warning: {lowStockItems.length} items below minimum stock threshold.</p>
              </div>
            )}
            <div className="p-4 bg-slate-900 border border-slate-700 rounded relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <p className="text-xs font-bold text-blue-400 mb-1 flex items-center"><Info className="mr-1 h-3 w-3"/> AI INSIGHT</p>
              <p className="text-sm text-slate-300">Based on current burn rates, Aviation Fuel (INV-001) will require resupply within 12 days for Operation Deep Freeze.</p>
            </div>
          </div>
        </div>

        {/* Live Map Placeholder */}
        <div className="lg:col-span-2 bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Navigation className="mr-2 h-5 w-5 text-emerald-400" /> Live Tracking Map
          </h3>
          <div className="w-full h-80 bg-slate-900 rounded border border-slate-700 flex flex-col items-center justify-center text-slate-500">
            <MapIcon className="h-12 w-12 mb-2 text-slate-600" />
            <p>Leaflet / OpenStreetMap Integration</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsDashboard;
