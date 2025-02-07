import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Order } from "@/_types/Order";

interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details - #{order.id}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
          <p>
            <strong>Name:</strong> {order.name}
          </p>
          <p>
            <strong>Email:</strong> {order.email || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
          <p>
            <strong>Address:</strong> {order.address}
          </p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Products</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.discount}</TableCell>
                  <TableCell>
                    {(Number(product.price) - Number(product.discount)) *
                      product.quantity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <p>
            <strong>Subtotal:</strong> {order.subtotal.toFixed(2)}
          </p>
          <p>
            <strong>Discount:</strong> {order.discount.toFixed(2)}
          </p>
          <p>
            <strong>Taxes:</strong> {order.taxes.toFixed(2)}
          </p>
          <p>
            <strong>Total:</strong> {order.total.toFixed(2)}
          </p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Order Status</h3>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Paid:</strong> {order.paid ? "Yes" : "No"}
          </p>
          <p>
            <strong>Done:</strong> {order.done ? "Yes" : "No"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
