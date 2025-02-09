"use client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { oneLine } from "common-tags";
import { ShoppingCart } from "lucide-react";
import classNames from "classnames";

import { useCart, useAddress } from "@/_store";
import type { AddressInput } from "@/_types/Address";
import {
  CartItems,
  OrderInputs,
  NoItemsInCart,
  CartTotals,
} from "@/app/_shared/Cart";

const ctaClasses = oneLine`
            bg-yellow-300 text-yellow-900 
            m-auto
            p-1 px-12 
            mt-12 
            block
        `;

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

        <section aria-label="cta-button">
          {!checkout && (
            <button
              className={ctaClasses}
              onClick={(e) => {
                e.preventDefault();
                setCheckout(true);
              }}
            >
              Checkout
            </button>
          )}

          {checkout && (
            <button
              type="submit"
              disabled={isSubmitting || !isDirty || !isValid}
              className={classNames(
                ctaClasses,
                (isSubmitting || !isDirty || !isValid) && 
                "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </button>
          )}
        </section>
      </form>
    </main>
  );
}
