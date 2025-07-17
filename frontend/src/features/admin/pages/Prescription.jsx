import React from 'react'
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import SearchFilterBar from '../components/SearchFilterBar';
import {FileText,CheckLine,ClockAlert,Ban} from 'lucide-react';
import { useState } from 'react';

const prescriptions = [
  { id: 'PRX001', patient: 'Alice Smith', pharmacy: 'City Pharmacy', status: 'Completed', submitted: '2023-06-01',amount: '1500'  },
  { id: 'PRX002', patient: 'Bob Johnson', pharmacy: 'Health Hub', status: 'Pending', submitted: '2023-06-05', amount: '500' },
  { id: 'PRX003', patient: 'Charlie Brown', pharmacy: 'MediCare Drugstore', status: 'Approved', submitted: '2023-06-10', amount: '1000' },
  { id: 'PRX004', patient: 'Diana Prince', pharmacy: 'City Pharmacy', status: 'Rejected', submitted: '2023-06-12', amount: '1600' },
  { id: 'PRX005', patient: 'Eve Adams', pharmacy: 'Quick Meds', status: 'Pending', submitted: '2023-06-15',amount: '1300' },
];

const Prescription = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredPrescriptions = prescriptions.filter(prescriptions => {
    const matchesSearch =
      prescriptions.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescriptions.pharmacy.toLowerCase().includes(searchTerm.toLowerCase())||
      prescriptions.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'All' || prescriptions.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">

        <PageHeader 
            icon={FileText} 
            title="Prescription Management" 
            subtitle="Monitor and manage all prescription orders." 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <StatCard label="Accepted Prescriptions" value={250} icon={<CheckLine size={48} className="text-blue-500" />} />
            <StatCard label="Pending Prescriptions" value={16} icon={<ClockAlert size={48} className="text-yellow-500" />} />
            <StatCard label="Rejected Prescriptions" value={5} icon={<Ban size={48} className="text-red-500" />} />
        </div>

        <SearchFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterValue={filterStatus}
            setFilterValue={setFilterStatus}
            placeholder="Search id, patient name, pharmacy name..."
            filterOptions={['All', 'Completed','Approved', 'Pending', 'Rejected']}
        />

        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Order id</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Pharmacy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Submitted on</th>
              
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPrescriptions.map((prescription) => (
              <tr key={prescription.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prescription.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prescription.patient}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prescription.pharmacy}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    prescription.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    prescription.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    prescription.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {prescription.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prescription.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prescription.submitted}</td>
                
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}

export default Prescription
