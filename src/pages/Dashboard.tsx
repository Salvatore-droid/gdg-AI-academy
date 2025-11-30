import { useState, useEffect } from "react";
import { Clock, Trophy, Award, BookOpen, Brain, Shield, Code, Bot } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { CourseCard } from "@/components/CourseCard";
import { PathCard } from "@/components/PathCard";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  total_learning_hours: number;
  total_modules_completed: number;
  total_certificates_earned: number;
  total_ai_projects: number;
  active_courses: ActiveCourse[];
  recommended_paths: LearningPath[];
}

interface ActiveCourse {
  id: string;
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration_minutes: number;
    difficulty: string;
    category: string;
    instructor: string;
  };
  progress_percentage: number;
  completed_modules_count: number;
  total_modules_count: number;
  started_at: string;
  last_accessed_at: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  color: string;
  difficulty: string;
  estimated_duration_hours: number;
}

const iconMap = {
  brain: Brain,
  shield: Shield,
  code: Code,
  bot: Bot,
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/auth';
          return;
        }

        const response = await fetch('http://localhost:8000/api/dashboard/stats/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/auth';
        } else {
          throw new Error('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold text-foreground">
            Welcome back, Developer! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Continue your AI learning journey.
            <span className="inline-block w-20 h-1 bg-gradient-google rounded-full ml-2" />
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            icon={Clock} 
            label="Hours Learned" 
            value={stats?.total_learning_hours?.toFixed(1) || "0"} 
            color="google-blue" 
          />
          <StatsCard 
            icon={BookOpen} 
            label="Modules Completed" 
            value={stats?.total_modules_completed?.toString() || "0"} 
            color="google-red" 
          />
          <StatsCard 
            icon={Award} 
            label="Certificates Earned" 
            value={stats?.total_certificates_earned?.toString() || "0"} 
            color="google-yellow" 
          />
          <StatsCard 
            icon={Trophy} 
            label="AI Projects Built" 
            value={stats?.total_ai_projects?.toString() || "0"} 
            color="google-green" 
          />
        </div>

        {/* Active Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Your Active Courses</h2>
            <a href="/courses" className="text-sm text-primary hover:underline font-medium">
              View all →
            </a>
          </div>
          
          {stats?.active_courses && stats.active_courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.active_courses.map((course, index) => (
                <CourseCard 
                  key={course.id}
                  id={course.course.id}
                  title={course.course.title}
                  thumbnail={course.course.thumbnail}
                  progress={course.progress_percentage}
                  duration={formatHours(course.course.duration_minutes)}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No active courses</h3>
              <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course</p>
              <a href="/courses" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Browse Courses
              </a>
            </div>
          )}
        </div>

        {/* Recommended AI Paths */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Recommended AI Paths</h2>
          
          {stats?.recommended_paths && stats.recommended_paths.length > 0 ? (
            <div className="overflow-x-auto pb-4 -mx-6 px-6">
              <div className="flex gap-4">
                {stats.recommended_paths.map((path, index) => {
                  const IconComponent = iconMap[path.icon_name as keyof typeof iconMap] || Brain;
                  return (
                    <PathCard 
                      key={path.id}
                      title={path.title}
                      description={path.description}
                      icon={IconComponent}
                      color={path.color as any}
                      index={index}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No learning paths available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}