"use client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { oneLine } from "common-tags";
import { ShoppingCart, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useCart, useAddress } from "@/_store";
import type { AddressInput } from "@/_types/Address";
import {
  CartItems,
  OrderInputs,
  NoItemsInCart,
  CartTotals,
} from "@/app/_shared/Cart";

export default function Page() {
  const [checkout, setCheckout] = useState<boolean>(false);
  const cart = useCart((s) => s.cart);
  const handleAddAddress = useAddress((s) => s.addAddress);

  const { register, handleSubmit, formState, trigger } = useForm<AddressInput>({ 
    mode: 'onBlur',
    criteriaMode: 'all'
  });
  const { errors, isSubmitting, isDirty, isValid } = formState;

  // Handling Form Submission
  const onSubmit: SubmitHandler<AddressInput> = async (data) => {
    try {
      // Validate all fields before submission
      const isValid = await trigger();
      if (!isValid) return;

      handleAddAddress({
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || "",
        address: data.address.trim(),
      });

      // Nextjs Router breaks on Client
      window.location.assign("/cart/review");
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  if (cart.length == 0) {
    return <NoItemsInCart />;
  }

  return (
    <main className="mx-2 my-4">
      <h1
        className={oneLine`
                flex items-center
                gap-2
                pl-4 pb-2 
                mb-2  
                font-semibold 
                border-b 
                `}
      >
        <ShoppingCart />
        {!checkout ? "Cart" : "Checkout"}
      </h1>

      <form method="post" onSubmit={handleSubmit(onSubmit)}>
        {checkout && <OrderInputs register={register} errors={errors} />}
        <CartItems />
        <CartTotals />

        <section aria-label="cta-button" className="mt-4 flex-col gap-1 w-full select-none">
          {!checkout && (
            <Button 
              onClick={(e) => {
                e.preventDefault();
                setCheckout(true);
              }}
              className="w-full bg-yellow-300 text-yellow-800 hover:bg-yellow-200 rounded-lg"
            >
              <CreditCard className="mr-2 h-4 w-4" /> Proceed to Checkout
            </Button>
          )}

          {checkout && (
            <Button 
              type="submit"
              className="w-full bg-yellow-300 text-yellow-800 hover:bg-yellow-200 rounded-lg"
              disabled={isSubmitting || !isDirty || !isValid}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> 
              {isSubmitting ? "Processing..." : "Confirm Order"}
            </Button>
          )}
        </section>
      </form>
    </main>
  );
}
