import { Sparkles, Rocket, Code, Brain, Zap, GitBranch, Lock, Play, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface AILab {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  difficulty: string;
  estimated_duration_minutes: number;
  status: "available" | "in-progress" | "completed" | "locked";
  category: string;
  prerequisites: string[];
  starter_code_url: string;
  instructions_url: string;
  created_at: string;
}

const iconMap = {
  sparkles: Sparkles,
  rocket: Rocket,
  code: Code,
  brain: Brain,
  zap: Zap,
  gitbranch: GitBranch,
};

const colorMap = {
  "google-blue": "from-blue-500/20 to-blue-600/10 text-blue-600",
  "google-red": "from-red-500/20 to-red-600/10 text-red-600",
  "google-yellow": "from-yellow-500/20 to-yellow-600/10 text-yellow-600",
  "google-green": "from-green-500/20 to-green-600/10 text-green-600",
};

const difficultyColors = {
  "Beginner": "bg-green-100 text-green-800 border-green-200",
  "Intermediate": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Advanced": "bg-red-100 text-red-800 border-red-200",
};

export default function AILabs() {
  const [labs, setLabs] = useState<AILab[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAILabs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/auth';
          return;
        }

        const response = await fetch('https://gdg-ai-academy-backend.onrender.com/api/ai-labs/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLabs(data);
        } else {
          throw new Error('Failed to fetch AI labs');
        }
      } catch (error) {
        console.error('Failed to fetch AI labs:', error);
        toast({
          title: "Error",
          description: "Failed to load AI labs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAILabs();
  }, [toast]);

  const handleStartLab = async (labId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://gdg-ai-academy-backend.onrender.com/api/ai-labs/${labId}/start/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Lab Started!",
          description: `You've started "${data.lab.title}"`,
        });
        
        // Refresh labs to update status
        const labsResponse = await fetch('https://gdg-ai-academy-backend.onrender.com/api/ai-labs/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (labsResponse.ok) {
          const labsData = await labsResponse.json();
          setLabs(labsData);
        }
        
        // Navigate to lab interface
        window.open(`/lab/${labId}`, '_blank');
      } else {
        throw new Error('Failed to start lab');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start lab",
        variant: "destructive",
      });
    }
  };

  const handleContinueLab = (labId: string) => {
    // Navigate to lab interface
    window.open(`/lab/${labId}`, '_blank');
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const getLabColor = (index: number): string => {
    const colors = ["google-blue", "google-green", "google-red", "google-yellow", "google-blue", "google-green"];
    return colors[index % colors.length];
  };

  const availableLabs = labs.filter(lab => lab.status === "available");
  const inProgressLabs = labs.filter(lab => lab.status === "in-progress");
  const completedLabs = labs.filter(lab => lab.status === "completed");
  const lockedLabs = labs.filter(lab => lab.status === "locked");

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading AI labs...</p>
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-google-green/20 to-google-green/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-google-green" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">AI Labs</h1>
          </div>
          <p className="text-lg text-muted-foreground ml-[60px]">
            Hands-on projects to build real AI applications
          </p>
        </motion.div>

        {/* Hero Card */}
        <Card className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">Ready to Build Something Amazing?</h2>
              <p className="text-muted-foreground mb-4">
                Put your AI knowledge into practice with hands-on lab projects. Each lab includes starter code, 
                detailed instructions, and automated testing.
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge variant="secondary" className="rounded-xl">
                  <Rocket className="w-3 h-3 mr-1" />
                  {labs.length} Projects
                </Badge>
                <Badge variant="secondary" className="rounded-xl">
                  <Code className="w-3 h-3 mr-1" />
                  Interactive Coding
                </Badge>
                <Badge variant="secondary" className="rounded-xl">
                  <Zap className="w-3 h-3 mr-1" />
                  Real-time Feedback
                </Badge>
              </div>
            </div>
            <div className="w-24 h-24 rounded-2xl bg-gradient-google flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
        </Card>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{availableLabs.length}</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{inProgressLabs.length}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Code className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedLabs.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <Lock className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{lockedLabs.length}</p>
                <p className="text-sm text-muted-foreground">Locked</p>
              </div>
            </div>
          </Card>
        </div>

        {/* In Progress Labs */}
        {inProgressLabs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Continue Working</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressLabs.map((lab, index) => {
                const IconComponent = iconMap[lab.icon_name as keyof typeof iconMap] || Sparkles;
                const color = getLabColor(index);

                return (
                  <motion.div
                    key={lab.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="p-6 rounded-2xl h-full flex flex-col border-primary/20 bg-primary/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} flex items-center justify-center mb-4`}>
                        <IconComponent className="w-7 h-7" />
                      </div>
                      
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-foreground">{lab.title}</h3>
                        <Badge className="rounded-xl bg-primary text-primary-foreground">In Progress</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 flex-1">{lab.description}</p>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary" className={`rounded-xl ${difficultyColors[lab.difficulty as keyof typeof difficultyColors]}`}>
                          {lab.difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDuration(lab.estimated_duration_minutes)}
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full rounded-xl"
                        onClick={() => handleContinueLab(lab.id)}
                      >
                        Continue Lab
                      </Button>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Labs */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">All AI Labs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labs.map((lab, index) => {
              const IconComponent = iconMap[lab.icon_name as keyof typeof iconMap] || Sparkles;
              const color = getLabColor(index);
              const isLocked = lab.status === "locked";
              const isInProgress = lab.status === "in-progress";
              const isCompleted = lab.status === "completed";
              
              return (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={`p-6 rounded-2xl h-full flex flex-col hover:shadow-xl transition-all duration-300 ${
                    isLocked ? "opacity-60" : "hover:-translate-y-1"
                  } ${isInProgress ? "border-primary bg-primary/5" : ""} ${
                    isCompleted ? "border-green-200 bg-green-50" : ""
                  }`}>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-foreground">{lab.title}</h3>
                      {isCompleted && (
                        <Badge className="rounded-xl bg-green-100 text-green-800 border-green-200">
                          Completed
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{lab.description}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className={`rounded-xl ${difficultyColors[lab.difficulty as keyof typeof difficultyColors]}`}>
                        {lab.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDuration(lab.estimated_duration_minutes)}
                      </div>
                    </div>
                    
                    {lab.prerequisites && lab.prerequisites.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-1">Prerequisites:</p>
                        <div className="flex flex-wrap gap-1">
                          {lab.prerequisites.slice(0, 2).map((prereq, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs rounded-lg">
                              {prereq}
                            </Badge>
                          ))}
                          {lab.prerequisites.length > 2 && (
                            <Badge variant="outline" className="text-xs rounded-lg">
                              +{lab.prerequisites.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full rounded-xl"
                      variant={isInProgress ? "default" : isCompleted ? "outline" : "outline"}
                      disabled={isLocked}
                      onClick={() => isInProgress ? handleContinueLab(lab.id) : handleStartLab(lab.id)}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </>
                      ) : isInProgress ? (
                        "Continue Lab"
                      ) : isCompleted ? (
                        "Review Lab"
                      ) : (
                        "Start Lab"
                      )}
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {labs.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No AI Labs Available</h3>
            <p className="text-muted-foreground">
              Complete more courses to unlock AI lab projects.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}