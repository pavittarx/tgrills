import { FC } from "react";
import { Plus, Minus, Trash2 } from "lucide-react";

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
      className="h-7 w-7 bg-yellow-50 text-yellow-900 hover:bg-yellow-100 transition-colors rounded-md inline-flex items-center justify-center"
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
    <div className="inline-flex items-center gap-1.5">
      <Button onClick={quantity > 1 ? onRemove : onDelete}>
        {quantity > 1 && <Minus className="w-4 h-4" />}
        {quantity == 1 && <Trash2 className="w-4 h-4" />}
      </Button>
      <span className="inline-flex items-center justify-center text-sm font-medium w-6">
        {quantity}
      </span>
      <Button onClick={onAdd}>
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};
