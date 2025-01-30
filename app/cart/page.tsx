"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";

import { useCart, useProducts } from "../_store";
import { Quantity } from "../_shared/Quantity";
import { LoginForm } from "../_shared/Auth/Login";
import type { AddressInput } from "../_shared/Auth/Login";

export default function Page() {
  const [checkout, setCheckout] = useState<boolean>(false);
  const methods = useForm<AddressInput>();

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

  const onCheckout = () => {
    console.log(methods.formState);
    console.log(methods.getValues());
  };

  return (
    <main className="mx-2 my-4">
      <h1 className="mx-2 pl-4 pb-1 font-semibold border-b grid-cols-4">
        {!checkout ? "Cart" : "Checkout"}
      </h1>

      {checkout && (
        <section>
          <LoginForm register={methods.register} />
        </section>
      )}

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

        <button
          className="bg-yellow-300 text-yellow-900 p-1 px-2"
          onClick={() => {
            if (!checkout) {
              setCheckout(true);
            }

            if(checkout){
              onCheckout();
            }
          }}
        >
          Checkout
        </button>
      </section>  
    </main>
  );
}
