import { ArrowRight, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface PathCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "google-blue" | "google-red" | "google-yellow" | "google-green";
  index: number;
}

const colorClasses = {
  "google-blue": "bg-google-blue/10 text-google-blue",
  "google-red": "bg-google-red/10 text-google-red",
  "google-yellow": "bg-google-yellow/10 text-google-yellow",
  "google-green": "bg-google-green/10 text-google-green",
};

export function PathCard({ title, description, icon: Icon, color, index }: PathCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex-shrink-0 w-80 bg-card rounded-2xl border border-border p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${colorClasses[color]}`}>
        <Icon className="w-7 h-7" />
      </div>
      
      <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {description}
      </p>

      <Button variant="ghost" className="w-full justify-between rounded-xl group-hover:bg-muted">
        Start Learning
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );
}
