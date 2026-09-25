import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const RiskCenter = () => {
  const [data, setData] = useState({ activeEmergencies: [], lowStockItems: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/dashboard/operations`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-white">Loading Risk Analysis...</div>;

  const { activeEmergencies = [], lowStockItems = [] } = data;

  return (
    <div className="space-y-6 text-white max-w-5xl">
      <h2 className="text-2xl font-bold flex items-center text-orange-500">
        <ShieldAlert className="w-6 h-6 mr-2" />
        Operational Risk Center
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-bold mb-4 flex items-center text-red-400">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Critical Vulnerabilities
          </h3>
          {activeEmergencies.length === 0 ? (
            <p className="text-slate-400">No active emergencies detected.</p>
          ) : (
            <ul className="space-y-3">
              {activeEmergencies.map(em => (
                <li key={em._id} className="p-3 bg-red-900/20 border border-red-900/50 rounded text-sm">
                  <span className="font-bold text-red-400">{em.type}</span> - {em.location} ({em.status})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-bold mb-4 flex items-center text-yellow-400">
            <Info className="w-5 h-5 mr-2" />
            Resource Depletion Risks
          </h3>
          {lowStockItems.length === 0 ? (
            <p className="text-slate-400">All inventory levels are optimal.</p>
          ) : (
            <ul className="space-y-3">
              {lowStockItems.map(item => (
                <li key={item._id} className="p-3 bg-yellow-900/20 border border-yellow-900/50 rounded text-sm">
                  <span className="font-bold text-yellow-400">{item.name}</span> is critically low ({item.quantity} {item.unit} remaining).
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h3 className="text-lg font-bold mb-4 flex items-center text-emerald-400">
          <CheckCircle className="w-5 h-5 mr-2" />
          Mitigation Strategies (AI Generated)
        </h3>
        <p className="text-sm text-slate-300">
          1. Divert supply lines to Maitri Station within 48 hours to resolve resource depletion risks.<br/><br/>
          2. Maintain secondary medical team on standby for the active emergency reported at Field Camp B.
        </p>
      </div>
    </div>
  );
};

export default RiskCenter;
