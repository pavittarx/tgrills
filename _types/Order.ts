export interface Order {
  id: number;
  created_at: string;
  name: string;
  email: string | null;
  address: string;
  products: {
    id: number;
    quantity: number;
    name: string;
    price: string;
    discount: string;
    image: string;
    description: string;
    categories: string[];
  }[];
  subtotal: number;
  discount: number;
  taxes: number;
  total: number;
  status: "PENDING" | "APPROVED" | "PREPARING" | "WAY" | "OUT" | "DELIVERED";
  paid: boolean;
  done: boolean;
  phone: number;
}
