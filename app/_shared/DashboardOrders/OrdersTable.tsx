import { useState, useEffect } from "react";
import { BadgeVariant } from "@/_types/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IndianRupeeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { sup } from "@/_sdk/supabase";
import { Order } from "@/_types/Order";
import { OrderDetailsModal } from "./OrderDetailsModal";

export function OrderDashboard() {
  const [orders, setOrders] = useState<Order[] | null>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await sup
        .from("guest_orders")
        .select("*")
        .order("id", { ascending: false });

      if (fetchError) throw new Error(fetchError.message);
      
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to real-time changes
    const channel = sup
      .channel('guest_orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'guest_orders'
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchOrders(); // Refresh the orders list
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    const { error } = await sup
      .from("guest_orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert(`${orderId}: Error while updating order status.`);
      return;
    }

    setEditingStatus(null);
    fetchOrders();
  };

  const handleStatusChange = async (
    orderId: number,
    field: "paid" | "done",
    value: boolean
  ) => {
    const { data, error } = await sup
      .from("guest_orders")
      .update({
        [field]: value,
      })
      .eq("id", orderId);

    if (error) {
      alert(`${orderId}: Error while updating order.`);
      return;
    }

    console.log(data, error);

    fetchOrders();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Dashboard</h1>
      {error && (
        <div className="p-4 mb-4 text-red-800 bg-red-100 rounded-lg">
          <p>{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => fetchOrders()}
          >
            Refresh
          </Button>
        </div>
      )}

      {isLoading && !orders?.length ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => (
            <TableRow
              key={order.id}
              className={cn(
                "cursor-pointer transition-colors",
                order.paid && order.done ? "bg-green-50 hover:bg-green-100" :
                order.paid ? "bg-blue-50 hover:bg-blue-100" :
                order.done ? "bg-yellow-50 hover:bg-yellow-100" :
                "hover:bg-gray-100"
              )}
              onClick={() => {
                setSelectedOrder(order);
                setIsModalOpen(true);
              }}
            >
              <TableCell>{order.id}</TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleString().toUpperCase()}
              </TableCell>
              <TableCell>{order.name}</TableCell>
              <TableCell className="flex gap-1 mt-1 items-center">
                <IndianRupeeIcon height={16} width={16} />{" "}
                {order.total.toFixed(2)}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu open={editingStatus === order.id} onOpenChange={(open: boolean) => setEditingStatus(open ? order.id : null)}>
                  <DropdownMenuTrigger asChild>
                    <div>
                      <Badge
                        variant={order.status.toLowerCase() as BadgeVariant}
                        className="cursor-pointer"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "PENDING")}>
                      <Badge variant="pending">PENDING</Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "APPROVED")}>
                      <Badge variant="approved">APPROVED</Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "PREPAIRING")}>
                      <Badge variant="prepairing">PREPAIRING</Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "WAY")}>
                      <Badge variant="way">WAY</Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "OUT")}>
                      <Badge variant="out">OUT</Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "DELIVERED")}>
                      <Badge variant="delivered">DELIVERED</Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "CANCELLED")}>
                      <Badge variant="cancelled">CANCELLED</Badge>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <Button
                  variant={order.paid ? "outline" : "default"}
                  size="sm"
                  className={cn(
                    "mr-2",
                    order.paid && "bg-blue-100 hover:bg-blue-200 border-blue-200"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(order.id, "paid", !order.paid);
                  }}
                >
                  {order.paid ? "💰 Paid" : "Mark Paid"}
                </Button>
                <Button
                  variant={order.done ? "outline" : "default"}
                  size="sm"
                  className={cn(
                    order.done && "bg-yellow-100 hover:bg-yellow-200 border-yellow-200"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(order.id, "done", !order.done);
                  }}
                >
                  {order.done ? "✅ Done" : "Mark Done"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
