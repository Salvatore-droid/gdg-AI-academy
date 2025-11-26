import { LayoutDashboard, BookOpen, Users, Layers, MessageSquare, Settings, LogOut } from "lucide-react";
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
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/admin") return currentPath === "/admin";
    return currentPath.startsWith(path);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <Sidebar className={`border-r border-sidebar-border ${isCollapsed ? "w-16" : "w-64"} transition-all duration-300 bg-gradient-to-b from-google-red/10 to-google-yellow/10`}>
      <SidebarContent className="bg-transparent">
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

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>Management</SidebarGroupLabel>
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
                            ? "bg-google-red/20 text-google-red font-medium" 
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }
                          ${isCollapsed ? "justify-center" : ""}
                        `}
                      >
                        <item.icon 
                          className={`w-5 h-5 transition-all duration-200 ${
                            active ? "text-google-red" : "group-hover:scale-110"
                          }`} 
                        />
                        {!isCollapsed && <span className="text-sm">{item.title}</span>}
                        {active && !isCollapsed && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-google-red" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className={`w-full ${isCollapsed ? "px-2" : ""}`}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Exit Admin</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
