"use client";

import { useCart } from "../_store"

export default function Page(){
    const cart = useCart(s => s.cart);
    console.log(cart);

    const header = {
        name: 'Name',
        quantity: 'Quantity',
        price: 'Price',
        total: 'Total',
    }

    return <main className="mx-2 my-4">
        <h1 className="mx-2 pl-4 pb-1 font-semibold border-b grid-cols-4">Cart</h1>

        <section className="py-2">
            {
                ...cart.map((product) => {
                    return <div 
                                key={product.name} 
                                className="py-1 text-xs pl-4 grid grid-rows-1 grid-cols-[200px_50px_50px_50px_50px] gap-1">
                                    <div className="col-span-1">{product.name}</div>
                                    <span className="inline-block col-span-1 place-self-end">{product.quantity}</span>
                                    <div className="col-span-1 place-self-end">{product.price}</div>
                                    <div className="col-span-1 place-self-end">{product.quantity * parseFloat(product.price)}</div>
                                    <div className="col-span-1 place-self-end"> D </div>
                            </div>
                })
            }
        </section>
    </main>
}