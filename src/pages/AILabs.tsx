import { Sparkles, Rocket, Code, Brain, Zap, GitBranch } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const labs = [
  {
    id: "1",
    title: "Build a Text Classifier",
    description: "Create a machine learning model that can classify text into different categories using TensorFlow.",
    icon: Brain,
    difficulty: "Beginner",
    duration: "2-3 hours",
    status: "available",
    color: "google-blue"
  },
  {
    id: "2",
    title: "Image Recognition System",
    description: "Develop an AI system that can identify and classify objects in images using computer vision.",
    icon: Sparkles,
    difficulty: "Intermediate",
    duration: "3-4 hours",
    status: "in-progress",
    color: "google-green"
  },
  {
    id: "3",
    title: "Chatbot with NLP",
    description: "Build an intelligent chatbot using natural language processing and transformer models.",
    icon: Code,
    difficulty: "Intermediate",
    duration: "4-5 hours",
    status: "available",
    color: "google-red"
  },
  {
    id: "4",
    title: "Sentiment Analysis Tool",
    description: "Create a tool that analyzes the sentiment of text data using deep learning techniques.",
    icon: Zap,
    difficulty: "Beginner",
    duration: "2-3 hours",
    status: "available",
    color: "google-yellow"
  },
  {
    id: "5",
    title: "Neural Network from Scratch",
    description: "Build and train a neural network from scratch without using high-level frameworks.",
    icon: GitBranch,
    difficulty: "Advanced",
    duration: "5-6 hours",
    status: "locked",
    color: "google-blue"
  },
  {
    id: "6",
    title: "AI-Powered Recommender",
    description: "Develop a recommendation system using collaborative filtering and deep learning.",
    icon: Rocket,
    difficulty: "Advanced",
    duration: "4-5 hours",
    status: "locked",
    color: "google-green"
  },
];

const difficultyColors = {
  "Beginner": "bg-google-green/10 text-google-green",
  "Intermediate": "bg-google-yellow/10 text-google-yellow",
  "Advanced": "bg-google-red/10 text-google-red"
};

export default function AILabs() {
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
              <div className="flex gap-4">
                <Badge variant="secondary" className="rounded-xl">
                  <Rocket className="w-3 h-3 mr-1" />
                  6 Projects
                </Badge>
                <Badge variant="secondary" className="rounded-xl">
                  <Zap className="w-3 h-3 mr-1" />
                  Interactive
                </Badge>
              </div>
            </div>
            <div className="w-24 h-24 rounded-2xl bg-gradient-google flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
        </Card>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab, index) => {
            const IconComponent = lab.icon;
            const isLocked = lab.status === "locked";
            const isInProgress = lab.status === "in-progress";
            
            return (
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`p-6 rounded-2xl h-full flex flex-col hover:shadow-xl transition-all duration-300 ${
                  isLocked ? "opacity-60" : "hover:-translate-y-1"
                } ${isInProgress ? "border-primary bg-primary/5" : ""}`}>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${lab.color}/20 to-${lab.color}/10 flex items-center justify-center mb-4`}>
                    <IconComponent className={`w-7 h-7 text-${lab.color}`} />
                  </div>
                  
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-foreground">{lab.title}</h3>
                    {isInProgress && <Badge className="rounded-xl">In Progress</Badge>}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{lab.description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className={`rounded-xl ${difficultyColors[lab.difficulty as keyof typeof difficultyColors]}`}>
                      {lab.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{lab.duration}</span>
                  </div>
                  
                  <Button 
                    className="w-full rounded-xl"
                    variant={isInProgress ? "default" : "outline"}
                    disabled={isLocked}
                  >
                    {isLocked ? "Locked" : isInProgress ? "Continue Lab" : "Start Lab"}
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
