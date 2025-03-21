"use client";
import { useRouter } from "next/navigation";
import { Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useAddress, useCart, useProducts, useTracker } from "@/_store";
import { useHydrated } from "@/app/_hooks";
import { calculateOrderTotals, mergeCartAndProducts } from "@/_methods/cart";
import { useEffect, useState } from "react";

const OrderReviewPage = () => {
  const router = useRouter();
  const hydrated = useHydrated();
  const cart = useCart((s) => s.cart);
  const products = useProducts((s) => s.products);
  const address = useAddress((s) => s.address);
  const trackWhatsapp = useTracker((s) => s.whatsAppClicked);
  const trackCall = useTracker((s) => s.callClicked);

  const [isCallLoading, setIsCallLoading] = useState(false);
  const [isWhatsappLoading, setIsWhatsappLoading] = useState(false);

  const items = mergeCartAndProducts(cart, products);
  const totals = calculateOrderTotals(cart, products);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    // Navigate back to Cart if phone is not available.
    if (!address?.phone) {
      router.push("/cart");
    }
    
  }, [hydrated]);

  const handleOrder = async (trigger: "call" | "whatsapp") => {
    if (trigger === "call") {
      setIsCallLoading(true);
    } else {
      setIsWhatsappLoading(true);
    }

    const order = {
      name: address.name,
      phone: address.phone,
      email: address.email,
      address: address.address,
      products: mergeCartAndProducts(cart, products),
      subtotal: totals.subtotal,
      discount: totals.discount,
      taxes: totals.taxes,
      total: totals.total,
      status: "PENDING",
      paid: false,
      done: false,
    };

    try {
      const { error: uError } = await sup.auth.signInWithPassword({
        phone: order.phone,
        password: "defpass",
      });

      // Guest Signup if the user does not exist
      if (uError) {
        await sup.auth.signUp({
          phone: order.phone,
          password: "defpass",
        });
      }
      // Save Orders
      const { data, error } = await sup
        .from("guest_orders")
        .insert(order)
        .select("id");

      if (error) {
        console.error("Error while creating order.");
        return false;
      }

      if(trigger == "call"){
        trackCall();
      }else if(trigger == "whatsapp"){
        trackWhatsapp();
      }

        // Use client-side navigation with prefetch
        router.push(`/orders/${data[0].id}`);
    } catch (error) {
      console.error(error);

      throw new Error("Error Occurred while processing order.", {
        cause: error,
      });
    } finally {
      if (trigger === "call") {
        setIsCallLoading(false);
      } else {
        setIsWhatsappLoading(false);
      }
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Order Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Customer Details</h2>
                <p>
                  <strong>Name:</strong> {address.name}
                </p>
                <p>
                  <strong>Phone:</strong> {address.phone}
                </p>
                <p>
                  <strong>Address:</strong> {address.address}
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-xl font-semibold mb-2">Order Items</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {parseFloat(item.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Separator />

              <div>
                <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes:</span>
                  <span>{totals.taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount ({totals.discountPct.toFixed(2)}%):</span>
                  <span>-{totals.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total:</span>
                  <span>{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-1 w-full select-none">
            <Button
              onClick={() => handleOrder("call")}
              disabled={isCallLoading || isWhatsappLoading}
              className="w-full bg-yellow-300 text-yellow-800 hover:bg-yellow-200"
            >
              {isCallLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <Phone className="mr-2 h-4 w-4" /> Order via Call
                </>
              )}
            </Button>
            <br />
            <Button
              onClick={() => handleOrder("whatsapp")}
              disabled={isCallLoading || isWhatsappLoading}
              className="w-full bg-yellow-300 text-yellow-800 hover:bg-yellow-200"
            >
              {isWhatsappLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" /> Order via WhatsApp
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default OrderReviewPage;
