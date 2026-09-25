import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';

const Equipment = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/equipment', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setEquipmentList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching equipment:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Equipment & Asset Management</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
         <div className="bg-slate-800 p-4 rounded border border-slate-700 text-center">
            <div className="text-2xl font-bold text-green-400">2</div>
            <div className="text-xs text-slate-400">Operational</div>
         </div>
         <div className="bg-slate-800 p-4 rounded border border-slate-700 text-center">
            <div className="text-2xl font-bold text-yellow-500">1</div>
            <div className="text-xs text-slate-400">Maintenance Due</div>
         </div>
         <div className="bg-slate-800 p-4 rounded border border-slate-700 text-center">
            <div className="text-2xl font-bold text-blue-400">1</div>
            <div className="text-xs text-slate-400">Under Maintenance</div>
         </div>
         <div className="bg-slate-800 p-4 rounded border border-slate-700 text-center">
            <div className="text-2xl font-bold text-red-500">0</div>
            <div className="text-xs text-slate-400">Critical / Failed</div>
         </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Equipment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Next Maintenance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {equipmentList.map((eq) => (
              <tr key={eq.id} className="hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{eq.name}</div>
                  <div className="text-sm text-slate-400">{eq.id} | {eq.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{eq.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{eq.nextMaint}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${eq.status === 'Operational' ? 'bg-green-900 text-green-200' : 
                      eq.status === 'Maintenance Due' ? 'bg-yellow-900 text-yellow-200' : 
                      'bg-blue-900 text-blue-200'}`}>
                    {eq.status}
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

export default Equipment;
