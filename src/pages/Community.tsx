import { Users, MessageCircle, Video, Calendar, Star, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const mentors = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    role: "ML Research Lead",
    expertise: ["Machine Learning", "Deep Learning", "Computer Vision"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    rating: 4.9,
    sessions: 156
  },
  {
    id: "2",
    name: "Prof. Michael Rodriguez",
    role: "NLP Specialist",
    expertise: ["NLP", "Transformers", "LLMs"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    rating: 4.8,
    sessions: 142
  },
  {
    id: "3",
    name: "Dr. Emily Zhang",
    role: "AI Ethics Expert",
    expertise: ["AI Ethics", "Responsible AI", "Fairness"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    rating: 5.0,
    sessions: 98
  },
];

const discussions = [
  {
    id: "1",
    title: "Best practices for training large language models?",
    author: "Alex Kumar",
    replies: 24,
    likes: 56,
    tags: ["NLP", "Training"],
    time: "2 hours ago"
  },
  {
    id: "2",
    title: "How to handle overfitting in small datasets?",
    author: "Maria Santos",
    replies: 18,
    likes: 42,
    tags: ["ML", "Best Practices"],
    time: "5 hours ago"
  },
  {
    id: "3",
    title: "Career advice: Transitioning from SWE to ML Engineer",
    author: "David Park",
    replies: 31,
    likes: 89,
    tags: ["Career", "Discussion"],
    time: "1 day ago"
  },
];

const upcomingEvents = [
  {
    id: "1",
    title: "Introduction to Transformers Workshop",
    date: "Nov 28, 2025",
    time: "2:00 PM - 4:00 PM",
    host: "Dr. Sarah Chen",
    attendees: 45
  },
  {
    id: "2",
    title: "AI Ethics Panel Discussion",
    date: "Nov 30, 2025",
    time: "6:00 PM - 7:30 PM",
    host: "Dr. Emily Zhang",
    attendees: 78
  },
];

export default function Community() {
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 rounded-2xl">
            <Users className="w-8 h-8 text-google-blue mb-2" />
            <p className="text-2xl font-bold text-foreground">2,847</p>
            <p className="text-sm text-muted-foreground">Active Members</p>
          </Card>
          <Card className="p-6 rounded-2xl">
            <MessageCircle className="w-8 h-8 text-google-green mb-2" />
            <p className="text-2xl font-bold text-foreground">1,234</p>
            <p className="text-sm text-muted-foreground">Discussions</p>
          </Card>
          <Card className="p-6 rounded-2xl">
            <Video className="w-8 h-8 text-google-red mb-2" />
            <p className="text-2xl font-bold text-foreground">48</p>
            <p className="text-sm text-muted-foreground">Workshops</p>
          </Card>
          <Card className="p-6 rounded-2xl">
            <Calendar className="w-8 h-8 text-google-yellow mb-2" />
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-sm text-muted-foreground">Upcoming Events</p>
          </Card>
        </div>

        {/* Mentors Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Expert Mentors</h2>
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
                      <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{mentor.name}</h3>
                      <p className="text-sm text-muted-foreground">{mentor.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-google-yellow fill-google-yellow" />
                        <span className="text-sm font-medium">{mentor.rating}</span>
                        <span className="text-xs text-muted-foreground">({mentor.sessions} sessions)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="rounded-xl text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full rounded-xl" variant="outline">
                    Book Session
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Discussions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Recent Discussions</h2>
            <Button variant="outline" className="rounded-xl">
              View All
            </Button>
          </div>
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
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>by {discussion.author}</span>
                        <span>•</span>
                        <span>{discussion.time}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {discussion.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="rounded-xl">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {discussion.replies}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {discussion.likes}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-google flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{event.date} • {event.time}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Hosted by {event.host}</p>
                        <Badge variant="secondary" className="rounded-xl">
                          <Users className="w-3 h-3 mr-1" />
                          {event.attendees}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full rounded-xl mt-4">
                    Register
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
