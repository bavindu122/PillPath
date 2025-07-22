import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Filter, 
  Search, 
  Calendar,
  Eye,
  Printer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './index-pharmacist.css';
import PharmaPageLayout from '../components/PharmaPageLayout';
import useListData from '../hooks/useListData';
import { orderService } from '../services/orderService';
import OrderStatsCards from '../components/OrderStatsCards';
import OrderFilters from '../components/OrderFilters';
import OrderTable from '../components/OrderTable';

const OrderHistoryList = () => {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  // Use the new list data hook with order service
  const {
    filteredData: filteredOrders,
    isLoading,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    sortBy,
    setSortBy,
    updateData,
    filteredCount
  } = useListData(
    orderService.loadOrders,
    orderService.getFilterConfig()
  );

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 300);
  }, []);

  const handleExport = () => {
    console.log('Exporting orders...');
  };

  const handleViewOrder = (orderId) => {
    console.log('Viewing order:', orderId);
  };

  const handlePrintOrder = (orderId) => {
    console.log('Printing order:', orderId);
  };

  const getStatsData = () => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Count payment methods
    const cashOrders = filteredOrders.filter(order => order.paymentMethod === 'Cash').length;
    const creditOrders = filteredOrders.filter(order => order.paymentMethod === 'Credit Card').length;

    return [
      { 
        title: "Total Orders", 
        value: totalOrders.toString(), 
        subtitle: `All processed prescriptions`, 
        color: "blue" 
      },
      { 
        title: "Total Revenue", 
        value: `Rs.${totalRevenue.toFixed(0)}/=`, 
        subtitle: `Average: Rs.${averageOrderValue.toFixed(2)}`, 
        color: "green" 
      },
      { 
        title: "Cash Payments", 
        value: cashOrders.toString(), 
        subtitle: `${totalOrders > 0 ? ((cashOrders/totalOrders)*100).toFixed(1) : 0}% of orders`, 
        color: "orange" 
      },
      { 
        title: "Card Payments", 
        value: creditOrders.toString(), 
        subtitle: `${totalOrders > 0 ? ((creditOrders/totalOrders)*100).toFixed(1) : 0}% of orders`, 
        color: "purple" 
      }
    ];
  };

  return (
    <PharmaPageLayout
      title="Order History"
      subtitle="View and manage completed orders"
      isLoading={isLoading}
      loadingMessage="Loading order history..."
      showBackButton={false}
      headerActions={
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Download className="h-4 w-4" />
          <span className="font-medium">Export</span>
        </button>
      }
    >
      {/* Stats Cards */}
      <div className="dashboard-fade-in-2 mb-4 sm:mb-6">
        <OrderStatsCards stats={getStatsData()} />
      </div>

      {/* Filters and Search */}
      <div className="dashboard-fade-in-3 mb-4 sm:mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover p-4 sm:p-6">
          <OrderFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateRange={filters.dateRange || 'all'}
            setDateRange={(value) => updateFilter('dateRange', value)}
            orderTypeFilter={filters.orderType || 'all'}
            setOrderTypeFilter={(value) => updateFilter('orderType', value)}
            typeFilter={filters.paymentMethod || 'all'}
            setTypeFilter={(value) => updateFilter('paymentMethod', value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="dashboard-fade-in-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover overflow-hidden">
          <div className="overflow-x-auto">
            <OrderTable
              orders={filteredOrders}
              onViewOrder={handleViewOrder}
              onPrintOrder={handlePrintOrder}
            />
          </div>
        </div>
      </div>
    </PharmaPageLayout>
  );
};

export default OrderHistoryList;