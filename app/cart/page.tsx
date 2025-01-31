"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";

import { sup } from "./../_sdk/supabase";
import { useCart, useProducts } from "../_store";
import { Quantity } from "../_shared/Quantity";
import { OrderInputs } from "@/app/_shared/OrderInputs";

import type { AddressInput } from "@/app/_types/Address";

const ctaClasses = "bg-yellow-300 text-yellow-900 p-1 px-12 mt-12 block m-auto";

export default function Page() {
  const [checkout, setCheckout] = useState<boolean>(false);

  const { register, handleSubmit, formState } = useForm<AddressInput>();
  const { errors } = formState;

  const cart = useCart((s) => s.cart);
  const products = useProducts((s) => s.products);
  const handleAdd = useCart((s) => s.addQuantity);
  const handleRemove = useCart((s) => s.removeQuantity);
  const handleDelete = useCart((s) => s.removeFromCart);

  const _cart = cart.map((item) => {
    const product = products.find((p) => p.id === item.id)!;
    return {
      ...item,
      ...product,
    };
  });

  const subtotal = _cart.reduce(
    (a, c) => a + c.quantity * parseFloat(c.discount || c.price),
    0
  );
  const taxes = subtotal * 0.05;
  const total = subtotal + taxes;

  // Handling Form Submission
  const onSubmit = async (data, event) => {
    event.preventDefault();

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

        <section className="py-2">
          {_cart.map((item) => {
            return (
              <div
                key={item.id}
                className="w-full py-1 px-4 text-xs  grid grid-rows-1 grid-cols-[50vw_20vw_15vw] gap-1 items-center justify-between"
              >
                <div className="col-span-1">{item.name}</div>
                <span className="inline-block col-span-1">
                  <Quantity
                    quantity={item.quantity}
                    onAdd={() => {
                      handleAdd(item.id);
                    }}
                    onRemove={() => handleRemove(item.id)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </span>
                <div className="col-span-1 self-place-end text-right">
                  {item.quantity * parseFloat(item.discount || item.price)}
                </div>
              </div>
            );
          })}

          <div
            className={classNames(
              "border-t-2 mt-2 text-sm",
              "mt-1 p-2 mx-2 w-full",
              "grid grid-rows-3 grid-cols-[50vw_20vw_15vw] gap-1"
            )}
          >
            <div className="col-start-2 text-right">Subtotal</div>
            <div className="col-start-3 text-right">{subtotal}</div>
            <div className="col-start-2 text-right">Tax</div>
            <div className="col-start-3 text-right">{taxes}</div>
            <div className="col-start-2 text-right">Total</div>
            <div className="col-start-3 text-right">{total}</div>
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
