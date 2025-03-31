
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  nativeLanguage: string;
  learningLanguage: string;
  proficiencyLevel: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("verboUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("verboUser");
      }
    }
    setLoading(false);
  }, []);

  // Mock Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a mock user
      const mockUser: User = {
        id: "user-123",
        email,
        name: email.split('@')[0],
        nativeLanguage: "English",
        learningLanguage: "Spanish",
        proficiencyLevel: "Beginner",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email
      };
      
      setUser(mockUser);
      localStorage.setItem("verboUser", JSON.stringify(mockUser));
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${mockUser.name}!`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock Register function
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a mock user
      const mockUser: User = {
        id: "user-" + Math.floor(Math.random() * 10000),
        email,
        name,
        nativeLanguage: "English",
        learningLanguage: "Spanish",
        proficiencyLevel: "Beginner",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email
      };
      
      setUser(mockUser);
      localStorage.setItem("verboUser", JSON.stringify(mockUser));
      toast({
        title: "Registration successful",
        description: `Welcome to VerboAI, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Could not create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("verboUser");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  // Update user data
  const updateUser = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, ...userData } as User;
      setUser(updatedUser);
      localStorage.setItem("verboUser", JSON.stringify(updatedUser));
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update profile",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
