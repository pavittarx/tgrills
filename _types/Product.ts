export type Product = {
  id: string;
  name: string;
  image: string;
  description: string;
  discount: string;
  price: string;
  categories: string[];
};

export type CartItem = {
  id: string;
  quantity: number;
}