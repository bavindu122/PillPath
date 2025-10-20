// import React from 'react';
// import DashboardOverview from '../../components/PerformanceMetrics/DashboardOverview';
// import QuickActions from '../../components/PerformanceMetrics/QuickActions';
// import RecentOrders from '../../components/PerformanceMetrics/RecentOrders';
// import LowStockAlerts from '../../components/PerformanceMetrics/LowStockAlerts';
// import useDashboardData from '../../hooks/useDashboardData';

// const DashboardPage = () => {
//   const pharmacyId = 1;

//   const { dashboardData, isLoading, error, refreshDashboard } = useDashboardData(pharmacyId);

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-center max-w-md">
//           <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//             <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
//             <p className="text-red-600 mb-4">{error}</p>
//             <button
//               onClick={refreshDashboard}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-semibold mb-6">Dashboard Overview</h1>

//       <DashboardOverview data={dashboardData} isLoading={isLoading} />

//       <QuickActions />

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//         <RecentOrders />
//         <LowStockAlerts pharmacyId={pharmacyId} />
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;































import React from 'react';
import DashboardOverview from '../../components/PerformanceMetrics/DashboardOverview';
import QuickActions from '../../components/PerformanceMetrics/QuickActions';
import RecentOrders from '../../components/PerformanceMetrics/RecentOrders';
import LowStockAlerts from '../../components/PerformanceMetrics/LowStockAlerts';
import useDashboardData from '../../hooks/useDashboardData';

const DashboardPage = () => {
  const pharmacyId = 1; // This should eventually come from auth context

  // Fetch real dashboard data from backend
  const { dashboardData, isLoading, error, refreshDashboard } = useDashboardData(pharmacyId);

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refreshDashboard}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Dashboard Overview</h1>

      {/* Pass real data and loading state to DashboardOverview */}
      <DashboardOverview data={dashboardData} isLoading={isLoading} />

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* TODO: Update to use real recent orders data when available */}
        <RecentOrders orders={dashboardData?.recentOrders} />
        
        {/* Keep existing LowStockAlerts - working with real backend data */}
        <LowStockAlerts pharmacyId={pharmacyId} />
      </div>
    </div>
  );
};

export default DashboardPage;





























// import React from 'react';
// import DashboardOverview from '../../components/PerformanceMetrics/DashboardOverview';
// import SalesTrendChart from '../../components/PerformanceMetrics/SalesTrendChart';
// import OrderStatusChart from '../../components/PerformanceMetrics/OrderStatusChart';
// import QuickActions from '../../components/PerformanceMetrics/QuickActions';
// import RecentOrders from '../../components/PerformanceMetrics/RecentOrders';
// import LowStockAlerts from '../../components/PerformanceMetrics/LowStockAlerts';
// import useDashboardData from '../../hooks/useDashboardData';
// // import { useDashboardData } from "../../hooks/useDashboardData";

// const DashboardPage = () => {
//   const { overviewData, salesData, orderStatusData, recentOrders, lowStockAlerts } = useDashboardData();

//    const pharmacyId = 1;

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-semibold mb-6">Dashboard Overview</h1>

//       <DashboardOverview data={overviewData} />

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2">
//         <SalesTrendChart data={salesData} />
//         <OrderStatusChart data={orderStatusData} />
//       </div>

//       <QuickActions />

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <RecentOrders orders={recentOrders} />
//         {/* <LowStockAlerts alerts={lowStockAlerts} /> */}
//         <LowStockAlerts pharmacyId={pharmacyId} />
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;