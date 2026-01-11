import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Allow access to /admin and /admin/dashboard - they have their own password authentication
  if (location.pathname === '/admin' || location.pathname === '/admin/dashboard' || location.pathname.startsWith('/admin/')) {
    return children;
  }

  if (!isAuthenticated || !user?.is_admin) {
    // Redirect non-admin users to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
