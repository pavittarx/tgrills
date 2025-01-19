import Image from "next/image";
import { FC, MouseEvent, useState } from "react";
import {motion } from "motion/react";

type ProductProps = {
  name: string;
  image: string;
  description: string;
  discount: string;
  price: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const ProductCollapsed: FC<ProductProps> = ({
  name,
  image,
  discount,
  price,
  onClick,
}) => {
  return (
    <motion.div
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
      <button
        className="mx-1 h-[32px] w-[32px] bg-yellow-50 text-yellow-500 rounded shadow"
        onClick={onClick}
      >
        +
      </button>
    </motion.div>
  );
};

export const ProductExpanded: FC<ProductProps> = ({
  name,
  image,
  description,
  discount,
  price,
  onClick,
}) => {
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
          <button
            className="mx-1 h-[32px] w-[32px] bg-yellow-50 text-yellow-500 rounded shadow"
            onClick={onClick}
          >
            +
          </button>
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
