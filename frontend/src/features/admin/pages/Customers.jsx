import { Users } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import SearchFilterBar from '../components/SearchFilterBar'
import { useState } from 'react'
import React from 'react'
import { Activity, Star, Ban, Eye, Trash2, UserPlus } from 'lucide-react'
import ViewDetailsModal from '../components/popup/ViewDetailsModal'
import SuspendUserModal from '../components/popup/SuspendUserModal'
import ActivateUserModal from '../components/popup/ActivateUserModal'

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
    orders: 8,
    loyaltyPoints: 0,
    suspendReason: null
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
    orders: 18,
    loyaltyPoints: 0,
    suspendReason: null
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    role: 'Customer',
    lastLogin: '2024-01-10 9:15 AM',
    status: 'Loyalty',
    joinDate: '2023-08-07',
    prescriptions: 6,
    orders: 4,
    loyaltyPoints: 120,
    suspendReason: null
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
    orders: 11,
    loyaltyPoints: 0,
    suspendReason: null
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
    orders: 2,
    loyaltyPoints: 0,
    suspendReason: 'Violation of terms and conditions - Multiple fake prescription uploads'
  }
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [suspendPopup, setSuspendPopup] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [activatePopup, setActivatePopup] = useState(null);


  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'All' || customer.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`min-h-screen bg-gray-100 p-8 font-sans ${selectedCustomer ? 'backdrop-blur-sm' : ''}`}>
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

      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterValue={filterStatus}
        setFilterValue={setFilterStatus}
        placeholder="Search by name or email..."
        filterOptions={['All', 'Active', 'Loyalty', 'Suspended']}
      />

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Prescriptions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Orders</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' :
                    user.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.prescriptions}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.orders}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedCustomer(user)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {user.status === 'Suspended' ? (
                      <button
                        className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-100 transition-colors"
                        title="Activate User"
                        onClick={() => setActivatePopup(user)}
                      >
                        <UserPlus size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setSuspendPopup(user)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                        title="Suspend User"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCustomer && (
        <ViewDetailsModal user={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
    )}

        {suspendPopup && (
            <SuspendUserModal
                user={suspendPopup}
                reason={suspendReason}
                setReason={setSuspendReason}
                onCancel={() => setSuspendPopup(null)}
                onConfirm={() => {
                console.log(`Suspended: ${suspendPopup.name}, Reason: ${suspendReason}`);
                setSuspendPopup(null);
                setSuspendReason('');
                }}
            />
            )}

            {activatePopup && (
            <ActivateUserModal
                user={activatePopup}
                onCancel={() => setActivatePopup(null)}
                onConfirm={() => {
                console.log(`Activated: ${activatePopup.name}`);
                setActivatePopup(null);
                }}
            />
            )}

      
    </div>
  )
}

export default Customers
