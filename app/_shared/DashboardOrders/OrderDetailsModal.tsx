import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Order, BadgeVariant } from "@/_types";
import { getOrderStatusText } from "@/app/_shared/utils/orderStatus";

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
  const restaurantName = process.env.NEXT_PUBLIC_NAME || "Tandoori Grills";
  const restaurantAddress = process.env.NEXT_PUBLIC_ADDRESS || "King Alpha Gym, Near Bijli Colony, Nanakmatta - 262311";
  const restaurantContact = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+91 1234567890";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-white p-0 overflow-hidden">
        <div className="border-2 border-gray-300 p-6">
          {/* Invoice Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{restaurantName}</h1>
            <p className="text-sm text-gray-600 mb-1">{restaurantAddress}</p>
            <p className="text-sm text-gray-600 mb-4">Contact: {restaurantContact}</p>
            
            <div className="flex justify-between items-center border-t border-b border-gray-300 py-2">
              <div>
                <p className="font-semibold text-left">Invoice #: {order.id}</p>
                <p>Date: {new Date().toLocaleDateString()}</p>
              </div>
              <Badge
                variant={order.status.toLowerCase() as BadgeVariant}
                className="text-sm font-normal"
              >
                {getOrderStatusText(order.status)}
              </Badge>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-6 text-sm">
            <h3 className="font-semibold mb-2">Bill To:</h3>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Email:</strong> {order.email || "N/A"}</p>
            
            <h3 className="font-semibold mb-2 mt-4">Delivery Address:</h3>
            <p>{order.address}</p>
          </div>

          {/* Order Items */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="text-right">{product.quantity}</TableCell>
                  <TableCell className="text-right">
                    ₹{Number(product.discount || product.price).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{(Number(product.discount || product.price) * product.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Bill Summary */}
          <div className="mt-6 border-t border-gray-300 pt-4 text-sm">
            <div className="space-y-2">
              <p className="italic text-gray-600">
                Thank you for your order! We are delighted to serve you. <br/>
                {order.done ? " Order completed." : " Order in progress."}
              </p>
              
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxes:</span>
                <span>₹{order.taxes.toFixed(2)}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>₹{order.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2">
                <span>Total:</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              {order.paid ? "Payment Received" : "Payment Pending"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
