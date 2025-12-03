import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  UserPlus, Search, Edit, Trash2, Shield, Mail, Calendar, 
  BookOpen, Filter, MoreVertical, Eye, Check, X, 
  Loader2, AlertCircle, RefreshCw, Users, TrendingUp, Award
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface User {
  id: string;
  email: string;
  full_name: string;
  bio?: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
  last_login: string;
  courses_enrolled: number;
  courses_completed: number;
  total_learning_hours: number;
  certificates_earned: number;
  avatar_url?: string;
}

interface UserStats {
  total_users: number;
  active_users: number;
  admin_users: number;
  new_users_today: number;
  new_users_week: number;
  total_learning_hours: number;
  top_learners: Array<{
    id: string;
    full_name: string;
    total_learning_hours: number;
    courses_completed: number;
  }>;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const { token } = useAdminAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    confirm_password: "",
    bio: "",
    is_active: true,
    is_staff: false,
    is_superuser: false,
    send_welcome_email: true,
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/users/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    }
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/users/stats/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchUserStats()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && user.is_active) ||
                         (filterStatus === "inactive" && !user.is_active);
    
    const matchesRole = filterRole === "all" ||
                       (filterRole === "admin" && user.is_staff) ||
                       (filterRole === "superadmin" && user.is_superuser) ||
                       (filterRole === "regular" && !user.is_staff && !user.is_superuser);
    
    const matchesTab = activeTab === "all" ||
                      (activeTab === "active" && user.is_active) ||
                      (activeTab === "inactive" && !user.is_active) ||
                      (activeTab === "admin" && user.is_staff);
    
    return matchesSearch && matchesStatus && matchesRole && matchesTab;
  });

  // Handle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
      bio: "",
      is_active: true,
      is_staff: false,
      is_superuser: false,
      send_welcome_email: true,
    });
    setEditingUser(null);
  };

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle add user
  const handleAddUser = async () => {
    // Validate form
    if (!formData.email || !formData.full_name) {
      toast({
        title: "Error",
        description: "Email and full name are required",
        variant: "destructive",
      });
      return;
    }
  
    if (formData.password && formData.password !== formData.confirm_password) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
  
    try {
      // Prepare data for API
      const userData = {
        email: formData.email,
        full_name: formData.full_name,
        password: formData.password || undefined,
        bio: formData.bio || undefined,
        is_active: formData.is_active,
        is_staff: formData.is_staff,
        is_superuser: formData.is_superuser,
      };
  
      console.log('Sending request to:', 'http://localhost:8000/api/admin/users/');
      console.log('Request data:', userData);
      console.log('Token:', token ? `${token.substring(0, 20)}...` : 'No token');
  
      const response = await fetch('http://localhost:8000/api/admin/users/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Add this for cookies
        body: JSON.stringify(userData),
      });
  
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  
      if (response.ok) {
        const data = await response.json();
        console.log('Success! Data:', data);
        
        toast({
          title: "Success",
          description: "User created successfully",
        });
        
        setIsAddDialogOpen(false);
        resetForm();
        
        // Refresh data
        await fetchUsers();
        await fetchUserStats();
        
        // Send welcome email if requested
        if (formData.send_welcome_email && formData.password) {
          try {
            await fetch('http://localhost:8000/api/admin/users/send-welcome/', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ user_id: data.id }),
            });
          } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
          }
        }
      } else {
        // Try to parse error response
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        
        let errorMessage = 'Failed to create user';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.detail || errorMessage;
          
          // Handle specific error cases
          if (response.status === 403) {
            errorMessage = 'Access denied. You may need to login again.';
            // Clear auth and redirect
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            window.location.href = '/admin/auth';
          }
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Add user error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    }
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      full_name: user.full_name,
      password: "",
      confirm_password: "",
      bio: user.bio || "",
      is_active: user.is_active,
      is_staff: user.is_staff,
      is_superuser: user.is_superuser,
      send_welcome_email: false,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
        // Debug log what we're sending
        console.log('=== UPDATE USER ===');
        console.log('Editing user:', editingUser.email);
        console.log('Form data password field:', formData.password ? '***' : '(empty)');
        console.log('Form data confirm_password field:', formData.confirm_password ? '***' : '(empty)');

        // Prepare update data - include ALL fields that should be sent
        const updateData: any = {
            email: formData.email,
            full_name: formData.full_name,
            bio: formData.bio || '',
            is_active: formData.is_active,
            is_staff: formData.is_staff,
            is_superuser: formData.is_superuser,
        };

        // CRITICAL FIX: Always send password field, even if empty
        // The backend serializer checks if password field exists in request
        // If it exists and is empty, it keeps current password
        // If it exists and has value, it updates password
        // If it doesn't exist, it doesn't know what to do
        updateData.password = formData.password || '';

        // Only validate password match if password is being changed (not empty)
        if (formData.password && formData.password.trim() !== '') {
            if (formData.password !== formData.confirm_password) {
                toast({
                    title: "Error",
                    description: "Passwords do not match",
                    variant: "destructive",
                });
                return;
            }
            console.log('Password will be updated');
        } else {
            console.log('Password field is empty, keeping current password');
        }

        // Debug the final data being sent
        console.log('Sending update data:', {
            ...updateData,
            password: updateData.password ? '*** (length: ' + updateData.password.length + ')' : '(empty string)'
        });

        const response = await fetch(`http://localhost:8000/api/admin/users/${editingUser.id}/`, {
            method: 'PUT',  // Use PUT (not PATCH) to send all fields
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'include',
            body: JSON.stringify(updateData),
        });

        console.log('Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Update successful:', data);
            
            toast({
                title: "Success",
                description: "User updated successfully",
            });
            
            // Reset form and close dialog
            setIsEditDialogOpen(false);
            resetForm();
            setEditingUser(null);
            
            // Refresh data
            await Promise.all([
                fetchUsers(),
                fetchUserStats()
            ]);
            
        } else {
            // Try to parse error response
            const errorText = await response.text();
            console.error('Update error response:', errorText);
            
            let errorMessage = 'Failed to update user';
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || errorData.detail || errorMessage;
                
                // Handle specific error cases
                if (response.status === 400) {
                    // Validation errors
                    if (errorData.email) {
                        errorMessage = `Email error: ${Array.isArray(errorData.email) ? errorData.email[0] : errorData.email}`;
                    } else if (errorData.password) {
                        errorMessage = `Password error: ${Array.isArray(errorData.password) ? errorData.password[0] : errorData.password}`;
                    }
                } else if (response.status === 403) {
                    errorMessage = 'Access denied. You may need to login again.';
                    // Clear auth and redirect
                    localStorage.removeItem('admin_token');
                    localStorage.removeItem('admin_user');
                    window.location.href = '/admin/auth';
                }
            } catch (parseError) {
                console.error('Could not parse error response:', parseError);
            }
            
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        console.error('Update user error:', error);
        toast({
            title: "Error",
            description: error.message || "Failed to update user",
            variant: "destructive",
        });
    }
};

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`http://localhost:8000/api/admin/users/${editingUser.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        setIsDeleteDialogOpen(false);
        setEditingUser(null);
        await fetchUsers();
        await fetchUserStats();
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  // Handle bulk actions
  const handleBulkActivate = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const response = await fetch('http://localhost:8000/api/admin/users/bulk_activate/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_ids: selectedUsers }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${selectedUsers.length} users activated`,
        });
        setSelectedUsers([]);
        await fetchUsers();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate users",
        variant: "destructive",
      });
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const response = await fetch('http://localhost:8000/api/admin/users/bulk_deactivate/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_ids: selectedUsers }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${selectedUsers.length} users deactivated`,
        });
        setSelectedUsers([]);
        await fetchUsers();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate users",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/admin/users/bulk_delete/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_ids: selectedUsers }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${selectedUsers.length} users deleted`,
        });
        setSelectedUsers([]);
        await fetchUsers();
        await fetchUserStats();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete users",
        variant: "destructive",
      });
    }
  };

  // Handle view user details
  const handleViewUser = (user: User) => {
    setViewingUser(user);
    setIsViewDialogOpen(true);
  };

  // Handle promote to admin
  const handlePromoteToAdmin = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/users/${userId}/promote_to_admin/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "User promoted to admin",
        });
        await fetchUsers();
        await fetchUserStats();
      } else {
        throw new Error('Failed to promote user');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote user",
        variant: "destructive",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Format learning hours
  // Fix the formatLearningHours function
const formatLearningHours = (hours: number | undefined | null) => {
  // Handle undefined, null, or NaN
  if (hours === undefined || hours === null || isNaN(hours)) {
    return "0 min";
  }
  
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  return `${hours.toFixed(1)} hours`;
};

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
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
              <h1 className="text-4xl font-bold text-foreground mb-2">Manage Users</h1>
              <p className="text-muted-foreground">View and manage all platform users</p>
            </div>
            <Button 
              className="bg-google-red hover:bg-google-red/90 text-white"
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add New User
            </Button>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{stats.total_users}</p>
                    </div>
                    <Users className="w-8 h-8 text-google-blue" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{stats.active_users}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-google-green" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Admin Users</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{stats.admin_users}</p>
                    </div>
                    <Shield className="w-8 h-8 text-google-red" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">New Users (Today)</p>
                      <p className="text-3xl font-bold text-foreground mt-2">+{stats.new_users_today}</p>
                    </div>
                    <UserPlus className="w-8 h-8 text-google-yellow" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({users.filter(u => u.is_active).length})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({users.filter(u => !u.is_active).length})</TabsTrigger>
              <TabsTrigger value="admin">Admins ({users.filter(u => u.is_staff).length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search and Filters */}
        <Card className="bg-gradient-card border-border/50 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users by name, email, or bio..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>

                {selectedUsers.length > 0 && (
                  <div className="flex gap-2 ml-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkActivate}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Activate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkDeactivate}
                    >
                      <X className="w-4 h-4 mr-2" />
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

        {/* Users Table */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={selectAllUsers}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Learning Hours</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-border/50 hover:bg-muted/50"
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className="rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              {user.avatar_url ? (
                                <AvatarImage src={user.avatar_url} alt={user.full_name} />
                              ) : null}
                              <AvatarFallback className="bg-google-blue/20 text-google-blue text-xs">
                                {getInitials(user.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.full_name}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            user.is_superuser ? "bg-purple-100 text-purple-800 border-purple-200" :
                            user.is_staff ? "bg-google-red/20 text-google-red border-google-red/30" :
                            "bg-gray-100 text-gray-800 border-gray-200"
                          }>
                            {user.is_superuser ? "Super Admin" : user.is_staff ? "Admin" : "User"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <BookOpen className="w-4 h-4 text-google-blue" />
                              <span>{user.courses_enrolled} enrolled</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Award className="w-4 h-4 text-google-yellow" />
                              <span>{user.courses_completed} completed</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatLearningHours(user.total_learning_hours)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.certificates_earned} certificates
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-3 h-3" />
                            {formatDate(user.created_at)}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(user.last_login)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.is_active ? "default" : "secondary"}
                            className={user.is_active ? "bg-google-green text-white" : ""}
                          >
                            {user.is_active ? "Active" : "Inactive"}
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
                              <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              {!user.is_staff && (
                                <DropdownMenuItem onClick={() => handlePromoteToAdmin(user.id)}>
                                  <Shield className="w-4 h-4 mr-2" />
                                  Promote to Admin
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => {
                                setEditingUser(user);
                                setIsDeleteDialogOpen(true);
                              }} className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add User Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account. All fields marked with * are required.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    placeholder="user@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleFormChange("full_name", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleFormChange("password", e.target.value)}
                    placeholder="Leave blank for auto-generate"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={formData.confirm_password}
                    onChange={(e) => handleFormChange("confirm_password", e.target.value)}
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleFormChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_active">Account Status</Label>
                    <p className="text-sm text-muted-foreground">Enable or disable user account</p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleFormChange("is_active", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_staff">Admin Privileges</Label>
                    <p className="text-sm text-muted-foreground">Grant admin access to the user</p>
                  </div>
                  <Switch
                    id="is_staff"
                    checked={formData.is_staff}
                    onCheckedChange={(checked) => handleFormChange("is_staff", checked)}
                  />
                </div>

                {formData.is_staff && (
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_superuser">Super Admin</Label>
                      <p className="text-sm text-muted-foreground">Grant full system access</p>
                    </div>
                    <Switch
                      id="is_superuser"
                      checked={formData.is_superuser}
                      onCheckedChange={(checked) => handleFormChange("is_superuser", checked)}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="send_welcome_email">Send Welcome Email</Label>
                    <p className="text-sm text-muted-foreground">Send welcome email with login instructions</p>
                  </div>
                  <Switch
                    id="send_welcome_email"
                    checked={formData.send_welcome_email}
                    onCheckedChange={(checked) => handleFormChange("send_welcome_email", checked)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser} disabled={!formData.email || !formData.full_name}>
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user account information.
              </DialogDescription>
            </DialogHeader>
            
            {editingUser && (
              <div className="py-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email Address *</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFormChange("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-full_name">Full Name *</Label>
                      <Input
                        id="edit-full_name"
                        value={formData.full_name}
                        onChange={(e) => handleFormChange("full_name", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-bio">Bio (Optional)</Label>
                    <Textarea
                      id="edit-bio"
                      value={formData.bio}
                      onChange={(e) => handleFormChange("bio", e.target.value)}
                      rows={2}
                    />
                  </div>

                  {/* In your Edit User Dialog */}
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="edit-password">
                              New Password 
                              <span className="text-xs text-muted-foreground ml-2">(leave blank to keep current)</span>
                          </Label>
                          <Input
                              id="edit-password"
                              type="password"
                              value={formData.password}
                              onChange={(e) => handleFormChange("password", e.target.value)}
                              placeholder="Enter new password or leave blank"
                          />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="edit-confirm_password">Confirm New Password</Label>
                          <Input
                              id="edit-confirm_password"
                              type="password"
                              value={formData.confirm_password}
                              onChange={(e) => handleFormChange("confirm_password", e.target.value)}
                              placeholder="Confirm new password"
                              disabled={!formData.password} // Disable if no password entered
                          />
                      </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="edit-is_active">Account Status</Label>
                        <p className="text-sm text-muted-foreground">Enable or disable user account</p>
                      </div>
                      <Switch
                        id="edit-is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => handleFormChange("is_active", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="edit-is_staff">Admin Privileges</Label>
                        <p className="text-sm text-muted-foreground">Grant admin access to the user</p>
                      </div>
                      <Switch
                        id="edit-is_staff"
                        checked={formData.is_staff}
                        onCheckedChange={(checked) => handleFormChange("is_staff", checked)}
                      />
                    </div>

                    {formData.is_staff && (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="edit-is_superuser">Super Admin</Label>
                          <p className="text-sm text-muted-foreground">Grant full system access</p>
                        </div>
                        <Switch
                          id="edit-is_superuser"
                          checked={formData.is_superuser}
                          onCheckedChange={(checked) => handleFormChange("is_superuser", checked)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateUser}>
                Update User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {editingUser && (
              <div className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-google-blue/20 text-google-blue">
                      {getInitials(editingUser.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{editingUser.full_name}</p>
                    <p className="text-sm text-muted-foreground">{editingUser.email}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p>Joined: {formatDate(editingUser.created_at)}</p>
                  <p>Last Login: {formatDate(editingUser.last_login)}</p>
                  <p>Courses Enrolled: {editingUser.courses_enrolled}</p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View User Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Complete information about this user.
              </DialogDescription>
            </DialogHeader>
            
            {viewingUser && (
              <div className="py-4">
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="w-16 h-16">
                    {viewingUser.avatar_url ? (
                      <AvatarImage src={viewingUser.avatar_url} alt={viewingUser.full_name} />
                    ) : null}
                    <AvatarFallback className="bg-google-blue/20 text-google-blue text-xl">
                      {getInitials(viewingUser.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{viewingUser.full_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{viewingUser.email}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Badge variant={
                        viewingUser.is_superuser ? "default" :
                        viewingUser.is_staff ? "secondary" : "outline"
                      } className={
                        viewingUser.is_superuser ? "bg-purple-100 text-purple-800" :
                        viewingUser.is_staff ? "bg-google-red/20 text-google-red" : ""
                      }>
                        {viewingUser.is_superuser ? "Super Admin" : viewingUser.is_staff ? "Admin" : "User"}
                      </Badge>
                      <Badge
                        variant={viewingUser.is_active ? "default" : "secondary"}
                        className={viewingUser.is_active ? "bg-google-green text-white" : ""}
                      >
                        {viewingUser.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {viewingUser.bio && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Bio</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      {viewingUser.bio}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Learning Stats</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Courses Enrolled:</span>
                        <span className="font-medium">{viewingUser.courses_enrolled}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Courses Completed:</span>
                        <span className="font-medium">{viewingUser.courses_completed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Learning Hours:</span>
                        <span className="font-medium">{formatLearningHours(viewingUser.total_learning_hours)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Certificates:</span>
                        <span className="font-medium">{viewingUser.certificates_earned}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Account Info</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Joined:</span>
                        <span>{formatDate(viewingUser.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span>{formatDate(viewingUser.updated_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Login:</span>
                        <span>{formatDate(viewingUser.last_login)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleEditUser(viewingUser);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit User
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      window.open(`/admin/users/${viewingUser.id}/activity`, '_blank');
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Activity
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default ManageUsers;