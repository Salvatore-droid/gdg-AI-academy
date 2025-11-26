import { motion } from "framer-motion";
import { UserPlus, Search, Edit, Trash2, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const users = [
  { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com", role: "Student", courses: 5, status: "Active", joined: "Jan 2024" },
  { id: 2, name: "Mike Chen", email: "mike.c@example.com", role: "Instructor", courses: 3, status: "Active", joined: "Dec 2023" },
  { id: 3, name: "Emma Wilson", email: "emma.w@example.com", role: "Student", courses: 8, status: "Active", joined: "Feb 2024" },
  { id: 4, name: "James Brown", email: "james.b@example.com", role: "Admin", courses: 0, status: "Active", joined: "Nov 2023" },
  { id: 5, name: "Lisa Anderson", email: "lisa.a@example.com", role: "Instructor", courses: 4, status: "Active", joined: "Jan 2024" },
  { id: 6, name: "David Lee", email: "david.l@example.com", role: "Student", courses: 6, status: "Inactive", joined: "Mar 2024" },
];

const ManageUsers = () => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Manage Users</h1>
            <p className="text-muted-foreground">View and manage all platform users</p>
          </div>
          <Button className="bg-google-red hover:bg-google-red/90 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        <Card className="bg-gradient-card border-border/50 mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filter by Role</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-border/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-google-blue/20 text-google-blue text-xs">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.role === "Admin" ? "border-google-red text-google-red" :
                          user.role === "Instructor" ? "border-google-blue text-google-blue" :
                          "border-google-green text-google-green"
                        }
                      >
                        {user.role === "Admin" && <Shield className="w-3 h-3 mr-1" />}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.courses}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "Active" ? "default" : "secondary"}
                        className={user.status === "Active" ? "bg-google-green text-white" : ""}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.joined}</TableCell>
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

export default ManageUsers;
