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
    <div className="flex flex-col divide-y divide-gray-100">
      {/* Header */}
      <div className="w-full py-2 px-4 grid grid-cols-[50vw_20vw_15vw] gap-2 items-center text-sm font-medium text-gray-500">
        <div>Item</div>
        <div className="text-center">Qty</div>
        <div className="text-right">Price</div>
      </div>

      {/* Items */}
      {cartItems.map((item) => {
        const itemTotal = item.quantity * parseFloat(item.discount || item.price);
        return (
          <div
            key={item.id}
            className="w-full py-3 px-4 grid grid-cols-[50vw_20vw_15vw] gap-2 items-center hover:bg-gray-50 transition-colors"
          >
            {/* Item Name */}
            <div className="text-sm text-gray-700">
              <div className="font-medium">{item.name}</div>
              {item.discount && (
                <div className="text-xs font-medium text-green-600 mt-0.5">
                  {Math.round(((parseFloat(item.price) - parseFloat(item.discount)) / parseFloat(item.price)) * 100)}% off
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-center h-full">
              <Quantity
                quantity={item.quantity}
                onAdd={() => handleAdd(item.id)}
                onRemove={() => handleRemove(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-sm font-medium">
                ₹{itemTotal.toFixed(2)}
              </div>
              {item.quantity > 1 && (
                <div className="text-xs text-gray-500 mt-0.5">
                  ₹{parseFloat(item.discount || item.price).toFixed(2)} each
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
