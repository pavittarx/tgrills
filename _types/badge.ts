export type BadgeVariant = "pending" | "approved" | "prepairing" | "way" | "out" | "delivered" | "cancelled";

export type OrderStatus = Uppercase<BadgeVariant>;
