import { motion } from "framer-motion";
import { MessageSquare, Search, Eye, Trash2, Flag, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const discussions = [
  { id: 1, title: "Best practices for neural network architecture", author: "Sarah J.", replies: 24, status: "Active", flagged: false },
  { id: 2, title: "Understanding backpropagation", author: "Mike C.", replies: 15, status: "Active", flagged: false },
  { id: 3, title: "Inappropriate content example", author: "User123", replies: 3, status: "Reported", flagged: true },
  { id: 4, title: "TensorFlow vs PyTorch discussion", author: "Emma W.", replies: 42, status: "Active", flagged: false },
];

const events = [
  { id: 1, title: "AI Workshop: Advanced Techniques", date: "2024-02-15", attendees: 45, status: "Upcoming" },
  { id: 2, title: "Guest Speaker: ML in Healthcare", date: "2024-02-20", attendees: 78, status: "Upcoming" },
  { id: 3, title: "Study Group: Deep Learning", date: "2024-01-30", attendees: 32, status: "Completed" },
];

const ManageCommunity = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Manage Community</h1>
          <p className="text-muted-foreground">Moderate discussions and manage events</p>
        </div>

        <Tabs defaultValue="discussions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="discussions">
            <Card className="bg-gradient-card border-border/50 mb-6">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search discussions..."
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
                      <TableHead>Discussion Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Replies</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discussions.map((discussion, index) => (
                      <motion.tr
                        key={discussion.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-border/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {discussion.flagged && <Flag className="w-4 h-4 text-destructive" />}
                            <MessageSquare className="w-4 h-4 text-google-blue" />
                            <span className="font-medium">{discussion.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{discussion.author}</TableCell>
                        <TableCell>{discussion.replies}</TableCell>
                        <TableCell>
                          <Badge
                            variant={discussion.status === "Reported" ? "destructive" : "default"}
                            className={discussion.status === "Active" ? "bg-google-green text-white" : ""}
                          >
                            {discussion.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
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
          </TabsContent>

          <TabsContent value="events">
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Attendees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event, index) => (
                      <motion.tr
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-border/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-google-red" />
                            <span className="font-medium">{event.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{event.date}</TableCell>
                        <TableCell>{event.attendees}</TableCell>
                        <TableCell>
                          <Badge
                            variant={event.status === "Upcoming" ? "default" : "secondary"}
                            className={event.status === "Upcoming" ? "bg-google-blue text-white" : ""}
                          >
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
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
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ManageCommunity;
