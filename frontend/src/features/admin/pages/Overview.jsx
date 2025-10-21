import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ChartCard from "../components/ChartCard";
import StatCard from "../components/StatCard";

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
      </div>
      {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}

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
