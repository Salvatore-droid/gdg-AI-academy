import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Search, Edit, Trash2, BookOpen, Filter, 
  ArrowUp, ArrowDown, Eye, MoreVertical, 
  ChevronDown, Loader2, Upload, Download
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface Course {
  id: string;
  title: string;
  category: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  course: string;
  course_id: string;
  order: number;
  duration_minutes: number;
  video_url?: string;  // Updated from content_url
  is_active: boolean;
  created_at: string;
  updated_at: string;
  total_duration: number;
}

interface ModuleStats {
  total_modules: number;
  active_modules: number;
  total_duration: number;
  modules_by_type?: Record<string, number>;  // Make optional
}

const ManageModules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<ModuleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const { toast } = useToast();
  const { token } = useAdminAuth();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course_id: "",
    order: 1,
    duration_minutes: 60,
    video_url: "",  // Updated from content_url
    is_active: true,
  });

  // Fetch modules
  const fetchModules = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/modules/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched modules data:', data);
        setModules(data.modules || []);
      } else {
        throw new Error('Failed to fetch modules');
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast({
        title: "Error",
        description: "Failed to load modules",
        variant: "destructive",
      });
    }
  };

  // Fetch courses for dropdown
  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/courses/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  // Fetch module statistics
  const fetchModuleStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/modules/stats/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch module stats:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchModules(),
          fetchCourses(),
          fetchModuleStats()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Filtered modules
  const filteredModules = modules.filter(module => {
    if (!module) return false;
    
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (module.description && module.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCourse = filterCourse === "all" || module.course_id === filterCourse;
    
    return matchesSearch && matchesCourse;
  });

  // Handle module selection
  const toggleModuleSelection = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const selectAllModules = () => {
    if (selectedModules.length === filteredModules.length) {
      setSelectedModules([]);
    } else {
      setSelectedModules(filteredModules.map(module => module.id));
    }
  };

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      course_id: courses.length > 0 ? courses[0].id : "",
      order: 1,
      duration_minutes: 60,
      video_url: "",
      is_active: true,
    });
    setEditingModule(null);
  };

  // Handle add module
  const handleAddModule = async () => {
    if (!formData.course_id) {
      toast({
        title: "Error",
        description: "Please select a course",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Module title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/admin/courses/${formData.course_id}/modules/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          order: formData.order,
          duration_minutes: formData.duration_minutes,
          video_url: formData.video_url,
          is_active: formData.is_active,
          course_id: formData.course_id
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Module created successfully",
        });
        setIsAddDialogOpen(false);
        resetForm();
        await fetchModules();
        await fetchModuleStats();
      } else {
        const error = await response.json();
        throw new Error(error.error || error.detail || 'Failed to create module');
      }
    } catch (error: any) {
      console.error('Error creating module:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create module",
        variant: "destructive",
      });
    }
  };

  // Handle edit module
  const handleEditModule = (module: Module) => {
    if (!module) return;
    
    setEditingModule(module);
    setFormData({
      title: module.title || "",
      description: module.description || "",
      course_id: module.course_id || "",
      order: module.order || 1,
      duration_minutes: module.duration_minutes || 60,
      video_url: module.video_url || "",
      is_active: module.is_active || true,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateModule = async () => {
    if (!editingModule) return;

    try {
      const response = await fetch(`http://localhost:8000/api/admin/courses/${editingModule.course_id}/modules/${editingModule.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          order: formData.order,
          duration_minutes: formData.duration_minutes,
          video_url: formData.video_url,
          is_active: formData.is_active,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Module updated successfully",
        });
        setIsEditDialogOpen(false);
        resetForm();
        await fetchModules();
        await fetchModuleStats();
      } else {
        const error = await response.json();
        throw new Error(error.error || error.detail || 'Failed to update module');
      }
    } catch (error: any) {
      console.error('Error updating module:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update module",
        variant: "destructive",
      });
    }
  };

  // Handle delete module
  const handleDeleteModule = async () => {
    if (!editingModule) return;

    try {
      const response = await fetch(`http://localhost:8000/api/admin/courses/${editingModule.course_id}/modules/${editingModule.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Module deleted successfully",
        });
        setIsDeleteDialogOpen(false);
        setEditingModule(null);
        await fetchModules();
        await fetchModuleStats();
      } else {
        const error = await response.json();
        throw new Error(error.error || error.detail || 'Failed to delete module');
      }
    } catch (error: any) {
      console.error('Error deleting module:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete module",
        variant: "destructive",
      });
    }
  };

  // Handle bulk actions
  const handleBulkActivate = async () => {
    if (selectedModules.length === 0) return;

    try {
      const response = await fetch('http://localhost:8000/api/admin/modules/bulk_activate/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ module_ids: selectedModules }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${selectedModules.length} modules activated`,
        });
        setSelectedModules([]);
        await fetchModules();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate modules",
        variant: "destructive",
      });
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedModules.length === 0) return;

    try {
      const response = await fetch('http://localhost:8000/api/admin/modules/bulk_deactivate/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ module_ids: selectedModules }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${selectedModules.length} modules deactivated`,
        });
        setSelectedModules([]);
        await fetchModules();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate modules",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedModules.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedModules.length} modules?`)) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/admin/modules/bulk_delete/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ module_ids: selectedModules }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${selectedModules.length} modules deleted`,
        });
        setSelectedModules([]);
        await fetchModules();
        await fetchModuleStats();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete modules",
        variant: "destructive",
      });
    }
  };

  // Handle reorder
  const handleReorder = async (moduleId: string, direction: 'up' | 'down') => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/modules/${moduleId}/reorder/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ direction }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Module order updated",
        });
        await fetchModules();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder module",
        variant: "destructive",
      });
    }
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    if (!minutes) return "0 min";
    
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();
  };

  // Add safety checks before render
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-google-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading modules...</p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(modules)) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-destructive mb-4">Data Error</h2>
          <p className="text-muted-foreground">Modules data format is invalid</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Manage Modules</h1>
              <p className="text-muted-foreground">Create and organize course modules</p>
            </div>
            <Button 
              className="bg-google-yellow hover:bg-google-yellow/90 text-white"
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Module
            </Button>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Modules</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{stats.total_modules || 0}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-google-yellow" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Modules</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{stats.active_modules || 0}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-google-green" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Duration</p>
                      <p className="text-3xl font-bold text-foreground mt-2">
                        {formatDuration(stats.total_duration || 0)}
                      </p>
                    </div>
                    <BookOpen className="w-8 h-8 text-google-blue" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="bg-gradient-card border-border/50 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search modules by title or description..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterCourse} onValueChange={setFilterCourse}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedModules.length > 0 && (
                  <div className="flex gap-2 ml-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkActivate}
                    >
                      Activate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkDeactivate}
                    >
                      Deactivate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkDelete}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules Table */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={filteredModules.length > 0 && selectedModules.length === filteredModules.length}
                        onChange={selectAllModules}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead>Module Title</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModules.length > 0 ? (
                    filteredModules.map((module, index) => {
                      if (!module) return null;
                      
                      return (
                        <motion.tr
                          key={module.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-b border-border/50 hover:bg-muted/50"
                        >
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedModules.includes(module.id)}
                              onChange={() => toggleModuleSelection(module.id)}
                              className="rounded border-gray-300"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-google-yellow" />
                              <div>
                                <div className="font-medium">{module.title}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-xs">
                                  {module.description?.substring(0, 60) || "No description"}...
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{module.course || "Unknown"}</Badge>
                          </TableCell>
                          <TableCell>
                            {formatDuration(module.duration_minutes)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">#{module.order}</Badge>
                              <div className="flex flex-col">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => handleReorder(module.id, 'up')}
                                  disabled={module.order === 1}
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => handleReorder(module.id, 'down')}
                                  disabled={module.order === modules.length}
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={module.is_active ? "default" : "secondary"}
                              className={module.is_active ? "bg-google-green text-white" : ""}
                            >
                              {module.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => window.open(`/admin/modules/${module.id}`, '_blank')}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditModule(module)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Module
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setEditingModule(module);
                                  setIsDeleteDialogOpen(true);
                                }} className="text-destructive">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Module
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No modules found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add Module Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Module</DialogTitle>
              <DialogDescription>
                Create a new module for a course.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Module Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    placeholder="Introduction to Neural Networks"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Course *</Label>
                  <Select
                    value={formData.course_id}
                    onValueChange={(value) => handleFormChange("course_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  placeholder="Module description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => handleFormChange("order", parseInt(e.target.value))}
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration_minutes}
                    onChange={(e) => handleFormChange("duration_minutes", parseInt(e.target.value))}
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_url">Video URL (optional)</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => handleFormChange("video_url", e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=example"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleFormChange("is_active", checked)}
                  id="active"
                />
                <Label htmlFor="active">Active Module</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddModule} disabled={!formData.title.trim() || !formData.description.trim() || !formData.course_id}>
                Create Module
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Module Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Module</DialogTitle>
              <DialogDescription>
                Update module information.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Module Title *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-course">Course</Label>
                  <Select
                    value={formData.course_id}
                    onValueChange={(value) => handleFormChange("course_id", value)}
                    disabled={true}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-order">Order</Label>
                  <Input
                    id="edit-order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => handleFormChange("order", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration (minutes)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    min="1"
                    value={formData.duration_minutes}
                    onChange={(e) => handleFormChange("duration_minutes", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-video_url">Video URL (optional)</Label>
                <Input
                  id="edit-video_url"
                  value={formData.video_url}
                  onChange={(e) => handleFormChange("video_url", e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleFormChange("is_active", checked)}
                  id="edit-active"
                />
                <Label htmlFor="edit-active">Active Module</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdateModule} disabled={!formData.title.trim() || !formData.description.trim()}>
                Update Module
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete Module</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this module? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {editingModule && (
              <div className="py-4">
                <p className="font-medium">{editingModule.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Course: {editingModule.course}
                </p>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteModule}>
                Delete Module
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default ManageModules;