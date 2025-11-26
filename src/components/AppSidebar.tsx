import { Home, BookOpen, Layers, Sparkles, Trophy, Users, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
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

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Courses", url: "/courses", icon: BookOpen },
  { title: "Modules", url: "/modules", icon: Layers },
  { title: "AI Labs", url: "/ai-labs", icon: Sparkles },
  { title: "Progress", url: "/progress", icon: Trophy },
  { title: "Community", url: "/community", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className={`border-r border-sidebar-border ${isCollapsed ? "w-16" : "w-64"} transition-all duration-300 bg-gradient-sidebar`}>
      <SidebarContent className="bg-transparent">
        <div className="px-6 py-6">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Logo className="w-10 h-10" />
              <div>
                <h2 className="font-bold text-lg text-foreground">Google AI</h2>
                <p className="text-xs text-muted-foreground">Learning Platform</p>
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
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item, idx) => {
                const active = isActive(item.url);
                const colors = ["google-blue", "google-red", "google-yellow", "google-green"];
                const iconColor = colors[idx % colors.length];
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className={`
                          group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                          ${active 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }
                          ${isCollapsed ? "justify-center" : ""}
                        `}
                      >
                        <item.icon 
                          className={`w-5 h-5 transition-all duration-200 ${
                            active ? "text-primary" : "group-hover:scale-110"
                          }`} 
                        />
                        {!isCollapsed && <span className="text-sm">{item.title}</span>}
                        {active && !isCollapsed && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
