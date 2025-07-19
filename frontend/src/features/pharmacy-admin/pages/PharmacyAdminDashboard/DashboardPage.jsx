import React from 'react';
import DashboardOverview from '../../components/PerformanceMetrics/DashboardOverview';
import SalesTrendChart from '../../components/PerformanceMetrics/SalesTrendChart';
import OrderStatusChart from '../../components/PerformanceMetrics/OrderStatusChart';
import QuickActions from '../../components/PerformanceMetrics/QuickActions';
import RecentOrders from '../../components/PerformanceMetrics/RecentOrders';
import LowStockAlerts from '../../components/PerformanceMetrics/LowStockAlerts';
import useDashboardData from '../../hooks/useDashboardData';
// import { useDashboardData } from "../../hooks/useDashboardData";

const DashboardPage = () => {
  const { overviewData, salesData, orderStatusData, recentOrders, lowStockAlerts } = useDashboardData();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Dashboard Overview</h1>

      <DashboardOverview data={overviewData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2">
        <SalesTrendChart data={salesData} />
        <OrderStatusChart data={orderStatusData} />
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={recentOrders} />
        <LowStockAlerts alerts={lowStockAlerts} />
      </div>
    </div>
  );
};

export default DashboardPage;