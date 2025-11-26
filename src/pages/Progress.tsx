import { Trophy, Award, Download, Star, TrendingUp, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const certificates = [
  {
    id: "1",
    title: "Machine Learning Fundamentals",
    issueDate: "2024-01-15",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    credentialId: "ML-2024-001"
  },
  {
    id: "2",
    title: "Natural Language Processing",
    issueDate: "2024-02-20",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    credentialId: "NLP-2024-002"
  },
];

const achievements = [
  { title: "First Steps", description: "Completed your first course", icon: Trophy, color: "google-blue" },
  { title: "Speed Learner", description: "Finished 3 courses in one month", icon: TrendingUp, color: "google-green" },
  { title: "Lab Master", description: "Completed 5 AI labs", icon: Star, color: "google-yellow" },
  { title: "Consistent Learner", description: "7-day learning streak", icon: Calendar, color: "google-red" },
];

const learningStats = [
  { label: "Total Learning Time", value: "127 hours", progress: 75, color: "google-blue" },
  { label: "Courses Completed", value: "8 / 12", progress: 67, color: "google-green" },
  { label: "Labs Finished", value: "12 / 15", progress: 80, color: "google-yellow" },
  { label: "Overall Progress", value: "74%", progress: 74, color: "google-red" },
];

export default function ProgressPage() {
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
          {learningStats.map((stat, index) => (
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

        {/* Achievements */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${achievement.color}/20 to-${achievement.color}/10 flex items-center justify-center mx-auto mb-3`}>
                      <IconComponent className={`w-8 h-8 text-${achievement.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
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
                    <img 
                      src={cert.image} 
                      alt={cert.title}
                      className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-foreground px-4">{cert.title}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Issue Date</span>
                      <span className="text-foreground font-medium">{cert.issueDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Credential ID</span>
                      <span className="text-foreground font-mono text-xs">{cert.credentialId}</span>
                    </div>
                    <Button className="w-full rounded-xl gap-2">
                      <Download className="w-4 h-4" />
                      Download Certificate
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress Chart Placeholder */}
        <Card className="p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Learning Progress Over Time</h2>
          <div className="h-64 bg-muted/20 rounded-xl flex items-center justify-center">
            <p className="text-muted-foreground">Chart visualization coming soon...</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
