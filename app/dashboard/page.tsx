"use client";
import { useSupUser } from "../_hooks/useSupUser";
import { AdminLogin } from "../_shared/AdminLogin";
import { OrderDashboard } from "../_shared/DashboardOrders/OrdersTable";

const DashboardPage = () => {
  const { isLoading, isLoggedIn, isAdmin, refetch } = useSupUser();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AdminLogin refetch={refetch} />;
  }

  if (!isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <OrderDashboard />;
};

export default DashboardPage;
