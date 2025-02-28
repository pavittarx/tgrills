export type Product = {
  id: number;
  name: string;
  image: string;
  description: string;
  discount: string;
  price: string;
  categories: string[];
};

export type CartItem = {
  id: number;
  quantity: number;
}