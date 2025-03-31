
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";

const AuthLayout = () => {
  const { user, loading } = useAuth();

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

  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-verbo-50 to-blue-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-verbo-700 mb-2">
            Verbo<span className="text-verbo-500">AI</span>
          </h1>
          <p className="text-gray-600">Your AI-powered language learning companion</p>
        </div>
        
        <Card className="shadow-lg border-0">
          <CardContent className="pt-6">
            <Outlet />
          </CardContent>
        </Card>
        
        <p className="text-center mt-6 text-sm text-gray-600">
          Interactive language learning with AI assistance
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
