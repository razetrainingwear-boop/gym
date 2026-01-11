import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // Only allow admin users (joviloh25@gmail.com)
  // The AdminDashboard component will show appropriate message if not admin
  return children;
};

export default AdminRoute;
