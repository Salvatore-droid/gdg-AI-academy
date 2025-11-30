import { BookOpen, Search, Filter, Clock, Star, Plus } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration_minutes: number;
  difficulty: string;
  category: string;
  instructor: string;
  rating?: number;
}

interface UserCourseProgress {
  id: string;
  course: Course;
  progress_percentage: number;
  is_completed: boolean;
}

const categories = ["All", "Machine Learning", "NLP", "Computer Vision", "Deep Learning", "Ethics", "Reinforcement Learning"];

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<UserCourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/auth';
          return;
        }

        // Fetch all available courses
        const coursesResponse = await fetch('http://localhost:8000/api/courses/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Fetch user's enrolled courses
        const userCoursesResponse = await fetch('http://localhost:8000/api/dashboard/courses/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (coursesResponse.ok && userCoursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          const userCoursesData = await userCoursesResponse.json();
          
          setAllCourses(coursesData);
          setUserCourses(userCoursesData);
        } else {
          throw new Error('Failed to fetch courses data');
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        toast({
          title: "Error",
          description: "Failed to load courses",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesData();
  }, [toast]);

  const handleEnrollCourse = async (courseId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/courses/${courseId}/enroll/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success!",
          description: `Enrolled in "${data.course.title}"`,
        });
        
        // Refresh user courses
        const userCoursesResponse = await fetch('http://localhost:8000/api/dashboard/courses/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (userCoursesResponse.ok) {
          const userCoursesData = await userCoursesResponse.json();
          setUserCourses(userCoursesData);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to enroll in course');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to enroll in course",
        variant: "destructive",
      });
    }
  };

  const getCourseProgress = (courseId: string): number => {
    const userCourse = userCourses.find(uc => uc.course.id === courseId);
    return userCourse ? userCourse.progress_percentage : 0;
  };

  const isUserEnrolled = (courseId: string): boolean => {
    return userCourses.some(uc => uc.course.id === courseId);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading courses...</p>
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-google-red/20 to-google-red/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-google-red" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">All Courses</h1>
              <p className="text-lg text-muted-foreground">
                Explore our comprehensive AI curriculum
              </p>
            </div>
          </div>
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
            <CourseCard 
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              thumbnail={course.thumbnail}
              progress={getCourseProgress(course.id)}
              duration={formatDuration(course.duration_minutes)}
              category={course.category}
              difficulty={course.difficulty}
              instructor={course.instructor}
              rating={course.rating}
              isEnrolled={isUserEnrolled(course.id)}
              onEnroll={() => handleEnrollCourse(course.id)}
              index={index}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory !== "All" 
                ? "No courses match your search criteria." 
                : "No courses available at the moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}