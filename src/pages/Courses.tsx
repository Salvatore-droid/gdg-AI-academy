import { BookOpen, Search, Filter, Clock, Star } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";

const allCourses = [
  {
    id: "1",
    title: "Machine Learning Fundamentals with TensorFlow",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    progress: 65,
    duration: "8h 20m",
    category: "ML",
    rating: 4.8
  },
  {
    id: "2",
    title: "Natural Language Processing with Transformers",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    progress: 42,
    duration: "6h 45m",
    category: "NLP",
    rating: 4.9
  },
  {
    id: "3",
    title: "Computer Vision and Image Recognition",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    progress: 28,
    duration: "10h 30m",
    category: "CV",
    rating: 4.7
  },
  {
    id: "4",
    title: "Deep Learning Neural Networks",
    thumbnail: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&q=80",
    progress: 0,
    duration: "12h 15m",
    category: "DL",
    rating: 4.9
  },
  {
    id: "5",
    title: "AI Ethics and Responsible AI",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    progress: 0,
    duration: "5h 30m",
    category: "Ethics",
    rating: 4.6
  },
  {
    id: "6",
    title: "Reinforcement Learning Basics",
    thumbnail: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80",
    progress: 0,
    duration: "9h 45m",
    category: "RL",
    rating: 4.8
  },
];

const categories = ["All", "ML", "NLP", "CV", "DL", "Ethics", "RL"];

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-google-red/20 to-google-red/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-google-red" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">All Courses</h1>
          </div>
          <p className="text-lg text-muted-foreground ml-[60px]">
            Explore our comprehensive AI curriculum
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="rounded-xl gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer rounded-xl px-4 py-2 text-sm whitespace-nowrap"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <CourseCard key={course.id} {...course} index={index} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
