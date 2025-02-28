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
import { useEffect } from "react";

const OrderReviewPage = () => {
  const router = useRouter();
  const hydrated = useHydrated();
  const cart = useCart((s) => s.cart);
  const products = useProducts((s) => s.products);
  const address = useAddress((s) => s.address);
  const trackWhatsapp = useTracker((s) => s.whatsAppClicked);
  const trackCall = useTracker((s) => s.callClicked);

  const items = mergeCartAndProducts(cart, products);
  const totals = calculateOrderTotals(cart, products);

  const clearAddress = useAddress((s) => s.clear);
  const clearCart = useCart((s) => s.clear);

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

      // Redirect to order details page
      const url = `/orders/${data[0].id}`;
      router.push(url);

      // Clear cart and address after successful order
      clearCart();
      clearAddress();
    } catch (error) {
      console.error(error);

      throw new Error("Error Occurred while processing order.", {
        cause: error,
      });
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
              className="w-full bg-yellow-300 text-yellow-800 hover:bg-yellow-200"
            >
              <Phone className="mr-2 h-4 w-4" /> Order via Call
            </Button>
            <br />
            <Button
              onClick={() => handleOrder("whatsapp")}
              className="w-full bg-yellow-300 text-yellow-800 hover:bg-yellow-200"
            >
              <MessageSquare className="mr-2 h-4 w-4" /> Order via WhatsApp
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default OrderReviewPage;
