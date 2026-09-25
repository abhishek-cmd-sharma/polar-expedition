import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Lightbulb, TrendingUp, AlertCircle, Loader } from 'lucide-react';

const AIInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/ai/insights', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.insights) {
          setInsights(data.insights);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching AI insights:', err);
        setLoading(false);
      });
  }, []);

  const icons = [Lightbulb, TrendingUp, AlertCircle];
  const colors = ['blue', 'emerald', 'purple'];

  return (
    <div className="space-y-6 text-white max-w-5xl">
      <h2 className="text-2xl font-bold flex items-center text-blue-400">
        <BrainCircuit className="w-6 h-6 mr-2" />
        AI Insights & Predictive Analytics (Powered by Gemini)
      </h2>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-800 rounded-lg border border-slate-700">
          <Loader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-400">Gemini AI is analyzing live mission parameters...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, idx) => {
            const Icon = icons[idx % icons.length];
            const color = colors[idx % colors.length];
            
            return (
              <div key={idx} className={`bg-slate-800 p-6 rounded-lg border border-${color}-900/50 shadow-[0_0_15px_rgba(59,130,246,0.1)] relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-1 h-full bg-${color}-500`}></div>
                <Icon className={`w-8 h-8 text-${color}-400 mb-4`} />
                <h3 className="text-lg font-bold mb-2">Operational Insight {idx + 1}</h3>
                <p className="text-sm text-slate-300">{insight}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AIInsights;
