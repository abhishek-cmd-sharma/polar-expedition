import React from 'react';
import { Compass, Clock, ArrowRight } from 'lucide-react';

const Movement = () => {
  const movements = [
    { id: 'MOV-1', entity: 'Science Team Alpha', type: 'Personnel', from: 'Maitri Station', to: 'Ice Core Beta', status: 'In Progress', time: '10:30 UTC' },
    { id: 'MOV-2', entity: 'CRG-10452', type: 'Cargo', from: 'India Port', to: 'Supply Ship', status: 'Completed', time: '04:15 UTC' },
    { id: 'MOV-3', entity: 'Vehicle V-09', type: 'Equipment', from: 'Field Camp B', to: 'Maitri Station', status: 'Delayed', time: '12:00 UTC' },
  ];

  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Compass className="w-6 h-6 mr-2 text-blue-400" />
          Movement Logs
        </h2>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold transition-colors">
          Log New Movement
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">Entity</th>
              <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">Route</th>
              <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">Time (UTC)</th>
              <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {movements.map(mov => (
              <tr key={mov.id} className="hover:bg-slate-700/50">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{mov.entity}</div>
                  <div className="text-xs text-slate-400">{mov.type}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-slate-300">
                    {mov.from} <ArrowRight className="w-4 h-4 mx-2 text-slate-500" /> {mov.to}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300 flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-slate-500" /> {mov.time}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                    mov.status === 'Completed' ? 'bg-green-900/50 text-green-400' :
                    mov.status === 'In Progress' ? 'bg-blue-900/50 text-blue-400' :
                    'bg-yellow-900/50 text-yellow-400'
                  }`}>
                    {mov.status}
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

export default Movement;
