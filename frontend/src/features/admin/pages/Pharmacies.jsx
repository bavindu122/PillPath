import React from 'react'
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import SearchFilterBar from '../components/SearchFilterBar';
import { Store,Activity,Ban,ClockAlert } from 'lucide-react';
import { useState } from 'react';

const pharmacies = [
  {
    id: 1,
    name: 'MedPlus Pharmacy',
    email: 'contact@medplus.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    status: 'Active',
    joinDate: '2023-03-15',
    orders: 245,
    rating: 4.8,
    license: 'NY-PHARM-001234'
  },
  {
    id: 2,
    name: 'HealthCare Pharmacy',
    email: 'info@healthcare-ph.com',
    phone: '+1 (555) 234-5678',
    location: 'Los Angeles, CA',
    status: 'Active',
    joinDate: '2023-01-22',
    orders: 189,
    rating: 4.6,
    license: 'CA-PHARM-005678'
  },
  {
    id: 3,
    name: 'QuickMeds',
    email: 'support@quickmeds.com',
    phone: '+1 (555) 345-6789',
    location: 'Chicago, IL',
    status: 'Pending',
    joinDate: '2024-01-10',
    orders: 0,
    rating: 0,
    license: 'IL-PHARM-009012'
  },
  {
    id: 4,
    name: 'Family Pharmacy',
    email: 'hello@familypharm.com',
    phone: '+1 (555) 456-7890',
    location: 'Houston, TX',
    status: 'Active',
    joinDate: '2023-08-07',
    orders: 156,
    rating: 4.9,
    license: 'TX-PHARM-003456'
  },
  {
    id: 5,
    name: 'Metro Pharmacy',
    email: 'contact@metro-pharm.com',
    phone: '+1 (555) 567-8901',
    location: 'Phoenix, AZ',
    status: 'Inactive',
    joinDate: '2023-06-30',
    orders: 78,
    rating: 4.2,
    license: 'AZ-PHARM-007890'
  }
];

const Pharmacies = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredPharmacies = pharmacies.filter(pharmacy => {
    const matchesSearch =
      pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'All' || pharmacy.status === filterStatus;

    return matchesSearch && matchesStatus;
  });


  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">

        <PageHeader 
            icon={Store} 
            title="Pharmacy Management" 
            subtitle="Manage all registered pharmacies on the PillPath platform." 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <StatCard label="Active Pharmacies" value={1250} icon={<Activity size={48} className="text-blue-500" />} />
            <StatCard label="Pending Approval" value={85} icon={<ClockAlert size={48} className="text-yellow-500" />} />
            <StatCard label="Suspended Pharmacies" value={45} icon={<Ban size={48} className="text-red-500" />} />
        </div>

        <SearchFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterValue={filterStatus}
            setFilterValue={setFilterStatus}
            placeholder="Search by name or email..."
            filterOptions={['All', 'Active', 'Pending', 'Suspended']}
        />
      
    </div>
  )
}

export default Pharmacies
