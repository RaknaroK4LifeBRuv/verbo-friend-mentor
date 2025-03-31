
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useSidebar } from "./SidebarProvider";
import { cn } from "@/lib/utils";

const Layout = () => {
  const { user, loading } = useAuth();
  const { isOpen } = useSidebar();

  // If still loading, show a loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse-light text-center">
          <div className="h-12 w-12 border-4 border-t-verbo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-verbo-700">Loading VerboAI...</p>
        </div>
      </div>
    );
  }

  // If no user is authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div 
        className={cn(
          "flex flex-col flex-1 w-0 overflow-hidden transition-all duration-300",
          isOpen ? "md:ml-64" : "ml-0"
        )}
      >
        <Navbar />
        <main className="relative flex-1 overflow-y-auto focus:outline-none p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
