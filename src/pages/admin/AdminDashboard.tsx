// src/pages/admin/AdminDashboard.tsx
import { useState, useEffect } from "react";
import { Users, BookOpen, Layers, TrendingUp, Activity, MessageSquare, Shield, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

// Define the stats interface based on what AdminStatsCalculator returns
interface AdminStats {
  total_users: number;
  active_users_today: number;
  total_courses: number;
  total_active_courses: number;
  pending_approvals: number;
  total_ai_labs: number;
  total_certificates_issued: number;
  revenue_today: number;
  revenue_month: number;
  system_uptime: number;
  total_modules: number;
  engagement_rate: number;
}

interface AdminActivity {
  id: string;
  admin_user: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  description: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { token } = useAdminAuth();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const currentToken = token || localStorage.getItem('admin_token');
      if (!currentToken) {
        console.log('No token found, redirecting to login');
        window.location.href = '/admin/login';
        return;
      }

      console.log('Fetching admin data with token:', currentToken.substring(0, 20) + '...');

      // Fetch dashboard stats
      const statsResponse = await fetch('http://localhost:8000/api/admin/dashboard/', {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Stats response status:', statsResponse.status);
      
      // First check if response is JSON
      const contentType = statsResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await statsResponse.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error(`Server returned non-JSON response: ${statsResponse.status} ${statsResponse.statusText}`);
      }

      const statsData = await statsResponse.json();
      console.log('Stats data received:', statsData);

      if (!statsResponse.ok) {
        throw new Error(statsData.error || `Failed to fetch stats: ${statsResponse.status}`);
      }

      setStats(statsData);

      // Try to fetch recent activities (optional)
      try {
        const activitiesResponse = await fetch('http://localhost:8000/api/admin/system/audit-logs/', {
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          setRecentActivities(activitiesData.logs?.slice(0, 5) || []);
        }
      } catch (activityError) {
        console.warn('Failed to fetch activities, continuing without them:', activityError);
      }

    } catch (error: any) {
      console.error('Failed to fetch admin data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load admin dashboard",
        variant: "destructive",
      });
      
      // If unauthorized, redirect to login
      if (error.message.includes('401') || error.message.includes('403')) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { 
      title: "Total Users", 
      value: stats?.total_users?.toLocaleString() || "0", 
      change: "+12%", 
      icon: Users, 
      color: "text-google-blue" 
    },
    { 
      title: "Active Courses", 
      value: stats?.total_active_courses?.toString() || "0", 
      change: "+3", 
      icon: BookOpen, 
      color: "text-google-red" 
    },
    { 
      title: "Total Modules", 
      value: stats?.total_modules?.toString() || "0", 
      change: "+8", 
      icon: Layers, 
      color: "text-google-yellow" 
    },
    { 
      title: "Engagement Rate", 
      value: stats?.engagement_rate?.toFixed(1) + "%" || "0%", 
      change: "+5%", 
      icon: TrendingUp, 
      color: "text-google-green" 
    },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create_course':
        window.location.href = '/admin/courses';
        break;
      case 'manage_users':
        window.location.href = '/admin/users';
        break;
      case 'system_settings':
        window.location.href = '/admin/settings';
        break;
      case 'view_logs':
        window.location.href = '/admin/community';
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your platform.
            <span className="inline-block w-20 h-1 bg-gradient-google rounded-full ml-2" />
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <Badge variant="secondary" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-google-blue" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest admin actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.action === 'create' ? 'bg-google-green' :
                          activity.action === 'update' ? 'bg-google-blue' :
                          activity.action === 'delete' ? 'bg-google-red' : 'bg-google-yellow'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">{activity.admin_user}</span> {activity.action}d{" "}
                            <span className="font-medium">{activity.resource_type}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.created_at).toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No recent activity
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-google-red" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    onClick={() => handleQuickAction('create_course')}
                    className="w-full justify-start bg-google-blue hover:bg-google-blue/90 text-white"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Create New Course
                  </Button>
                  <Button 
                    onClick={() => handleQuickAction('manage_users')}
                    className="w-full justify-start bg-google-red hover:bg-google-red/90 text-white"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button 
                    onClick={() => handleQuickAction('view_logs')}
                    className="w-full justify-start bg-google-yellow hover:bg-google-yellow/90 text-white"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    View Activity Logs
                  </Button>
                  <Button 
                    onClick={() => handleQuickAction('system_settings')}
                    className="w-full justify-start bg-google-green hover:bg-google-green/90 text-white"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;