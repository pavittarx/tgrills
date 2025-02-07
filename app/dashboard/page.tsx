"use client";
import { useSupabaseUser } from "../_hooks/useSupUser";
import { AdminLogin } from "../_shared/AdminLogin";
import { OrderDashboard } from "../_shared/DashboardOrders/OrdersTable";

const DashboardPage = () => {
  const { isLoading, isLoggedIn, refetch, logout } = useSupabaseUser();

  if (isLoading) {
    return "Loading...";
  }

  if (!isLoggedIn) {
    return <AdminLogin refetch={refetch} />;
  }

  return <OrderDashboard />;
};

export default DashboardPage;
