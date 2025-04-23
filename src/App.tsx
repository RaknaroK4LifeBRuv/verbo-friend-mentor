
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./components/layout/SidebarProvider";
import Dashboard from "./pages/Dashboard";
import Lessons from "./pages/Lessons";
import LessonContent from "./pages/LessonContent";
import Conversations from "./pages/Conversations";
import RolePlay from "./pages/RolePlay";
import Pronunciation from "./pages/Pronunciation";
import Performance from "./pages/Performance";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import AuthLayout from "./components/layout/AuthLayout";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <Routes>
              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              
              {/* Main app routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/lesson/:lessonId" element={<LessonContent />} />
                <Route path="/conversations" element={<Conversations />} />
                <Route path="/roleplay" element={<RolePlay />} />
                <Route path="/pronunciation" element={<Pronunciation />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
