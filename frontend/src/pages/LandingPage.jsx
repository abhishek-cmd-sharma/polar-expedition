import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, Map, Package, BrainCircuit, Users, Navigation } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      title: "Real-time Operations Dashboard",
      description: "Monitor active expeditions, transit cargo, low stock alerts, and open emergencies from a single, dark-mode optimized control center.",
      icon: Activity
    },
    {
      title: "Role-Based Access Control",
      description: "Dynamic access for Admins, Operations Officers, and Field Teams ensuring secure, need-to-know information access.",
      icon: Shield
    },
    {
      title: "Live Emergency Response",
      description: "WebSocket-powered instant notifications allow field teams to report hazards and receive immediate support globally.",
      icon: Navigation
    },
    {
      title: "Logistics & Inventory Management",
      description: "Track personnel, cargo, equipment, and stock thresholds to ensure zero resource outages during critical missions.",
      icon: Package
    },
    {
      title: "AI Insights Engine",
      description: "Leverage Google Gemini AI to analyze burn rates, transit delays, and generate predictive operational summaries.",
      icon: BrainCircuit
    },
    {
      title: "Interactive Mapping",
      description: "Live tracking of expeditions and movement vectors using interactive spatial dashboards.",
      icon: Map
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center border-b border-slate-800">
        <div className="font-bold text-2xl tracking-widest text-blue-400 flex items-center">
          <Navigation className="mr-3 h-8 w-8 text-blue-500" />
          POLAR COMMAND
        </div>
        <Link 
          to="/login" 
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors"
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="px-8 py-20 md:py-32 max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Command the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Extreme</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            The ultimate logistics and emergency management system designed exclusively for polar expeditions, isolated research stations, and extreme environment operations.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/login" 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-bold transition-transform hover:scale-105 shadow-lg shadow-blue-900/50"
            >
              Access Command Center
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-slate-800/50 py-20 border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-3xl font-bold text-center mb-16">Platform Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                  <feature.icon className="h-12 w-12 text-blue-400 mb-6" />
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-8 py-10 bg-slate-900 border-t border-slate-800 text-center text-slate-500">
        <p>&copy; 2026 Polar Command Systems. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
