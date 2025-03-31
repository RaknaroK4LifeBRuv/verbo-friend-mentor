
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  
  // Show a notice to users if Supabase credentials are not configured
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      toast({
        title: "Setup Required",
        description: "Please connect your Supabase project in the project settings.",
        variant: "destructive",
        duration: 6000,
      });
    }
  }, [toast]);

  // Redirect to the dashboard page
  return <Navigate to="/dashboard" replace />;
};

export default Index;
