import React from 'react'
import { ChartColumn,Users,Store,FileText,ShoppingBasket,ShieldCheck,HandCoins } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';

//mock data for stat cards
const stats = {
    customers: 1000,
    pharmacies: 50,
    prescriptions: 2500,
    orders: 100000,
    activePharmacies: 45,
    suspendedPharmacies: 5,
    income: 50000
}

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <PageHeader 
            icon={ChartColumn} 
            title="Reports & Analytics"  
            subtitle="In-depth insights into platform performance." 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <StatCard label="Total Users" value={` `} icon={<Users size={48} className="text-blue-500" />} />
            <StatCard label="Total Pharmacies" value={` `}  icon={<Store size={48} className="text-orange-500" />} />
            <StatCard label="Total Prescriptions Uploaded" value={` `}  icon={<FileText size={48} className="text-gray-500" />} />
            <StatCard label="Orders Processed" value={` `}  icon={<ShoppingBasket size={48} className="text-purple-500" />} />
            <StatCard label="Total Active vs Suspended Pharmacies" value={``}  icon={<ShieldCheck size={48} className="text-green-500" />} />
            <StatCard label="Monthly Revenue / Commission Earned" value={`Rs. `}  icon={<HandCoins size={48} className="text-pink-500" />} />
        </div>
      
    </div>
  )
}

export default Analytics
