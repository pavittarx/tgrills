"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreateOrderModal } from '@/app/_shared/DashboardOrders/CreateOrderModal';
import { AdminLogin } from "../_shared/AdminLogin";
import { useSupUser } from "../_hooks/useSupUser";
import { OrderDashboard as OrdersTable } from "../_shared/DashboardOrders/OrdersTable";

const DashboardPage = () => {
  const { isLoading, isLoggedIn, isAdmin, refetch } = useSupUser();
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={() => setIsCreateOrderModalOpen(true)}>
          Create New Order
        </Button>
      </div>

      <OrdersTable />

      <CreateOrderModal 
        isOpen={isCreateOrderModalOpen} 
        onClose={() => setIsCreateOrderModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
