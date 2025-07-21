import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import {
  Users, Building, UploadCloud, Package, Activity, DollarSign, FileText, UserCheck, Ban, TrendingUp, TrendingDown,User,ChartColumn
} from 'lucide-react'; // Using lucide-react for icons
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';

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
    { month: 'Jan', uploads: 400 }, { month: 'Feb', uploads: 300 }, { month: 'Mar', uploads: 500 },
    { month: 'Apr', uploads: 450 }, { month: 'May', uploads: 600 }, { month: 'Jun', uploads: 550 },
    { month: 'Jul', uploads: 700 }, { month: 'Aug', uploads: 650 }, { month: 'Sep', uploads: 800 },
    { month: 'Oct', uploads: 750 }, { month: 'Nov', uploads: 900 }, { month: 'Dec', uploads: 850 },
  ],
  pharmacyRegistrations: [
    { month: 'Jan', registered: 10 }, { month: 'Feb', registered: 8 }, { month: 'Mar', registered: 12 },
    { month: 'Apr', registered: 9 }, { month: 'May', registered: 15 }, { month: 'Jun', registered: 11 },
    { month: 'Jul', registered: 14 }, { month: 'Aug', registered: 10 }, { month: 'Sep', registered: 18 },
    { month: 'Oct', registered: 13 }, { month: 'Nov', registered: 20 }, { month: 'Dec', registered: 16 },
  ],
  growthTrend: [
    { month: 'Jan', customers: 1000, pharmacies: 100 },
    { month: 'Feb', customers: 1200, pharmacies: 110 },
    { month: 'Mar', customers: 1500, pharmacies: 125 },
    { month: 'Apr', customers: 1800, pharmacies: 135 },
    { month: 'May', customers: 2200, pharmacies: 150 },
    { month: 'Jun', customers: 2500, pharmacies: 160 },
    { month: 'Jul', customers: 2800, pharmacies: 175 },
    { month: 'Aug', customers: 3100, pharmacies: 185 },
    { month: 'Sep', customers: 3500, pharmacies: 200 },
    { month: 'Oct', customers: 3800, pharmacies: 210 },
    { month: 'Nov', customers: 4200, pharmacies: 225 },
    { month: 'Dec', customers: 4500, pharmacies: 235 },
  ],
  orderFulfillment: [
    { name: 'Fulfilled', value: 6500, color: '#82ca9d' },
    { name: 'Pending', value: 500, color: '#ffc658' },
    { name: 'Canceled', value: 200, color: '#ff7300' },
  ],
  revenueAnalytics: [
    { month: 'Jan', revenue: 8000 }, { month: 'Feb', revenue: 9500 }, { month: 'Mar', revenue: 11000 },
    { month: 'Apr', revenue: 10500 }, { month: 'May', revenue: 13000 }, { month: 'Jun', revenue: 12000 },
    { month: 'Jul', revenue: 14500 }, { month: 'Aug', revenue: 13500 }, { month: 'Sep', revenue: 16000 },
    { month: 'Oct', revenue: 15000 }, { month: 'Nov', revenue: 17500 }, { month: 'Dec', revenue: 16500 },
  ],
  monthlyPharmacyPerformance: [
    { name: 'City Pharmacy', orders: 120, rating: 4.5, status: 'Active', regDate: '2022-01-15' },
    { name: 'Green Meds', orders: 90, rating: 4.2, status: 'Active', regDate: '2021-11-01' },
    { name: 'Quick Rx', orders: 150, rating: 4.8, status: 'Active', regDate: '2023-03-20' },
    { name: 'Health Hub', orders: 75, rating: 3.9, status: 'Active', regDate: '2022-07-10' },
    { name: 'Care Pharmacy', orders: 110, rating: 4.6, status: 'Active', regDate: '2023-01-05' },
  ],
  customerActivity: [
    { name: 'Alice Smith', prescriptions: 25, status: 'Active', lastLogin: '2024-07-18' },
    { name: 'Bob Johnson', prescriptions: 18, status: 'Loyalty', lastLogin: '2024-07-15' },
    { name: 'Charlie Brown', prescriptions: 30, status: 'Active', lastLogin: '2024-07-19' },
    { name: 'Diana Prince', prescriptions: 12, status: 'Suspended', lastLogin: '2024-07-10' },
    { name: 'Eve Adams', prescriptions: 22, status: 'Active', lastLogin: '2024-07-17' },
  ],
  suspendedAccounts: [
    { type: 'Pharmacy', name: 'Old Town Pharmacy', reason: 'License Expired', date: '2024-06-01' },
    { type: 'User', name: 'John Doe', reason: 'Fraudulent Activity', date: '2024-05-20' },
    { type: 'Pharmacy', name: 'Sunset Drugs', reason: 'Non-compliance', date: '2024-07-05' },
  ],
  monthlyRevenueReport: [
    { month: 'Jan', totalCommission: 12500, avgCommissionPerOrder: 3.50 },
    { month: 'Feb', totalCommission: 13000, avgCommissionPerOrder: 3.60 },
    { month: 'Mar', totalCommission: 14000, avgCommissionPerOrder: 3.75 },
    { month: 'Apr', totalCommission: 13500, avgCommissionPerOrder: 3.40 },
    { month: 'May', totalCommission: 15000, avgCommissionPerOrder: 3.80 },
  ],
};

// Helper function to download CSV
const downloadCSV = (data, filename) => {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};



const Analytics = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-inter">
      <PageHeader 
            icon={ChartColumn} 
            title="Analytics"  
            subtitle="Detailed financial insights into PillPath transactions and earnings" 
        />


      {/* Overview Cards / KPIs */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StatCard label="Total Users" value={dummyData.kpis.totalUsers} icon={<Users size={48} className="text-blue-600"/>}  />
          <StatCard label="Total Pharmacies" value={dummyData.kpis.totalPharmacies} icon={<Building size={48} className="text-green-600"/>}  />
          <StatCard label="Prescriptions Uploaded" value={dummyData.kpis.totalPrescriptionsUploaded} icon={<UploadCloud size={48} className="text-purple-600"/>} />
          <StatCard label="Orders Processed" value={dummyData.kpis.ordersProcessed} icon={<Package size={48} className="text-indigo-600"/>} />
          <StatCard label="Active Pharmacies" value={dummyData.kpis.activePharmacies} icon={<Activity size={48} className="text-teal-600"/>} />
          <StatCard label="Suspended Pharmacies" value={dummyData.kpis.suspendedPharmacies} icon={<Ban size={48} className="text-red-600"/>} />
          <StatCard label="Monthly Revenue" value={dummyData.kpis.monthlyRevenue} icon={<DollarSign size={48} className="text-yellow-600"/>} />
        </div>
      </section>

      {/* Charts Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Performance Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prescription Uploads Over Time */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Prescription Uploads Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dummyData.prescriptionUploads} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="uploads" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pharmacy Registrations Trend */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Pharmacy Registrations Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dummyData.pharmacyRegistrations} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Bar dataKey="registered" fill="#82ca9d" barSize={30} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Customer vs Pharmacy Growth */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Customer vs Pharmacy Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dummyData.growthTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Area type="monotone" dataKey="customers" stroke="#8884d8" fillOpacity={1} fill="url(#colorCustomers)" />
                <Area type="monotone" dataKey="pharmacies" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPharmacies)" />
                <defs>
                  <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPharmacies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Order Fulfillment Report (Pie Chart) */}
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Order Fulfillment Report</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dummyData.orderFulfillment}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dummyData.orderFulfillment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Analytics */}
          <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Monthly Revenue / Commission Earned</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dummyData.revenueAnalytics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#ffc658" fillOpacity={1} fill="url(#colorRevenue)" />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Reports</h2>

        {/* Monthly Pharmacy Performance Report */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-gray-800">Monthly Pharmacy Performance Report</h3>
            <button
              onClick={() => downloadCSV(dummyData.monthlyPharmacyPerformance, 'monthly_pharmacy_performance.csv')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              <FileText className="inline-block mr-2 w-5 h-5" /> Download CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders Fulfilled</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyData.monthlyPharmacyPerformance.map((pharmacy, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pharmacy.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pharmacy.orders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pharmacy.rating}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        pharmacy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {pharmacy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pharmacy.regDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Activity Report */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-gray-800">Customer Activity Report</h3>
            <button
              onClick={() => downloadCSV(dummyData.customerActivity, 'customer_activity_report.csv')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              <FileText className="inline-block mr-2 w-5 h-5" /> Download CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescriptions Uploaded</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyData.customerActivity.map((customer, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center space-x-3">
                      {customer.imageUrl ? (
                        <img src={customer.imageUrl} alt={customer.name} className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                      <span>{customer.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.prescriptions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        customer.status === 'Loyalty' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Suspended Accounts Report */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-gray-800">Suspended Accounts Report</h3>
            <button
              onClick={() => downloadCSV(dummyData.suspendedAccounts, 'suspended_accounts_report.csv')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              <FileText className="inline-block mr-2 w-5 h-5" /> Download CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Suspended</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyData.suspendedAccounts.map((account, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Revenue Report */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-gray-800">Monthly Revenue Report</h3>
            <button
              onClick={() => downloadCSV(dummyData.monthlyRevenueReport, 'monthly_revenue_report.csv')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              <FileText className="inline-block mr-2 w-5 h-5" /> Download CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Commission</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Commission per Order</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyData.monthlyRevenueReport.map((revenue, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{revenue.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${revenue.totalCommission.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${revenue.avgCommissionPerOrder.toFixed(2)}</td>
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
