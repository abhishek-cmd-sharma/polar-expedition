import { API_BASE_URL } from '../config';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FIELD_TEAM');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (isLogin) {
      const result = await login(username, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } else {
      // Handle Registration
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, role }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Automatically log the user in after successful registration
          const loginResult = await login(username, password);
          if (loginResult.success) {
            navigate('/');
          } else {
            setError('Registration successful, but auto-login failed: ' + loginResult.message);
            setIsLogin(true);
          }
        } else {
          setError(data.message || data.error || 'Registration failed');
        }
      } catch (err) {
        setError('An error occurred during registration');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-900">
      <div className="bg-slate-800 p-8 rounded shadow-md w-96 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">
          {isLogin ? 'Login' : 'Register New User'}
        </h2>
        
        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
        {message && <div className="bg-green-500/10 text-green-500 p-3 rounded mb-4 text-sm">{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-slate-300 text-sm font-bold mb-2">Username</label>
            <input 
              type="text" 
              className="w-full p-2 bg-slate-700 text-white border border-slate-600 rounded" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              className="w-full p-2 bg-slate-700 text-white border border-slate-600 rounded" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          {!isLogin && (
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-bold mb-2">Role</label>
              <select 
                className="w-full p-2 bg-slate-700 text-white border border-slate-600 rounded"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="FIELD_TEAM">Field Team</option>
                <option value="OPERATIONS_OFFICER">Operations Officer</option>
              </select>
            </div>
          )}
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
            {isLogin ? 'Sign In' : 'Register'}
          </button>
          
          <div className="text-center">
            <button 
              type="button" 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setMessage('');
              }} 
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
