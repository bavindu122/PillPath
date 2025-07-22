import { useState, useMemo } from 'react';

export const useSalesData = () => {
  // Dummy sales data
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Generate dummy daily sales data for the past 30 days
  const generateDailySalesData = () => {
    const data = [];
    const categories = ['Prescription', 'OTC Medication'];

    // Current date
    const now = new Date();

    // Generate sales for last 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);

      const dayData = {
        date: date.toISOString().split('T')[0],
        totalSales: 0,
        totalOrders: 0,
        totalCashSales: 0, // New: Track cash sales
        totalCardSales: 0, // New: Track card sales
        categories: {}
      };

      // Generate random sales for each product category
      categories.forEach(category => {
        const sales = Math.floor(Math.random() * 2000) + 500;
        const orders = Math.floor(Math.random() * 20) + 5;

        // Randomly distribute sales between cash and card
        const cashSales = Math.floor(sales * (Math.random() * 0.4 + 0.3)); // 30-70% cash
        const cardSales = sales - cashSales;

        dayData.categories[category] = {
          sales,
          orders,
          cashSales,
          cardSales
        };

        dayData.totalSales += sales;
        dayData.totalOrders += orders;
        dayData.totalCashSales += cashSales;
        dayData.totalCardSales += cardSales;
      });

      data.push(dayData);
    }

    return data;
  };

  // Generate dummy monthly data for the past 12 months
  const generateMonthlySalesData = () => {
    const data = [];
    const categories = ['Prescription', 'OTC Medication'];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - i);

      const monthData = {
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        totalSales: 0,
        totalOrders: 0,
        totalCashSales: 0, // New: Track cash sales
        totalCardSales: 0, // New: Track card sales
        categories: {}
      };

      categories.forEach(category => {
        const sales = Math.floor(Math.random() * 50000) + 10000;
        const orders = Math.floor(Math.random() * 500) + 100;

        const cashSales = Math.floor(sales * (Math.random() * 0.4 + 0.3));
        const cardSales = sales - cashSales;

        monthData.categories[category] = {
          sales,
          orders,
          cashSales,
          cardSales
        };

        monthData.totalSales += sales;
        monthData.totalOrders += orders;
        monthData.totalCashSales += cashSales;
        monthData.totalCardSales += cardSales;
      });

      data.push(monthData);
    }

    return data;
  };

  // Top selling products data (updated to remove medical devices)
  const topSellingProducts = [
    { id: 1, name: 'Paracetamol 500mg', category: 'OTC Medication', sales: 24750, units: 1650, growth: 12 },
    { id: 3, name: 'Multivitamin Tablets', category: 'Health Supplements', sales: 15900, units: 530, growth: 15 },
    { id: 4, name: 'Antibiotic - Amoxicillin', category: 'Prescription', sales: 14250, units: 285, growth: -3 },
    { id: 6, name: 'Vitamin D3 Supplements', category: 'Health Supplements', sales: 10500, units: 700, growth: 20 },
    { id: 7, name: 'Aspirin 100mg', category: 'OTC Medication', sales: 8700, units: 870, growth: -1 },
    { id: 8, name: 'Insulin', category: 'Prescription', sales: 7950, units: 159, growth: 4 },
  ];

  // Sales by product category summary (retained for breakdown if needed elsewhere, but CategoryBreakdown will use payment distribution)
  const salesByCategory = [
    { category: 'Prescription', sales: 156000, percentage: 58, orders: 3120, growth: 7 }, // Adjusted percentages
    { category: 'OTC Medication', sales: 112000, percentage: 42, orders: 5600, growth: 12 }, // Adjusted percentages
  ];

  // Customer demographics (remains the same)
  const customerDemographics = {
    ageGroups: [
      { group: '18-24', percentage: 12 },
      { group: '25-34', percentage: 24 },
      { group: '35-44', percentage: 28 },
      { group: '45-54', percentage: 20 },
      { group: '55+', percentage: 16 }
    ],
    gender: [
      { type: 'Male', percentage: 45 },
      { type: 'Female', percentage: 55 }
    ],
    loyaltyStatus: [
      { status: 'New', percentage: 30 },
      { status: 'Returning', percentage: 40 },
      { status: 'Loyal', percentage: 30 }
    ]
  };

  // Sales summary metrics
  const salesSummary = useMemo(() => {
    const dailyData = generateDailySalesData();
    const monthlyData = generateMonthlySalesData();

    let periodSales = 0;
    let periodOrders = 0;
    let periodCashSales = 0; // New
    let periodCardSales = 0; // New
    let previousPeriodSales = 0;
    let previousPeriodOrders = 0;
    let previousPeriodCashSales = 0; // New
    let previousPeriodCardSales = 0; // New

    if (timeRange === 'month') {
      for (let i = dailyData.length - 30; i < dailyData.length; i++) {
        periodSales += dailyData[i].totalSales;
        periodOrders += dailyData[i].totalOrders;
        periodCashSales += dailyData[i].totalCashSales;
        periodCardSales += dailyData[i].totalCardSales;
      }
      for (let i = dailyData.length - 60; i < dailyData.length - 30; i++) {
        if (i >= 0) {
          previousPeriodSales += dailyData[i].totalSales;
          previousPeriodOrders += dailyData[i].totalOrders;
          previousPeriodCashSales += dailyData[i].totalCashSales;
          previousPeriodCardSales += dailyData[i].totalCardSales;
        }
      }
    } else if (timeRange === 'week') {
      for (let i = dailyData.length - 7; i < dailyData.length; i++) {
        periodSales += dailyData[i].totalSales;
        periodOrders += dailyData[i].totalOrders;
        periodCashSales += dailyData[i].totalCashSales;
        periodCardSales += dailyData[i].totalCardSales;
      }
      for (let i = dailyData.length - 14; i < dailyData.length - 7; i++) {
        previousPeriodSales += dailyData[i].totalSales;
        previousPeriodOrders += dailyData[i].totalOrders;
        previousPeriodCashSales += dailyData[i].totalCashSales;
        previousPeriodCardSales += dailyData[i].totalCardSales;
      }
    } else if (timeRange === 'year') {
      for (let i = 0; i < monthlyData.length; i++) {
        periodSales += monthlyData[i].totalSales;
        periodCashSales += monthlyData[i].totalCashSales;
        periodCardSales += monthlyData[i].totalCardSales;
      }
      previousPeriodSales = periodSales * 0.92;
      previousPeriodCashSales = periodCashSales * 0.9; // Example growth
      previousPeriodCardSales = periodCardSales * 0.95; // Example growth
    }

    const salesGrowth = previousPeriodSales === 0 ? 0 : ((periodSales - previousPeriodSales) / previousPeriodSales) * 100;
    const ordersGrowth = previousPeriodOrders === 0 ? 0 : ((periodOrders - previousPeriodOrders) / previousPeriodOrders) * 100;

    const totalPayments = periodCashSales + periodCardSales;
    const cashPaymentPercentage = totalPayments === 0 ? 0 : (periodCashSales / totalPayments) * 100;
    const cardPaymentPercentage = totalPayments === 0 ? 0 : (periodCardSales / totalPayments) * 100;

    return {
      totalSales: periodSales,
      totalOrders: periodOrders,
      averageOrderValue: periodOrders === 0 ? 0 : periodSales / periodOrders,
      salesGrowth: salesGrowth.toFixed(1),
      ordersGrowth: ordersGrowth.toFixed(1),
      conversionRate: 67.5,
      cashPaymentPercentage: cashPaymentPercentage.toFixed(1), // New
      cardPaymentPercentage: cardPaymentPercentage.toFixed(1) // New
    };
  }, [timeRange]);

  // Payment distribution data for the CategoryBreakdown component
  const paymentDistribution = useMemo(() => {
    let currentPeriodTotalCashSales = 0;
    let currentPeriodTotalCardSales = 0;

    if (timeRange === 'month' || timeRange === 'week') {
      const dailyData = generateDailySalesData();
      const startIndex = timeRange === 'week' ? dailyData.length - 7 : dailyData.length - 30;
      dailyData.slice(startIndex).forEach(day => {
        currentPeriodTotalCashSales += day.totalCashSales;
        currentPeriodTotalCardSales += day.totalCardSales;
      });
    } else { // timeRange === 'year'
      const monthlyData = generateMonthlySalesData();
      monthlyData.forEach(month => {
        currentPeriodTotalCashSales += month.totalCashSales;
        currentPeriodTotalCardSales += month.totalCardSales;
      });
    }

    const totalPayments = currentPeriodTotalCashSales + currentPeriodTotalCardSales;

    return [
      { category: 'Cash Payments', sales: currentPeriodTotalCashSales, percentage: totalPayments === 0 ? 0 : (currentPeriodTotalCashSales / totalPayments) * 100, orders: 0, growth: (Math.random() * 10 - 2).toFixed(1) },
      { category: 'Card Payments', sales: currentPeriodTotalCardSales, percentage: totalPayments === 0 ? 0 : (currentPeriodTotalCardSales / totalPayments) * 100, orders: 0, growth: (Math.random() * 10 - 2).toFixed(1) },
    ];
  }, [timeRange]);


  // Get chart data based on time range and filters
  const chartData = useMemo(() => {
    if (timeRange === 'month' || timeRange === 'week') {
      const dailyData = generateDailySalesData();
      const startIndex = timeRange === 'week' ? dailyData.length - 7 : dailyData.length - 30;

      const currentPeriodData = dailyData.slice(startIndex).map(day => ({
        date: day.date,
        sales: selectedCategory === 'all' ? day.totalSales : day.categories[selectedCategory]?.sales || 0
      }));

      // For comparison, get data from the previous period
      let previousPeriodData = [];
      if (comparisonEnabled) {
        const previousStartIndex = timeRange === 'week' ? dailyData.length - 14 : dailyData.length - 60;
        const previousEndIndex = timeRange === 'week' ? dailyData.length - 7 : dailyData.length - 30;
        previousPeriodData = dailyData.slice(previousStartIndex, previousEndIndex).map(day => ({
          date: day.date, // Note: The date here will be for the previous period
          previousSales: selectedCategory === 'all' ? day.totalSales : day.categories[selectedCategory]?.sales || 0
        }));
      }

      // Merge current and previous data if comparison is enabled
      return currentPeriodData.map((currentDay, index) => {
        const mergedData = { ...currentDay };
        if (comparisonEnabled && previousPeriodData[index]) {
          mergedData.previousSales = previousPeriodData[index].previousSales;
        }
        return mergedData;
      });

    } else { // timeRange === 'year'
      const monthlyData = generateMonthlySalesData();
      const currentPeriodData = monthlyData.map(month => ({
        date: month.date,
        sales: selectedCategory === 'all' ? month.totalSales : month.categories[selectedCategory]?.sales || 0
      }));

      let previousPeriodData = [];
      if (comparisonEnabled) {
        // For 'year' comparison, we'll simulate a previous year's data
        // For simplicity, we'll just scale down current year's sales.
        // In a real application, you'd fetch actual previous year's data.
        previousPeriodData = monthlyData.map(month => ({
          date: month.date, // Date represents month/year, so same for comparison
          previousSales: (selectedCategory === 'all' ? month.totalSales : month.categories[selectedCategory]?.sales || 0) * 0.9 // 10% less than current year for "previous"
        }));
      }

      // Merge current and previous data
      return currentPeriodData.map((currentMonth, index) => {
        const mergedData = { ...currentMonth };
        if (comparisonEnabled && previousPeriodData[index]) {
          mergedData.previousSales = previousPeriodData[index].previousSales;
        }
        return mergedData;
      });
    }
  }, [timeRange, selectedCategory, comparisonEnabled]);


  return {
    salesSummary,
    chartData,
    timeRange,
    setTimeRange,
    comparisonEnabled,
    setComparisonEnabled,
    selectedCategory,
    setSelectedCategory,
    topSellingProducts,
    salesByCategory, // Still available if needed for other product-specific analytics
    paymentDistribution, // New: for payment type breakdown
    customerDemographics,
    categories: ['all', 'Prescription', 'OTC Medication'] // Updated categories
  };
};

export default useSalesData;




























// import { useState, useMemo } from 'react';

// export const useSalesData = () => {
//   // Dummy sales data
//   const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
//   const [comparisonEnabled, setComparisonEnabled] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('all');

//   // Generate dummy daily sales data for the past 30 days
//   const generateDailySalesData = () => {
//     const data = [];
//     const categories = ['Prescription', 'OTC Medication', 'Health Supplements', 'Medical Devices'];
    
//     // Current date
//     const now = new Date();
    
//     // Generate sales for last 30 days
//     for (let i = 30; i >= 0; i--) {
//       const date = new Date(now);
//       date.setDate(now.getDate() - i);
      
//       const dayData = {
//         date: date.toISOString().split('T')[0],
//         totalSales: 0,
//         totalOrders: 0,
//         categories: {}
//       };
      
//       // Generate random sales for each category
//       categories.forEach(category => {
//         const sales = Math.floor(Math.random() * 2000) + 500;
//         const orders = Math.floor(Math.random() * 20) + 5;
        
//         dayData.categories[category] = {
//           sales,
//           orders
//         };
        
//         dayData.totalSales += sales;
//         dayData.totalOrders += orders;
//       });
      
//       data.push(dayData);
//     }
    
//     return data;
//   };

//   // Generate dummy monthly data for the past 12 months
//   const generateMonthlySalesData = () => {
//     const data = [];
//     const categories = ['Prescription', 'OTC Medication', 'Health Supplements', 'Medical Devices'];
//     const now = new Date();
    
//     for (let i = 11; i >= 0; i--) {
//       const date = new Date(now);
//       date.setMonth(now.getMonth() - i);
      
//       const monthData = {
//         date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
//         totalSales: 0,
//         totalOrders: 0,
//         categories: {}
//       };
      
//       categories.forEach(category => {
//         const sales = Math.floor(Math.random() * 50000) + 10000;
//         const orders = Math.floor(Math.random() * 500) + 100;
        
//         monthData.categories[category] = {
//           sales,
//           orders
//         };
        
//         monthData.totalSales += sales;
//         monthData.totalOrders += orders;
//       });
      
//       data.push(monthData);
//     }
    
//     return data;
//   };

//   // Top selling products data
//   const topSellingProducts = [
//     { id: 1, name: 'Paracetamol 500mg', category: 'OTC Medication', sales: 24750, units: 1650, growth: 12 },
//     { id: 2, name: 'Blood Pressure Monitor', category: 'Medical Devices', sales: 18600, units: 124, growth: 8 },
//     { id: 3, name: 'Multivitamin Tablets', category: 'Health Supplements', sales: 15900, units: 530, growth: 15 },
//     { id: 4, name: 'Antibiotic - Amoxicillin', category: 'Prescription', sales: 14250, units: 285, growth: -3 },
//     { id: 5, name: 'Diabetic Test Strips', category: 'Medical Devices', sales: 13200, units: 440, growth: 5 },
//     { id: 6, name: 'Vitamin D3 Supplements', category: 'Health Supplements', sales: 10500, units: 700, growth: 20 },
//     { id: 7, name: 'Aspirin 100mg', category: 'OTC Medication', sales: 8700, units: 870, growth: -1 },
//     { id: 8, name: 'Insulin', category: 'Prescription', sales: 7950, units: 159, growth: 4 },
//   ];

//   // Sales by category summary
//   const salesByCategory = [
//     { category: 'Prescription', sales: 156000, percentage: 35, orders: 3120, growth: 7 },
//     { category: 'OTC Medication', sales: 112000, percentage: 25, orders: 5600, growth: 12 },
//     { category: 'Health Supplements', sales: 89000, percentage: 20, orders: 2225, growth: 18 },
//     { category: 'Medical Devices', sales: 89000, percentage: 20, orders: 890, growth: 5 },
//   ];

//   // Customer demographics
//   const customerDemographics = {
//     ageGroups: [
//       { group: '18-24', percentage: 12 },
//       { group: '25-34', percentage: 24 },
//       { group: '35-44', percentage: 28 },
//       { group: '45-54', percentage: 20 },
//       { group: '55+', percentage: 16 }
//     ],
//     gender: [
//       { type: 'Male', percentage: 45 },
//       { type: 'Female', percentage: 55 }
//     ],
//     loyaltyStatus: [
//       { status: 'New', percentage: 30 },
//       { status: 'Returning', percentage: 40 },
//       { status: 'Loyal', percentage: 30 }
//     ]
//   };

//   // Sales summary metrics
//   const salesSummary = useMemo(() => {
//     const dailyData = generateDailySalesData();
//     const monthlyData = generateMonthlySalesData();
    
//     // Calculate total sales and orders for selected time period
//     let periodSales = 0;
//     let periodOrders = 0;
//     let previousPeriodSales = 0;
//     let previousPeriodOrders = 0;
    
//     if (timeRange === 'month') {
//       // Current month (last 30 days)
//       for (let i = dailyData.length - 30; i < dailyData.length; i++) {
//         periodSales += dailyData[i].totalSales;
//         periodOrders += dailyData[i].totalOrders;
//       }
//       // Previous month
//       for (let i = dailyData.length - 60; i < dailyData.length - 30; i++) {
//         if (i >= 0) {
//           previousPeriodSales += dailyData[i].totalSales;
//           previousPeriodOrders += dailyData[i].totalOrders;
//         }
//       }
//     } else if (timeRange === 'week') {
//       // Current week (last 7 days)
//       for (let i = dailyData.length - 7; i < dailyData.length; i++) {
//         periodSales += dailyData[i].totalSales;
//         periodOrders += dailyData[i].totalOrders;
//       }
//       // Previous week
//       for (let i = dailyData.length - 14; i < dailyData.length - 7; i++) {
//         previousPeriodSales += dailyData[i].totalSales;
//         previousPeriodOrders += dailyData[i].totalOrders;
//       }
//     } else if (timeRange === 'year') {
//       // Use monthly data for year
//       for (let i = 0; i < monthlyData.length; i++) {
//         periodSales += monthlyData[i].totalSales;
//       }
//       // For year, we'll set a dummy growth rate
//       previousPeriodSales = periodSales * 0.92; // 8% growth from last year
//     }
    
//     // Calculate growth rates
//     const salesGrowth = previousPeriodSales === 0 ? 0 : ((periodSales - previousPeriodSales) / previousPeriodSales) * 100;
//     const ordersGrowth = previousPeriodOrders === 0 ? 0 : ((periodOrders - previousPeriodOrders) / previousPeriodOrders) * 100;
    
//     return {
//       totalSales: periodSales,
//       totalOrders: periodOrders,
//       averageOrderValue: periodOrders === 0 ? 0 : periodSales / periodOrders,
//       salesGrowth: salesGrowth.toFixed(1),
//       ordersGrowth: ordersGrowth.toFixed(1),
//       conversionRate: 67.5, // Dummy conversion rate
//     };
//   }, [timeRange]);

//   // Get chart data based on time range and filters
//   const chartData = useMemo(() => {
//     if (timeRange === 'month' || timeRange === 'week') {
//       const dailyData = generateDailySalesData();
//       const startIndex = timeRange === 'week' ? dailyData.length - 7 : dailyData.length - 30;
      
//       return dailyData.slice(startIndex).map(day => ({
//         date: day.date,
//         sales: selectedCategory === 'all' ? day.totalSales : day.categories[selectedCategory]?.sales || 0
//       }));
//     } else {
//       return generateMonthlySalesData().map(month => ({
//         date: month.date,
//         sales: selectedCategory === 'all' ? month.totalSales : month.categories[selectedCategory]?.sales || 0
//       }));
//     }
//   }, [timeRange, selectedCategory]);

//   return {
//     salesSummary,
//     chartData,
//     timeRange,
//     setTimeRange,
//     comparisonEnabled,
//     setComparisonEnabled,
//     selectedCategory,
//     setSelectedCategory,
//     topSellingProducts,
//     salesByCategory,
//     customerDemographics,
//     categories: ['all', 'Prescription', 'OTC Medication', 'Health Supplements', 'Medical Devices']
//   };
// };

// export default useSalesData;