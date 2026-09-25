import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
      <AlertTriangle className="h-24 w-24 text-red-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">403 - Unauthorized</h1>
      <p className="text-lg text-slate-400 mb-8">You do not have permission to access this page.</p>
      <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Return to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
