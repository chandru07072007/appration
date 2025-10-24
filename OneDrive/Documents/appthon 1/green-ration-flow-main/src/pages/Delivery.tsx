import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface RationOrder {
  id: string;
  user_id: string;
  phone_no: string;
  items: any;
  cost: number;
  pay_history: boolean;
  visit_time: string;
  delivery_status: string;
}

const Delivery = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<RationOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    // Load accepted orders from localStorage
    const acceptedOrdersJSON = localStorage.getItem("acceptedOrders");
    const localAcceptedOrders = acceptedOrdersJSON ? JSON.parse(acceptedOrdersJSON) : [];

    // Try to load from Supabase
    const { data, error } = await supabase
      .from("ration_orders")
      .select("*")
      .eq("order_status", "accepted")
      .order("created_at", { ascending: false });

    if (error) {
      // If error, use localStorage data
      setOrders(localAcceptedOrders);
      setLoading(false);
      return;
    }

    // Combine Supabase data with localStorage data
    const combinedOrders = [...localAcceptedOrders, ...(data || [])];
    setOrders(combinedOrders);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // Update in localStorage
    const acceptedOrdersJSON = localStorage.getItem("acceptedOrders");
    const localAcceptedOrders = acceptedOrdersJSON ? JSON.parse(acceptedOrdersJSON) : [];
    const updatedOrders = localAcceptedOrders.map((order: RationOrder) =>
      order.id === orderId ? { ...order, delivery_status: newStatus } : order
    );
    localStorage.setItem("acceptedOrders", JSON.stringify(updatedOrders));

    // Update in Supabase
    const { error } = await supabase
      .from("ration_orders")
      .update({ delivery_status: newStatus })
      .eq("id", orderId);

    if (error && error.message !== "No rows found") {
      // Only show error if it's not "no rows found" (which happens with local data)
      console.error("Supabase update error:", error);
    }

    toast.success(`Delivery status updated to ${newStatus}`);
    loadOrders();
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

  const getRowClassName = (status: string) => {
    if (status === "delivered") {
      return "bg-success/10 hover:bg-success/20";
    }
    if (status === "pending") {
      return "bg-warning/10 hover:bg-warning/20";
    }
    return "";
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
          <h1 className="text-3xl font-bold text-white">Delivery Management</h1>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white">
            <CardTitle>Accepted Orders - Delivery Status</CardTitle>
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
                    <TableHead className="font-bold">Delivery Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Loading deliveries...
                      </TableCell>
                    </TableRow>
                  ) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No accepted orders yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order, index) => (
                      <TableRow key={order.id} className={cn(getRowClassName(order.delivery_status))}>
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
                          <Select
                            value={order.delivery_status}
                            onValueChange={(value) => handleStatusChange(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
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

export default Delivery;
