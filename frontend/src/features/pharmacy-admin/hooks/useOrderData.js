import { useState, useEffect, useMemo } from 'react';

const useOrdersData = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    dateRange: 'all',
    orderType: 'all',
    paymentMethod: 'all'
  });

  // Generate dummy orders data
  useEffect(() => {
    const generateOrders = () => {
      setIsLoading(true);
      
      // Customer names
      const customers = [
        { name: 'John McCrae', email: 'johnmccrae@email.com', phone: '+1 (555) 123-4567' },
        { name: 'Sarah Johnson', email: 'sarahjohnson@email.com', phone: '+1 (555) 234-5678' },
        { name: 'Michael Chen', email: 'michaelchen@email.com', phone: '+1 (555) 345-6789' },
        { name: 'Emma Wilson', email: 'emmawilson@email.com', phone: '+1 (555) 456-7890' },
        { name: 'David Rodriguez', email: 'davidr@email.com', phone: '+1 (555) 567-8901' },
        { name: 'Linda Kim', email: 'lindakim@email.com', phone: '+1 (555) 678-9012' },
        { name: 'Robert Taylor', email: 'robertt@email.com', phone: '+1 (555) 789-0123' },
        { name: 'Patricia Brown', email: 'patriciab@email.com', phone: '+1 (555) 890-1234' }
      ];
      
      // Prescription medications
      const prescriptionMeds = [
        { id: 'p1', name: 'Amoxicillin 500mg', price: 12.99, category: 'prescription' },
        { id: 'p2', name: 'Lisinopril 10mg', price: 8.50, category: 'prescription' },
        { id: 'p3', name: 'Metformin 1000mg', price: 14.75, category: 'prescription' },
        { id: 'p4', name: 'Atorvastatin 20mg', price: 22.50, category: 'prescription' },
        { id: 'p5', name: 'Levothyroxine 50mcg', price: 10.99, category: 'prescription' },
        { id: 'p6', name: 'Albuterol Inhaler', price: 45.00, category: 'prescription' },
        { id: 'p7', name: 'Sertraline 100mg', price: 15.25, category: 'prescription' }
      ];
      
      // OTC medications
      const otcMeds = [
        { id: 'o1', name: 'Acetaminophen 500mg', price: 7.99, category: 'otc' },
        { id: 'o2', name: 'Ibuprofen 200mg', price: 6.50, category: 'otc' },
        { id: 'o3', name: 'Multivitamin Tablets', price: 15.99, category: 'otc' },
        { id: 'o4', name: 'Allergy Relief', price: 12.75, category: 'otc' },
        { id: 'o5', name: 'Antacid Tablets', price: 8.25, category: 'otc' },
        { id: 'o6', name: 'Cold & Flu Relief', price: 9.99, category: 'otc' },
        { id: 'o7', name: 'Vitamin D3 1000IU', price: 11.50, category: 'otc' },
        { id: 'o8', name: 'Melatonin 5mg', price: 13.99, category: 'otc' }
      ];
      
      // Generate random orders
      const dummyOrders = Array.from({ length: 50 }, (_, index) => {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 90)); // Random date within last 90 days
        
        // Decide if this order includes prescription, OTC, or both
        const hasPrescription = Math.random() > 0.3;
        const hasOTC = Math.random() > 0.3;
        
        let items = [];
        let orderType = 'mixed';
        
        if (hasPrescription && hasOTC) {
          // Add 1-2 prescription items
          const prescriptionCount = Math.floor(Math.random() * 2) + 1;
          for (let i = 0; i < prescriptionCount; i++) {
            const med = prescriptionMeds[Math.floor(Math.random() * prescriptionMeds.length)];
            const quantity = Math.floor(Math.random() * 2) + 1;
            items.push({
              ...med,
              quantity,
              total: +(med.price * quantity).toFixed(2)
            });
          }
          
          // Add 1-3 OTC items
          const otcCount = Math.floor(Math.random() * 3) + 1;
          for (let i = 0; i < otcCount; i++) {
            const med = otcMeds[Math.floor(Math.random() * otcMeds.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            items.push({
              ...med,
              quantity,
              total: +(med.price * quantity).toFixed(2)
            });
          }
        } else if (hasPrescription) {
          // Prescription only
          orderType = 'prescription';
          const prescriptionCount = Math.floor(Math.random() * 3) + 1;
          for (let i = 0; i < prescriptionCount; i++) {
            const med = prescriptionMeds[Math.floor(Math.random() * prescriptionMeds.length)];
            const quantity = Math.floor(Math.random() * 2) + 1;
            items.push({
              ...med,
              quantity,
              total: +(med.price * quantity).toFixed(2)
            });
          }
        } else {
          // OTC only
          orderType = 'otc';
          const otcCount = Math.floor(Math.random() * 5) + 1;
          for (let i = 0; i < otcCount; i++) {
            const med = otcMeds[Math.floor(Math.random() * otcMeds.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            items.push({
              ...med,
              quantity,
              total: +(med.price * quantity).toFixed(2)
            });
          }
        }
        
        // Calculate total
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const tax = +(subtotal * 0.07).toFixed(2); // 7% tax
        const total = +(subtotal + tax).toFixed(2);
        
        // Determine payment method
        const paymentMethod = Math.random() > 0.5 ? 'Credit Card' : 'Cash';
        
        return {
          id: `ORD-${(10000 + index).toString()}`,
          customer,
          orderDate,
          items,
          orderType,
          subtotal,
          tax,
          total,
          paymentMethod,
          status: 'Completed',
          pharmacist: 'Dr. Sarah Johnson'
        };
      });
      
      // Sort by date, newest first
      dummyOrders.sort((a, b) => b.orderDate - a.orderDate);
      
      setOrders(dummyOrders);
      setIsLoading(false);
    };
    
    generateOrders();
  }, []);
  
  // Update filters
  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  // Apply filters and search
  const filteredOrders = useMemo(() => {
    if (!orders.length) return [];
    
    return orders.filter(order => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesCustomer = order.customer.name.toLowerCase().includes(searchLower);
        const matchesId = order.id.toLowerCase().includes(searchLower);
        const matchesItems = order.items.some(item => 
          item.name.toLowerCase().includes(searchLower)
        );
        
        if (!matchesCustomer && !matchesId && !matchesItems) {
          return false;
        }
      }
      
      // Date range filter
      if (filters.dateRange !== 'all') {
        const orderDate = new Date(order.orderDate);
        const today = new Date();
        let daysToCompare = 0;
        
        switch (filters.dateRange) {
          case 'last7days':
            daysToCompare = 7;
            break;
          case 'last30days':
            daysToCompare = 30;
            break;
          case 'last90days':
            daysToCompare = 90;
            break;
          default:
            daysToCompare = 0;
        }
        
        if (daysToCompare > 0) {
          const cutoffDate = new Date();
          cutoffDate.setDate(today.getDate() - daysToCompare);
          if (orderDate < cutoffDate) {
            return false;
          }
        }
      }
      
      // Order type filter
      if (filters.orderType !== 'all' && order.orderType !== filters.orderType) {
        return false;
      }
      
      // Payment method filter
      if (filters.paymentMethod !== 'all') {
        const methodToCheck = filters.paymentMethod === 'credit' ? 'Credit Card' : 'Cash';
        if (order.paymentMethod !== methodToCheck) {
          return false;
        }
      }
      
      return true;
    });
  }, [orders, searchTerm, filters]);
  
  // Get a specific order by ID
  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId) || null;
  };
  
  return {
    orders,
    filteredOrders,
    isLoading,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    getOrderById
  };
};

export default useOrdersData;