import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import OperationsDashboard from './pages/OperationsDashboard';
import FieldDashboard from './pages/FieldDashboard';
import Expeditions from './pages/Expeditions';
import Personnel from './pages/Personnel';
import Cargo from './pages/Cargo';
import Inventory from './pages/Inventory';
import Equipment from './pages/Equipment';
import Emergencies from './pages/Emergencies';
import Analytics from './pages/Analytics';
import RiskCenter from './pages/RiskCenter';
import AIInsights from './pages/AIInsights';
import MapPage from './pages/MapPage';
import Teams from './pages/Teams';
import Movement from './pages/Movement';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import Users from './pages/Users';
import Profile from './pages/Profile';
import { ROLES } from './utils/permissions';

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === ROLES.ADMIN) return <Navigate to="/admin/dashboard" replace />;
  if (user.role === ROLES.OPERATIONS_OFFICER) return <Navigate to="/operations/dashboard" replace />;
  if (user.role === ROLES.FIELD_TEAM) return <Navigate to="/field/dashboard" replace />;
  return <Navigate to="/unauthorized" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<RoleBasedRedirect />} />
              
              <Route path="admin/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminDashboard /></ProtectedRoute>} />
              <Route path="operations/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OPERATIONS_OFFICER]}><OperationsDashboard /></ProtectedRoute>} />
              <Route path="field/dashboard" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OPERATIONS_OFFICER, ROLES.FIELD_TEAM]}><FieldDashboard /></ProtectedRoute>} />
              
              <Route path="expeditions" element={<Expeditions />} />
              <Route path="personnel" element={<Personnel />} />
              <Route path="cargo" element={<Cargo />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="emergencies" element={<Emergencies />} />
              <Route path="teams" element={<Teams />} />
              <Route path="movement" element={<Movement />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<Profile />} />
              
              <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OPERATIONS_OFFICER]} />}>
                <Route path="equipment" element={<Equipment />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="map" element={<MapPage />} />
                <Route path="risk" element={<RiskCenter />} />
                <Route path="ai" element={<AIInsights />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
                <Route path="users" element={<Users />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
