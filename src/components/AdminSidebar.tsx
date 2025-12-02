import { LayoutDashboard, BookOpen, Users, Layers, MessageSquare, Settings, LogOut, Shield } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const adminNavItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Manage Courses", url: "/admin/courses", icon: BookOpen },
  { title: "Manage Users", url: "/admin/users", icon: Users },
  { title: "Manage Modules", url: "/admin/modules", icon: Layers },
  { title: "Manage Community", url: "/admin/community", icon: MessageSquare },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { adminUser, logout } = useAdminAuth();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/admin") return currentPath === "/admin" || currentPath === "/admin/dashboard";
    return currentPath.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been logged out from admin panel",
      });
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExitAdmin = () => {
    navigate("/");
  };

  return (
    <Sidebar className={`border-r border-sidebar-border ${isCollapsed ? "w-16" : "w-64"} transition-all duration-300 bg-gradient-to-b from-google-red/10 to-google-yellow/10`}>
      <SidebarContent className="bg-transparent">
        {/* Logo Section - Matches your original */}
        <div className="px-6 py-6">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Logo className="w-10 h-10" />
              <div>
                <h2 className="font-bold text-lg text-foreground">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">Management Console</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <Logo className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* User Info (only shown when expanded) - Light theme */}
        {!isCollapsed && adminUser && (
          <div className="px-4 mb-4">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-google-blue to-google-green rounded-full flex items-center justify-center">
                  <span className="font-semibold text-white">
                    {adminUser.full_name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {adminUser.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {adminUser.email}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex justify-center">
                <Badge variant="secondary" className="bg-google-red/20 text-google-red text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu - Original styling */}
        <SidebarGroup className="px-3">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs uppercase text-muted-foreground tracking-wider">
              Management
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => {
                const active = isActive(item.url);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/admin"}
                        className={`
                          group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                          ${active 
                            ? "bg-google-red/20 text-google-red font-medium shadow-sm" 
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }
                          ${isCollapsed ? "justify-center" : ""}
                        `}
                      >
                        <item.icon 
                          className={`w-5 h-5 transition-all duration-200 ${
                            active ? "text-google-red scale-110" : "group-hover:scale-110"
                          }`} 
                        />
                        {!isCollapsed && (
                          <span className="text-sm font-medium">{item.title}</span>
                        )}
                        {active && !isCollapsed && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-google-red animate-pulse" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Actions - Original styling */}
        <div className="mt-auto p-4 space-y-2">
          {!isCollapsed && (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-gray-300 dark:border-gray-700 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          )}
          
          {isCollapsed && (
            <>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="icon"
                className="w-full text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={handleExitAdmin}
                variant="ghost"
                size="icon"
                className="w-full text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Exit Admin"
              >
                <Shield className="w-5 h-5" />
              </Button>
            </>
          )}
          
          {!isCollapsed && (
            <Button
              onClick={handleExitAdmin}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Shield className="w-4 h-4 mr-2" />
              Exit Admin Panel
            </Button>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}