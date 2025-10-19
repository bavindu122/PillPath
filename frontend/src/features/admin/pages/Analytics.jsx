import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Users,
  Building,
  UploadCloud,
  Package,
  Activity,
  DollarSign,
  FileText,
  UserCheck,
  Ban,
  TrendingUp,
  TrendingDown,
  User,
  ChartColumn,
} from "lucide-react"; // Using lucide-react for icons
import StatCard from "../components/StatCard";
import PageHeader from "../components/PageHeader";
import AdminService from "../../../services/api/AdminService";

// Dummy Data for demonstration purposes
const dummyData = {
  kpis: {
    totalUsers: 12500,
    totalPharmacies: 350,
    totalPrescriptionsUploaded: 8760,
    ordersProcessed: 7200,
    activePharmacies: 300,
    suspendedPharmacies: 50,
    monthlyRevenue: 125000,
  },
  prescriptionUploads: [
    { month: "Jan", uploads: 400 },
    { month: "Feb", uploads: 300 },
    { month: "Mar", uploads: 500 },
    { month: "Apr", uploads: 450 },
    { month: "May", uploads: 600 },
    { month: "Jun", uploads: 550 },
    { month: "Jul", uploads: 700 },
    { month: "Aug", uploads: 650 },
    { month: "Sep", uploads: 800 },
    { month: "Oct", uploads: 750 },
    { month: "Nov", uploads: 900 },
    { month: "Dec", uploads: 850 },
  ],
  pharmacyRegistrations: [
    { month: "Jan", registered: 10 },
    { month: "Feb", registered: 8 },
    { month: "Mar", registered: 12 },
    { month: "Apr", registered: 9 },
    { month: "May", registered: 15 },
    { month: "Jun", registered: 11 },
    { month: "Jul", registered: 14 },
    { month: "Aug", registered: 10 },
    { month: "Sep", registered: 18 },
    { month: "Oct", registered: 13 },
    { month: "Nov", registered: 20 },
    { month: "Dec", registered: 16 },
  ],
  growthTrend: [
    { month: "Jan", customers: 1000, pharmacies: 100 },
    { month: "Feb", customers: 1200, pharmacies: 110 },
    { month: "Mar", customers: 1500, pharmacies: 125 },
    { month: "Apr", customers: 1800, pharmacies: 135 },
    { month: "May", customers: 2200, pharmacies: 150 },
    { month: "Jun", customers: 2500, pharmacies: 160 },
    { month: "Jul", customers: 2800, pharmacies: 175 },
    { month: "Aug", customers: 3100, pharmacies: 185 },
    { month: "Sep", customers: 3500, pharmacies: 200 },
    { month: "Oct", customers: 3800, pharmacies: 210 },
    { month: "Nov", customers: 4200, pharmacies: 225 },
    { month: "Dec", customers: 4500, pharmacies: 235 },
  ],
  orderFulfillment: [
    { name: "Fulfilled", value: 6500, color: "#10B981" },
    { name: "Pending", value: 500, color: "#F59E0B" },
    { name: "Canceled", value: 200, color: "#EF4444" },
  ],
  revenueAnalytics: [
    { month: "Jan", revenue: 8000 },
    { month: "Feb", revenue: 9500 },
    { month: "Mar", revenue: 11000 },
    { month: "Apr", revenue: 10500 },
    { month: "May", revenue: 13000 },
    { month: "Jun", revenue: 12000 },
    { month: "Jul", revenue: 14500 },
    { month: "Aug", revenue: 13500 },
    { month: "Sep", revenue: 16000 },
    { month: "Oct", revenue: 15000 },
    { month: "Nov", revenue: 17500 },
    { month: "Dec", revenue: 16500 },
  ],
  monthlyPharmacyPerformance: [
    {
      name: "City Pharmacy",
      orders: 120,
      rating: 4.5,
      status: "Active",
      regDate: "2022-01-15",
    },
    {
      name: "Green Meds",
      orders: 90,
      rating: 4.2,
      status: "Active",
      regDate: "2021-11-01",
    },
    {
      name: "Quick Rx",
      orders: 150,
      rating: 4.8,
      status: "Active",
      regDate: "2023-03-20",
    },
    {
      name: "Health Hub",
      orders: 75,
      rating: 3.9,
      status: "Active",
      regDate: "2022-07-10",
    },
    {
      name: "Care Pharmacy",
      orders: 110,
      rating: 4.6,
      status: "Active",
      regDate: "2023-01-05",
    },
  ],
  customerActivity: [
    {
      name: "Alice Smith",
      prescriptions: 25,
      status: "Active",
      lastLogin: "2024-07-18",
    },
    {
      name: "Bob Johnson",
      prescriptions: 18,
      status: "Loyalty",
      lastLogin: "2024-07-15",
    },
    {
      name: "Charlie Brown",
      prescriptions: 30,
      status: "Active",
      lastLogin: "2024-07-19",
    },
    {
      name: "Diana Prince",
      prescriptions: 12,
      status: "Suspended",
      lastLogin: "2024-07-10",
    },
    {
      name: "Eve Adams",
      prescriptions: 22,
      status: "Active",
      lastLogin: "2024-07-17",
    },
  ],
  suspendedAccounts: [
    {
      type: "Pharmacy",
      name: "Old Town Pharmacy",
      reason: "License Expired",
      date: "2024-06-01",
    },
    {
      type: "User",
      name: "John Doe",
      reason: "Fraudulent Activity",
      date: "2024-05-20",
    },
    {
      type: "Pharmacy",
      name: "Sunset Drugs",
      reason: "Non-compliance",
      date: "2024-07-05",
    },
  ],
  monthlyRevenueReport: [
    { month: "Jan", totalCommission: 12500, avgCommissionPerOrder: 3.5 },
    { month: "Feb", totalCommission: 13000, avgCommissionPerOrder: 3.6 },
    { month: "Mar", totalCommission: 14000, avgCommissionPerOrder: 3.75 },
    { month: "Apr", totalCommission: 13500, avgCommissionPerOrder: 3.4 },
    { month: "May", totalCommission: 15000, avgCommissionPerOrder: 3.8 },
  ],
};

// Helper: format ISO datetime or any date string to YYYY-MM-DD
const formatDateOnly = (value) => {
  if (!value) return "";
  try {
    const str = String(value);
    // Fast path for ISO-like strings
    if (str.includes("T")) {
      return str.split("T")[0];
    }
    const d = new Date(str);
    if (!isNaN(d)) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }
    return str; // fallback: return as-is
  } catch {
    return String(value);
  }
};

// Helper function to download CSV
const downloadCSV = (data, filename) => {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = headers.map((header) => {
      const escaped = ("" + row[header]).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const Analytics = () => {
  // Analytics KPIs state (backend-driven)
  const [kpis, setKpis] = useState({
    totalUsers: 0,
    totalPharmacies: 0,
    totalPrescriptionsUploaded: 0,
    ordersProcessed: 0,
    activePharmacies: 0,
    suspendedPharmacies: 0,
    totalPayments: 0,
  });
  const [kpisLoading, setKpisLoading] = useState(true);
  const [kpisError, setKpisError] = useState("");

  // Analytics charts state (backend-driven)
  const [charts, setCharts] = useState({
    prescriptionUploads: [],
    pharmacyRegistrations: [],
    growthRegistrations: [],
    orderFulfillment: [],
  });
  const [chartsLoading, setChartsLoading] = useState(true);
  const [chartsError, setChartsError] = useState("");

  // Pharmacy performance (backend-driven, single endpoint)
  const [pharmacyPerformance, setPharmacyPerformance] = useState([]);
  const [pharmacyPerfLoading, setPharmacyPerfLoading] = useState(true);
  const [pharmacyPerfError, setPharmacyPerfError] = useState("");

  // Customer activity (backend-driven, single endpoint)
  const [customerActivity, setCustomerActivity] = useState([]);
  const [customerActivityLoading, setCustomerActivityLoading] = useState(true);
  const [customerActivityError, setCustomerActivityError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadKpis = async () => {
      try {
        setKpisLoading(true);
        setKpisError("");
        const data = await AdminService.getAnalyticsKpis();
        // Normalize and fallback just in case backend fields vary
        const normalized = {
          totalUsers: Number(data?.totalUsers ?? 0),
          totalPharmacies: Number(data?.totalPharmacies ?? 0),
          totalPrescriptionsUploaded: Number(
            data?.totalPrescriptionsUploaded ?? data?.prescriptionsUploaded ?? 0
          ),
          ordersProcessed: Number(data?.ordersProcessed ?? data?.orders ?? 0),
          activePharmacies: Number(data?.activePharmacies ?? 0),
          suspendedPharmacies: Number(data?.suspendedPharmacies ?? 0),
          totalPayments: Number(
            data?.totalPayments ??
              data?.paymentsTotal ??
              data?.monthlyRevenue ??
              0
          ),
        };
        if (isMounted) setKpis(normalized);
      } catch (err) {
        console.error("Failed to load analytics KPIs:", err);
        if (isMounted) setKpisError(err?.message || "Failed to load KPIs");
      } finally {
        if (isMounted) setKpisLoading(false);
      }
    };
    loadKpis();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadCharts = async () => {
      try {
        setChartsLoading(true);
        setChartsError("");
        const data = await AdminService.getAnalyticsCharts();

        // Normalize backend payload to chart shapes used by UI
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const puRaw = Array.isArray(data?.prescriptionUploads)
          ? data.prescriptionUploads
          : [];
        const prescriptionUploads = puRaw.map((d) => ({
          month: String(d?.month ?? ""),
          uploads: Number(d?.uploads ?? 0),
        }));

        const prRaw = Array.isArray(data?.pharmacyRegistrations)
          ? data.pharmacyRegistrations
          : [];
        const pharmacyRegistrations = prRaw.map((d) => ({
          month: String(d?.month ?? ""),
          registered: Number(d?.registered ?? 0),
        }));

        const grRaw = Array.isArray(data?.growthRegistrations)
          ? data.growthRegistrations
          : Array.isArray(data?.growthTrend)
          ? data.growthTrend
          : [];
        const growthRegistrations = grRaw.map((d) => ({
          month: String(d?.month ?? ""),
          customers: Number(d?.customers ?? 0),
          pharmacies: Number(d?.pharmacies ?? 0),
        }));

        const statusColors = {
          delivered: "#10B981",
          pending: "#F59E0B",
          cancelled: "#EF4444",
          canceled: "#EF4444", // tolerate US spelling just in case
        };

        // Ensure all statuses exist with count 0 if missing
        const ofRaw = Array.isArray(data?.orderFulfillment)
          ? data.orderFulfillment
          : [];
        const counts = { delivered: 0, pending: 0, cancelled: 0 };
        for (const item of ofRaw) {
          const key = String(item?.status || "").toLowerCase();
          if (key === "canceled") {
            counts.cancelled += Number(item?.count ?? 0);
          } else if (key in counts) {
            counts[key] += Number(item?.count ?? 0);
          }
        }
        const orderFulfillment = [
          {
            name: "Delivered",
            value: counts.delivered,
            color: statusColors.delivered,
          },
          {
            name: "Pending",
            value: counts.pending,
            color: statusColors.pending,
          },
          {
            name: "Cancelled",
            value: counts.cancelled,
            color: statusColors.cancelled,
          },
        ];

        // Fill missing months with 0 to keep charts consistent (optional but safer)
        const ensureMonths = (arr, keyMap) => {
          const byMonth = new Map(arr.map((x) => [x.month, x]));
          return months.map((m) => {
            if (byMonth.has(m)) return byMonth.get(m);
            const base = { month: m };
            for (const [k, defVal] of Object.entries(keyMap)) base[k] = defVal;
            return base;
          });
        };

        const chartsData = {
          prescriptionUploads: ensureMonths(prescriptionUploads, {
            uploads: 0,
          }),
          pharmacyRegistrations: ensureMonths(pharmacyRegistrations, {
            registered: 0,
          }),
          growthRegistrations: ensureMonths(growthRegistrations, {
            customers: 0,
            pharmacies: 0,
          }),
          orderFulfillment,
        };

        if (isMounted) setCharts(chartsData);
      } catch (err) {
        console.error("Failed to load analytics charts:", err);
        if (isMounted) setChartsError(err?.message || "Failed to load charts");
      } finally {
        if (isMounted) setChartsLoading(false);
      }
    };
    loadCharts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch pharmacy performance
  useEffect(() => {
    let isMounted = true;
    const loadPharmacyPerformance = async () => {
      try {
        setPharmacyPerfLoading(true);
        setPharmacyPerfError("");
        const data = await AdminService.getPharmacyPerformance();
        if (Array.isArray(data) && isMounted) {
          setPharmacyPerformance(data);
        } else if (isMounted) {
          setPharmacyPerformance([]);
        }
      } catch (err) {
        console.error("Failed to load pharmacy performance:", err);
        if (isMounted)
          setPharmacyPerfError(
            err?.message || "Failed to load pharmacy performance"
          );
      } finally {
        if (isMounted) setPharmacyPerfLoading(false);
      }
    };
    loadPharmacyPerformance();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch customer activity
  useEffect(() => {
    let isMounted = true;
    const loadCustomerActivity = async () => {
      try {
        setCustomerActivityLoading(true);
        setCustomerActivityError("");
        const data = await AdminService.getCustomerActivity();
        if (Array.isArray(data)) {
          // Normalize fields: prescriptionsUploaded, registrationDate
          const normalized = data.map((c) => ({
            customerId: c.customerId ?? c.id ?? undefined,
            name: c.name ?? c.fullName ?? "",
            prescriptionsUploaded: Number(
              c.prescriptionsUploaded ?? c.prescriptions ?? 0
            ),
            status: c.status ?? "",
            registrationDate:
              c.registrationDate ?? c.createdAt ?? c.registeredAt ?? "",
            imageUrl: c.imageUrl ?? undefined,
          }));
          if (isMounted) setCustomerActivity(normalized);
        } else if (isMounted) {
          setCustomerActivity([]);
        }
      } catch (err) {
        console.error("Failed to load customer activity:", err);
        if (isMounted)
          setCustomerActivityError(
            err?.message || "Failed to load customer activity"
          );
      } finally {
        if (isMounted) setCustomerActivityLoading(false);
      }
    };
    loadCustomerActivity();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-inter">
      <PageHeader
        icon={ChartColumn}
        title="Analytics"
        subtitle="Detailed financial insights into PillPath transactions and earnings"
      />

      {/* Overview Cards / KPIs */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Overview
        </h2>
        {kpisError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {kpisError}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StatCard
            label="Total Users"
            value={kpis.totalUsers}
            icon={<Users size={48} className="text-blue-600" />}
          />
          <StatCard
            label="Total Pharmacies"
            value={kpis.totalPharmacies}
            icon={<Building size={48} className="text-green-600" />}
          />
          <StatCard
            label="Prescriptions Uploaded"
            value={kpis.totalPrescriptionsUploaded}
            icon={<UploadCloud size={48} className="text-purple-600" />}
          />
          <StatCard
            label="Orders Processed"
            value={kpis.ordersProcessed}
            icon={<Package size={48} className="text-indigo-600" />}
          />
          <StatCard
            label="Active Pharmacies"
            value={kpis.activePharmacies}
            icon={<Activity size={48} className="text-teal-600" />}
          />
          <StatCard
            label="Suspended Pharmacies"
            value={kpis.suspendedPharmacies}
            icon={<Ban size={48} className="text-red-600" />}
          />
          <StatCard
            label="Total Payments"
            value={kpis.totalPayments}
            icon={<DollarSign size={48} className="text-yellow-600" />}
          />
        </div>
        {kpisLoading && (
          <p className="mt-3 text-sm text-gray-500">Loading KPIs…</p>
        )}
      </section>

      {/* Charts Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Performance Charts
        </h2>
        {chartsError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {chartsError}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(() => {
            const hasPrescriptionUploads = charts.prescriptionUploads?.some(
              (d) => Number(d.uploads) > 0
            );
            return (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-medium text-gray-800 mb-4">
                  Prescription Uploads Over Time
                </h3>
                {chartsLoading ? (
                  <div className="h-[300px] flex items-center justify-center text-gray-400">
                    Loading…
                  </div>
                ) : hasPrescriptionUploads ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={charts.prescriptionUploads}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip
                        cursor={{ fill: "transparent" }}
                        contentStyle={{
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="uploads"
                        stroke="#3B82F6"
                        activeDot={{ r: 8, fill: "#1D4ED8" }}
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No prescription uploads data available
                  </div>
                )}
              </div>
            );
          })()}
          {/* Pharmacy Registrations Trend */}
          {(() => {
            const hasPharmacyRegistrations = charts.pharmacyRegistrations?.some(
              (d) => Number(d.registered) > 0
            );
            return (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-medium text-gray-800 mb-4">
                  Pharmacy Registrations Trend
                </h3>
                {chartsLoading ? (
                  <div className="h-[300px] flex items-center justify-center text-gray-400">
                    Loading…
                  </div>
                ) : hasPharmacyRegistrations ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={charts.pharmacyRegistrations}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip
                        cursor={{ fill: "transparent" }}
                        contentStyle={{
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="registered"
                        fill="#EC4899"
                        barSize={30}
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No pharmacy registrations data available
                  </div>
                )}
              </div>
            );
          })()}

          {/* Customer vs Pharmacy Growth */}
          {(() => {
            const hasGrowth = charts.growthRegistrations?.some(
              (d) => Number(d.customers) > 0 || Number(d.pharmacies) > 0
            );
            return (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-medium text-gray-800 mb-4">
                  Customer vs Pharmacy Growth
                </h3>
                {chartsLoading ? (
                  <div className="h-[300px] flex items-center justify-center text-gray-400">
                    Loading…
                  </div>
                ) : hasGrowth ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={charts.growthRegistrations}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="customers"
                        stroke="#8B5CF6"
                        fillOpacity={1}
                        fill="url(#colorCustomers)"
                      />
                      <Area
                        type="monotone"
                        dataKey="pharmacies"
                        stroke="#10B981"
                        fillOpacity={1}
                        fill="url(#colorPharmacies)"
                      />
                      <defs>
                        <linearGradient
                          id="colorCustomers"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8B5CF6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8B5CF6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorPharmacies"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10B981"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10B981"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No registration growth data available
                  </div>
                )}
              </div>
            );
          })()}

          {/* Order Fulfillment Report (Pie Chart) */}
          {(() => {
            const totalOF = (charts.orderFulfillment || []).reduce(
              (sum, x) => sum + Number(x.value || 0),
              0
            );
            const hasOF = totalOF > 0;
            return (
              <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
                <h3 className="text-xl font-medium text-gray-800 mb-4">
                  Order Fulfillment Report
                </h3>
                {chartsLoading ? (
                  <div className="h-[300px] flex items-center justify-center text-gray-400 w-full">
                    Loading…
                  </div>
                ) : hasOF ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={charts.orderFulfillment}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {charts.orderFulfillment.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500 w-full">
                    No order fulfillment data available
                  </div>
                )}
              </div>
            );
          })()}
        </div>
        {chartsLoading && (
          <p className="mt-3 text-sm text-gray-500">Loading charts…</p>
        )}
      </section>

      {/* Reports Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Reports
        </h2>

        {/* Monthly Pharmacy Performance Report */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-gray-800">
              Pharmacy Performance Report
            </h3>
            <button
              onClick={() =>
                downloadCSV(
                  (pharmacyPerformance || []).map((p) => ({
                    Name: p.name,
                    "Orders Fulfilled": p.ordersFulfilled ?? p.orders ?? 0,
                    Rating: p.rating ?? 0,
                    Status: p.status ?? "",
                    "Registration Date": formatDateOnly(
                      p.registrationDate ?? p.regDate ?? ""
                    ),
                  })),
                  "monthly_pharmacy_performance.csv"
                )
              }
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              disabled={
                !pharmacyPerformance || pharmacyPerformance.length === 0
              }
            >
              <FileText className="inline-block mr-2 w-5 h-5" /> Download CSV
            </button>
          </div>
          {pharmacyPerfError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {pharmacyPerfError}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Orders Fulfilled
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Rating
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Registration Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pharmacyPerfLoading ? (
                  <tr>
                    <td className="px-6 py-6 text-sm text-gray-500" colSpan={5}>
                      Loading pharmacy performance…
                    </td>
                  </tr>
                ) : (pharmacyPerformance || []).length === 0 ? (
                  <tr>
                    <td className="px-6 py-6 text-sm text-gray-500" colSpan={5}>
                      No data available
                    </td>
                  </tr>
                ) : (
                  (pharmacyPerformance || [])
                    .slice(0, 5)
                    .map((pharmacy, index) => (
                      <tr key={pharmacy.pharmacyId ?? index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {pharmacy.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pharmacy.ordersFulfilled ?? pharmacy.orders ?? 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pharmacy.rating ?? 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              (pharmacy.status ?? "").toLowerCase() === "active"
                                ? "bg-green-100 text-green-800"
                                : (pharmacy.status ?? "").toLowerCase() ===
                                  "suspended"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {pharmacy.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateOnly(
                            pharmacy.registrationDate ?? pharmacy.regDate ?? ""
                          )}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Activity Report */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-gray-800">
              Customer Activity Report
            </h3>
            <button
              onClick={() =>
                downloadCSV(
                  (customerActivity || []).map((c) => ({
                    Name: c.name,
                    "Prescriptions Uploaded": c.prescriptionsUploaded,
                    Status: c.status,
                    "Registration Date": formatDateOnly(c.registrationDate),
                  })),
                  "customer_activity_report.csv"
                )
              }
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              disabled={!customerActivity || customerActivity.length === 0}
            >
              <FileText className="inline-block mr-2 w-5 h-5" /> Download CSV
            </button>
          </div>
          {customerActivityError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {customerActivityError}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Prescriptions Uploaded
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Registration Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customerActivityLoading ? (
                  <tr>
                    <td className="px-6 py-6 text-sm text-gray-500" colSpan={4}>
                      Loading customer activity…
                    </td>
                  </tr>
                ) : (customerActivity || []).length === 0 ? (
                  <tr>
                    <td className="px-6 py-6 text-sm text-gray-500" colSpan={4}>
                      No data available
                    </td>
                  </tr>
                ) : (
                  (customerActivity || [])
                    .slice(0, 5)
                    .map((customer, index) => (
                      <tr key={customer.customerId ?? index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center space-x-3">
                          {customer.imageUrl ? (
                            <img
                              src={customer.imageUrl}
                              alt={customer.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                          <span>{customer.name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.prescriptionsUploaded}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              (customer.status ?? "").toLowerCase() === "active"
                                ? "bg-green-100 text-green-800"
                                : (customer.status ?? "").toLowerCase() ===
                                  "suspended"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateOnly(customer.registrationDate)}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Suspended Accounts Report */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-gray-800">
              Suspended Accounts Report
            </h3>
            <button
              onClick={() =>
                downloadCSV(
                  dummyData.suspendedAccounts,
                  "suspended_accounts_report.csv"
                )
              }
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              <FileText className="inline-block mr-2 w-5 h-5" /> Download CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyData.suspendedAccounts.map((account, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {account.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payments Report */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-gray-800">
              Payments Report
            </h3>
            <button
              onClick={() =>
                downloadCSV(
                  dummyData.monthlyRevenueReport,
                  "payments_report.csv"
                )
              }
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              <FileText className="inline-block mr-2 w-5 h-5" /> Download CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Month
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Total Commission
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Avg. Commission per Order
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyData.monthlyRevenueReport.map((revenue, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {revenue.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs.{revenue.totalCommission.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs.{revenue.avgCommissionPerOrder.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
