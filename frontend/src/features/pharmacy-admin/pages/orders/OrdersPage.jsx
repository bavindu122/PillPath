import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import OrderFilters from '../../components/Orders/OrderFilters';
import OrderCard from '../../components/Orders/OrderCard';
import useOrdersData from '../../hooks/useOrderData';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  
  const {
    filteredOrders,
    isLoading,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter
  } = useOrdersData();
  
  useEffect(() => {
    setTimeout(() => setFadeIn(true), 300);
  }, []);
  
  const handleExport = () => {
    console.log('Exporting orders...');
    // Implementation for exporting data
  };
  
  // Create a simple layout component for pharmacy admin pages
  const PageLayout = ({ children, title, subtitle, isLoading, loadingMessage, headerActions }) => {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
              <p className="text-gray-500">{loadingMessage || 'Loading...'}</p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    );
  };
  
  return (
    <PageLayout
      title="Order History"
      subtitle="View and manage past orders"
      isLoading={isLoading}
      loadingMessage="Loading order history..."
    >
      {/* Filters and Search */}
      <div className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'} mb-6`}>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <OrderFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateRange={filters.dateRange}
            setDateRange={(value) => updateFilter('dateRange', value)}
            orderTypeFilter={filters.orderType}
            setOrderTypeFilter={(value) => updateFilter('orderType', value)}
            typeFilter={filters.paymentMethod}
            setTypeFilter={(value) => updateFilter('paymentMethod', value)}
            onExport={handleExport}
          />
        </div>
      </div>
      
      {/* Orders List */}
      <div className={`transition-opacity duration-500 delay-100 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default OrdersPage;


































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


