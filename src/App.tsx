import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { TopBar } from "@/components/TopBar";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Modules from "./pages/Modules";
import AILabs from "./pages/AILabs";
import Progress from "./pages/Progress";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageModules from "./pages/admin/ManageModules";
import ManageCommunity from "./pages/admin/ManageCommunity";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLogin from "./pages/admin/AdminLogin"; // Add this
import { AdminAuthProvider } from "@/contexts/AdminAuthContext"; // Add this
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute"; // Add this

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          {/* Public Auth Routes - MUST come first */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin/*" element={
              <SidebarProvider defaultOpen>
                <div className="min-h-screen flex w-full bg-gray-900">
                  <AdminSidebar />
                  <div className="flex-1 flex flex-col">
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="courses" element={<ManageCourses />} />
                      <Route path="users" element={<ManageUsers />} />
                      <Route path="modules" element={<ManageModules />} />
                      <Route path="community" element={<ManageCommunity />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </div>
              </SidebarProvider>
            } />
          </Route>

          {/* Main App Routes - This should come LAST */}
          <Route path="/*" element={
            <SidebarProvider defaultOpen>
              <div className="min-h-screen flex w-full bg-background">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="courses" element={<Courses />} />
                    <Route path="courses/:id" element={<CourseDetail />} />
                    <Route path="modules" element={<Modules />} />
                    <Route path="ai-labs" element={<AILabs />} />
                    <Route path="progress" element={<Progress />} />
                    <Route path="community" element={<Community />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </SidebarProvider>
          } />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;