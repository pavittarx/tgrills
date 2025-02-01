"use client";
import { useState } from "react";
import classNames from "classnames";
import { SubmitHandler, useForm } from "react-hook-form";

import { calculateOrderTotals } from "@/_methods/cart";
import { sup } from "@/_sdk/supabase";
import { useCart, useProducts } from "@/_store";
import type { AddressInput } from "@/_types/Address";
import { CartItems } from "@/app/_shared/CartItems";
import { OrderInputs } from "@/app/_shared/OrderInputs";

const ctaClasses = "bg-yellow-300 text-yellow-900 p-1 px-12 mt-12 block m-auto";

export default function Page() {
  const [checkout, setCheckout] = useState<boolean>(false);
  const cart = useCart((s) => s.cart);
  const products = useProducts((s) => s.products);

  const { register, handleSubmit, formState } = useForm<AddressInput>();
  const { errors } = formState;

  const totals = calculateOrderTotals(cart, products);

  // Handling Form Submission
  const onSubmit: SubmitHandler<AddressInput> = async (data, event) => {
    event?.preventDefault();

    const order = {
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      address: data.address,
      products: _cart,
      subtotal: subtotal,
      discount: 0,
      taxes: taxes,
      total: total,
      status: "PENDING",
      paid: false,
      done: false,
    };

    const { data: uData, error: uError } = await sup.auth.signInWithPassword({
      phone: data.phone,
      password: "defpass",
    });

    if (uError) {
      await sup.auth.signUp({
        phone: data.phone,
        password: "defpass",
      });
    }

    const { data: dx, error } = await sup.from("guest_orders").insert(order);
  };

  return (
    <main className="mx-2 my-4">
      <h1 className="mx-2 pl-4 pb-1 font-semibold border-b grid-cols-4">
        {!checkout ? "Cart" : "Checkout"}
      </h1>

      <form method="post" onSubmit={handleSubmit(onSubmit)}>
        {checkout && <OrderInputs register={register} errors={errors} />}
        <CartItems />

        <section className="py-2">
          <div
            className={classNames(
              "border-t-2 mt-2 text-sm",
              "mt-1 p-2 mx-2 w-full",
              "grid grid-rows-3 grid-cols-[50vw_20vw_15vw] gap-1"
            )}
          >
            <div className="col-start-2 text-right">Subtotal</div>
            <div className="col-start-3 text-right">{totals.subtotal}</div>
            <div className="col-start-2 text-right">Tax</div>
            <div className="col-start-3 text-right">{totals.taxes}</div>
            <div className="col-start-2 text-right">Total</div>
            <div className="col-start-3 text-right">{totals.total}</div>
          </div>

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
        </section>

        {checkout && (
          <button type="submit" className={ctaClasses}>
            Order
          </button>
        )}
      </form>
    </main>
  );
}
