import { Users, MessageCircle, Video, Calendar, Star, TrendingUp, BookOpen, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Mentor {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  avatar: string;
  rating: number;
  sessions_completed: number;
  bio: string;
  is_available: boolean;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  replies_count: number;
  likes_count: number;
  tags: string[];
  created_at: string;
  views_count: number;
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  duration_minutes: number;
  host: {
    id: string;
    name: string;
    avatar: string;
  };
  attendees_count: number;
  max_attendees: number;
  event_type: string;
  is_registered: boolean;
}

interface CommunityStats {
  total_members: number;
  total_discussions: number;
  total_workshops: number;
  upcoming_events: number;
  active_mentors: number;
}

export default function Community() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/auth';
          return;
        }

        // Fetch community stats
        const statsResponse = await fetch('http://localhost:8000/api/community/stats/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Fetch mentors
        const mentorsResponse = await fetch('http://localhost:8000/api/community/mentors/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Fetch discussions
        const discussionsResponse = await fetch('http://localhost:8000/api/community/discussions/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Fetch events
        const eventsResponse = await fetch('http://localhost:8000/api/community/events/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (statsResponse.ok && mentorsResponse.ok && discussionsResponse.ok && eventsResponse.ok) {
          const statsData = await statsResponse.json();
          const mentorsData = await mentorsResponse.json();
          const discussionsData = await discussionsResponse.json();
          const eventsData = await eventsResponse.json();
          
          setStats(statsData);
          setMentors(mentorsData);
          setDiscussions(discussionsData);
          setEvents(eventsData);
        } else {
          throw new Error('Failed to fetch community data');
        }
      } catch (error) {
        console.error('Failed to fetch community data:', error);
        toast({
          title: "Error",
          description: "Failed to load community data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [toast]);

  const handleBookSession = async (mentorId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/community/mentors/${mentorId}/book-session/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Session Booked!",
          description: `You've booked a session with ${data.mentor.name}`,
        });
      } else {
        throw new Error('Failed to book session');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book session",
        variant: "destructive",
      });
    }
  };

  const handleRegisterEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/community/events/${eventId}/register/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Registered!",
          description: `You've registered for "${data.event.title}"`,
        });
        
        // Refresh events to update registration status
        const eventsResponse = await fetch('http://localhost:8000/api/community/events/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData);
        }
      } else {
        throw new Error('Failed to register for event');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for event",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatEventDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading community...</p>
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
              <Users className="w-6 h-6 text-google-red" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Community Hub</h1>
          </div>
          <p className="text-lg text-muted-foreground ml-[60px]">
            Connect with mentors and fellow AI learners
          </p>
        </motion.div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 rounded-2xl">
              <Users className="w-8 h-8 text-google-blue mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.total_members.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Active Members</p>
            </Card>
            <Card className="p-6 rounded-2xl">
              <MessageCircle className="w-8 h-8 text-google-green mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.total_discussions.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Discussions</p>
            </Card>
            <Card className="p-6 rounded-2xl">
              <Video className="w-8 h-8 text-google-red mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.total_workshops}</p>
              <p className="text-sm text-muted-foreground">Workshops</p>
            </Card>
            <Card className="p-6 rounded-2xl">
              <Calendar className="w-8 h-8 text-google-yellow mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.upcoming_events}</p>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
            </Card>
          </div>
        )}

        {/* Mentors Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Expert Mentors</h2>
            <Badge variant="secondary" className="rounded-xl">
              <Users className="w-3 h-3 mr-1" />
              {stats?.active_mentors || 0} Available
            </Badge>
          </div>
          {mentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mentors.map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="p-6 rounded-2xl hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={mentor.avatar} alt={mentor.name} />
                        <AvatarFallback>
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-foreground">{mentor.name}</h3>
                            <p className="text-sm text-muted-foreground">{mentor.role}</p>
                          </div>
                          {mentor.is_available && (
                            <Badge className="rounded-xl bg-green-100 text-green-800 border-green-200 text-xs">
                              Available
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-google-yellow fill-google-yellow" />
                          <span className="text-sm font-medium">{mentor.rating}</span>
                          <span className="text-xs text-muted-foreground">
                            ({mentor.sessions_completed} sessions)
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {mentor.bio}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.expertise.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="rounded-xl text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {mentor.expertise.length > 3 && (
                        <Badge variant="outline" className="rounded-xl text-xs">
                          +{mentor.expertise.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <Button 
                      className="w-full rounded-xl" 
                      variant="outline"
                      disabled={!mentor.is_available}
                      onClick={() => handleBookSession(mentor.id)}
                    >
                      {mentor.is_available ? 'Book Session' : 'Not Available'}
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No mentors available</h3>
              <p className="text-muted-foreground">
                Check back later for available mentorship sessions.
              </p>
            </div>
          )}
        </div>

        {/* Recent Discussions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Recent Discussions</h2>
            <Button variant="outline" className="rounded-xl">
              View All
            </Button>
          </div>
          {discussions.length > 0 ? (
            <div className="space-y-3">
              {discussions.map((discussion, index) => (
                <motion.div
                  key={discussion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="p-6 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{discussion.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {discussion.content}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                              <AvatarFallback className="text-xs">
                                {discussion.author.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>by {discussion.author.name}</span>
                          </div>
                          <span>•</span>
                          <span>{formatTimeAgo(discussion.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {discussion.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="rounded-xl">
                              {tag}
                            </Badge>
                          ))}
                          {discussion.tags.length > 3 && (
                            <Badge variant="outline" className="rounded-xl">
                              +{discussion.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {discussion.replies_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {discussion.likes_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {discussion.views_count}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No discussions yet</h3>
              <p className="text-muted-foreground">
                Be the first to start a discussion in the community!
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${
                        event.event_type === 'workshop' 
                          ? 'bg-gradient-to-br from-google-blue/20 to-google-blue/10' 
                          : 'bg-gradient-to-br from-google-green/20 to-google-green/10'
                      } flex items-center justify-center flex-shrink-0`}>
                        {event.event_type === 'workshop' ? (
                          <BookOpen className="w-6 h-6 text-google-blue" />
                        ) : (
                          <Video className="w-6 h-6 text-google-green" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-bold text-foreground">{event.title}</h3>
                          <Badge variant="secondary" className="rounded-xl capitalize">
                            {event.event_type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {formatEventDate(event.event_date)} • {event.event_time}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={event.host.avatar} alt={event.host.name} />
                              <AvatarFallback className="text-xs">
                                {event.host.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>by {event.host.name}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(event.duration_minutes)}
                            </div>
                            <Badge variant="secondary" className="rounded-xl">
                              <Users className="w-3 h-3 mr-1" />
                              {event.attendees_count}/{event.max_attendees}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full rounded-xl mt-4"
                      variant={event.is_registered ? "outline" : "default"}
                      disabled={event.attendees_count >= event.max_attendees && !event.is_registered}
                      onClick={() => handleRegisterEvent(event.id)}
                    >
                      {event.is_registered 
                        ? 'Registered' 
                        : event.attendees_count >= event.max_attendees 
                          ? 'Full' 
                          : 'Register'
                      }
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No upcoming events</h3>
              <p className="text-muted-foreground">
                Check back later for upcoming workshops and events.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}