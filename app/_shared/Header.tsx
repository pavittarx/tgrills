"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Phone } from "lucide-react";
import { useCart } from "@/_store";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();
  const cartItems = useCart((s) => s.cart.length);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo.png"
            width={40}
            height={40}
            alt="Tandoori Grills logo"
            className="rounded-full"
          />
          <span className="text-lg font-semibold text-yellow-900">Tandoori Grills</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link 
            href="/cart" 
            className={`relative p-2 rounded-full transition-colors ${pathname === '/cart' ? 'bg-yellow-50 text-yellow-900' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems}
              </span>
            )}
          </Link>
          
          <a 
            href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`}
            className="p-2 hover:bg-green-50 rounded-full transition-colors text-green-600 hover:text-green-700"
            aria-label="Call us"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
};
