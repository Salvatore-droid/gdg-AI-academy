import { Trophy, Award, Download, Star, TrendingUp, Calendar, Clock, BookOpen, Zap, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Certificate {
  id: string;
  course: {
    id: string;
    title: string;
    instructor: string;
  };
  certificate_id: string;
  issued_at: string;
  download_url: string;
}

interface UserLearningStats {
  total_learning_hours: number;
  total_courses_completed: number;
  total_modules_completed: number;
  total_certificates_earned: number;
  total_ai_projects: number;
  streak_days: number;
  last_learning_date: string;
}

interface Achievement {
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlocked_at?: string;
}

const iconMap = {
  trophy: Trophy,
  award: Award,
  star: Star,
  trendingup: TrendingUp,
  calendar: Calendar,
  clock: Clock,
  bookopen: BookOpen,
  zap: Zap,
  target: Target,
};

const colorMap = {
  "google-blue": "from-blue-500/20 to-blue-600/10 text-blue-600",
  "google-red": "from-red-500/20 to-red-600/10 text-red-600", 
  "google-yellow": "from-yellow-500/20 to-yellow-600/10 text-yellow-600",
  "google-green": "from-green-500/20 to-green-600/10 text-green-600",
};

export default function ProgressPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [learningStats, setLearningStats] = useState<UserLearningStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/auth';
          return;
        }

        // Fetch certificates
        const certificatesResponse = await fetch('https://gdg-ai-academy-backend.onrender.com/api/dashboard/certificates/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Fetch learning stats
        const statsResponse = await fetch('https://gdg-ai-academy-backend.onrender.com/api/progress/stats/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Fetch achievements
        const achievementsResponse = await fetch('https://gdg-ai-academy-backend.onrender.com/api/progress/achievements/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (certificatesResponse.ok && statsResponse.ok && achievementsResponse.ok) {
          const certificatesData = await certificatesResponse.json();
          const statsData = await statsResponse.json();
          const achievementsData = await achievementsResponse.json();
          
          setCertificates(certificatesData);
          setLearningStats(statsData);
          setAchievements(achievementsData);
        } else {
          throw new Error('Failed to fetch progress data');
        }
      } catch (error) {
        console.error('Failed to fetch progress data:', error);
        toast({
          title: "Error",
          description: "Failed to load progress data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [toast]);

  const handleDownloadCertificate = async (certificateId: string, certificateTitle: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://gdg-ai-academy-backend.onrender.com/api/certificates/${certificateId}/download/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${certificateTitle.replace(/\s+/g, '_')}_certificate.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Success!",
          description: "Certificate downloaded successfully",
        });
      } else {
        throw new Error('Failed to download certificate');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download certificate",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatHours = (hours: number): string => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    }
    return `${hours.toFixed(1)} hours`;
  };

  // Calculate progress percentages
  const calculateCourseProgress = (): number => {
    if (!learningStats) return 0;
    // Assuming 12 total courses available (you might want to fetch this from backend)
    const totalCourses = 12;
    return Math.round((learningStats.total_courses_completed / totalCourses) * 100);
  };

  const calculateLabProgress = (): number => {
    if (!learningStats) return 0;
    // Assuming 15 total labs available
    const totalLabs = 15;
    return Math.round((learningStats.total_ai_projects / totalLabs) * 100);
  };

  const calculateOverallProgress = (): number => {
    const courseProgress = calculateCourseProgress();
    const labProgress = calculateLabProgress();
    return Math.round((courseProgress + labProgress) / 2);
  };

  const learningStatsData = [
    { 
      label: "Total Learning Time", 
      value: learningStats ? formatHours(learningStats.total_learning_hours) : "0 hours", 
      progress: learningStats ? Math.min(Math.round(learningStats.total_learning_hours / 200 * 100), 100) : 0, 
      color: "google-blue" 
    },
    { 
      label: "Courses Completed", 
      value: learningStats ? `${learningStats.total_courses_completed} / 12` : "0 / 12", 
      progress: calculateCourseProgress(), 
      color: "google-green" 
    },
    { 
      label: "Labs Finished", 
      value: learningStats ? `${learningStats.total_ai_projects} / 15` : "0 / 15", 
      progress: calculateLabProgress(), 
      color: "google-yellow" 
    },
    { 
      label: "Overall Progress", 
      value: learningStats ? `${calculateOverallProgress()}%` : "0%", 
      progress: calculateOverallProgress(), 
      color: "google-red" 
    },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your progress...</p>
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-google-blue/20 to-google-blue/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-google-blue" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Progress & Certificates</h1>
          </div>
          <p className="text-lg text-muted-foreground ml-[60px]">
            Track your achievements and download certificates
          </p>
        </motion.div>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {learningStatsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-6 rounded-2xl">
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mb-3">{stat.value}</p>
                <Progress value={stat.progress} className="h-2" />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Stats */}
        {learningStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{learningStats.total_modules_completed}</p>
                  <p className="text-sm text-muted-foreground">Modules Completed</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{learningStats.total_certificates_earned}</p>
                  <p className="text-sm text-muted-foreground">Certificates Earned</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{learningStats.streak_days}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Achievements */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => {
              const IconComponent = iconMap[achievement.icon as keyof typeof iconMap] || Trophy;
              const isUnlocked = achievement.unlocked;

              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={`p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300 ${
                    !isUnlocked ? 'opacity-50' : ''
                  }`}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
                      colorMap[achievement.color as keyof typeof colorMap]
                    } flex items-center justify-center mx-auto mb-3`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                    {achievement.unlocked_at && (
                      <Badge variant="secondary" className="text-xs rounded-lg">
                        {formatDate(achievement.unlocked_at)}
                      </Badge>
                    )}
                    {!isUnlocked && (
                      <Badge variant="outline" className="text-xs rounded-lg mt-2">
                        Locked
                      </Badge>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Certificates */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Your Certificates</h2>
            <Badge variant="secondary" className="rounded-xl">
              <Award className="w-3 h-3 mr-1" />
              {certificates.length} Earned
            </Badge>
          </div>
          
          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden rounded-2xl hover:shadow-xl transition-all duration-300 group">
                    <div className="aspect-[16/10] relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-foreground px-4">{cert.course.title}</h3>
                          <p className="text-sm text-muted-foreground mt-2">by {cert.course.instructor}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Issue Date</span>
                        <span className="text-foreground font-medium">{formatDate(cert.issued_at)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credential ID</span>
                        <span className="text-foreground font-mono text-xs">{cert.certificate_id}</span>
                      </div>
                      <Button 
                        className="w-full rounded-xl gap-2"
                        onClick={() => handleDownloadCertificate(cert.id, cert.course.title)}
                      >
                        <Download className="w-4 h-4" />
                        Download Certificate
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No certificates yet</h3>
              <p className="text-muted-foreground">
                Complete courses to earn certificates and showcase your achievements.
              </p>
            </div>
          )}
        </div>

        {/* Progress Chart Placeholder */}
        <Card className="p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Learning Progress Over Time</h2>
          <div className="h-64 bg-muted/20 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Progress analytics coming soon...</p>
              <p className="text-sm text-muted-foreground mt-2">
                Track your learning patterns and growth over time
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
