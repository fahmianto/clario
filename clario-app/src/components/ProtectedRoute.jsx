import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser, userData } = useAuth();

  // If Firebase is still checking auth state, we show nothing or a loader
  if (currentUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 size={32} className="animate-spin text-primary-600" />
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but we need to check if they have a role defined
  // Since fetching role is async, userData might be null momentarily
  if (userData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 size={32} className="animate-spin text-primary-600" />
      </div>
    );
  }

  // Logged in, but unauthorized for this specific route
  if (userData && allowedRoles && !allowedRoles.includes(userData.role)) {
    // Redirect them to their designated dashboard based on their role
    const dashboardPath = userData.role === 'super-admin' ? 'admin' : userData.role;
    return <Navigate to={`/${dashboardPath}`} autoFocus replace />;
  }

  // Authorized -> render child components
  return <Outlet />;
};

export default ProtectedRoute;
