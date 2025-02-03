import classNames from "classnames";
import { useCart, useProducts } from "@/_store";
import { calculateOrderTotals } from "@/_methods/cart";

export const CartTotals = () => {
  const cart = useCart((s) => s.cart);
  const products = useProducts((s) => s.products);
  const totals = calculateOrderTotals(cart, products);

  return (
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
    </section>
  );
};
