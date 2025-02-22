import Image from "next/image";
import { FC } from "react";
import { motion } from "motion/react";
import { Quantity } from "./Quantity";
import { useCart } from "../../_store";
import type { Product as ProductProps } from "@/_types";
import classNames from "classnames";
import { Plus } from "lucide-react";
import { getPublicImageUrl } from "@/_sdk/supabase";

export const Product: FC<ProductProps> = ({
  id,
  name,
  description,
  discount,
  price,
  image,
}) => {
  const quantity =
    useCart((s) =>
      s.cart.length > 0 ? s.cart.find((item) => item.id === id)?.quantity : 0
    ) || 0;

  const handleAdd = useCart((s) => s.addToCart);
  const handlePlus = useCart((s) => s.addQuantity);
  const handleMinus = useCart((s) => s.removeQuantity);
  const handleDelete = useCart((s) => s.removeFromCart);

  const percentOff: number = discount
    ? 100 - Math.floor((parseInt(discount) / parseInt(price)) * 100)
    : 0;

  return (
    <motion.div
      animate={{ height: [0, 150] }}
      key={name}
      className="mx-4 my-2 flex items-center gap-4 px-3 py-3 shadow-sm hover:shadow transition duration-200 rounded-lg select-none bg-white"
    >
      <Image
        className="border rounded-lg max-w-[150px] max-h-[150px] object-cover"
        src={getPublicImageUrl(image)}
        alt={name}
        width={120}
        height={120}
      />
      <div className="w-full">
        <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
        <p className="text-sm text-gray-600 pb-2 line-clamp-2">{description}</p>

        <div className="flex justify-between w-full">
          <div>
            {discount && (
              <div className="flex items-center gap-2">
                <span className="text-base font-medium text-yellow-900">
                  ₹{discount}
                </span>
                <span className="bg-yellow-50 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {percentOff}% off
                </span>
              </div>
            )}
            <div
              className={classNames(
                "text-sm mt-1",
                discount
                  ? "line-through text-gray-400"
                  : "font-medium text-yellow-900"
              )}
            >
              ₹{price}
            </div>
          </div>
          {!quantity && (
            <button
              className="mx-1 h-[32px] w-[32px] bg-yellow-50 text-yellow-900 hover:bg-yellow-100 transition-colors rounded shadow"
              onClick={(e) => {
                e.stopPropagation();
                handleAdd(id);
              }}
            >
              <Plus className="w-4 h-4 mx-auto" />
            </button>
          )}
          {quantity > 0 && (
            <Quantity
              quantity={quantity}
              onAdd={() => handlePlus(id)}
              onDelete={() => handleDelete(id)}
              onRemove={() => handleMinus(id)}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};
