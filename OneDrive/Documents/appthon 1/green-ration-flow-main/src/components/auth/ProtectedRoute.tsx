import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { checkUserRole } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Check localStorage authentication first (from SignIn page)
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

      if (isAuthenticated) {
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // Fallback to Supabase authentication (from Auth page)
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const role = await checkUserRole(session.user.id);
        setIsAdmin(role === "admin");
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
