import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { signOut } from "@/lib/supabase";
import { LogOut, ClipboardList, Truck, Users, Package } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const loadProfile = async () => {
      // Check localStorage for simple auth
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        setAdminName(userEmail.split("@")[0]);
        return;
      }

      // Fallback to Supabase auth
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (profile?.full_name) {
          setAdminName(profile.full_name);
        }
      }
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    // Clear localStorage auth
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");

    // Also sign out from Supabase if logged in
    const { error } = await signOut();

    if (error && error.message !== "User not logged in") {
      toast.error("Failed to logout");
      return;
    }

    toast.success("Logged out successfully");
    navigate("/signin");
  };

  const navigationCards = [
    {
      title: "Submission Page",
      description: "View and manage ration order submissions",
      icon: ClipboardList,
      path: "/submissions",
      color: "from-primary to-primary/80",
    },
    {
      title: "Delivery Page",
      description: "Track and update delivery status",
      icon: Truck,
      path: "/delivery",
      color: "from-secondary to-secondary/80",
    },
    {
      title: "Meet Page",
      description: "Communication and support",
      icon: Users,
      path: "/meet",
      color: "from-accent to-accent/80",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome, {adminName}</h1>
              <p className="text-white/80">Ration Distribution Management System</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {navigationCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.path}
                className="cursor-pointer transition-all hover:scale-105 hover:shadow-2xl border-0"
                onClick={() => navigate(card.path)}
              >
                <CardHeader className={`bg-gradient-to-br ${card.color} text-white rounded-t-lg`}>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                  <CardDescription className="text-white/90">{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Button className="w-full bg-primary hover:bg-secondary">
                    Open {card.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
