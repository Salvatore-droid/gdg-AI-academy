import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, BookOpen } from "lucide-react";
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

const modules = [
  { id: 1, title: "Introduction to Neural Networks", course: "Machine Learning Basics", duration: "45 min", status: "Published", order: 1 },
  { id: 2, title: "Deep Learning Fundamentals", course: "Advanced TensorFlow", duration: "60 min", status: "Published", order: 2 },
  { id: 3, title: "Training Your First Model", course: "Machine Learning Basics", duration: "50 min", status: "Draft", order: 3 },
  { id: 4, title: "Text Processing Techniques", course: "NLP", duration: "40 min", status: "Published", order: 1 },
  { id: 5, title: "Image Classification", course: "Computer Vision", duration: "55 min", status: "Published", order: 1 },
  { id: 6, title: "Bias in AI Systems", course: "AI Ethics", duration: "35 min", status: "Published", order: 2 },
];

const ManageModules = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Manage Modules</h1>
            <p className="text-muted-foreground">Create and organize course modules</p>
          </div>
          <Button className="bg-google-yellow hover:bg-google-yellow/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Module
          </Button>
        </div>

        <Card className="bg-gradient-card border-border/50 mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search modules by title or course..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filter by Course</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module Title</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((module, index) => (
                  <motion.tr
                    key={module.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-border/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-google-yellow" />
                        <span className="font-medium">{module.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{module.course}</TableCell>
                    <TableCell>{module.duration}</TableCell>
                    <TableCell>
                      <Badge variant="outline">#{module.order}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={module.status === "Published" ? "default" : "secondary"}
                        className={module.status === "Published" ? "bg-google-green text-white" : ""}
                      >
                        {module.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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

export default ManageModules;
