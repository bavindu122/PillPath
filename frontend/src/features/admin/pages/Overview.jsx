import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ChartCard from "../components/ChartCard";
import StatCard from "../components/StatCard";
import RecentActivityCard from "../components/RecentActivityCard";

import {
  Home,
  Users,
  User,
  Store,
  FileText,
  Package,
  Wallet,
  Activity,
  Clock,
  AlertTriangle,
  ChartLine,
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import AdminService from "../../../services/api/AdminService";

const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#06B6D4", "#8B5CF6"];

const mockDashboardData = {
  summary: {
    totalUsers: 1250,
    activePharmacies: 85,
    pendingPrescriptions: 45,
    completedOrders: 980,
    totalRevenue: 35000,
  },
  userRegistrationTrend: [
    { name: "Jan", users: 400 },
    { name: "Feb", users: 300 },
    { name: "Mar", users: 500 },
    { name: "Apr", users: 450 },
    { name: "May", users: 600 },
    { name: "Jun", users: 700 },
  ],
  orderStatusDistribution: [
    { name: "Pending", value: 150 },
    { name: "Approved", value: 300 },
    { name: "Completed", value: 500 },
    { name: "Rejected", value: 50 },
  ],
  recentActivity: [
    {
      id: 1,
      user: "Dr. Sarah Johnson",
      action: "Uploaded prescription",
      time: "2 minutes ago",
      status: "success",
    },
    {
      id: 2,
      user: "MedPlus Pharmacy",
      action: "Updated inventory",
      time: "5 minutes ago",
      status: "info",
    },
    {
      id: 3,
      user: "John Smith",
      action: "Account login",
      time: "8 minutes ago",
      status: "info",
    },
    {
      id: 4,
      user: "System",
      action: "Backup completed",
      time: "15 minutes ago",
      status: "success",
    },
    {
      id: 5,
      user: "HealthCare Pharmacy",
      action: "New registration",
      time: "23 minutes ago",
      status: "warning",
    },
  ],
  userRolesData: [
    { name: "Customers", value: 1247, color: "#3B82F6" },
    { name: "Pharmacists", value: 89, color: "#8B5CF6" },
    { name: "Pharmacy Admins", value: 34, color: "#EC4899" },
    { name: "System Admins", value: 8, color: "#06B6D4" },
  ],
  monthlyOTCData: [
    { month: "Jan", sales: 4800 },
    { month: "Feb", sales: 5200 },
    { month: "Mar", sales: 4900 },
    { month: "Apr", sales: 6100 },
    { month: "May", sales: 5800 },
    { month: "Jun", sales: 7200 },
  ],
  pharmacyOnboardingData: [
    { month: "Jan", pharmacies: 12 },
    { month: "Feb", pharmacies: 19 },
    { month: "Mar", pharmacies: 15 },
    { month: "Apr", pharmacies: 22 },
    { month: "May", pharmacies: 28 },
    { month: "Jun", pharmacies: 35 },
  ],
};

const Overview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePharmacies: 0,
    prescriptionsUploaded: 0,
    completedOrders: 0,
    totalRevenue: 0,
    walletBalance: 0,
    currency: "LKR",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charts state
  const [charts, setCharts] = useState({
    userRegistrationTrend: [],
    userRolesData: [],
    pharmacyOnboardingData: [],
  });
  const [chartsLoading, setChartsLoading] = useState(true);
  const [chartsError, setChartsError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    AdminService.getOverviewSummary()
      .then((data) => {
        if (!mounted) return;
        setStats({
          totalUsers: data?.totalUsers ?? 0,
          activePharmacies: data?.activePharmacies ?? 0,
          prescriptionsUploaded: data?.prescriptionsUploaded ?? 0,
          completedOrders: data?.completedOrders ?? 0,
          totalRevenue: data?.totalRevenue ?? 0,
          walletBalance: data?.walletBalance ?? 0,
          currency: data?.currency || "LKR",
        });
      })
      .catch((e) => setError(e?.message || "Failed to load stats"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    setChartsLoading(true);
    setChartsError(null);

    const monthNames = [
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
    const toMonthLabel = (value) => {
      if (!value) return "";
      if (typeof value === "string") {
        const match = value.match(/\d{4}-(\d{2})/); // YYYY-MM or YYYY-MM-DD
        if (match) {
          const idx = parseInt(match[1], 10) - 1;
          return monthNames[idx] ?? value;
        }
        // Already a short month name
        if (value.length <= 3) return value;
      }
      if (typeof value === "number") {
        return monthNames[value - 1] ?? String(value);
      }
      return String(value);
    };

    const ROLE_DISPLAY = {
      CUSTOMER: { name: "Customers", color: "#3B82F6" },
      PHARMACIST: { name: "Pharmacists", color: "#8B5CF6" },
      PHARMACY_ADMIN: { name: "Pharmacy Admins", color: "#EC4899" },
      ADMIN: { name: "System Admins", color: "#06B6D4" },
    };

    AdminService.getOverviewCharts()
      .then((data) => {
        if (!mounted) return;

        // Normalize user registration trend
        const userRegistrationTrend = Array.isArray(data?.userRegistrationTrend)
          ? data.userRegistrationTrend.map((item, idx) => ({
              name: toMonthLabel(
                item.month || item.name || item.label || item.m
              ),
              users: item.users ?? item.count ?? item.total ?? 0,
            }))
          : [];

        // Normalize roles distribution
        const rolesSource = data?.userRolesDistribution;
        let userRolesData = [];
        if (Array.isArray(rolesSource)) {
          userRolesData = rolesSource.map((item, idx) => {
            const key = item.role || item.name || item.type || `ROLE_${idx}`;
            const meta = ROLE_DISPLAY[key] || {
              name: key,
              color: COLORS[idx % COLORS.length],
            };
            return {
              name: meta.name,
              value: item.count ?? item.value ?? 0,
              color: meta.color,
            };
          });
        } else if (rolesSource && typeof rolesSource === "object") {
          userRolesData = Object.entries(rolesSource).map(
            ([key, count], idx) => {
              const meta = ROLE_DISPLAY[key] || {
                name: key,
                color: COLORS[idx % COLORS.length],
              };
              return { name: meta.name, value: count ?? 0, color: meta.color };
            }
          );
        }

        // Normalize pharmacy onboarding
        const pharmacyOnboardingData = Array.isArray(
          data?.pharmacyOnboardingData
        )
          ? data.pharmacyOnboardingData.map((item) => ({
              month: toMonthLabel(
                item.month || item.name || item.label || item.m
              ),
              pharmacies: item.pharmacies ?? item.count ?? item.total ?? 0,
            }))
          : [];

        setCharts({
          userRegistrationTrend,
          userRolesData,
          pharmacyOnboardingData,
        });
      })
      .catch((e) => setChartsError(e?.message || "Failed to load charts"))
      .finally(() => mounted && setChartsLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <PageHeader
        icon={Home}
        title="Admin Dashboard"
        subtitle="Overview of PillPath Platform"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard
          label="Total Users"
          value={loading ? "..." : stats.totalUsers}
          icon={<Users size={48} className="text-blue-500" />}
        />
        <StatCard
          label="Active Pharmacies"
          value={loading ? "..." : stats.activePharmacies}
          icon={<Store size={48} className="text-green-500" />}
        />
        <StatCard
          label="Prescriptions Uploaded"
          value={loading ? "..." : stats.prescriptionsUploaded}
          icon={<FileText size={48} className="text-yellow-500" />}
        />
        <StatCard
          label="Completed Orders"
          value={loading ? "..." : stats.completedOrders}
          icon={<Package size={48} className="text-purple-500" />}
        />

        <StatCard
          label="Total Revenue"
          value={
            loading
              ? "..."
              : `Rs. ${(stats.totalRevenue || 0).toLocaleString()}`
          }
          icon={<ChartLine size={48} className="text-pink-500" />}
        />
        <StatCard
          label="Wallet Balance"
          value={
            loading
              ? "..."
              : `Rs. ${(stats.walletBalance || 0).toLocaleString()}`
          }
          icon={<Wallet size={48} className="text-red-500" />}
        />
      </div>
      {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}

      <RecentActivityCard
        title="Recent Activities"
        activities={mockDashboardData.recentActivity}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="User Registration Trend">
          {chartsLoading ? (
            <div className="p-4 text-gray-500">Loading...</div>
          ) : chartsError ? (
            <div className="p-4 text-red-600">{chartsError}</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={charts.userRegistrationTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: "#1D4ED8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="User Roles Distribution">
          {chartsLoading ? (
            <div className="p-4 text-gray-500">Loading...</div>
          ) : chartsError ? (
            <div className="p-4 text-red-600">{chartsError}</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={charts.userRolesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {charts.userRolesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Monthly OTC Sales">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockDashboardData.monthlyOTCData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#EC4899" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Pharmacy Onboarding Trends">
          {chartsLoading ? (
            <div className="p-4 text-gray-500">Loading...</div>
          ) : chartsError ? (
            <div className="p-4 text-red-600">{chartsError}</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={charts.pharmacyOnboardingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="pharmacies"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default Overview;
