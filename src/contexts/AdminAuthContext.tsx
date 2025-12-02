// contexts/AdminAuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  is_staff: boolean;
  is_active: boolean;
  last_login: string;
  created_at: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
}

// Create the context
export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Create the hook
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('admin_token');
      const storedUser = localStorage.getItem('admin_user');

      if (storedToken && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setToken(storedToken);
          setAdminUser(user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing stored admin user:', error);
          clearAuth();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/admin/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.admin_user));
        
        setToken(data.token);
        setAdminUser(data.admin_user);
        setIsAuthenticated(true);
        
        toast({
          title: "Admin Access Granted",
          description: data.message,
        });
        
        navigate('/admin/dashboard');
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('http://localhost:8000/api/admin/auth/logout/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      navigate('/admin/login');
    }
  };

  const verifyToken = async () => {
    const storedToken = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');
    
    if (!storedToken || !storedUser) {
      return false;
    }
    
    try {
      const user = JSON.parse(storedUser);
      
      // Simple check - we could verify with backend here
      if (user && user.is_staff) {
        setAdminUser(user);
        setToken(storedToken);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error('Token verification error:', error);
    }
    
    return false;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        verifyToken,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};