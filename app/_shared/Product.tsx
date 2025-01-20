import Image from "next/image";
import { FC, useState } from "react";
import { motion } from "motion/react";

import { Quantity } from "./Quantity";
import { useCart } from "../_store";
import type { Product as ProductProps } from "../_store";

export const ProductCollapsed: FC<ProductProps> = ({
  id,
  name,
  image,
  discount,
  price
}) => {
  const quantity: number =
    useCart((s) =>
      s.cart.length > 0 ? s.cart.find((item) => item.id === id)?.quantity : 0
    ) || 0;

  const handleAdd = useCart((s) => s.addToCart);
  const handlePlus = useCart((s) => s.addQuantity);
  const handleMinus = useCart((s) => s.removeQuantity);
  const handleDelete = useCart((s) => s.removeFromCart);

  return (
    <motion.div
      initial={{ height: 150 }}
      animate={{ height: [150, 60] }}
      key={name}
      className="transition-all mx-4 my-1 flex items-center justify-between px-2 py-2 shadow-sm"
    >
      <div className="w-full px-2 flex items-center justify-left gap-2">
        <Image src={image} alt={name} height={38} width={38} />
        <h2 className="text-md font-bold">{name}</h2>
      </div>
      {discount && <div className="text-md font-semibold">{discount}</div>}
      <div className="text-md mr-1 mt-1">{price}</div>
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
    </motion.div>
  );
};

export const ProductExpanded: FC<ProductProps> = ({
  id,
  name,
  image,
  description,
  discount,
  price,
}) => {
  const quantity = useCart((s) =>
    s.cart.length > 0 ? s.cart.find((item) => item.id === id)?.quantity : 0
  ) || 0;

  const handleAdd = useCart((s) => s.addToCart);
  const handlePlus = useCart((s) => s.addQuantity);
  const handleMinus = useCart((s) => s.removeQuantity);
  const handleDelete = useCart((s) => s.removeFromCart);

  return (
    <motion.div
      animate={{ height: [0, 150] }}
      key={name}
      className="mx-4 my-1 flex items-center gap-3 px-2 py-2 shadow-sm transition"
    >
      <Image
        className="border rounded-md max-w-[150px] max-h-[150px]"
        src={image}
        alt={name}
        height={150}
        width={150}
      />
      <div className="w-full">
        <h2 className="text-md font-bold">{name}</h2>
        <p className="text-sm">{description}</p>
        {discount && <div className="text-md font-semibold">{discount}</div>}
        <div className="flex justify-end w-full">
          <div className="text-md mr-1 mt-1">{price}</div>
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

export const Product: FC<ProductProps> = (props) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <motion.div className="select-none" onClick={() => setOpen(!isOpen)}>
      {!isOpen ? (
        <ProductCollapsed {...props} />
      ) : (
        <ProductExpanded {...props} />
      )}
    </motion.div>
  );
};
