
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If admin only route and user is not admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
