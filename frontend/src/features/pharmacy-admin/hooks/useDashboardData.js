import { useState, useEffect } from 'react';

const useDashboardData = () => {
  const [overviewData, setOverviewData] = useState({
    totalOrders: { value: '1,247', change: '+12%' },
    revenue: { value: '$24,580', change: '+8%' },
    activeStaff: { value: 12, new: 2 },
    inventoryItems: { value: 856, lowStock: 23 },
    digitalWallet : { value: 100, description: 'Current Balance' }
  });

  const [salesData, setSalesData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [1500, 1800, 1200, 2500, 2800, 2000, 1700],
  });

  const [orderStatusData, setOrderStatusData] = useState({
    labels: ['Cancelled', 'Pending', 'Completed'],
    values: [10, 30, 60], // Represents percentages or counts
    colors: ['#EF4444', '#F59E0B', '#10B981'], // Tailwind red-500, yellow-500, green-500
  });

  const [recentOrders, setRecentOrders] = useState([
    { id: 'Order #1234', customerName: 'John Smith', amount: '$45.50', status: 'Completed' },
    { id: 'Order #1235', customerName: 'Sarah Johnson', amount: '$32.00', status: 'Pending' },
    { id: 'Order #1236', customerName: 'Michael Brown', amount: '$60.20', status: 'Completed' },
    { id: 'Order #1237', customerName: 'Emily Davis', amount: '$15.75', status: 'Pending' },
  ]);

  const [lowStockAlerts, setLowStockAlerts] = useState([
    { itemName: 'Aspirin 500mg', unitsLeft: 5 },
    { itemName: 'Vitamin C Tablets', unitsLeft: 12 },
    { itemName: 'Paracetamol 250mg', unitsLeft: 8 },
  ]);

  // In a real application, you would fetch this data from an API
  // useEffect(() => {
  //   const fetchData = async () => {
  //     // Simulate API call
  //     const response = await new Promise(resolve => setTimeout(() => {
  //       resolve({
  //         overview: { ... },
  //         sales: { ... },
  //         orderStatus: { ... },
  //         recentOrders: [...],
  //         lowStockAlerts: [...],
  //       });
  //     }, 1000));
  //     setOverviewData(response.overview);
  //     setSalesData(response.sales);
  //     setOrderStatusData(response.orderStatus);
  //     setRecentOrders(response.recentOrders);
  //     setLowStockAlerts(response.lowStockAlerts);
  //   };
  //   fetchData();
  // }, []);

  return {
    overviewData,
    salesData,
    orderStatusData,
    recentOrders,
    lowStockAlerts,
  };
};

export default useDashboardData;