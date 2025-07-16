import { Users } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import React from 'react'
import { Activity, Star,Ban } from 'lucide-react'

const customers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@email.com',
    role: 'Customer',
    lastLogin: '2024-01-15 10:30 AM',
    status: 'Active',
    joinDate: '2023-06-15',
    prescriptions: 12,
    orders: 8
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    role: 'Premium Customer',
    lastLogin: '2024-01-14 3:45 PM',
    status: 'Active',
    joinDate: '2023-03-22',
    prescriptions: 24,
    orders: 18
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    role: 'Customer',
    lastLogin: '2024-01-10 9:15 AM',
    status: 'Inactive',
    joinDate: '2023-08-07',
    prescriptions: 6,
    orders: 4
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    role: 'Customer',
    lastLogin: '2024-01-15 2:20 PM',
    status: 'Active',
    joinDate: '2023-11-12',
    prescriptions: 15,
    orders: 11
  },
  {
    id: 5,
    name: 'Robert Wilson',
    email: 'robert.w@email.com',
    role: 'Customer',
    lastLogin: '2024-01-13 11:05 AM',
    status: 'Suspended',
    joinDate: '2023-09-30',
    prescriptions: 3,
    orders: 2
  }
];

const Customers = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
        <PageHeader 
        icon={Users} 
        title="Customer Management" 
        subtitle="Manage registered customers and their account details" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard label="Active Customers" value={1250} icon={<Activity size={48} className="text-blue-500" />} />
        <StatCard label="Loyalty Members" value={85} icon={<Star size={48} className="text-yellow-500" />} />
        <StatCard label="Suspended Accounts" value={45} icon={<Ban size={48} className="text-red-500" />} />
      
    </div>
      
    </div>
  )
}

export default Customers
