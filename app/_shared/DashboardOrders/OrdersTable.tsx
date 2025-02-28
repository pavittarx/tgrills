import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IndianRupeeIcon, Edit, DollarSign, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { sup } from "@/_sdk/supabase";
import { Order } from "@/_types/Order";
import { BadgeVariant, OrderStatus } from "@/_types";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { CreateOrderModal } from "./CreateOrderModal";
import { getOrderStatusText } from "@/app/_shared/utils/orderStatus";

export function OrderDashboard() {
  const [orders, setOrders] = useState<Order[] | null>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
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
    try {
      const { error } = await sup
        .from("guest_orders")
        .update({
          [field]: value,
        })
        .eq("id", orderId);

      if (error) throw error;

      fetchOrders();
    } catch (err) {
      console.error(`Error updating order ${field} status:`, err);
      alert(`Failed to update order ${field} status`);
    }
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setIsEditModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
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
              <DropdownMenu open={!order.done && editingStatus === order.id} onOpenChange={(open: boolean) => setEditingStatus(open ? order.id : null)}>
                  <DropdownMenuTrigger asChild>
                    <div>
                      <Badge
                        variant={order?.status?.toLowerCase() as BadgeVariant}
                        className="cursor-pointer"
                      >
                        {getOrderStatusText(order.status as OrderStatus)}
                      </Badge>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "PENDING")}>
                      <Badge variant={"pending"}>
                        {getOrderStatusText("PENDING")}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "APPROVED")}>
                      <Badge variant={"approved"}>
                        {getOrderStatusText("APPROVED")}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "PREPAIRING")}>
                      <Badge variant={"prepairing"}>
                        {getOrderStatusText("PREPAIRING")}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "WAY")}>
                      <Badge variant={"way"}>
                        {getOrderStatusText("WAY")}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "OUT")}>
                      <Badge variant={"out"}>
                        {getOrderStatusText("OUT")}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "DELIVERED")}>
                      <Badge variant={"delivered"}>
                        {getOrderStatusText("DELIVERED")}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "CANCELLED")}>
                      <Badge variant={"cancelled"}>
                        {getOrderStatusText("CANCELLED")}
                      </Badge>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEditOrder(order)}
                    title="Edit Order"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={order.paid ? "outline" : "ghost"}
                    size="icon"
                    className={cn(
                      order.paid && "bg-blue-100 hover:bg-blue-200"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(order.id, "paid", !order.paid);
                    }}
                    title={order.paid ? "Unmark Paid" : "Mark Paid"}
                  >
                    <DollarSign className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={order.done ? "outline" : "ghost"}
                    size="icon"
                    className={cn(
                      order.done && "bg-green-100 hover:bg-green-200"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(order.id, "done", !order.done);
                    }}
                    title={order.done ? "Unmark Done" : "Mark Done"}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={selectedOrder}
        />
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <CreateOrderModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingOrder(null);
          }}
          existingOrder={editingOrder}
          onOrderCreated={fetchOrders}
        />
      )}
    </div>
  );
}
