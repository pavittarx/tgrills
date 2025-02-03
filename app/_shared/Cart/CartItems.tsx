import { useCart, useProducts } from "@/_store";
import { mergeCartAndProducts } from "@/_methods/cart";
import { Quantity } from "../Quantity";

export const CartItems = () => {
  const cart = useCart((s) => s.cart);
  const products = useProducts((s) => s.products);

  const handleAdd = useCart((s) => s.addQuantity);
  const handleRemove = useCart((s) => s.removeQuantity);
  const handleDelete = useCart((s) => s.removeFromCart);

  const cartItems = mergeCartAndProducts(cart, products);

  return (
    <>
      {cartItems.map((item) => {
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
    </>
  );
};
