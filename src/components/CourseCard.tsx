import { Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface CourseCardProps {
  id: string;
  title: string;
  thumbnail: string;
  progress: number;
  duration: string;
  index: number;
}

export function CourseCard({ id, title, thumbnail, progress, duration, index }: CourseCardProps) {
  return (
    <Link to={`/courses/${id}`} className="block">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -4 }}
        className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-google-blue/20 to-google-green/20">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
          <Clock className="w-3 h-3" />
          {duration}
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Button 
          className="w-full rounded-xl group/btn"
          asChild
        >
          <span>
            <Play className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            Continue Learning
          </span>
        </Button>
      </div>
    </motion.div>
    </Link>
  );
}
