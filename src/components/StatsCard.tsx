import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: "google-blue" | "google-red" | "google-yellow" | "google-green";
  index: number;
}

const colorClasses = {
  "google-blue": "bg-google-blue/10 text-google-blue",
  "google-red": "bg-google-red/10 text-google-red",
  "google-yellow": "bg-google-yellow/10 text-google-yellow",
  "google-green": "bg-google-green/10 text-google-green",
};

export function StatsCard({ icon: Icon, label, value, color, index }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
