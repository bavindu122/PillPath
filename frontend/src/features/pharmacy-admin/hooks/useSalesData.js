import { useState, useMemo, useEffect, useCallback } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { pharmacyAdminOrdersService } from "../services/ordersService";

export const useSalesData = () => {
  // Real sales data derived from backend orders
  const [timeRange, setTimeRange] = useState("month"); // 'week', 'month', 'year'
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, isAuthenticated, isPharmacyAdmin } = useAuth();
  const pharmacyId =
    user?.pharmacyId ||
    user?.pharmacy?.id ||
    JSON.parse(localStorage.getItem("user_data") || "{}")?.pharmacyId;

  const loadOrders = useCallback(async () => {
    if (!isAuthenticated || !isPharmacyAdmin || !pharmacyId) {
      setOrders([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const list = await pharmacyAdminOrdersService.listOrders(pharmacyId);
      setOrders(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.message || "Failed to load sales data");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isPharmacyAdmin, pharmacyId]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Helpers
  const toDate = (d) => (d ? new Date(d) : null);
  const startOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const formatDay = (d) => d.toISOString().slice(0, 10);
  const formatMonth = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

  const getOrderTotal = (o) => Number(o?.totals?.total ?? o?.total ?? 0);
  const getPaymentMethod = (o) =>
    (o?.payment?.method || "").toString().toUpperCase().replace(/[ _]/g, "");
  const getCreatedAt = (o) =>
    toDate(o?.createdAt || o?.orderDate || o?.dateCreated);

  // Build time windows
  const now = new Date();
  const today = startOfDay(now);
  const currentWindow = useMemo(() => {
    if (timeRange === "week") {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      const end = new Date(today);
      return { granularity: "day", start, end };
    } else if (timeRange === "month") {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      const end = new Date(today);
      return { granularity: "day", start, end };
    } else {
      // year
      const start = new Date(today);
      start.setMonth(start.getMonth() - 11);
      start.setDate(1);
      const end = new Date(today);
      return { granularity: "month", start, end };
    }
  }, [timeRange]);

  const previousWindow = useMemo(() => {
    const { granularity, start, end } = currentWindow;
    if (granularity === "day") {
      const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
      const prevEnd = new Date(start);
      prevEnd.setDate(start.getDate() - 1);
      const prevStart = new Date(prevEnd);
      prevStart.setDate(prevEnd.getDate() - (days - 1));
      return { granularity, start: prevStart, end: prevEnd };
    } else {
      // month granularity
      const prevEnd = new Date(currentWindow.start);
      prevEnd.setDate(0); // last day of previous month
      const prevStart = new Date(prevEnd);
      prevStart.setMonth(prevStart.getMonth() - 11);
      prevStart.setDate(1);
      return { granularity, start: prevStart, end: prevEnd };
    }
  }, [currentWindow]);

  // Filter orders by window
  const filterByWindow = (list, window) => {
    const { start, end } = window;
    return list.filter((o) => {
      const d = getCreatedAt(o);
      return (
        d &&
        d >= start &&
        d <=
          new Date(
            end.getFullYear(),
            end.getMonth(),
            end.getDate(),
            23,
            59,
            59,
            999
          )
      );
    });
  };

  const ordersCurrent = useMemo(
    () => filterByWindow(orders, currentWindow),
    [orders, currentWindow]
  );
  const ordersPrevious = useMemo(
    () => filterByWindow(orders, previousWindow),
    [orders, previousWindow]
  );

  // Top selling products from actual items in current window
  const topSellingProducts = useMemo(() => {
    const map = new Map();
    const accum = (list, factor = 1) => {
      list.forEach((o) => {
        const items = Array.isArray(o.items) ? o.items : [];
        items.forEach((it) => {
          const name =
            it.medicineName || it.name || `Item-${it.itemId || it.id}`;
          const units = Number(it.quantity || 0) * factor;
          const sales =
            Number(it.totalPrice ?? (it.unitPrice || 0) * (it.quantity || 0)) *
            factor;
          const prev = map.get(name) || {
            name,
            currentSales: 0,
            prevSales: 0,
            currentUnits: 0,
          };
          if (factor > 0) {
            prev.currentSales += sales;
            prev.currentUnits += units;
          } else {
            prev.prevSales += Math.abs(sales);
          }
          map.set(name, prev);
        });
      });
    };
    accum(ordersCurrent, 1);
    accum(ordersPrevious, -1);
    const arr = Array.from(map.values()).map((p) => ({
      id: p.name,
      name: p.name,
      category: "Prescription",
      sales: p.currentSales,
      units: p.currentUnits,
      growth:
        p.prevSales > 0
          ? ((p.currentSales - p.prevSales) / p.prevSales) * 100
          : 0,
    }));
    arr.sort((a, b) => b.sales - a.sales);
    return arr.slice(0, 8);
  }, [ordersCurrent, ordersPrevious]);

  // Payment distribution for CategoryBreakdown (Cash vs Card) in current window
  const paymentDistribution = useMemo(() => {
    let cashSales = 0,
      cardSales = 0;
    ordersCurrent.forEach((o) => {
      const method = getPaymentMethod(o);
      const amt = getOrderTotal(o);
      if (method.includes("CASH")) cashSales += amt;
      else if (method.includes("CARD")) cardSales += amt;
    });
    const total = cashSales + cardSales;
    const pct = (n) => (total === 0 ? 0 : (n / total) * 100);
    // CategoryBreakdown expects fields similar to category/sales/percentage
    return [
      {
        category: "Cash Payments",
        sales: cashSales,
        percentage: pct(cashSales),
        orders: 0,
        growth: 0,
      },
      {
        category: "Card Payments",
        sales: cardSales,
        percentage: pct(cardSales),
        orders: 0,
        growth: 0,
      },
    ];
  }, [ordersCurrent]);

  // Customer demographics not derived here (not used on page)
  const customerDemographics = undefined;

  // Sales summary metrics
  const salesSummary = useMemo(() => {
    const currentSales = ordersCurrent.reduce(
      (s, o) => s + getOrderTotal(o),
      0
    );
    const currentOrders = ordersCurrent.length;
    const previousSales = ordersPrevious.reduce(
      (s, o) => s + getOrderTotal(o),
      0
    );
    const previousOrders = ordersPrevious.length;

    // Payment breakdown percentages for summary
    let currCash = 0,
      currCard = 0;
    ordersCurrent.forEach((o) => {
      const m = getPaymentMethod(o);
      const amt = getOrderTotal(o);
      if (m.includes("CASH")) currCash += amt;
      else if (m.includes("CARD")) currCard += amt;
    });
    const totalPayments = currCash + currCard;
    const cashPct = totalPayments === 0 ? 0 : (currCash / totalPayments) * 100;
    const cardPct = totalPayments === 0 ? 0 : (currCard / totalPayments) * 100;

    // Use paid orders ratio as "Customer Purchase Rate"
    const paidOrders = ordersCurrent.filter(
      (o) => (o?.payment?.status || "").toString().toUpperCase() === "PAID"
    ).length;
    const conversionRate =
      currentOrders === 0 ? 0 : (paidOrders / currentOrders) * 100;

    return {
      totalSales: currentSales,
      totalOrders: currentOrders,
      averageOrderValue: currentOrders === 0 ? 0 : currentSales / currentOrders,
      salesGrowth:
        previousSales === 0
          ? 0
          : ((currentSales - previousSales) / previousSales) * 100,
      ordersGrowth:
        previousOrders === 0
          ? 0
          : ((currentOrders - previousOrders) / previousOrders) * 100,
      conversionRate,
      cashPaymentPercentage: cashPct,
      cardPaymentPercentage: cardPct,
    };
  }, [ordersCurrent, ordersPrevious]);

  // Chart data (real)
  const chartData = useMemo(() => {
    const { granularity, start, end } = currentWindow;
    const daysBetween = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
    if (granularity === "day") {
      // Initialize buckets for each day
      const series = Array.from({ length: daysBetween }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return { key: formatDay(d), date: formatDay(d), sales: 0 };
      });
      const idx = new Map(series.map((s, i) => [s.key, i]));
      ordersCurrent.forEach((o) => {
        const d = getCreatedAt(o);
        const key = formatDay(startOfDay(d));
        const i = idx.get(key);
        if (i != null) series[i].sales += getOrderTotal(o);
      });

      // Previous series for comparison
      let prev = [];
      if (comparisonEnabled) {
        const { start: ps, end: pe } = previousWindow;
        const pDays = Math.round((pe - ps) / (1000 * 60 * 60 * 24)) + 1;
        prev = Array.from({ length: pDays }, (_, i) => {
          const d = new Date(ps);
          d.setDate(ps.getDate() + i);
          return { key: formatDay(d), date: formatDay(d), previousSales: 0 };
        });
        const pIdx = new Map(prev.map((s, i) => [s.key, i]));
        ordersPrevious.forEach((o) => {
          const d = getCreatedAt(o);
          const key = formatDay(startOfDay(d));
          const i = pIdx.get(key);
          if (i != null) prev[i].previousSales += getOrderTotal(o);
        });
      }

      // Merge current and previous (by index)
      return series.map((s, i) => ({
        ...s,
        ...(prev[i] ? { previousSales: prev[i].previousSales } : {}),
      }));
    }
    // Month granularity: last 12 months
    const months = [];
    const cursor = new Date(currentWindow.start);
    while (cursor <= currentWindow.end) {
      months.push({
        key: formatMonth(cursor),
        date: formatMonth(cursor),
        sales: 0,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }
    const midx = new Map(months.map((m, i) => [m.key, i]));
    ordersCurrent.forEach((o) => {
      const d = getCreatedAt(o);
      const key = formatMonth(d);
      const i = midx.get(key);
      if (i != null) months[i].sales += getOrderTotal(o);
    });
    if (comparisonEnabled) {
      const prevMonths = [];
      const pCursor = new Date(previousWindow.start);
      while (pCursor <= previousWindow.end) {
        prevMonths.push({ key: formatMonth(pCursor), previousSales: 0 });
        pCursor.setMonth(pCursor.getMonth() + 1);
      }
      const pidx = new Map(prevMonths.map((m, i) => [m.key, i]));
      ordersPrevious.forEach((o) => {
        const d = getCreatedAt(o);
        const key = formatMonth(d);
        const i = pidx.get(key);
        if (i != null) prevMonths[i].previousSales += getOrderTotal(o);
      });
      return months.map((m, i) => ({
        ...m,
        ...(prevMonths[i]
          ? { previousSales: prevMonths[i].previousSales }
          : {}),
      }));
    }
    return months;
  }, [
    ordersCurrent,
    ordersPrevious,
    currentWindow,
    previousWindow,
    comparisonEnabled,
  ]);

  return {
    salesSummary: {
      ...salesSummary,
      // Keep one decimal formatting at the component level
    },
    chartData,
    timeRange,
    setTimeRange,
    comparisonEnabled,
    setComparisonEnabled,
    selectedCategory,
    setSelectedCategory,
    topSellingProducts,
    paymentDistribution,
    customerDemographics,
    categories: ["all"],
    loading,
    error,
    reload: loadOrders,
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
