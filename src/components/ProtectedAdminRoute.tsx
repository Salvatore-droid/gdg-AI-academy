import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useEffect, useState } from 'react';

interface ProtectedAdminRouteProps {
  requireAuth?: boolean;
  redirectPath?: string;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  requireAuth = true,
  redirectPath = '/auth',
}) => {
  const { isAuthenticated, isLoading, verifyToken } = useAdminAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        await verifyToken();
      }
      setIsVerifying(false);
    };

    checkAuth();
  }, [isAuthenticated, verifyToken]);

  if (isLoading || isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-google-red mx-auto"></div>
          <p className="mt-4 text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;