import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const courses = [
  { id: 1, title: "Introduction to Machine Learning", instructor: "Dr. Sarah Johnson", students: 1247, status: "Active", category: "ML" },
  { id: 2, title: "Advanced TensorFlow", instructor: "Prof. Mike Chen", students: 856, status: "Active", category: "DL" },
  { id: 3, title: "Natural Language Processing", instructor: "Dr. Emma Wilson", students: 1092, status: "Active", category: "NLP" },
  { id: 4, title: "Computer Vision Basics", instructor: "James Brown", students: 743, status: "Draft", category: "CV" },
  { id: 5, title: "AI Ethics and Responsibility", instructor: "Dr. Lisa Anderson", students: 2103, status: "Active", category: "Ethics" },
  { id: 6, title: "Reinforcement Learning", instructor: "Prof. David Lee", students: 567, status: "Active", category: "RL" },
];

const ManageCourses = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Manage Courses</h1>
            <p className="text-muted-foreground">Create, edit, and manage all courses</p>
          </div>
          <Button className="bg-google-blue hover:bg-google-blue/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Course
          </Button>
        </div>

        <Card className="bg-gradient-card border-border/50 mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search courses by title or instructor..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Title</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course, index) => (
                  <motion.tr
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-border/50"
                  >
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>{course.students.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{course.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={course.status === "Active" ? "default" : "secondary"}
                        className={course.status === "Active" ? "bg-google-green text-white" : ""}
                      >
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ManageCourses;
