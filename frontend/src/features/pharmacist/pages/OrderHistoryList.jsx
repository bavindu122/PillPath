import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Filter, 
  Search, 
  Calendar,
  Eye,
  Printer,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import OrderStatsCards from '../components/OrderStatsCards';
import OrderFilters from '../components/OrderFilters';
import OrderTable from '../components/OrderTable';

const OrderHistoryList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all'); // New filter for prescription/OTC
  const [typeFilter, setTypeFilter] = useState('all'); // Payment method filter
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      loadOrderData();
      setFadeIn(true);
    }, 300);
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchTerm, dateRange, orderTypeFilter, typeFilter]);

  const loadOrderData = () => {
    // Updated mock order data - only finished prescriptions
    const mockOrders = [
      {
        id: 'ORD-2024-001',
        patient: {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          avatar: '/api/placeholder/40/40',
          phone: '+1 (555) 123-4567'
        },
        type: 'Prescription',
        items: 3,
        itemDetails: [
          { name: 'Amoxicillin 500mg', quantity: 21, price: 15.99 },
          { name: 'Ibuprofen 200mg', quantity: 30, price: 8.50 },
          { name: 'Vitamin D3 1000IU', quantity: 60, price: 12.99 }
        ],
        total: 127.50,
        date: '2024-12-28',
        time: '10:30 AM',
        paymentMethod: 'Cash',
        notes: 'Patient allergic to penicillin - verified safe alternative',
        actions: ['view', 'print']
      },
      {
        id: 'ORD-2024-002',
        patient: {
          name: 'Michael Chen',
          email: 'm.chen@email.com',
          avatar: '/api/placeholder/40/40',
          phone: '+1 (555) 234-5678'
        },
        type: 'Prescription',
        items: 4,
        itemDetails: [
          { name: 'Metformin 500mg', quantity: 90, price: 35.00 },
          { name: 'Lisinopril 10mg', quantity: 30, price: 18.80 },
          { name: 'Atorvastatin 20mg', quantity: 30, price: 25.99 },
          { name: 'Aspirin 81mg', quantity: 90, price: 9.46 }
        ],
        total: 89.25,
        date: '2024-12-27',
        time: '02:15 PM',
        paymentMethod: 'Credit Card',
        notes: 'Regular monthly medication refill',
        actions: ['view', 'print']
      },
      {
        id: 'ORD-2024-003',
        patient: {
          name: 'Emma Davis',
          email: 'emma.davis@email.com',
          avatar: '/api/placeholder/40/40',
          phone: '+1 (555) 345-6789'
        },
        type: 'OTC',
        items: 2,
        itemDetails: [
          { name: 'Sertraline 50mg', quantity: 30, price: 45.99 },
          { name: 'Alprazolam 0.5mg', quantity: 15, price: 25.00 }
        ],
        total: 245.80,
        date: '2024-12-26',
        time: '11:45 AM',
        paymentMethod: 'Cash',
        notes: 'Mental health medications - patient counseled',
        actions: ['view', 'print']
      },
      {
        id: 'ORD-2024-004',
        patient: {
          name: 'Robert Wilson',
          email: 'r.wilson@email.com',
          avatar: '/api/placeholder/40/40',
          phone: '+1 (555) 456-7890'
        },
        type: 'Prescription',
        items: 3,
        itemDetails: [
          { name: 'Albuterol Inhaler', quantity: 2, price: 65.00 },
          { name: 'Fluticasone Nasal Spray', quantity: 1, price: 28.99 },
          { name: 'Montelukast 10mg', quantity: 30, price: 42.50 }
        ],
        total: 156.30,
        date: '2024-12-25',
        time: '09:20 AM',
        paymentMethod: 'Credit Card',
        notes: 'Asthma medications - inhaler technique demonstrated',
        actions: ['view', 'print']
      },
      {
        id: 'ORD-2024-005',
        patient: {
          name: 'Lisa Thompson',
          email: 'l.thompson@email.com',
          avatar: '/api/placeholder/40/40',
          phone: '+1 (555) 567-8901'
        },
        type: 'Prescription',
        items: 1,
        itemDetails: [
          { name: 'Insulin Glargine (Lantus)', quantity: 3, price: 203.45 }
        ],
        total: 203.45,
        date: '2024-12-24',
        time: '03:30 PM',
        paymentMethod: 'Cash',
        notes: 'Diabetes medication - refrigeration required',
        actions: ['view', 'print']
      },
      {
        id: 'ORD-2024-006',
        patient: {
          name: 'David Martinez',
          email: 'd.martinez@email.com',
          avatar: '/api/placeholder/40/40',
          phone: '+1 (555) 678-9012'
        },
        type: 'Prescription',
        items: 2,
        itemDetails: [
          { name: 'Warfarin 5mg', quantity: 30, price: 28.99 },
          { name: 'Furosemide 40mg', quantity: 30, price: 15.99 }
        ],
        total: 285.00,
        date: '2024-12-23',
        time: '01:00 PM',
        paymentMethod: 'Credit Card',
        notes: 'Cardiovascular medications - follow-up required',
        actions: ['view', 'print']
      },
      {
        id: 'ORD-2024-007',
        patient: {
          name: 'Jennifer Lee',
          email: 'j.lee@email.com',
          avatar: '/api/placeholder/40/40',
          phone: '+1 (555) 789-0123'
        },
        type: 'Prescription',
        items: 3,
        itemDetails: [
          { name: 'Levothyroxine 100mcg', quantity: 90, price: 24.99 },
          { name: 'Omeprazole 20mg', quantity: 30, price: 19.99 },
          { name: 'Vitamin B12', quantity: 60, price: 15.99 }
        ],
        total: 117.94,
        date: '2024-12-22',
        time: '04:45 PM',
        paymentMethod: 'Cash',
        notes: 'Thyroid medication - take on empty stomach',
        actions: ['view', 'print']
      },
      {
        id: 'ORD-2024-008',
        patient: {
          name: 'Thomas Brown',
          email: 't.brown@email.com',
          avatar: '/api/placeholder/40/40',
          phone: '+1 (555) 890-1234'
        },
        type: 'Prescription',
        items: 2,
        itemDetails: [
          { name: 'Hydrocodone/Acetaminophen', quantity: 20, price: 45.99 },
          { name: 'Ibuprofen 600mg', quantity: 30, price: 12.50 }
        ],
        total: 161.47,
        date: '2024-12-21',
        time: '10:15 AM',
        paymentMethod: 'Credit Card',
        notes: 'Pain management - controlled substance dispensed',
        actions: ['view', 'print']
      },
      {
        id: 'ORD-2024-009',
        patient: {
          name: 'Maria Rodriguez',
          email: 'm.rodriguez@email.com',
          avatar: '/api/placeholder/40/40',
          phone: '+1 (555) 901-2345'
        },
        type: 'Prescription',
        items: 4,
        itemDetails: [
          { name: 'Amlodipine 10mg', quantity: 30, price: 15.99 },
          { name: 'Metoprolol 25mg', quantity: 60, price: 18.99 },
          { name: 'Hydrochlorothiazide 25mg', quantity: 30, price: 8.99 },
          { name: 'Potassium Chloride', quantity: 30, price: 22.99 }
        ],
        total: 98.91,
        date: '2024-12-20',
        time: '12:30 PM',
        paymentMethod: 'Cash',
        notes: 'Hypertension management - multiple medications',
        actions: ['view', 'print']
      },
      {
        id: 'ORD-2024-010',
        patient: {
          name: 'James Wilson',
          email: 'j.wilson@email.com',
          avatar: '/api/placeholder/40/40',
          phone: '+1 (555) 012-3456'
        },
        type: 'Prescription',
        items: 1,
        itemDetails: [
          { name: 'Prednisone 20mg', quantity: 21, price: 67.48 }
        ],
        total: 67.48,
        date: '2024-12-19',
        time: '08:45 AM',
        paymentMethod: 'Credit Card',
        notes: 'Short-term steroid therapy - taper schedule provided',
        actions: ['view', 'print']
      }
    ];

    setOrders(mockOrders);
    setIsLoading(false);
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.patient.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply order type filter (Prescription/OTC)
    if (orderTypeFilter !== 'all') {
      filtered = filtered.filter(order => 
        order.type.toLowerCase() === orderTypeFilter.toLowerCase()
      );
    }

    // Apply payment method filter
    if (typeFilter !== 'all') {
      if (typeFilter === 'cash') {
        filtered = filtered.filter(order => order.paymentMethod === 'Cash');
      } else if (typeFilter === 'credit') {
        filtered = filtered.filter(order => order.paymentMethod === 'Credit Card');
      }
    }

    // Apply date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      if (dateRange === 'last7days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        filtered = filtered.filter(order => new Date(order.date) >= sevenDaysAgo);
      } else if (dateRange === 'last30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        filtered = filtered.filter(order => new Date(order.date) >= thirtyDaysAgo);
      } else if (dateRange === 'last90days') {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(now.getDate() - 90);
        filtered = filtered.filter(order => new Date(order.date) >= ninetyDaysAgo);
      }
    }

    setFilteredOrders(filtered);
  };

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
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Count payment methods
    const cashOrders = orders.filter(order => order.paymentMethod === 'Cash').length;
    const creditOrders = orders.filter(order => order.paymentMethod === 'Credit Card').length;

    return [
      { 
        title: "Total Orders", 
        value: totalOrders.toString(), 
        subtitle: `All processed prescriptions`, 
        color: "blue" 
      },
      { 
        title: "Total Revenue", 
        value: `$${totalRevenue.toFixed(0)}`, 
        subtitle: `Average: $${averageOrderValue.toFixed(2)}`, 
        color: "green" 
      },
      { 
        title: "Cash Payments", 
        value: cashOrders.toString(), 
        subtitle: `${((cashOrders/totalOrders)*100).toFixed(1)}% of orders`, 
        color: "orange" 
      },
      { 
        title: "Card Payments", 
        value: creditOrders.toString(), 
        subtitle: `${((creditOrders/totalOrders)*100).toFixed(1)}% of orders`, 
        color: "purple" 
      }
    ];
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Sidebar during loading */}
        <div className="sidebar-slide-in">
          <Sidebar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full loading-dot-1"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full loading-dot-2"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full loading-dot-3"></div>
              </div>
            </div>
            <p className="text-gray-600 font-medium animate-pulse">Loading order history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Sidebar with active state management */}
      <div className="sidebar-slide-in">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="dashboard-fade-in-1 flex-shrink-0">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Back button and Page Title */}
          <div className="dashboard-fade-in-1 mb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate('/pharmacist/dashboard')}
                className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50 px-4 py-2 rounded-lg group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
                <p className="text-gray-600 mt-1">Track and manage all your processed prescriptions</p>
              </div>
              
              <div className="w-32"></div> {/* Spacer for centering */}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="dashboard-fade-in-2 mb-6">
            <OrderStatsCards stats={getStatsData()} />
          </div>

          {/* Filters and Search */}
          <div className="dashboard-fade-in-3 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover p-6">
              <OrderFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                dateRange={dateRange}
                setDateRange={setDateRange}
                orderTypeFilter={orderTypeFilter}
                setOrderTypeFilter={setOrderTypeFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                onExport={handleExport}
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="dashboard-fade-in-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover">
              <OrderTable
                orders={filteredOrders}
                onViewOrder={handleViewOrder}
                onPrintOrder={handlePrintOrder}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderHistoryList;