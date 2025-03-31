
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/authService";
import { User } from "@/types/backend";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, nativeLanguage?: string, learningLanguage?: string, proficiencyLevel?: string) => Promise<void>;
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

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        
        if (session) {
          try {
            // Use setTimeout to prevent potential deadlocks
            setTimeout(async () => {
              const profile = await authService.getUserProfile();
              setUser(profile);
              setLoading(false);
            }, 0);
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setUser(null);
            setLoading(false);
          }
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Initial session check
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const profile = await authService.getUserProfile();
          setUser(profile);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${userData.name}!`,
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string,
    nativeLanguage: string = "English",
    learningLanguage: string = "Spanish",
    proficiencyLevel: string = "Beginner"
  ) => {
    setLoading(true);
    try {
      const userData = await authService.register(
        email, 
        password, 
        name, 
        nativeLanguage,
        learningLanguage,
        proficiencyLevel
      );
      setUser(userData);
      toast({
        title: "Registration successful",
        description: `Welcome to VerboAI, ${name}!`,
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "Could not log out",
        variant: "destructive",
      });
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateUser(userData);
      setUser(updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Could not update profile",
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
