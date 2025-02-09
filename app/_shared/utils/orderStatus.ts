// Type is now imported from @/_types/OrderStatus
import { OrderStatus } from "@/_types/Order";

export const orderStatusText: Record<OrderStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  PREPAIRING: "Preparing",
  WAY: "On the Way",
  OUT: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled"
};

export function getOrderStatusText(status: OrderStatus): string {
  return orderStatusText[status];
}