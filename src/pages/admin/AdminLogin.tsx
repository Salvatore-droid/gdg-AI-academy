import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail, Lock, Shield, ArrowRight, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAdminAuth();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    console.log('=== FRONTEND LOGIN DEBUG ===');
    console.log('Email:', email);
    console.log('Password:', '*'.repeat(password.length));
    console.log('URL:', 'http://localhost:8000/api/admin/auth/login/');
    
    try {
      const response = await fetch('http://localhost:8000/api/admin/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Get raw response text first
      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed JSON:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response was not JSON. First 500 chars:', responseText.substring(0, 500));
        throw new Error('Server returned non-JSON response');
      }
  
      if (response.ok) {
        console.log('✓ Login successful!');
        console.log('Token received:', data.token ? data.token.substring(0, 20) + '...' : 'No token');
        console.log('Admin user data:', data.admin_user);
        
        // Store authentication data
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.admin_user));
        
        console.log('✓ Token stored in localStorage');
        console.log('Stored token:', localStorage.getItem('admin_token')?.substring(0, 20) + '...');
        console.log('Stored user:', localStorage.getItem('admin_user'));
        
        toast({
          title: "Admin Access Granted",
          description: data.message,
        });
        
        // Navigate to dashboard
        console.log('✓ Navigating to /admin/dashboard');
        navigate('/admin/dashboard');
        
      } else {
        console.log('✗ Login failed:', data);
        const errorMessage = data.email?.[0] || data.password?.[0] || data.error || "Invalid admin credentials";
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('✗ Login error:', error);
      toast({
        title: "Admin Access Denied",
        description: error.message || "Login failed",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToMain = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-google-red/20 rounded-full">
              <Shield className="w-10 h-10 text-google-red" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
              <p className="text-gray-400 mt-1">Google AI Learning Platform</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Restricted access. Authorized personnel only.</p>
        </div>

        <Card className="border-2 border-gray-700 bg-gray-800 text-white shadow-2xl">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-white">Admin Sign In</CardTitle>
            <CardDescription className="text-gray-400">
              Use your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="admin-email" className="text-gray-300">
                  Admin Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@googleai.com"
                    className={`pl-12 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:border-google-red focus:ring-google-red/50 ${
                      errors.email ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="admin-password" className="text-gray-300">
                    Admin Password
                  </Label>
                  <button
                    type="button"
                    className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
                    onClick={() => toast({
                      title: "Password Help",
                      description: "Contact system administrator for password recovery",
                    })}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    className={`pl-12 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:border-google-red focus:ring-google-red/50 ${
                      errors.password ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {errors.password && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-google-red hover:bg-google-red/90 text-white font-semibold py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Sign in as Admin
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </Button>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-800 px-3 text-gray-500">Security Notice</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 text-center">
                  <Shield className="inline-block w-3 h-3 mr-1" />
                  This portal is secured with end-to-end encryption. All activities are logged and monitored.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={handleBackToMain}
                  disabled={isSubmitting}
                >
                  ← Back to Main Site
                </Button>
                
                <div className="text-center">
                  <Link 
                    to="/auth" 
                    className="text-sm text-gray-400 hover:text-gray-300 transition-colors inline-flex items-center gap-1"
                  >
                    <span>Regular user? </span>
                    <span className="text-google-blue hover:underline">Sign in here</span>
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need admin access? Contact:{" "}
            <button
              type="button"
              className="text-gray-400 hover:text-gray-300 underline"
              onClick={() => toast({
                title: "Contact Information",
                description: "Email: admin-support@googleai.com\nPhone: +1-XXX-XXX-XXXX",
              })}
            >
              System Administrator
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}