import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [cargoData, setCargoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        const invRes = await fetch('http://localhost:5000/api/inventory', { headers });
        const cargoRes = await fetch('http://localhost:5000/api/cargo', { headers });
        
        if (invRes.ok) {
          const invList = await invRes.json();
          // Transform inventory for Recharts
          const mappedInv = invList.map(item => ({
            name: item.name.substring(0, 10),
            current: item.quantity,
            min: item.minStock
          }));
          setInventoryData(mappedInv);
        }
        
        if (cargoRes.ok) {
          const cargoList = await cargoRes.json();
          const delivered = cargoList.filter(c => c.status === 'Delivered').length;
          const inTransit = cargoList.filter(c => c.status === 'In Transit').length;
          const delayed = cargoList.filter(c => c.status === 'Delayed').length;
          setCargoData([
            { name: 'Delivered', value: delivered, color: '#10b981' },
            { name: 'In Transit', value: inTransit, color: '#3b82f6' },
            { name: 'Delayed', value: delayed, color: '#ef4444' },
          ]);
        }
      } catch (err) {
        console.error('Error fetching analytics data', err);
      }
    };
    
    fetchData();
  }, []);

  const consumptionTrend = [
    { day: 'Mon', fuel: 85, food: 6 },
    { day: 'Tue', fuel: 82, food: 5 },
    { day: 'Wed', fuel: 90, food: 5 },
    { day: 'Thu', fuel: 75, food: 4 },
    { day: 'Fri', fuel: 88, food: 5 },
    { day: 'Sat', fuel: 110, food: 7 },
    { day: 'Sun', fuel: 95, food: 6 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics & Reports</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Levels */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Inventory Status</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                <Legend />
                <Bar dataKey="current" fill="#3b82f6" name="Current Stock" />
                <Bar dataKey="min" fill="#ef4444" name="Minimum Required" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cargo Status */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Cargo Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cargoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cargoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consumption Trends */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Weekly Consumption Trends (Fuel & Food)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consumptionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis yAxisId="left" stroke="#3b82f6" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="fuel" stroke="#3b82f6" name="Fuel (L)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="food" stroke="#10b981" name="Food (Boxes)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
