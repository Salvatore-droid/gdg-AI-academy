import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, Search, Eye, Trash2, Flag, Calendar, 
  Users, TrendingUp, AlertCircle, MoreVertical,
  Filter, CheckCircle, XCircle, Edit, User
} from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface Discussion {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_id: string;
  course_title?: string;
  course_id?: string;
  replies_count: number;
  views_count: number;
  likes_count: number;
  status: 'active' | 'reported' | 'archived' | 'locked';
  is_flagged: boolean;
  flag_reason?: string;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  max_attendees: number;
  current_attendees: number;
  host_name: string;
  host_id: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  location: string;
  is_virtual: boolean;
  meeting_link?: string;
  created_at: string;
}

interface CommunityStats {
  total_discussions: number;
  active_discussions: number;
  reported_discussions: number;
  total_events: number;
  upcoming_events: number;
  active_users: number;
  popular_topics: Array<{
    topic: string;
    discussion_count: number;
  }>;
}

const ManageCommunity = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDiscussions, setSelectedDiscussions] = useState<string[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFlagDialogOpen, setIsFlagDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Discussion | CommunityEvent | null>(null);
  const [activeTab, setActiveTab] = useState("discussions");
  const { toast } = useToast();
  const { token } = useAdminAuth();

  // Form state for flagging
  const [flagData, setFlagData] = useState({
    reason: "",
    action: "warn" as "warn" | "lock" | "archive",
    message: "",
  });

  // Form state for events
  const [eventFormData, setEventFormData] = useState({
    title: "",
    description: "",
    event_type: "workshop",
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    max_attendees: 100,
    location: "",
    is_virtual: false,
    meeting_link: "",
  });

  // Fetch discussions
  const fetchDiscussions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/community/discussions/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDiscussions(data.discussions || []);
      } else {
        throw new Error('Failed to fetch discussions');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load discussions",
        variant: "destructive",
      });
    }
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/community/events/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      } else {
        throw new Error('Failed to fetch events');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    }
  };

  // Fetch community statistics
  const fetchCommunityStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/community/stats/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch community stats:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDiscussions(),
        fetchEvents(),
        fetchCommunityStats()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Filtered discussions
  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.author_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || discussion.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Filtered events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.host_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handle discussion selection
  const toggleDiscussionSelection = (discussionId: string) => {
    setSelectedDiscussions(prev =>
      prev.includes(discussionId)
        ? prev.filter(id => id !== discussionId)
        : [...prev, discussionId]
    );
  };

  const toggleEventSelection = (eventId: string) => {
    setSelectedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const selectAllDiscussions = () => {
    if (selectedDiscussions.length === filteredDiscussions.length) {
      setSelectedDiscussions([]);
    } else {
      setSelectedDiscussions(filteredDiscussions.map(discussion => discussion.id));
    }
  };

  const selectAllEvents = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map(event => event.id));
    }
  };

  // Handle flag discussion
  const handleFlagDiscussion = (discussion: Discussion) => {
    setCurrentItem(discussion);
    setIsFlagDialogOpen(true);
  };

  const handleSubmitFlag = async () => {
    if (!currentItem) return;

    try {
      const response = await fetch(`http://localhost:8000/api/admin/community/discussions/${currentItem.id}/flag/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flagData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Discussion flagged successfully",
        });
        setIsFlagDialogOpen(false);
        setFlagData({ reason: "", action: "warn", message: "" });
        await fetchDiscussions();
        await fetchCommunityStats();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to flag discussion');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle delete item
  const handleDeleteItem = async () => {
    if (!currentItem) return;

    try {
      const endpoint = activeTab === 'discussions' 
        ? `http://localhost:8000/api/admin/community/discussions/${currentItem.id}/`
        : `http://localhost:8000/api/admin/community/events/${currentItem.id}/`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${activeTab === 'discussions' ? 'Discussion' : 'Event'} deleted successfully`,
        });
        setIsDeleteDialogOpen(false);
        setCurrentItem(null);
        
        if (activeTab === 'discussions') {
          await fetchDiscussions();
        } else {
          await fetchEvents();
        }
        await fetchCommunityStats();
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  // Handle bulk actions
  const handleBulkDelete = async (itemIds: string[]) => {
    if (itemIds.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${itemIds.length} items?`)) {
      return;
    }

    try {
      const endpoint = activeTab === 'discussions'
        ? 'http://localhost:8000/api/admin/community/discussions/bulk_delete/'
        : 'http://localhost:8000/api/admin/community/events/bulk_delete/';

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: itemIds }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${itemIds.length} items deleted`,
        });
        
        if (activeTab === 'discussions') {
          setSelectedDiscussions([]);
          await fetchDiscussions();
        } else {
          setSelectedEvents([]);
          await fetchEvents();
        }
        await fetchCommunityStats();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete items",
        variant: "destructive",
      });
    }
  };

  const handleBulkApprove = async (itemIds: string[]) => {
    if (itemIds.length === 0) return;

    try {
      const response = await fetch('http://localhost:8000/api/admin/community/discussions/bulk_approve/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: itemIds }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${itemIds.length} discussions approved`,
        });
        setSelectedDiscussions([]);
        await fetchDiscussions();
        await fetchCommunityStats();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve discussions",
        variant: "destructive",
      });
    }
  };

  // Handle create event
  const handleCreateEvent = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/community/events/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventFormData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event created successfully",
        });
        setIsEventDialogOpen(false);
        setEventFormData({
          title: "",
          description: "",
          event_type: "workshop",
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          max_attendees: 100,
          location: "",
          is_virtual: false,
          meeting_link: "",
        });
        await fetchEvents();
        await fetchCommunityStats();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create event');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'upcoming':
        return "bg-google-green text-white";
      case 'reported':
      case 'locked':
        return "bg-google-yellow text-white";
      case 'archived':
      case 'completed':
        return "bg-gray-500 text-white";
      case 'cancelled':
        return "bg-google-red text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-google-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading community data...</p>
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
              <h1 className="text-4xl font-bold text-foreground mb-2">Manage Community</h1>
              <p className="text-muted-foreground">Moderate discussions and manage events</p>
            </div>
            <div className="flex gap-2">
              {activeTab === 'events' && (
                <Button 
                  className="bg-google-red hover:bg-google-red/90 text-white"
                  onClick={() => setIsEventDialogOpen(true)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Discussions</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{stats.total_discussions}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-google-blue" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Reported Issues</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{stats.reported_discussions}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-google-yellow" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Upcoming Events</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{stats.upcoming_events}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-google-red" />
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
                    <Users className="w-8 h-8 text-google-green" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  className="pl-10 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {activeTab === 'discussions' ? (
                    <>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="reported">Reported</SelectItem>
                      <SelectItem value="locked">Locked</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="discussions">
            {/* Bulk Actions */}
            {selectedDiscussions.length > 0 && (
              <Card className="bg-gradient-card border-border/50 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {selectedDiscussions.length} discussion{selectedDiscussions.length !== 1 ? 's' : ''} selected
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkApprove(selectedDiscussions)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkDelete(selectedDiscussions)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Discussions Table */}
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedDiscussions.length === filteredDiscussions.length && filteredDiscussions.length > 0}
                            onChange={selectAllDiscussions}
                            className="rounded border-gray-300"
                          />
                        </TableHead>
                        <TableHead>Discussion Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDiscussions.length > 0 ? (
                        filteredDiscussions.map((discussion, index) => (
                          <motion.tr
                            key={discussion.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="border-b border-border/50 hover:bg-muted/50"
                          >
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedDiscussions.includes(discussion.id)}
                                onChange={() => toggleDiscussionSelection(discussion.id)}
                                className="rounded border-gray-300"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {discussion.is_flagged && <Flag className="w-4 h-4 text-destructive" />}
                                <MessageSquare className="w-4 h-4 text-google-blue" />
                                <div>
                                  <div className="font-medium">{discussion.title}</div>
                                  <div className="text-xs text-muted-foreground truncate max-w-xs">
                                    {discussion.content.substring(0, 60)}...
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span>{discussion.author_name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {discussion.course_title || "General"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <MessageSquare className="w-3 h-3" />
                                  <span>{discussion.replies_count} replies</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Eye className="w-3 h-3" />
                                  <span>{discussion.views_count} views</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(discussion.status)}>
                                {discussion.status.charAt(0).toUpperCase() + discussion.status.slice(1)}
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
                                  <DropdownMenuItem onClick={() => window.open(`/community/discussions/${discussion.id}`, '_blank')}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Discussion
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    setCurrentItem(discussion);
                                    setIsFlagDialogOpen(true);
                                  }}>
                                    <Flag className="w-4 h-4 mr-2" />
                                    Flag/Moderate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    setCurrentItem(discussion);
                                    setIsDeleteDialogOpen(true);
                                  }} className="text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Discussion
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No discussions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            {/* Bulk Actions */}
            {selectedEvents.length > 0 && (
              <Card className="bg-gradient-card border-border/50 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''} selected
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkDelete(selectedEvents)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Events Table */}
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedEvents.length === filteredEvents.length && filteredEvents.length > 0}
                            onChange={selectAllEvents}
                            className="rounded border-gray-300"
                          />
                        </TableHead>
                        <TableHead>Event Title</TableHead>
                        <TableHead>Host</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Attendees</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvents.length > 0 ? (
                        filteredEvents.map((event, index) => (
                          <motion.tr
                            key={event.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="border-b border-border/50 hover:bg-muted/50"
                          >
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedEvents.includes(event.id)}
                                onChange={() => toggleEventSelection(event.id)}
                                className="rounded border-gray-300"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-google-red" />
                                <div>
                                  <div className="font-medium">{event.title}</div>
                                  <div className="text-xs text-muted-foreground truncate max-w-xs">
                                    {event.description.substring(0, 60)}...
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span>{event.host_name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm">{formatDate(event.start_date)}</div>
                                {event.end_date !== event.start_date && (
                                  <div className="text-xs text-muted-foreground">
                                    to {formatDate(event.end_date)}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm">
                                  {event.current_attendees} / {event.max_attendees}
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-google-green h-2 rounded-full" 
                                    style={{ width: `${(event.current_attendees / event.max_attendees) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {event.event_type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(event.status)}>
                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
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
                                  <DropdownMenuItem onClick={() => window.open(`/community/events/${event.id}`, '_blank')}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Event
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    setCurrentItem(event);
                                    setIsDeleteDialogOpen(true);
                                  }} className="text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Event
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No events found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Flag/Moderate Dialog */}
      <Dialog open={isFlagDialogOpen} onOpenChange={setIsFlagDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Moderate Discussion</DialogTitle>
            <DialogDescription>
              Flag or moderate this discussion for inappropriate content.
            </DialogDescription>
          </DialogHeader>
          
          {currentItem && 'title' in currentItem && (
            <div className="py-4">
              <div className="font-medium mb-2">Discussion: {currentItem.title}</div>
              <div className="text-sm text-muted-foreground">
                Author: {currentItem.author_name}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Flagging</Label>
              <Select
                value={flagData.reason}
                onValueChange={(value) => setFlagData(prev => ({ ...prev, reason: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inappropriate_content">Inappropriate Content</SelectItem>
                  <SelectItem value="harassment">Harassment</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="off_topic">Off-topic</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="action">Action to Take</Label>
              <Select
                value={flagData.action}
                onValueChange={(value: "warn" | "lock" | "archive") => 
                  setFlagData(prev => ({ ...prev, action: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warn">Send Warning</SelectItem>
                  <SelectItem value="lock">Lock Discussion</SelectItem>
                  <SelectItem value="archive">Archive Discussion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message to User (optional)</Label>
              <Textarea
                id="message"
                value={flagData.message}
                onChange={(e) => setFlagData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Explain why this content was flagged..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFlagDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitFlag} className="bg-google-yellow hover:bg-google-yellow/90">
              Submit Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete {activeTab === 'discussions' ? 'Discussion' : 'Event'}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {activeTab === 'discussions' ? 'discussion' : 'event'}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentItem && (
            <div className="py-4">
              <p className="font-medium">{
                'title' in currentItem ? currentItem.title : 'Unknown Item'
              }</p>
              <p className="text-sm text-muted-foreground mt-1">
                {activeTab === 'discussions' 
                  ? `Author: ${'author_name' in currentItem ? currentItem.author_name : 'Unknown'}`
                  : `Host: ${'host_name' in currentItem ? currentItem.host_name : 'Unknown'}`
                }
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Community Event</DialogTitle>
            <DialogDescription>
              Schedule a new event for the community.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title *</Label>
              <Input
                id="event-title"
                value={eventFormData.title}
                onChange={(e) => setEventFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="AI Workshop: Advanced Techniques"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-description">Description *</Label>
              <Textarea
                id="event-description"
                value={eventFormData.description}
                onChange={(e) => setEventFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Event description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Select
                  value={eventFormData.event_type}
                  onValueChange={(value) => setEventFormData(prev => ({ ...prev, event_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="meetup">Meetup</SelectItem>
                    <SelectItem value="study_group">Study Group</SelectItem>
                    <SelectItem value="guest_speaker">Guest Speaker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-attendees">Max Attendees</Label>
                <Input
                  id="max-attendees"
                  type="number"
                  min="1"
                  value={eventFormData.max_attendees}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, max_attendees: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date *</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={eventFormData.start_date}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date *</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={eventFormData.end_date}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={eventFormData.location}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Online or physical address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-link">Meeting Link (if virtual)</Label>
                <Input
                  id="meeting-link"
                  value={eventFormData.meeting_link}
                  onChange={(e) => setEventFormData(prev => ({ ...prev, meeting_link: e.target.value }))}
                  placeholder="https://meet.google.com/..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is-virtual"
                checked={eventFormData.is_virtual}
                onChange={(e) => setEventFormData(prev => ({ ...prev, is_virtual: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="is-virtual">Virtual Event</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEvent} disabled={!eventFormData.title || !eventFormData.description}>
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageCommunity;