"use client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { oneLine } from "common-tags";

import { mergeCartAndProducts, calculateOrderTotals } from "@/_methods/cart";
import { sup } from "@/_sdk/supabase";
import { useCart, useProducts } from "@/_store";
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
  const products = useProducts((s) => s.products);

  const { register, handleSubmit, formState } = useForm<AddressInput>();
  const { errors, isSubmitting, isValid } = formState;

  const totals = calculateOrderTotals(cart, products);

  // Handling Form Submission
  const onSubmit: SubmitHandler<AddressInput> = async (data, event) => {
    event?.preventDefault();

    const order = {
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      address: data.address,
      products: mergeCartAndProducts(cart, products),
      subtotal: totals.subtotal,
      discount: 0,
      taxes: totals.taxes,
      total: totals.total,
      status: "PENDING",
      paid: false,
      done: false,
    };

    try {
      const { error: uError } = await sup.auth.signInWithPassword({
        phone: data.phone,
        password: "defpass",
      });

      if (uError) {
        await sup.auth.signUp({
          phone: data.phone,
          password: "defpass",
        });
      }

      // Save Orders
      await sup.from("guest_orders").insert(order);
    } catch (error) {
      console.log(error);
    }
  };

  if (cart.length == 0) {
    return <NoItemsInCart />;
  }

  return (
    <main className="mx-2 my-4">
      <h1 className="mx-2 pl-4 pb-1 font-semibold border-b grid-cols-4">
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
              disabled={isSubmitting || !isValid}
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
