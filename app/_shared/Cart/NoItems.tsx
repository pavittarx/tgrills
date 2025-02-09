import Link from "next/link";
import { Home, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";

export const NoItemsInCart = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="bg-secondary/10 p-8 rounded-2xl max-w-md w-full shadow-sm">
        <div className="mb-6 flex justify-center">
          <div className="bg-secondary/20 p-4 rounded-full">
            <ShoppingCart 
              className="h-10 w-10 stroke-secondary-foreground/70" 
              strokeWidth={1.5} 
            />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-secondary-foreground mb-3">
          Your Cart is Empty
        </h2>
        
        <p className="text-sm text-secondary-foreground/70 mb-6">
          Looks like you haven&apos;t added any items to your cart yet. 
          Let&apos;s find something delicious!
        </p>
        
        <Link href="/" className="block">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              px-6 py-3 rounded-full
              bg-secondary/30 text-secondary-foreground
              hover:bg-secondary/40
              flex items-center justify-center mx-auto
              transition-colors duration-200
              font-medium text-sm
            `}
          >
            <Home className="w-4 h-4 mr-2" />
            Explore Menu
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};
