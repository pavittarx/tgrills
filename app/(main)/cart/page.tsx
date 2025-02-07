"use client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { oneLine } from "common-tags";
import { ShoppingCart } from "lucide-react";

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

  const { register, handleSubmit, formState } = useForm<AddressInput>();
  const { errors, isSubmitting } = formState;

  // Handling Form Submission
  const onSubmit: SubmitHandler<AddressInput> = async (data) => {
    handleAddAddress({
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      address: data.address,
    });

    // Nextjs Router breaks on Client
    window.location.assign("/cart/review");
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
              disabled={isSubmitting}
              className={ctaClasses}
            >
              Order
            </button>
          )}
        </section>
      </form>
    </main>
  );
}
