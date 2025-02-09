export type OrderStatus = 
  | "PENDING" 
  | "APPROVED"
  | "PREPAIRING"
  | "WAY"
  | "OUT"
  | "DELIVERED"
  | "CANCELLED";


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
  status: OrderStatus;
  paid: boolean;
  done: boolean;
  phone: number;
}
