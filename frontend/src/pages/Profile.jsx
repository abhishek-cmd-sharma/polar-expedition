import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Key, Activity, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        }
      } catch (err) {
        console.error('Error fetching profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-white text-center py-10">Loading Profile...</div>;
  if (!profileData) return <div className="text-white text-center py-10">Error loading profile data.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">User Profile</h2>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-xl">
        <div className="h-32 bg-gradient-to-r from-blue-900 to-indigo-900"></div>
        <div className="px-8 pb-8 relative">
          
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="bg-slate-700 h-24 w-24 rounded-full flex items-center justify-center border-4 border-slate-800 shadow-lg">
              <User className="h-12 w-12 text-slate-300" />
            </div>
            <span className="px-4 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/50 rounded-full text-sm font-bold tracking-wider">
              {profileData.role.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white capitalize">{profileData.username}</h1>
            <p className="text-slate-400 flex items-center"><Mail className="h-4 w-4 mr-2" /> {profileData.username.toLowerCase()}@polarops.gov</p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-400" /> Security Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">System ID</p>
                  <p className="text-sm font-mono text-slate-300">{profileData.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Access Level</p>
                  <p className="text-sm text-slate-300">{profileData.role === 'ADMIN' ? 'Level 5 (Maximum)' : profileData.role === 'OPERATIONS_OFFICER' ? 'Level 4 (Command)' : 'Level 2 (Field)'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Status</p>
                  <p className="text-sm text-emerald-400 font-bold flex items-center"><Activity className="h-4 w-4 mr-1" /> Active</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-400" /> Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-slate-700/50 pb-2">
                  <div>
                    <p className="text-sm text-white">System Login</p>
                    <p className="text-xs text-slate-400">Authenticated via Secure Terminal</p>
                  </div>
                  <span className="text-xs text-slate-500">Just now</span>
                </div>
                <div className="flex justify-between items-start border-b border-slate-700/50 pb-2">
                  <div>
                    <p className="text-sm text-white">Security Clearance Check</p>
                    <p className="text-xs text-slate-400">Validated access token</p>
                  </div>
                  <span className="text-xs text-slate-500">2h ago</span>
                </div>
              </div>
              <button className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded transition-colors flex items-center justify-center">
                <Key className="h-4 w-4 mr-2" /> Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
