import { API_BASE_URL } from '../config';
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Package, Archive, PenTool, AlertTriangle, Map as MapIcon, Bell, BarChart2, LogOut, Settings, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/permissions';
import io from 'socket.io-client';

const socket = io(`${API_BASE_URL}`);

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on('new_emergency', (data) => {
      // Only show to Ops or Admin (or if it pertains to them, but generally Ops/Admin handle emergencies)
      if (user?.role === ROLES.ADMIN || user?.role === ROLES.OPERATIONS_OFFICER) {
        const newNotif = {
          id: Date.now(),
          title: '🚨 New Emergency Reported',
          message: `${data.type} - Severity: ${data.severity}`,
          time: new Date().toLocaleTimeString()
        };
        setNotifications(prev => [newNotif, ...prev]);
        
        // Auto-dismiss after 8 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
        }, 8000);
      }
    });

    return () => {
      socket.off('new_emergency');
    };
  }, [user]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavigation = () => {
    switch (user?.role) {
      case ROLES.ADMIN:
        return [
          { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Expeditions', href: '/expeditions', icon: MapIcon },
          { name: 'Personnel', href: '/personnel', icon: Users },
          { name: 'Teams', href: '/teams', icon: Users },
          { name: 'Cargo', href: '/cargo', icon: Package },
          { name: 'Inventory', href: '/inventory', icon: Archive },
          { name: 'Movement', href: '/movement', icon: MapIcon },
          { name: 'Emergencies', href: '/emergencies', icon: AlertTriangle },
          { name: 'Analytics', href: '/analytics', icon: BarChart2 },
          { name: 'Reports', href: '/reports', icon: BarChart2 },
          { name: 'Users & Roles', href: '/users', icon: Users },
          { name: 'System Settings', href: '/settings', icon: Settings },
          { name: 'Profile', href: '/profile', icon: Users },
        ];
      case ROLES.OPERATIONS_OFFICER:
        return [
          { name: 'Dashboard', href: '/operations/dashboard', icon: LayoutDashboard },
          { name: 'Expeditions', href: '/expeditions', icon: MapIcon },
          { name: 'Personnel', href: '/personnel', icon: Users },
          { name: 'Teams', href: '/teams', icon: Users },
          { name: 'Cargo', href: '/cargo', icon: Package },
          { name: 'Inventory', href: '/inventory', icon: Archive },
          { name: 'Movement', href: '/movement', icon: MapIcon },
          { name: 'Map', href: '/map', icon: MapIcon },
          { name: 'Emergencies', href: '/emergencies', icon: AlertTriangle },
          { name: 'Risk Center', href: '/risk', icon: AlertTriangle },
          { name: 'AI Insights', href: '/ai', icon: BarChart2 },
          { name: 'Reports', href: '/reports', icon: BarChart2 },
          { name: 'Profile', href: '/profile', icon: Users },
        ];
      case ROLES.FIELD_TEAM:
        return [
          { name: 'Dashboard', href: '/field/dashboard', icon: LayoutDashboard },
          { name: 'My Expedition', href: '/expeditions', icon: MapIcon },
          { name: 'My Team', href: '/personnel', icon: Users },
          { name: 'My Tasks', href: '/tasks', icon: PenTool },
          { name: 'My Resources', href: '/cargo', icon: Package },
          { name: 'Movement / Map', href: '/movement', icon: MapIcon },
          { name: 'Report Emergency', href: '/emergencies', icon: AlertTriangle },
          { name: 'Profile', href: '/profile', icon: Users },
        ];
      default:
        return [];
    }
  };

  const navigation = getNavigation();

  return (
    <div className="flex h-screen bg-slate-900 text-slate-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-700">
          <div className="font-bold text-xl tracking-wider text-blue-400">POLAR COMMAND</div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white transition-colors'}
                  `}
                >
                  <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-700 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-slate-400" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Toast Notifications */}
        <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
          {notifications.map(notif => (
            <div key={notif.id} className="bg-red-900 border border-red-500 text-white p-4 rounded shadow-lg w-80 flex justify-between items-start animate-pulse">
              <div>
                <h4 className="font-bold flex items-center"><AlertTriangle className="w-4 h-4 mr-2"/> {notif.title}</h4>
                <p className="text-sm mt-1">{notif.message}</p>
                <p className="text-xs text-red-200 mt-2">{notif.time}</p>
              </div>
              <button onClick={() => removeNotification(notif.id)} className="text-red-200 hover:text-white">
                <X className="w-4 h-4"/>
              </button>
            </div>
          ))}
        </div>

        {/* Top Header */}
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold">
            {navigation.find(n => n.href === location.pathname)?.name || 'Polar Command'}
          </h1>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors" onClick={() => setNotifications([])}>
              <Bell className="h-6 w-6" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-red-500 ring-2 ring-slate-800 text-white text-[10px] font-bold text-center leading-4">
                  {notifications.length}
                </span>
              )}
            </button>
            <Link to="/profile" className="flex items-center space-x-2 hover:bg-slate-700 p-2 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">{user?.username?.substring(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-tight">{user?.username}</span>
                <span className="text-xs text-slate-400 leading-tight">{user?.role}</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
