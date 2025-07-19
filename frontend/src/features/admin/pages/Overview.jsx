import React from 'react'
import PageHeader from '../components/PageHeader'
import ChartCard from '../components/ChartCard'
import StatCard from '../components/StatCard'
import RecentActivityCard from '../components/RecentActivityCard'

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
} from 'lucide-react';

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

} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF1D1D'];

const mockDashboardData = {
  summary: {
    totalUsers: 1250,
    activePharmacies: 85,
    pendingPrescriptions: 45,
    completedOrders: 980,
    totalRevenue: 35000,
  },
  userRegistrationTrend: [
    { name: 'Jan', users: 400 },
    { name: 'Feb', users: 300 },
    { name: 'Mar', users: 500 },
    { name: 'Apr', users: 450 },
    { name: 'May', users: 600 },
    { name: 'Jun', users: 700 },
  ],
  orderStatusDistribution: [
    { name: 'Pending', value: 150 },
    { name: 'Approved', value: 300 },
    { name: 'Completed', value: 500 },
    { name: 'Rejected', value: 50 },
  ],
  recentActivity: [
  { id: 1, user: 'Dr. Sarah Johnson', action: 'Uploaded prescription', time: '2 minutes ago', status: 'success' },
  { id: 2, user: 'MedPlus Pharmacy', action: 'Updated inventory', time: '5 minutes ago', status: 'info' },
  { id: 3, user: 'John Smith', action: 'Account login', time: '8 minutes ago', status: 'info' },
  { id: 4, user: 'System', action: 'Backup completed', time: '15 minutes ago', status: 'success' },
  { id: 5, user: 'HealthCare Pharmacy', action: 'New registration', time: '23 minutes ago', status: 'warning' },
],
userRolesData:[
  { name: 'Customers', value: 1247, color: '#3b82f6' },
  { name: 'Pharmacists', value: 89, color: '#10b981' },
  { name: 'Pharmacy Admins', value: 34, color: '#f59e0b' },
  { name: 'System Admins', value: 8, color: '#ef4444' },
],
monthlyOTCData: [
  { month: 'Jan', sales: 4800 },
  { month: 'Feb', sales: 5200 },
  { month: 'Mar', sales: 4900 },
  { month: 'Apr', sales: 6100 },
  { month: 'May', sales: 5800 },
  { month: 'Jun', sales: 7200 },
],
pharmacyOnboardingData:[
  { month: 'Jan', pharmacies: 12 },
  { month: 'Feb', pharmacies: 19 },
  { month: 'Mar', pharmacies: 15 },
  { month: 'Apr', pharmacies: 22 },
  { month: 'May', pharmacies: 28 },
  { month: 'Jun', pharmacies: 35 },
],
};


const Overview = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
        <PageHeader 
        icon={Home} 
        title="Admin Dashboard" 
        subtitle="Overview of PillPath Platform" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard label="Total Users" value={1250} icon={<Users size={48} className="text-blue-500" />} />
        <StatCard label="Active Pharmacies" value={85} icon={<Store size={48} className="text-green-500" />} />
        <StatCard label="Prescriptions Uploaded" value={45} icon={<FileText size={48} className="text-yellow-500" />} />
        <StatCard label="Completed Orders" value={980} icon={<Package size={48} className="text-purple-500" />} />

        <StatCard label="Total Revenue" value={`Rs. ${(35000).toLocaleString()}`} icon={<ChartLine size={48} className="text-pink-500" />} />
        <StatCard label="Wallet Balance" value={`Rs. ${(25600).toLocaleString()}`} icon={<Wallet size={48} className="text-red-500" />} />

      </div>

      <RecentActivityCard 
        title="Recent Activities"
        activities={mockDashboardData.recentActivity}
      />

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="User Registration Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockDashboardData.userRegistrationTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="User Roles Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockDashboardData.userRolesData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {mockDashboardData.userRolesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly OTC Sales">
          <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockDashboardData.monthlyOTCData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Pharmacy Onboarding Trends">
          <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockDashboardData.pharmacyOnboardingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="pharmacies" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
      </div>

    </div>
  )
}

export default Overview
