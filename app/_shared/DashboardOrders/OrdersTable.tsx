import { useState, useEffect } from "react";
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

  const fetchOrders = async () => {
    const { data, error } = await sup
      .from("guest_orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error while fetching orders.");
      return;
    }

    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    const { data, error } = await sup
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
              className="cursor-pointer hover:bg-gray-100"
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
                        variant={order.status.toLowerCase() as any}
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(order.id, "paid", !order.paid);
                  }}
                >
                  {order.paid ? "Paid" : "Mark Paid"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(order.id, "done", !order.done);
                  }}
                >
                  {order.done ? "Done" : "Mark Done"}
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
