import { Clock, Trophy, Award, BookOpen, Brain, Shield, Code, Bot } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { CourseCard } from "@/components/CourseCard";
import { PathCard } from "@/components/PathCard";
import { motion } from "framer-motion";

const stats = [
  { icon: Clock, label: "Hours Learned", value: "127", color: "google-blue" as const },
  { icon: BookOpen, label: "Modules Completed", value: "24", color: "google-red" as const },
  { icon: Award, label: "Certificates Earned", value: "8", color: "google-yellow" as const },
  { icon: Trophy, label: "AI Projects Built", value: "12", color: "google-green" as const },
];

const activeCourses = [
  {
    id: "1",
    title: "Machine Learning Fundamentals with TensorFlow",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    progress: 65,
    duration: "8h 20m"
  },
  {
    id: "2",
    title: "Natural Language Processing with Transformers",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    progress: 42,
    duration: "6h 45m"
  },
  {
    id: "3",
    title: "Computer Vision and Image Recognition",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    progress: 28,
    duration: "10h 30m"
  },
];

const recommendedPaths = [
  {
    title: "AI for Beginners",
    description: "Start your journey into artificial intelligence with foundational concepts and hands-on projects.",
    icon: Brain,
    color: "google-blue" as const
  },
  {
    title: "AI + Cybersecurity",
    description: "Learn how AI is revolutionizing cybersecurity and threat detection systems.",
    icon: Shield,
    color: "google-red" as const
  },
  {
    title: "AI Software Engineering",
    description: "Master the art of building scalable AI-powered applications and systems.",
    icon: Code,
    color: "google-yellow" as const
  },
  {
    title: "Build Your Own AI Assistant",
    description: "Create intelligent chatbots and virtual assistants using cutting-edge AI models.",
    icon: Bot,
    color: "google-green" as const
  },
];

export default function Dashboard() {
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
          {stats.map((stat, index) => (
            <StatsCard key={stat.label} {...stat} index={index} />
          ))}
        </div>

        {/* Active Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Your Active Courses</h2>
            <a href="/courses" className="text-sm text-primary hover:underline font-medium">
              View all →
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCourses.map((course, index) => (
              <CourseCard key={course.id} {...course} index={index} />
            ))}
          </div>
        </div>

        {/* Recommended AI Paths */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Recommended AI Paths</h2>
          
          <div className="overflow-x-auto pb-4 -mx-6 px-6">
            <div className="flex gap-4">
              {recommendedPaths.map((path, index) => (
                <PathCard key={path.title} {...path} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
