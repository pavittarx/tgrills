import { useCart, useProducts } from "@/_store";
import { calculateOrderTotals } from "@/_methods/cart";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

export const CartTotals = () => {
  const cart = useCart((s) => s.cart);
  const products = useProducts((s) => s.products);
  const totals = calculateOrderTotals(cart, products);

  return (
    <section className="py-4 px-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-3">
        <div className="flex justify-between items-center text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
        </div>
        
        {totals.discount > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span className="flex items-center gap-2">
              Discount
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {formatPercentage(totals.discountPct)}
              </span>
            </span>
            <span className="font-medium">- {formatCurrency(totals.discount)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-gray-600">
          <span>Tax</span>
          <span className="font-medium">{formatCurrency(totals.taxes)}</span>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
