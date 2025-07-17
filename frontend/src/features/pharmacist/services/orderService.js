// Mock data service for orders
export const orderService = {
  async loadOrders() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
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
        date: '2025-07-10',
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
        date: '2025-06-27',
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
      }
    ];
  },

  // Filter configurations for orders
  getFilterConfig() {
    return {
      defaultSort: 'date',
      searchFields: ['patient.name', 'patient.email', 'id'],
      customFilters: {
        dateRange: (item, value) => {
          if (value === 'all') return true;
          
          const itemDate = new Date(item.date);
          const today = new Date();
          
          switch (value) {
            case 'last7days':
              const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
              return itemDate >= weekAgo;
            case 'last30days':
              const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
              return itemDate >= monthAgo;
            case 'last90days':
              const threeMonthsAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
              return itemDate >= threeMonthsAgo;
            default:
              return true;
          }
        },
        orderType: (item, value) => {
          if (value === 'all') return true;
          return item.type.toLowerCase() === value.toLowerCase();
        },
        paymentMethod: (item, value) => {
          if (value === 'all') return true;
          if (value === 'cash') return item.paymentMethod.toLowerCase() === 'cash';
          if (value === 'credit') return item.paymentMethod.toLowerCase().includes('credit');
          return item.paymentMethod.toLowerCase() === value.toLowerCase();
        }
      },
      sortFunctions: {
        date: (a, b) => new Date(b.date) - new Date(a.date),
        patient: (a, b) => a.patient.name.localeCompare(b.patient.name),
        total: (a, b) => b.total - a.total,
        type: (a, b) => a.type.localeCompare(b.type)
      }
    };
  }
};
