"use client";
import { Carousel } from "@/app/_shared/Carousel";
import { Product } from "@/app/_shared/Product";
import { useProducts, useBanners, useCategories } from "@/_store";
import { getCatalogue } from "@/app/_services";

import { useState, useEffect } from "react";
import classNames from "classnames";
import { motion, MotionConfig } from "motion/react";
import { X } from "lucide-react";

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
        {categories.map((category) => {
          const isActive = filters.includes(category);

          return (
            <motion.div key={category}>
              <motion.button
                animate={true}
                transition={{ duration: 1 }}
                className={classNames(
                  "px-2 py-1 mx-1 h-8 text-xs rounded-full select-none",
                  "min-w-14 text-center hover:bg-gray-50",
                  "whitespace-nowrap",
                  "border block",
                  "flex items-center gap-1 flex-1",
                  isActive && "bg-gray-100"
                )}
                onClick={() => {
                  if (!isActive) {
                    const _filters = [...filters, category];
                    setFilters(_filters);
                  } else {
                    setFilters(filters.filter((f) => f !== category));
                  }
                }}
              >
                <span className="w-full">{category}</span>
                {isActive && (
                  <div className="m-[0.5] p-0.5 border rounded-lg border-zinc-300">
                    {" "}
                    <X />{" "}
                  </div>
                )}
              </motion.button>{" "}
            </motion.div>
          );
        })}
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
