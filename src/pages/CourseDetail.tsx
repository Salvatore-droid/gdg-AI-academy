import { Play, FileText, CheckCircle2, Circle, Clock, Award, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

const modules = [
  { id: 1, title: "Introduction to Machine Learning", duration: "45 min", completed: true },
  { id: 2, title: "Understanding Neural Networks", duration: "1h 20m", completed: true },
  { id: 3, title: "Training Your First Model", duration: "2h 15m", completed: false, current: true },
  { id: 4, title: "Model Evaluation and Metrics", duration: "1h 30m", completed: false },
  { id: 5, title: "Hyperparameter Tuning", duration: "1h 45m", completed: false },
  { id: 6, title: "Deployment Strategies", duration: "2h 10m", completed: false },
];

export default function CourseDetail() {
  const { id } = useParams();
  const completedModules = modules.filter(m => m.completed).length;
  const progress = Math.round((completedModules / modules.length) * 100);

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="h-full flex">
        {/* Module List Sidebar */}
        <div className="w-96 border-r border-border bg-card overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Course Modules</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {completedModules} of {modules.length} modules completed
              </p>
              <Progress value={progress} className="h-2" />
            </div>

            <Separator />

            <div className="space-y-2">
              {modules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card 
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      module.current 
                        ? "border-primary bg-primary/5 hover:bg-primary/10" 
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {module.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-google-green" />
                        ) : (
                          <Circle className={`w-5 h-5 ${module.current ? "text-primary" : "text-muted-foreground"}`} />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <h3 className={`font-medium text-sm ${
                          module.current ? "text-primary" : "text-foreground"
                        }`}>
                          {module.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {module.duration}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-8 space-y-6">
            {/* Video Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div className="aspect-video bg-gradient-to-br from-google-blue/20 to-google-green/20 rounded-2xl overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80"
                  alt="Video preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button size="lg" className="rounded-full w-16 h-16 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Training Your First Model
                  </h1>
                  <p className="text-muted-foreground">
                    Learn how to build and train your first neural network from scratch
                  </p>
                </div>
                
                <Button variant="outline" className="rounded-xl">
                  <Award className="w-4 h-4 mr-2" />
                  Certificate
                </Button>
              </div>
            </motion.div>

            {/* Progress Tracker */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Your Progress</h3>
                <span className="text-sm font-medium text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3 mb-4" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-google-blue">{completedModules}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-google-yellow">1</p>
                  <p className="text-xs text-muted-foreground">Current</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-muted-foreground">
                    {modules.length - completedModules - 1}
                  </p>
                  <p className="text-xs text-muted-foreground">Remaining</p>
                </div>
              </div>
            </Card>

            {/* Notes Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Lesson Notes
                </h3>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 min-h-[200px]">
                <p className="text-sm text-muted-foreground">
                  Your notes for this lesson will appear here...
                </p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
