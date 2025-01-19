"use client";

import { Header } from "./_shared/Header";
import { Footer } from "./_shared/Footer";
import { Carousel } from "./_shared/Carousel";
import { Product } from "./_shared/Product";
import { useProducts, useCart, useBanners, useCategories } from "./_store";
import { getCatalogue } from "./_services";

import { useState, useEffect } from "react";
import classNames from "classnames";
import { MotionConfig } from "motion/react";


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
      const {products, categories, banners} = await getCatalogue();
      setProducts(products);
      setCategories(categories);
      setBanners(banners);
    })();
  }, []);

  const handleAddProduct = useCart((s) => s.addToCart);

  return (
    <>
      <Header />
      <main className="h-full">
        <section className="border border-gray-100 py-2 mb-1">
          {categories.map((category) => (
            <button
              key={category}
              className={classNames(
                "px-3 py-1 mx-1 text-xs rounded-full hover:bg-gray-300",
                "border",
                filters.includes(category) && "bg-gray-100"
              )}
              onClick={() => {
                if (!filters.includes(category)) {
                  const _filters = [...filters, category];
                  setFilters(_filters);
                } else {
                  setFilters(filters.filter((f) => f !== category));
                }
              }}
            >
              {category}
            </button>
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
              .filter((product) =>
                filters.length > 0
                  ? product.categories.some((cat) => filters.includes(cat))
                  : true
              )
              .map((product) => (
                <Product key={product.name} {...product} onClick={e => {
                  e.stopPropagation();
                  handleAddProduct(product);
                }} />
              ))}
          </MotionConfig>
        </div>
      </main>
      <Footer />
    </>
  );
}
