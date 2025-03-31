
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "./SidebarProvider";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  Theater,
  Mic,
  BarChart3,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Lessons",
      href: "/lessons",
      icon: BookOpen,
    },
    {
      name: "Conversations",
      href: "/conversations",
      icon: MessageCircle,
    },
    {
      name: "Role Play",
      href: "/roleplay",
      icon: Theater,
    },
    {
      name: "Pronunciation",
      href: "/pronunciation",
      icon: Mic,
    },
    {
      name: "Performance",
      href: "/performance",
      icon: BarChart3,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
        {
          "translate-x-0": isOpen,
          "-translate-x-full": !isOpen,
        }
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <Link to="/" className="flex items-center">
          <div className="text-verbo-700 font-bold text-2xl mr-2">Verbo<span className="text-verbo-500">AI</span></div>
        </Link>
        <button
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none md:hidden"
          onClick={toggleSidebar}
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-4 py-5">
        <div className="flex items-center mb-6">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatarUrl} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500">
              {user?.learningLanguage || "Spanish"} - {user?.proficiencyLevel || "Beginner"}
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors",
                location.pathname === item.href
                  ? "bg-verbo-50 text-verbo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  location.pathname === item.href
                    ? "text-verbo-500"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
