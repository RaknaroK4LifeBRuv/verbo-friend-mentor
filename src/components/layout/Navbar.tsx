
import { useSidebar } from "./SidebarProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
      <div className="flex flex-1 justify-between px-4 md:px-6">
        <div className="flex flex-1">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none md:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
          <div className="flex w-full items-center md:ml-0">
            <h1 className="text-2xl font-semibold text-gray-900">
              VerboAI
            </h1>
          </div>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6 space-x-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-verbo-500">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Streak Reminder</span>
                  <span className="text-xs text-gray-500">Practice today to keep your streak!</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">New Achievement</span>
                  <span className="text-xs text-gray-500">You earned the "Conversation Master" badge!</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Pronunciation Improved</span>
                  <span className="text-xs text-gray-500">Your Spanish pronunciation score increased by 12%!</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarImage src={user?.avatarUrl} alt={user?.name || ""} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" asChild>
                <a href="/profile">Profile</a>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <a href="/settings">Settings</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
