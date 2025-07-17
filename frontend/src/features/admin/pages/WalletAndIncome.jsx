import React from 'react'
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { Wallet,HandCoins,Handshake,CreditCard } from 'lucide-react';

const mockTransactions = [
  { id: 'TXN001', date: '2023-01-15', patient: 'Alice Smith', pharmacy: 'City Pharmacy', amount: 100.00, commissionRate: 0.10, paymentType: 'Online', status: 'Completed' },
  { id: 'TXN002', date: '2023-01-20', patient: 'Bob Johnson', pharmacy: 'Health Hub', amount: 50.00, commissionRate: 0.10, paymentType: 'On-Hand', status: 'Completed' },
  { id: 'TXN003', date: '2023-02-01', patient: 'Charlie Brown', pharmacy: 'MediCare Drugstore', amount: 75.00, commissionRate: 0.10, paymentType: 'Online', status: 'Completed' },
  { id: 'TXN004', date: '2023-02-10', patient: 'Diana Prince', pharmacy: 'City Pharmacy', amount: 120.00, commissionRate: 0.10, paymentType: 'On-Hand', status: 'Completed' },
  { id: 'TXN005', date: '2023-03-05', patient: 'Eve Adams', pharmacy: 'Quick Meds', amount: 90.00, commissionRate: 0.10, paymentType: 'Online', status: 'Completed' },
  { id: 'TXN006', date: '2023-03-12', patient: 'Frank White', pharmacy: 'Family Pharmacy', amount: 65.00, commissionRate: 0.10, paymentType: 'On-Hand', status: 'Completed' },
  { id: 'TXN007', date: '2023-04-01', patient: 'Grace Lee', pharmacy: 'City Pharmacy', amount: 110.00, commissionRate: 0.10, paymentType: 'Online', status: 'Completed' },
  { id: 'TXN008', date: '2023-04-20', patient: 'Henry King', pharmacy: 'Health Hub', amount: 80.00, commissionRate: 0.10, paymentType: 'On-Hand', status: 'Completed' },
  { id: 'TXN009', date: '2023-05-03', patient: 'Ivy Queen', pharmacy: 'MediCare Drugstore', amount: 150.00, commissionRate: 0.10, paymentType: 'Online', status: 'Completed' },
  { id: 'TXN010', date: '2023-05-18', patient: 'Jack Black', pharmacy: 'Quick Meds', amount: 70.00, commissionRate: 0.10, paymentType: 'Online', status: 'Completed' },
  { id: 'TXN011', date: '2023-06-07', patient: 'Karen Green', pharmacy: 'Family Pharmacy', amount: 95.00, commissionRate: 0.10, paymentType: 'On-Hand', status: 'Completed' },
  { id: 'TXN012', date: '2023-06-25', patient: 'Liam Blue', pharmacy: 'City Pharmacy', amount: 130.00, commissionRate: 0.10, paymentType: 'Online', status: 'Completed' },
  { id: 'TXN013', date: '2023-07-01', patient: 'Mia Red', pharmacy: 'Health Hub', amount: 88.00, commissionRate: 0.10, paymentType: 'On-Hand', status: 'Completed' },
  { id: 'TXN014', date: '2023-07-10', patient: 'Noah White', pharmacy: 'MediCare Drugstore', amount: 105.00, commissionRate: 0.10, paymentType: 'Online', status: 'Completed' },
  { id: 'TXN015', date: '2023-07-15', patient: 'Olivia Purple', pharmacy: 'Quick Meds', amount: 60.00, commissionRate: 0.10, paymentType: 'On-Hand', status: 'Completed' },
];

const WalletAndIncome = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">

        <PageHeader 
            icon={Wallet} 
            title="Wallet & Income Overview" 
            subtitle="Detailed financial insights into PillPath transactions and earnings" 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
            <StatCard label="Total Revenue" value={1250} icon={<HandCoins size={48} className="text-green-500" />} />
            <StatCard label="Total Online Payments" value={85} icon={<CreditCard size={48} className="text-pink-500" />} />
            <StatCard label="Total On-Hand Payments" value={45} icon={<Handshake size={48} className="text-purple-500" />} />
            <StatCard label="Current Wallet Balance" value={45} icon={<Wallet size={48} className="text-blue-500" />} />


        </div>
      
    </div>
  )
}

export default WalletAndIncome

