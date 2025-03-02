"use client";

import { useEffect, useState, use } from "react";
import { Phone, Mail, MapPin, PhoneCall } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { sup } from "@/_sdk/supabase";
import { Badge } from "@/components/ui/badge";
import { getOrderStatusText } from "@/app/_shared/utils/orderStatus";
import { useHydrated } from "@/app/_hooks";
import {useTracker} from "@/_store";
import { BadgeVariant, OrderStatus } from "@/_types";

interface OrderDetails {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  products: Array<{
    id: number;
    name: string;
    price: string;
    discount: string;
    quantity: number;
  }>;
  subtotal: number;
  discount: number;
  taxes: number;
  total: number;
  deliveryFee?: number;
  status: 
    | "PENDING" 
    | "APPROVED"
    | "PREPARING"
    | "WAY"
    | "OUT"
    | "DELIVERED"
    | "CANCELLED";
  paid: boolean;
  done: boolean;
  created_at: string;
}

// Mask sensitive information
const maskPhone = (phone: string) => {
  return `${phone.slice(0, 3)}****${phone.slice(-3)}`;
};

const maskEmail = (email: string | null) => {
  if (!email) return "";
  const [username, domain] = email.split("@");
  return `${username[0]}***@${domain}`;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const triggerCall = async () => {
  window.location.href = `tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`;
};

const triggerWhatsapp = (orderId: string) => {
  const message = encodeURIComponent(
    `Hi,\nI'd like to confirm my order #${orderId}.\nhttps://tandoorigrills.in/orders/${orderId}\n`
  );

  setTimeout(() => {
    window.location.assign(
      `https://wa.me/${process.env.NEXT_PUBLIC_PHONE_NUMBER}?text=${message}`
    );
  }, 3000)
}

export default function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const hydrated = useHydrated();
  const {orderId} = use(params);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isCallClicked, isWhatsappClicked, clear } = useTracker();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await sup
          .from("guest_orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Order not found");

        setOrder(data as OrderDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if(!hydrated || !orderId){
      return;
    }

    if(isCallClicked){
      triggerCall();
    }

    if(isWhatsappClicked){
      triggerWhatsapp(orderId);
    }

    clear();
  }, [hydrated, orderId])

  if (loading || !hydrated) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-600">
        {error || "Order not found"}
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Order #{order.id}</p>
              <CardTitle className="text-2xl font-bold mt-1">
                Order Details
              </CardTitle>
            </div>
            <Badge
              variant={order.status.toLocaleLowerCase() as BadgeVariant}
              className={`px-3 py-1 text-sm font-medium`}
            >
              {getOrderStatusText(order.status as OrderStatus)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{maskPhone(order.phone)}</span>
              </div>
              {order.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{maskEmail(order.email)}</span>
                </div>
              )}
              <div className="flex items-start gap-2 text-gray-600 md:col-span-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>{order.address}</span>
              </div>
            </div>
          </div>

          <Separator />
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.products.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(parseFloat(item.discount || item.price))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(
                        item.quantity *
                          parseFloat(item.discount || item.price)
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-yellow-700">
                  -{formatCurrency(order.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxes (SGST/IGST) </span>
              <span>{formatCurrency(order.taxes)}</span>
            </div>
            {(order.deliveryFee ?? 0) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span>{formatCurrency(order.deliveryFee || 0)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span className="text-lg">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 flex flex-col gap-4">
          <p className="text-sm text-gray-500">
            Order placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          
          <a
            href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`}
            className="flex items-center justify-center gap-2 w-full bg-yellow-300 hover:bg-yellow-200 text-yellow-800 py-3 px-4 rounded-lg font-medium transition-colors"
          >
            <PhoneCall className="w-5 h-5" />
            Call us about order #{order.id}
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
