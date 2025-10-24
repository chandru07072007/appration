import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Check, X } from "lucide-react";
import { format } from "date-fns";

interface RationOrder {
  id: string;
  user_id: string;
  phone_no: string;
  items: any;
  cost: number;
  pay_history: boolean;
  visit_time: string;
  order_status: string;
}

// Sample submission data
const sampleOrders: RationOrder[] = [
  {
    id: "1",
    user_id: "USR001",
    phone_no: "9876543210",
    items: [
      { name: "Rice", quantity: "5 kg" },
      { name: "Wheat", quantity: "3 kg" },
      { name: "Sugar", quantity: "2 kg" }
    ],
    cost: 450,
    pay_history: true,
    visit_time: new Date().toISOString(),
    order_status: "pending"
  },
  {
    id: "2",
    user_id: "USR002",
    phone_no: "9123456789",
    items: [
      { name: "Rice", quantity: "10 kg" },
      { name: "Dal", quantity: "2 kg" },
      { name: "Oil", quantity: "1 L" }
    ],
    cost: 650,
    pay_history: false,
    visit_time: new Date(Date.now() - 3600000).toISOString(),
    order_status: "pending"
  },
  {
    id: "3",
    user_id: "USR003",
    phone_no: "9988776655",
    items: [
      { name: "Wheat", quantity: "8 kg" },
      { name: "Sugar", quantity: "3 kg" },
      { name: "Salt", quantity: "1 kg" }
    ],
    cost: 380,
    pay_history: true,
    visit_time: new Date(Date.now() - 7200000).toISOString(),
    order_status: "pending"
  },
  {
    id: "4",
    user_id: "USR004",
    phone_no: "9445566778",
    items: [
      { name: "Rice", quantity: "7 kg" },
      { name: "Dal", quantity: "3 kg" },
      { name: "Tea", quantity: "500 g" }
    ],
    cost: 520,
    pay_history: true,
    visit_time: new Date(Date.now() - 10800000).toISOString(),
    order_status: "pending"
  },
  {
    id: "5",
    user_id: "USR005",
    phone_no: "9334455667",
    items: [
      { name: "Wheat", quantity: "6 kg" },
      { name: "Sugar", quantity: "4 kg" },
      { name: "Oil", quantity: "2 L" }
    ],
    cost: 720,
    pay_history: false,
    visit_time: new Date(Date.now() - 14400000).toISOString(),
    order_status: "pending"
  }
];

const Submissions = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<RationOrder[]>(sampleOrders);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from("ration_orders")
      .select("*")
      .eq("order_status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      // If error, use sample data
      setOrders(sampleOrders);
      setLoading(false);
      return;
    }

    // If database returns data, use it; otherwise use sample data
    setOrders(data && data.length > 0 ? data : sampleOrders);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleAccept = async (orderId: string) => {
    // Find the order to accept
    const orderToAccept = orders.find(order => order.id === orderId);

    if (orderToAccept) {
      // Update order status
      const acceptedOrder = {
        ...orderToAccept,
        order_status: "accepted",
        delivery_status: "pending"
      };

      // Save to localStorage for delivery page
      const acceptedOrdersJSON = localStorage.getItem("acceptedOrders");
      const existingAcceptedOrders = acceptedOrdersJSON ? JSON.parse(acceptedOrdersJSON) : [];
      existingAcceptedOrders.push(acceptedOrder);
      localStorage.setItem("acceptedOrders", JSON.stringify(existingAcceptedOrders));

      // Remove from current orders list
      setOrders(orders.filter(order => order.id !== orderId));

      toast.success("Order accepted successfully - Available in Delivery page");
    }

    // Also try to update in Supabase
    const { error } = await supabase
      .from("ration_orders")
      .update({
        order_status: "accepted",
        delivery_status: "pending"
      })
      .eq("id", orderId);

    if (error && error.message !== "No rows found") {
      console.error("Supabase update error:", error);
    }
  };

  const handleReject = async (orderId: string) => {
    // Remove from current orders list
    setOrders(orders.filter(order => order.id !== orderId));

    toast.success("Order rejected");

    // Also try to update in Supabase
    const { error } = await supabase
      .from("ration_orders")
      .update({ order_status: "rejected" })
      .eq("id", orderId);

    if (error && error.message !== "No rows found") {
      console.error("Supabase update error:", error);
    }
  };

  const formatItems = (items: any) => {
    if (typeof items === "string") {
      return items;
    }
    if (Array.isArray(items)) {
      return items.map((item: any) => `${item.name} (${item.quantity})`).join(", ");
    }
    return JSON.stringify(items);
  };

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
          <h1 className="text-3xl font-bold text-white">Order Submissions</h1>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white">
            <CardTitle>Pending Ration Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">S.No</TableHead>
                    <TableHead className="font-bold">ID</TableHead>
                    <TableHead className="font-bold">Phone No</TableHead>
                    <TableHead className="font-bold">Items</TableHead>
                    <TableHead className="font-bold">Cost</TableHead>
                    <TableHead className="font-bold">Pay History</TableHead>
                    <TableHead className="font-bold">Visit Time</TableHead>
                    <TableHead className="font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Loading submissions...
                      </TableCell>
                    </TableRow>
                  ) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No pending submissions
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order, index) => (
                      <TableRow key={order.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">{order.user_id}</TableCell>
                        <TableCell>{order.phone_no}</TableCell>
                        <TableCell>{formatItems(order.items)}</TableCell>
                        <TableCell className="font-semibold">₹{order.cost}</TableCell>
                        <TableCell>
                          {order.pay_history ? (
                            <span className="text-success font-bold">✅ Paid</span>
                          ) : (
                            <span className="text-destructive font-bold">❌ Not Paid</span>
                          )}
                        </TableCell>
                        <TableCell>{format(new Date(order.visit_time), "PPp")}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAccept(order.id)}
                              className="bg-success hover:bg-success/90"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(order.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Submissions;
