
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          // Not authenticated, redirect to login
          navigate("/login");
        } else {
          // User is authenticated
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Show nothing while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  // If we reach here, the user is authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
