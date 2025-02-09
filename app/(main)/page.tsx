"use client";
import { Carousel } from "@/app/_shared/Carousel";
import { Product } from "@/app/_shared/Product";
import { useProducts, useBanners, useCategories } from "@/_store";
import { getCatalogue } from "@/app/_services";

import { useState, useEffect } from "react";
import classNames from "classnames";
import { motion, MotionConfig } from "motion/react";

type Category = {
  id: string;
  name: string;
};

export default function Home() {
  const products = useProducts((s) => s.products);
  const setProducts = useProducts((s) => s.setProducts);

  const categories = useCategories((s) => s.categories);
  const setCategories = useCategories((s) => s.setCategories);

  const bannersTop = useBanners((s) => s.top);
  const setBanners = useBanners((s) => s.setBanners);

  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { products, categories, banners } = await getCatalogue();
      setProducts(products);
      setCategories(categories.map((cat: Category) => cat.name));
      setBanners(banners);
    })();
  }, []);

  return (
    <main className="h-full">
      <section className="mx-2 py-2 mb-1 flex overflow-x-scroll no-scrollbar">
        {/* Active Filters */}
        {filters.map((category) => (
          <motion.div key={category} className="mr-1">
            <motion.button
              animate={true}
              transition={{ duration: 1 }}
              className={classNames(
                "px-3 py-1 mx-0.5 h-8 rounded-full select-none",
                "min-w-14 text-center",
                "whitespace-nowrap",
                "border border-yellow-300",
                "flex items-center justify-center",
                "text-xs font-semibold",
                "bg-yellow-50 text-yellow-900",
                "hover:bg-yellow-100"
              )}
              onClick={() => {
                // Remove this specific filter
                setFilters(filters.filter((f) => f !== category));
              }}
            >
              <div className="flex items-center justify-center w-full">
                <span>{category}</span>
              </div>
            </motion.button>
          </motion.div>
        ))}

        {/* Available Categories */}
        {categories
          .filter((category) => !filters.includes(category))
          .map((category) => (
            <motion.div key={category} className="mr-2">
              <motion.button
                animate={true}
                transition={{ duration: 1 }}
                className={classNames(
                  "px-3 py-1 mx-1 h-8 rounded-full select-none",
                  "min-w-14 text-center",
                  "whitespace-nowrap",
                  "border border-secondary/50",
                  "flex items-center justify-center",
                  "text-xs font-medium",
                  "bg-secondary/30 text-secondary-foreground",
                  "hover:bg-secondary/40"
                )}
                onClick={() => {
                  const _filters = [...filters, category];
                  setFilters(_filters);
                }}
              >
                <div className="flex items-center justify-center w-full">
                  <span>{category}</span>
                </div>
              </motion.button>
            </motion.div>
          ))}
      </section>

      <section className="m-1 h-[200px] w-full">
        <Carousel slides={bannersTop} options={{ loop: true }} />
      </section>

      <div className="grid grid-cols-1 gap-2 mb-4">
        <MotionConfig
          transition={{
            duration: 5,
            ease: "easeInOut",
            type: "spring",
            stiffness: 100,
          }}
        >
          {products
            .filter((product) => {
              if (filters.length > 0) {
                const res = filters.every((cat) =>
                  product.categories.includes(cat)
                );

                return res;
              }
              return true;
            })
            .map((product) => (
              <Product key={product.name} {...product} />
            ))}
        </MotionConfig>
      </div>
    </main>
  );
}
