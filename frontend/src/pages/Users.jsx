import React, { useState, useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  if (loading) return <div className="text-white">Loading users...</div>;

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      <div className="bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-700">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="pb-3 text-sm font-medium text-slate-400">Username</th>
              <th className="pb-3 text-sm font-medium text-slate-400">Role</th>
              <th className="pb-3 text-sm font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-b border-slate-700/50">
                <td className="py-3">{user.username}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' :
                    user.role === 'OPERATIONS_OFFICER' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3">
                  <button className="text-blue-400 text-sm mr-4">Edit Role</button>
                  <button className="text-red-400 text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
