import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../../components/Orders/OrderCard';
import OrderFilters from '../../components/Orders/OrderFilters';
import useOrdersData from '../../hooks/useOrderData';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  // ✅ Remove token parameter - it's handled inside the hook
  const {
    filteredOrders,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    refreshOrders,
  } = useOrdersData(); // ✅ No token parameter needed

  useEffect(() => {
    setFadeIn(true);
    
    // ✅ DEBUG: Check localStorage
    console.log('🔍 Checking localStorage for authentication...');
    console.log('token:', localStorage.getItem('token'));
    console.log('authToken:', localStorage.getItem('authToken'));
    console.log('pharmacyAdminToken:', localStorage.getItem('pharmacyAdminToken'));
    console.log('All keys:', Object.keys(localStorage));
  }, []);

  const handleExport = () => {
    console.log('Exporting orders...');
    // TODO: Implement export functionality
  };

  const handleOrderClick = (orderId) => {
    navigate(`/pharmacy-admin/orders/${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Orders</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refreshOrders}
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
    <div className={`container mx-auto px-6 py-8 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">View and manage all pharmacy orders</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <OrderFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateRange={filters.dateRange}
          setDateRange={(value) => updateFilter('dateRange', value)}
          statusFilter={filters.status}
          setStatusFilter={(value) => updateFilter('status', value)}
          typeFilter={filters.paymentMethod}
          setTypeFilter={(value) => updateFilter('paymentMethod', value)}
          onExport={handleExport}
        />
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.pharmacyOrderId}
              order={order}
              onClick={() => handleOrderClick(order.pharmacyOrderId)}
            />
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default OrdersPage;


































// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Download, Package, AlertCircle } from 'lucide-react';
// import OrderFilters from '../../components/Orders/OrderFilters';
// import OrderCard from '../../components/Orders/OrderCard';
// import useOrdersData from '../../hooks/useOrderData';

// const OrdersPage = () => {
//   const navigate = useNavigate();
//   const [fadeIn, setFadeIn] = useState(false);
  
//   // TODO: Get token from your auth context/state
//   // For now, using localStorage (replace with your auth solution)
//   const token = localStorage.getItem('token') || 'your-test-token';
  
//   const {
//     filteredOrders,
//     isLoading,
//     error,
//     searchTerm,
//     setSearchTerm,
//     filters,
//     updateFilter,
//     refreshOrders
//   } = useOrdersData(token); // ✅ Pass token here
  
//   useEffect(() => {
//     setTimeout(() => setFadeIn(true), 300);
//   }, []);
  
//   const handleExport = () => {
//     console.log('Exporting orders...');
//     const csvContent = [
//       ['Order Code', 'Customer', 'Type', 'Status', 'Total', 'Date', 'Payment Method'].join(','),
//       ...filteredOrders.map(order => [
//         order.orderCode || '',
//         order.customerName || '',
//         order.orderType || '',
//         order.status || '',
//         `Rs.${(order.subtotal || 0).toFixed(2)}`,
//         new Date(order.createdAt || order.orderDate).toLocaleString(),
//         order.paymentMethod || ''
//       ].join(','))
//     ].join('\n');
    
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };
  
//   const PageLayout = ({ children, title, subtitle, isLoading, loadingMessage, headerActions }) => {
//     return (
//       <div className="p-6">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
//             {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
//           </div>
//           {headerActions && <div>{headerActions}</div>}
//         </div>
        
//         {isLoading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
//               <p className="text-gray-500">{loadingMessage || 'Loading...'}</p>
//             </div>
//           </div>
//         ) : (
//           children
//         )}
//       </div>
//     );
//   };
  
//   // Error state
//   if (error) {
//     return (
//       <PageLayout title="Order History" subtitle="View and manage orders">
//         <div className="bg-red-50 rounded-xl border border-red-200 p-8 text-center">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Orders</h3>
//           <p className="text-red-600 mb-4">{error}</p>
//           <div className="space-x-2">
//             <button
//               onClick={() => refreshOrders()}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               Retry
//             </button>
//             <button
//               onClick={() => {
//                 console.log('🔍 Debug Info:');
//                 console.log('Token:', token ? 'Present' : 'Missing');
//                 console.log('API URL:', 'http://localhost:8080/api/v1/orders/pharmacy');
//               }}
//               className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//             >
//               Debug Info
//             </button>
//           </div>
//         </div>
//       </PageLayout>
//     );
//   }
  
//   return (
//     <PageLayout
//       title="Order History"
//       subtitle={`${filteredOrders.length} orders found`}
//       isLoading={isLoading}
//       loadingMessage="Loading order history..."
//     >
//       {/* Filters and Search */}
//       <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'} mb-6`}>
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
//           <OrderFilters
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             dateRange={filters.dateRange}
//             setDateRange={(value) => updateFilter('dateRange', value)}
//             orderTypeFilter={filters.orderType}
//             setOrderTypeFilter={(value) => updateFilter('orderType', value)}
//             typeFilter={filters.paymentMethod}
//             setTypeFilter={(value) => updateFilter('paymentMethod', value)}
//             statusFilter={filters.status}
//             setStatusFilter={(value) => updateFilter('status', value)}
//             onExport={handleExport}
//           />
//         </div>
//       </div>
      
//       {/* Orders List */}
//       <div className={`transition-opacity duration-500 delay-100 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
//         {filteredOrders.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
//             <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
//             <p className="text-gray-500">
//               {searchTerm || Object.values(filters).some(f => f !== 'all')
//                 ? 'Try adjusting your filters or search criteria'
//                 : 'No orders available yet'}
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredOrders.map(order => (
//               <OrderCard key={order.pharmacyOrderId || order.id} order={order} />
//             ))}
//           </div>
//         )}
//       </div>
//     </PageLayout>
//   );
// };

// export default OrdersPage;







































// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Download } from 'lucide-react';
// import OrderFilters from '../../components/Orders/OrderFilters';
// import OrderCard from '../../components/Orders/OrderCard';
// import useOrdersData from '../../hooks/useOrderData';

// const OrdersPage = () => {
//   const navigate = useNavigate();
//   const [fadeIn, setFadeIn] = useState(false);
  
//   const {
//     filteredOrders,
//     isLoading,
//     searchTerm,
//     setSearchTerm,
//     filters,
//     updateFilter
//   } = useOrdersData();
  
//   useEffect(() => {
//     setTimeout(() => setFadeIn(true), 300);
//   }, []);
  
//   const handleExport = () => {
//     console.log('Exporting orders...');
//     // Implementation for exporting data
//   };
  
//   // Create a simple layout component for pharmacy admin pages
//   const PageLayout = ({ children, title, subtitle, isLoading, loadingMessage, headerActions }) => {
//     return (
//       <div className="p-6">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
//             {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
//           </div>
//           {headerActions && <div>{headerActions}</div>}
//         </div>
        
//         {isLoading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
//               <p className="text-gray-500">{loadingMessage || 'Loading...'}</p>
//             </div>
//           </div>
//         ) : (
//           children
//         )}
//       </div>
//     );
//   };
  
//   return (
//     <PageLayout
//       title="Order History"
//       subtitle="View and manage past orders"
//       isLoading={isLoading}
//       loadingMessage="Loading order history..."
//     >
//       {/* Filters and Search */}
//       <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'} mb-6`}>
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
//           <OrderFilters
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             dateRange={filters.dateRange}
//             setDateRange={(value) => updateFilter('dateRange', value)}
//             orderTypeFilter={filters.orderType}
//             setOrderTypeFilter={(value) => updateFilter('orderType', value)}
//             typeFilter={filters.paymentMethod}
//             setTypeFilter={(value) => updateFilter('paymentMethod', value)}
//             onExport={handleExport}
//           />
//         </div>
//       </div>
      
//       {/* Orders List */}
//       <div className={`transition-opacity duration-500 delay-100 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
//         {filteredOrders.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
//             <p className="text-gray-500">Try adjusting your filters or search criteria</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredOrders.map(order => (
//               <OrderCard key={order.id} order={order} />
//             ))}
//           </div>
//         )}
//       </div>
//     </PageLayout>
//   );
// };

// export default OrdersPage;


































// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Download } from 'lucide-react';
// import OrderFilters from '../../components/Orders/OrderFilters';
// import OrderCard from '../../components/Orders/OrderCard';
// import useOrdersData from '../../hooks/useOrderData';

// const OrdersPage = () => {
//   const navigate = useNavigate();
//   const [fadeIn, setFadeIn] = useState(false);
  
//   const {
//     filteredOrders,
//     isLoading,
//     searchTerm,
//     setSearchTerm,
//     filters,
//     updateFilter
//   } = useOrdersData();
  
//   useEffect(() => {
//     setTimeout(() => setFadeIn(true), 300);
//   }, []);
  
//   const handleExport = () => {
//     console.log('Exporting orders...');
//     // Implementation for exporting data
//   };
  
//   // Create a simple layout component for pharmacy admin pages
//   const PageLayout = ({ children, title, subtitle, isLoading, loadingMessage, headerActions }) => {
//     return (
//       <div className="p-6">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
//             {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
//           </div>
//           {headerActions && <div>{headerActions}</div>}
//         </div>
        
//         {isLoading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
//               <p className="text-gray-500">{loadingMessage || 'Loading...'}</p>
//             </div>
//           </div>
//         ) : (
//           children
//         )}
//       </div>
//     );
//   };
  
//   return (
//     <PageLayout
//       title="Order History"
//       subtitle="View and manage past orders"
//       isLoading={isLoading}
//       loadingMessage="Loading order history..."

//     >
//       {/* Filters and Search */}
//       <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'} mb-6`}>
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
//           <OrderFilters
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             dateRange={filters.dateRange}
//             setDateRange={(value) => updateFilter('dateRange', value)}
//             orderTypeFilter={filters.orderType}
//             setOrderTypeFilter={(value) => updateFilter('orderType', value)}
//             typeFilter={filters.paymentMethod}
//             setTypeFilter={(value) => updateFilter('paymentMethod', value)}
//             onExport={handleExport}
//           />
//         </div>
//       </div>
      
//       {/* Orders Grid */}
//       <div className={`transition-opacity duration-500 delay-100 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
//         {filteredOrders.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
//             <p className="text-gray-500">Try adjusting your filters or search criteria</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredOrders.map(order => (
//               <OrderCard key={order.id} order={order} />
//             ))}
//           </div>
//         )}
//       </div>
//     </PageLayout>
//   );
// };

// export default OrdersPage;


