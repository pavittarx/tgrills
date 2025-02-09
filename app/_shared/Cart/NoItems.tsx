import { oneLine } from "common-tags";
import Link from "next/link";
import { Home } from "lucide-react";

export const NoItemsInCart = () => {
  return (
    <div
      className={oneLine`
        select-none
        bg-yellow-100 text-yellow-800
        mx-5 my-10 
        p-10
        rounded-md
        text-center
      `}
    >
      <span>No items in cart</span>
      <br />

      <Link href="/">
        <span
          className={oneLine`
            flex justify-center items-center
            gap-1  
            mt-2 
            hover:opacity-50`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </span>
      </Link>
    </div>
  );
};
