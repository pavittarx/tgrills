"use client";

import { useCart, useProducts } from "../_store";
import { Quantity } from "../_shared/Quantity";

export default function Page() {
  const cart = useCart((s) => s.cart);
  const products = useProducts(s => s.products);
  const handleAdd  = useCart((s) => s.addQuantity);
  const handleRemove = useCart((s) => s.removeQuantity);
  const handleDelete = useCart((s) => s.removeFromCart);

  if(!products.length){
    return <>No Products</>;
  }

  const _cart = cart.map((item) => {
    const product = products.find(p => p.id === item.id)!;
    return {
      ...item,
      ...product
    };
  });

  return (
    <main className="mx-2 my-4">
      <h1 className="mx-2 pl-4 pb-1 font-semibold border-b grid-cols-4">
        Cart
      </h1>

      <section className="py-2">
        {_cart.map((item) => {
          return (
            <div
              key={item.id}
              className="w-full py-1 px-4 text-xs  grid grid-rows-1 grid-cols-[200px_80px_20px] gap-1 items-center justify-between"
            >
              <div className="col-span-1">{item.name}</div>
              <span className="inline-block col-span-1">
                <Quantity
                  quantity={item.quantity}
                  onAdd={() => {handleAdd(item.id)}}
                  onRemove={() => handleRemove(item.id)}
                  onDelete={() => handleDelete(item.id)}
                /> 
              </span>
              <div className="col-span-1 self-place-end text-right">
                {item.quantity * parseFloat(item.price)}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
