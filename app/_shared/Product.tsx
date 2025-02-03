import Image from "next/image";
import { FC } from "react";
import { motion } from "motion/react";

import { Quantity } from "./Quantity";
import { useCart } from "../../_store";
import type { Product as ProductProps } from "@/_types";
import classNames from "classnames";

export const Product: FC<ProductProps> = ({
  id,
  name,
  image,
  description,
  discount,
  price,
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
      className="mx-4 my-1 flex items-center gap-3 px-2 py-2 shadow-sm transition select-none"
    >
      <Image
        className="border rounded-md max-w-[150px] max-h-[150px]"
        src={image}
        alt={name}
        height={150}
        width={150}
      />
      <div className="w-full">
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-sm pb-1">{description}</p>

        <div className="flex justify-between w-full">
          <div>
            {discount && (
              <div className="text-md text-sm text-yellow-700">
                <span>Rs. {discount}</span>
                <span className="bg-yellow-50 text-yellow-500 ml-1 border border-yellow-50 rounded py-0.5 px-1">
                  {percentOff}% off
                </span>
              </div>
            )}
            <div
              className={classNames(
                "text-md mr-1 mt-1 text-sm text-yellow-800",
                discount && "line-through text-gray-400"
              )}
            >
              Rs. {price}
            </div>
          </div>
          {!quantity && (
            <button
              className="mx-1 h-[32px] w-[32px] bg-yellow-50 text-yellow-500 rounded shadow"
              onClick={(e) => {
                e.stopPropagation();
                handleAdd(id);
              }}
            >
              +
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
