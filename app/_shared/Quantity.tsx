import { FC } from "react";
import { MdOutlineAdd, MdOutlineRemove, MdOutlineDelete } from "react-icons/md";

type QuantityProps = {
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onDelete: () => void;
};

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

const Button: FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button
      type="button"
      className="h-[30px] w-[30px] bg-yellow-50 text-yellow-900 shadow shadow-yellow-100 rounded"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
};

export const Quantity: FC<QuantityProps> = ({
  quantity,
  onAdd,
  onRemove,
  onDelete,
}) => {
  return (
    <div className="text-base flex gap-1 items-center">
      <Button onClick={quantity > 1 ? onRemove : onDelete}>
        {quantity > 1 && <MdOutlineRemove className="inline-block" />}
        {quantity == 1 && <MdOutlineDelete className="inline-block" />}
      </Button>
      <span className="bg-white p-1 text-xs text-center w-[22px]">
        {quantity}
      </span>
      <Button onClick={onAdd}>
        <MdOutlineAdd className="inline-block" />
      </Button>
    </div>
  );
};
