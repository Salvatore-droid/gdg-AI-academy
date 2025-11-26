import { motion } from "framer-motion";
import { Users, BookOpen, Layers, TrendingUp, Activity, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { title: "Total Users", value: "2,847", change: "+12%", icon: Users, color: "text-google-blue" },
  { title: "Active Courses", value: "24", change: "+3", icon: BookOpen, color: "text-google-red" },
  { title: "Total Modules", value: "156", change: "+8", icon: Layers, color: "text-google-yellow" },
  { title: "Engagement Rate", value: "87%", change: "+5%", icon: TrendingUp, color: "text-google-green" },
];

const recentActivities = [
  { user: "Sarah Johnson", action: "completed", course: "Machine Learning Basics", time: "2 mins ago" },
  { user: "Mike Chen", action: "enrolled in", course: "Advanced TensorFlow", time: "15 mins ago" },
  { user: "Emma Wilson", action: "started", course: "AI Ethics", time: "1 hour ago" },
  { user: "James Brown", action: "posted in", course: "Community Forum", time: "2 hours ago" },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your platform.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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
                <CardDescription>Latest user actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-google-green mt-2" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                          <span className="font-medium">{activity.course}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
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
                  <MessageSquare className="w-5 h-5 text-google-red" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <Button className="w-full justify-start bg-google-blue hover:bg-google-blue/90 text-white">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Create New Course
                  </Button>
                  <Button className="w-full justify-start bg-google-red hover:bg-google-red/90 text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Add New User
                  </Button>
                  <Button className="w-full justify-start bg-google-yellow hover:bg-google-yellow/90 text-white">
                    <Layers className="w-4 h-4 mr-2" />
                    Create Module
                  </Button>
                  <Button className="w-full justify-start bg-google-green hover:bg-google-green/90 text-white">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Moderate Community
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
