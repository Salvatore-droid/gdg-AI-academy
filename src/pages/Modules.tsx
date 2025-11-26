import { Layers, Clock, CheckCircle2, Circle, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const modules = [
  {
    id: "1",
    courseId: "1",
    courseTitle: "Machine Learning Fundamentals",
    title: "Introduction to Machine Learning",
    duration: "45 min",
    completed: true,
    locked: false
  },
  {
    id: "2",
    courseId: "1",
    courseTitle: "Machine Learning Fundamentals",
    title: "Understanding Neural Networks",
    duration: "1h 20m",
    completed: true,
    locked: false
  },
  {
    id: "3",
    courseId: "1",
    courseTitle: "Machine Learning Fundamentals",
    title: "Training Your First Model",
    duration: "2h 15m",
    completed: false,
    locked: false,
    current: true
  },
  {
    id: "4",
    courseId: "2",
    courseTitle: "Natural Language Processing",
    title: "NLP Fundamentals",
    duration: "1h 10m",
    completed: true,
    locked: false
  },
  {
    id: "5",
    courseId: "2",
    courseTitle: "Natural Language Processing",
    title: "Tokenization & Embeddings",
    duration: "1h 45m",
    completed: false,
    locked: false,
    current: true
  },
  {
    id: "6",
    courseId: "3",
    courseTitle: "Computer Vision",
    title: "Image Processing Basics",
    duration: "1h 30m",
    completed: false,
    locked: true
  },
];

export default function Modules() {
  const inProgressModules = modules.filter(m => m.current);
  const completedModules = modules.filter(m => m.completed);
  const upcomingModules = modules.filter(m => !m.completed && !m.current);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-google-green/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-google-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedModules.length}</p>
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
                <p className="text-2xl font-bold text-foreground">{inProgressModules.length}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Lock className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{upcomingModules.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </Card>
        </div>

        {/* In Progress */}
        {inProgressModules.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Continue Learning</h2>
            <div className="grid gap-4">
              {inProgressModules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link to={`/courses/${module.courseId}`}>
                    <Card className="p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border-primary/20 bg-primary/5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge className="mb-2">{module.courseTitle}</Badge>
                          <h3 className="text-lg font-semibold text-foreground mb-2">{module.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {module.duration}
                            </div>
                          </div>
                        </div>
                        <Circle className="w-6 h-6 text-primary" />
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
          <div className="grid gap-3">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link to={module.locked ? "#" : `/courses/${module.courseId}`}>
                  <Card className={`p-4 rounded-xl hover:shadow-md transition-all duration-200 ${
                    module.locked ? "opacity-60 cursor-not-allowed" : "hover:bg-muted/50"
                  }`}>
                    <div className="flex items-center gap-4">
                      <div>
                        {module.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-google-green" />
                        ) : module.locked ? (
                          <Lock className="w-6 h-6 text-muted-foreground" />
                        ) : (
                          <Circle className={`w-6 h-6 ${module.current ? "text-primary" : "text-muted-foreground"}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">{module.courseTitle}</p>
                        <h3 className="font-medium text-foreground">{module.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {module.duration}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
