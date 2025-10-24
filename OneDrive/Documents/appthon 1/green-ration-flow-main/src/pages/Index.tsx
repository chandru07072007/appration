import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ClipboardList, Truck, Shield } from "lucide-react";
import { getSession, checkUserRole } from "@/lib/supabase";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { session } = await getSession();
      if (session?.user) {
        const role = await checkUserRole(session.user.id);
        if (role === "admin") {
          navigate("/dashboard");
        }
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-secondary">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
            <Package className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Ration Distribution Management
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Streamline your ration distribution workflow with our comprehensive admin dashboard
          </p>
          <Button
            onClick={() => navigate("/signin")}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
          >
            <Shield className="mr-2 h-5 w-5" />
            Sign In
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-br from-primary to-primary/80 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <ClipboardList className="w-6 h-6" />
              </div>
              <CardTitle>Order Management</CardTitle>
              <CardDescription className="text-white/90">
                Review and process ration order submissions efficiently
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• View all pending submissions</li>
                <li>• Check payment status</li>
                <li>• Accept or reject orders</li>
                <li>• Track visit times</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-br from-secondary to-secondary/80 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Truck className="w-6 h-6" />
              </div>
              <CardTitle>Delivery Tracking</CardTitle>
              <CardDescription className="text-white/90">
                Monitor and update delivery status in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Color-coded status indicators</li>
                <li>• Update delivery progress</li>
                <li>• View complete order details</li>
                <li>• Automated notifications</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-br from-accent to-accent/80 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-6 h-6" />
              </div>
              <CardTitle>Secure Access</CardTitle>
              <CardDescription className="text-white/90">
                Protected admin-only access with authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Role-based access control</li>
                <li>• Secure login system</li>
                <li>• Audit trail logging</li>
                <li>• Data encryption</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="shadow-2xl border-0 bg-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Ready to streamline your ration distribution?
            </h2>
            <p className="text-muted-foreground mb-6">
              Login to access the admin dashboard and manage orders efficiently
            </p>
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="bg-primary hover:bg-secondary"
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
