import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Phone, Mail } from "lucide-react";

const Meet = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">Communication & Support</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-br from-primary to-primary/80 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <CardTitle>Live Chat</CardTitle>
              <CardDescription className="text-white/90">
                Connect with support team instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button className="w-full bg-primary hover:bg-secondary">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-br from-secondary to-secondary/80 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Phone className="w-6 h-6" />
              </div>
              <CardTitle>Phone Support</CardTitle>
              <CardDescription className="text-white/90">
                Call us for urgent assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button className="w-full bg-secondary hover:bg-primary">
                Call Now
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-br from-accent to-accent/80 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <CardTitle>Email Support</CardTitle>
              <CardDescription className="text-white/90">
                Send us your queries via email
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button className="w-full bg-accent hover:bg-accent/80">
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 shadow-xl">
          <CardHeader>
            <CardTitle>Quick Help</CardTitle>
            <CardDescription>Frequently asked questions and resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">How to accept orders?</h3>
                <p className="text-sm text-muted-foreground">
                  Navigate to the Submission Page, review order details, and click the "Accept" button to approve orders.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">How to update delivery status?</h3>
                <p className="text-sm text-muted-foreground">
                  Go to the Delivery Page and use the dropdown menu to update the status between "Pending" and "Delivered".
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Where can I view payment history?</h3>
                <p className="text-sm text-muted-foreground">
                  Payment status is displayed in both Submission and Delivery pages with ✅ for paid and ❌ for unpaid orders.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Meet;
