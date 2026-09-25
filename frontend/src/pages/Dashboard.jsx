import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/permissions';
import AdminDashboard from './AdminDashboard';
import OperationsDashboard from './OperationsDashboard';
import FieldDashboard from './FieldDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case ROLES.ADMIN:
      return <AdminDashboard />;
    case ROLES.OPERATIONS_OFFICER:
      return <OperationsDashboard />;
    case ROLES.FIELD_TEAM:
      return <FieldDashboard />;
    default:
      return <div className="text-white text-center py-10">Unknown role. Contact administrator.</div>;
  }
};

export default Dashboard;
