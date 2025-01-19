import type {Banner} from "@/app/_store/banners";

const transformCategories = (categories: Array<string | string[]>) => {
  categories.shift();
  return categories.map((cat) => cat[0]);
}

const transformProducts = (products: Array<string[]>, categories: Array<string | string[]>) => {
  
  products.shift();
  return products.map((product: Array<string>) => {
    return {
      name: product[0],
      price: product[1],
      discount: product[2],
      image: product[3],
      description: product[4],
      categories: categories
        .filter((cat) => cat[1].includes(product[0]))
        .map((cat) => cat[0]),
    };
  });
}

type BannerType = "top" | "middle" | "bottom";

const transformBanners = (banners: Array<string[]>) => {
  banners.shift();
  return banners.reduce(
    (acc: Banner, curr: Array<string>) => {
      if (!curr.length) {
        return acc;
      }

      const pos = curr.shift() as BannerType;
      acc[pos] = curr;

      return acc;
    },
    {
      top: [],
      middle: [],
      bottom: [],
    }
  );
}


export const getCatalogue = async () => {
  const res = await fetch("/api");
  const data = await res.json();

  return {
    products: transformProducts(data.products, data.categories),
    categories: transformCategories(data.categories),
    banners: transformBanners(data.banners),
  };

};