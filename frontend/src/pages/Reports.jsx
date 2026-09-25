import React from 'react';
import { FileText, Download, Filter } from 'lucide-react';

const Reports = () => {
  const reports = [
    { id: 'REP-01', name: 'Weekly Expedition Summary', date: '2026-09-20', type: 'Operational' },
    { id: 'REP-02', name: 'Monthly Inventory Burn Rate', date: '2026-09-01', type: 'Analytics' },
    { id: 'REP-03', name: 'Emergency Incident Report ER-102', date: '2026-09-24', type: 'Incident' },
  ];

  return (
    <div className="space-y-6 text-white max-w-5xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <FileText className="w-6 h-6 mr-2 text-blue-400" />
          System Reports
        </h2>
        <div className="flex space-x-2">
          <button className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded font-bold flex items-center transition-colors">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reports.map(rep => (
          <div key={rep.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-between items-center hover:bg-slate-750 transition-colors">
            <div className="flex items-center">
              <div className="p-3 bg-slate-900 rounded text-blue-400 mr-4">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{rep.name}</h3>
                <div className="text-sm text-slate-400 space-x-4">
                  <span>ID: {rep.id}</span>
                  <span>Date: {rep.date}</span>
                  <span>Type: {rep.type}</span>
                </div>
              </div>
            </div>
            <button className="bg-slate-700 hover:bg-slate-600 p-2 rounded text-slate-300 hover:text-white transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
