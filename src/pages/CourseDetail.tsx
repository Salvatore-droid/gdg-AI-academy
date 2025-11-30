import { Play, FileText, CheckCircle2, Circle, Clock, Award, MessageCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  duration_minutes: number;
  video_url: string;
  content: string;
}

interface CourseDetail {
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
  modules: CourseModule[];
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
  progress_percentage: number;
  completed_modules_count: number;
  total_modules_count: number;
  current_module: string | null;
  is_completed: boolean;
}

export default function CourseDetail() {
  const { id } = useParams();
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
  const [userProgress, setUserProgress] = useState<UserCourseProgress | null>(null);
  const [moduleProgress, setModuleProgress] = useState<UserModuleProgress[]>([]);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/auth';
          return;
        }

        // Fetch course details
        const courseResponse = await fetch(`http://localhost:8000/api/courses/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Fetch user progress for this course
        const progressResponse = await fetch(`http://localhost:8000/api/courses/${id}/progress/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (courseResponse.ok && progressResponse.ok) {
          const courseData = await courseResponse.json();
          const progressData = await progressResponse.json();
          
          setCourseDetail(courseData);
          setUserProgress(progressData.progress);
          setModuleProgress(progressData.module_progress);
          
          // Set current module (first incomplete module or last module if all completed)
          const currentModule = progressData.progress?.current_module || 
                              courseData.modules[0]?.id || null;
          setCurrentModuleId(currentModule);
        } else {
          throw new Error('Failed to fetch course data');
        }
      } catch (error) {
        console.error('Failed to fetch course details:', error);
        toast({
          title: "Error",
          description: "Failed to load course details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseData();
    }
  }, [id, toast]);

  const handleModuleClick = (moduleId: string) => {
    setCurrentModuleId(moduleId);
  };

  const handleMarkComplete = async (moduleId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/modules/${moduleId}/complete/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Module completed!",
          description: `"${data.module.title}" marked as completed`,
        });
        
        // Refresh progress data
        const progressResponse = await fetch(`http://localhost:8000/api/courses/${id}/progress/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setUserProgress(progressData.progress);
          setModuleProgress(progressData.module_progress);
        }
      } else {
        throw new Error('Failed to mark module as complete');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update module progress",
        variant: "destructive",
      });
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const getModuleProgress = (moduleId: string): UserModuleProgress | undefined => {
    return moduleProgress.find(mp => mp.module === moduleId);
  };

  const isModuleCompleted = (moduleId: string): boolean => {
    const progress = getModuleProgress(moduleId);
    return progress?.is_completed || false;
  };

  const isCurrentModule = (moduleId: string): boolean => {
    return moduleId === currentModuleId;
  };

  const getCurrentModule = (): CourseModule | undefined => {
    return courseDetail?.modules.find(module => module.id === currentModuleId);
  };

  const completedModules = moduleProgress.filter(mp => mp.is_completed).length;
  const totalModules = courseDetail?.modules.length || 0;
  const progress = userProgress?.progress_percentage || 0;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (!courseDetail) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Course not found</h3>
          <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const currentModule = getCurrentModule();

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="h-full flex flex-col lg:flex-row">
        {/* Module List Sidebar */}
        <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-border bg-card overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Course Modules</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {completedModules} of {totalModules} modules completed
              </p>
              <Progress value={progress} className="h-2" />
            </div>

            <Separator />

            <div className="space-y-2">
              {courseDetail.modules.map((module, index) => {
                const isCompleted = isModuleCompleted(module.id);
                const isCurrent = isCurrentModule(module.id);
                const moduleProgress = getModuleProgress(module.id);

                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card 
                      className={`p-4 cursor-pointer transition-all duration-200 ${
                        isCurrent 
                          ? "border-primary bg-primary/5 hover:bg-primary/10" 
                          : "hover:bg-muted"
                      }`}
                      onClick={() => handleModuleClick(module.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-google-green" />
                          ) : (
                            <Circle className={`w-5 h-5 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <h3 className={`font-medium text-sm ${
                            isCurrent ? "text-primary" : "text-foreground"
                          }`}>
                            {module.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDuration(module.duration_minutes)}
                            {moduleProgress?.time_spent_minutes > 0 && (
                              <span className="text-google-blue">
                                • {formatDuration(moduleProgress.time_spent_minutes)} watched
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6 lg:p-8 space-y-6">
            {currentModule ? (
              <>
                {/* Video Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <div className="aspect-video bg-gradient-to-br from-google-blue/20 to-google-green/20 rounded-2xl overflow-hidden relative group">
                    {currentModule.video_url ? (
                      <video
                        src={currentModule.video_url}
                        className="w-full h-full object-cover"
                        controls
                        poster={courseDetail.course.thumbnail}
                      />
                    ) : (
                      <>
                        <img 
                          src={courseDetail.course.thumbnail}
                          alt="Course thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Button size="lg" className="rounded-full w-16 h-16 group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                        {currentModule.title}
                      </h1>
                      <p className="text-muted-foreground">
                        {currentModule.description || "No description available"}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      {!isModuleCompleted(currentModule.id) && (
                        <Button 
                          onClick={() => handleMarkComplete(currentModule.id)}
                          className="rounded-xl"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Mark Complete
                        </Button>
                      )}
                      {userProgress?.is_completed && (
                        <Button variant="outline" className="rounded-xl">
                          <Award className="w-4 h-4 mr-2" />
                          Get Certificate
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Progress Tracker */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Course Progress</h3>
                    <span className="text-sm font-medium text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3 mb-4" />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-google-blue">{completedModules}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-google-yellow">
                        {currentModuleId && !isModuleCompleted(currentModuleId) ? 1 : 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Current</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-muted-foreground">
                        {totalModules - completedModules - (currentModuleId && !isModuleCompleted(currentModuleId) ? 1 : 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Remaining</p>
                    </div>
                  </div>
                </Card>

                {/* Module Content */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Lesson Content
                    </h3>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    {currentModule.content ? (
                      <div 
                        className="text-foreground"
                        dangerouslySetInnerHTML={{ __html: currentModule.content }}
                      />
                    ) : (
                      <div className="bg-muted/50 rounded-xl p-8 text-center">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No additional content available for this module.
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* AI Tutor Help */}
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-google flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">Need Help? Ask Your AI Tutor</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Get instant answers to your questions about this lesson from our AI assistant.
                      </p>
                      <Button className="rounded-xl">
                        Chat with AI Tutor
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Select a Module</h3>
                <p className="text-muted-foreground">Choose a module from the sidebar to start learning.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}