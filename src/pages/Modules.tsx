import { Layers, Clock, CheckCircle2, Circle, Lock, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Module {
  id: string;
  course: {
    id: string;
    title: string;
    category: string;
    difficulty: string;
  };
  title: string;
  description: string;
  order: number;
  duration_minutes: number;
  video_url: string;
  content: string;
}

interface UserModuleProgress {
  id: string;
  module: string;
  is_completed: boolean;
  completed_at: string | null;
  time_spent_minutes: number;
  last_position: number;
}

interface UserCourseProgress {
  id: string;
  course: {
    id: string;
    title: string;
    category: string;
  };
  progress_percentage: number;
  completed_modules_count: number;
  total_modules_count: number;
  current_module: string | null;
  is_completed: boolean;
}

export default function Modules() {
  const [userCourses, setUserCourses] = useState<UserCourseProgress[]>([]);
  const [moduleProgress, setModuleProgress] = useState<UserModuleProgress[]>([]);
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchModulesData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/auth';
          return;
        }

        // Fetch user's enrolled courses
        const coursesResponse = await fetch('http://localhost:8000/api/dashboard/courses/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Fetch all modules for enrolled courses
        const modulesResponse = await fetch('http://localhost:8000/api/modules/user-modules/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (coursesResponse.ok && modulesResponse.ok) {
          const coursesData = await coursesResponse.json();
          const modulesData = await modulesResponse.json();
          
          setUserCourses(coursesData);
          setAllModules(modulesData.modules);
          setModuleProgress(modulesData.module_progress);
        } else {
          throw new Error('Failed to fetch modules data');
        }
      } catch (error) {
        console.error('Failed to fetch modules:', error);
        toast({
          title: "Error",
          description: "Failed to load modules",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchModulesData();
  }, [toast]);

  const getModuleProgress = (moduleId: string): UserModuleProgress | undefined => {
    return moduleProgress.find(mp => mp.module === moduleId);
  };

  const isModuleCompleted = (moduleId: string): boolean => {
    const progress = getModuleProgress(moduleId);
    return progress?.is_completed || false;
  };

  const isModuleCurrent = (moduleId: string): boolean => {
    return userCourses.some(course => course.current_module === moduleId);
  };

  const isModuleLocked = (module: Module): boolean => {
    // A module is locked if it's not the first module and the previous module isn't completed
    if (module.order === 1) return false; // First module is never locked
    
    const course = userCourses.find(uc => uc.course.id === module.course.id);
    if (!course) return true; // Not enrolled in the course
    
    // Find previous module in the same course
    const previousModule = allModules.find(m => 
      m.course.id === module.course.id && m.order === module.order - 1
    );
    
    if (!previousModule) return false; // No previous module
    
    return !isModuleCompleted(previousModule.id);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const getModuleStatus = (module: Module) => {
    if (isModuleCompleted(module.id)) {
      return 'completed';
    } else if (isModuleCurrent(module.id)) {
      return 'current';
    } else if (isModuleLocked(module)) {
      return 'locked';
    } else {
      return 'available';
    }
  };

  // Filter modules by status
  const completedModules = allModules.filter(module => isModuleCompleted(module.id));
  const currentModules = allModules.filter(module => isModuleCurrent(module.id));
  const availableModules = allModules.filter(module => 
    !isModuleCompleted(module.id) && 
    !isModuleCurrent(module.id) && 
    !isModuleLocked(module)
  );
  const lockedModules = allModules.filter(module => isModuleLocked(module));

  const totalModules = allModules.length;
  const totalCompleted = completedModules.length;
  const totalInProgress = currentModules.length;
  const totalUpcoming = availableModules.length + lockedModules.length;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-google-yellow/20 to-google-yellow/10 flex items-center justify-center">
              <Layers className="w-6 h-6 text-google-yellow" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Learning Modules</h1>
          </div>
          <p className="text-lg text-muted-foreground ml-[60px]">
            Track your progress across all modules
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-google-green/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-google-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalCompleted}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-google-blue/10 flex items-center justify-center">
                <Circle className="w-6 h-6 text-google-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalInProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-google-yellow/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-google-yellow" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalUpcoming}</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Lock className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{lockedModules.length}</p>
                <p className="text-sm text-muted-foreground">Locked</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Overall Progress */}
        {userCourses.length > 0 && (
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Overall Learning Progress</h3>
              <span className="text-sm font-medium text-primary">
                {totalModules > 0 ? Math.round((totalCompleted / totalModules) * 100) : 0}%
              </span>
            </div>
            <Progress 
              value={totalModules > 0 ? (totalCompleted / totalModules) * 100 : 0} 
              className="h-3" 
            />
            <div className="grid grid-cols-4 gap-4 text-center mt-4">
              <div>
                <p className="text-lg font-bold text-google-green">{totalCompleted}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div>
                <p className="text-lg font-bold text-google-blue">{totalInProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
              <div>
                <p className="text-lg font-bold text-google-yellow">{availableModules.length}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
              <div>
                <p className="text-lg font-bold text-muted-foreground">{lockedModules.length}</p>
                <p className="text-xs text-muted-foreground">Locked</p>
              </div>
            </div>
          </Card>
        )}

        {/* Continue Learning (Current Modules) */}
        {currentModules.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Continue Learning</h2>
            <div className="grid gap-4">
              {currentModules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link to={`/courses/${module.course.id}`}>
                    <Card className="p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border-primary/20 bg-primary/5 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge variant="secondary" className="mb-2">
                            {module.course.title}
                          </Badge>
                          <h3 className="text-lg font-semibold text-foreground mb-2">{module.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {module.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDuration(module.duration_minutes)}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Module {module.order}
                            </Badge>
                          </div>
                        </div>
                        <Circle className="w-6 h-6 text-primary mt-1" />
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All Modules */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">All Modules</h2>
          {allModules.length > 0 ? (
            <div className="grid gap-3">
              {allModules.map((module, index) => {
                const status = getModuleStatus(module);
                const isLocked = status === 'locked';
                const isCompleted = status === 'completed';
                const isCurrent = status === 'current';

                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link to={isLocked ? "#" : `/courses/${module.course.id}`}>
                      <Card className={`p-4 rounded-xl hover:shadow-md transition-all duration-200 ${
                        isLocked ? "opacity-60 cursor-not-allowed" : 
                        isCurrent ? "border-primary/20 bg-primary/5" : 
                        "hover:bg-muted/50"
                      }`}>
                        <div className="flex items-center gap-4">
                          <div>
                            {isCompleted ? (
                              <CheckCircle2 className="w-6 h-6 text-google-green" />
                            ) : isLocked ? (
                              <Lock className="w-6 h-6 text-muted-foreground" />
                            ) : isCurrent ? (
                              <Circle className="w-6 h-6 text-primary" />
                            ) : (
                              <Circle className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-xs text-muted-foreground">{module.course.title}</p>
                              <Badge variant="outline" className="text-xs">
                                {module.course.difficulty}
                              </Badge>
                            </div>
                            <h3 className="font-medium text-foreground">{module.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {module.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDuration(module.duration_minutes)}
                            </div>
                            {isLocked && (
                              <Badge variant="secondary" className="text-xs">
                                Locked
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Layers className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No modules available</h3>
              <p className="text-muted-foreground mb-4">
                Enroll in courses to start learning
              </p>
              <Link to="/courses">
                <Button variant="outline">Browse Courses</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}