import React from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { Activity, TrendingUp, TrendingDown,Search } from 'lucide-react';
import { useState } from 'react';
import SearchFilterBar from '../components/SearchFilterBar';

const mockSalesTransactions = [
  { id: 'ORD001', date: '2023-01-10', sender: 'Customer A', receiver: 'City Pharmacy', amount: 100.00, type: 'Order Payment', pharmacyName: 'City Pharmacy' },
  { id: 'ORD002', date: '2023-01-12', sender: 'Customer B', receiver: 'Health Hub', amount: 50.00, type: 'Order Payment', pharmacyName: 'Health Hub' },
  { id: 'ORD003', date: '2023-02-05', sender: 'Customer C', receiver: 'MediCare Drugstore', amount: 75.00, type: 'Order Payment', pharmacyName: 'MediCare Drugstore' },
  { id: 'ORD004', date: '2023-02-15', sender: 'Customer D', receiver: 'City Pharmacy', amount: 120.00, type: 'Order Payment', pharmacyName: 'City Pharmacy' },
  { id: 'ORD005', date: '2023-03-01', sender: 'Customer E', receiver: 'Quick Meds', amount: 90.00, type: 'Order Payment', pharmacyName: 'Quick Meds' },
  { id: 'ORD006', date: '2023-03-20', sender: 'Customer F', receiver: 'Health Hub', amount: 65.00, type: 'Order Payment', pharmacyName: 'Health Hub' },
  { id: 'ORD007', date: '2023-04-08', sender: 'Customer G', receiver: 'City Pharmacy', amount: 110.00, type: 'Order Payment', pharmacyName: 'City Pharmacy' },
  { id: 'ORD008', date: '2023-04-25', sender: 'Customer H', receiver: 'MediCare Drugstore', amount: 80.00, type: 'Order Payment', pharmacyName: 'MediCare Drugstore' },
  { id: 'ORD009', date: '2023-05-02', sender: 'Customer I', receiver: 'Quick Meds', amount: 150.00, type: 'Order Payment', pharmacyName: 'Quick Meds' },
  { id: 'ORD010', date: '2023-05-19', sender: 'Customer J', receiver: 'Health Hub', amount: 70.00, type: 'Order Payment', pharmacyName: 'Health Hub' },
  { id: 'ORD011', date: '2023-06-03', sender: 'Customer K', receiver: 'City Pharmacy', amount: 95.00, type: 'Order Payment', pharmacyName: 'City Pharmacy' },
  { id: 'ORD012', date: '2023-06-28', sender: 'Customer L', receiver: 'MediCare Drugstore', amount: 130.00, type: 'Order Payment', pharmacyName: 'MediCare Drugstore' },
  { id: 'ORD013', date: '2023-07-07', sender: 'Customer M', receiver: 'Quick Meds', amount: 88.00, type: 'Order Payment', pharmacyName: 'Quick Meds' },
  { id: 'ORD014', date: '2023-07-14', sender: 'Customer N', receiver: 'Health Hub', amount: 105.00, type: 'Order Payment', pharmacyName: 'Health Hub' },

  
  { id: 'COM001', date: '2023-01-11', sender: 'City Pharmacy', receiver: 'PillPath', amount: 10.00, type: 'Commission Payment', pharmacyName: 'City Pharmacy' }, // 10% of 100
  { id: 'COM002', date: '2023-01-13', sender: 'Health Hub', receiver: 'PillPath', amount: 5.00, type: 'Commission Payment', pharmacyName: 'Health Hub' }, // 10% of 50
  { id: 'COM003', date: '2023-02-06', sender: 'MediCare Drugstore', receiver: 'PillPath', amount: 7.50, type: 'Commission Payment', pharmacyName: 'MediCare Drugstore' }, // 10% of 75
  { id: 'COM004', date: '2023-02-16', sender: 'City Pharmacy', receiver: 'PillPath', amount: 12.00, type: 'Commission Payment', pharmacyName: 'City Pharmacy' }, // 10% of 120
  { id: 'COM005', date: '2023-03-02', sender: 'Quick Meds', receiver: 'PillPath', amount: 9.00, type: 'Commission Payment', pharmacyName: 'Quick Meds' }, // 10% of 90
  { id: 'COM006', date: '2023-03-21', sender: 'Health Hub', receiver: 'PillPath', amount: 6.50, type: 'Commission Payment', pharmacyName: 'Health Hub' }, // 10% of 65
  { id: 'COM007', date: '2023-04-09', sender: 'City Pharmacy', receiver: 'PillPath', amount: 11.00, type: 'Commission Payment', pharmacyName: 'City Pharmacy' }, // 10% of 110
  { id: 'COM008', date: '2023-04-26', sender: 'MediCare Drugstore', receiver: 'PillPath', amount: 8.00, type: 'Commission Payment', pharmacyName: 'MediCare Drugstore' }, // 10% of 80
  { id: 'COM009', date: '2023-05-03', sender: 'Quick Meds', receiver: 'PillPath', amount: 15.00, type: 'Commission Payment', pharmacyName: 'Quick Meds' }, // 10% of 150
  { id: 'COM010', date: '2023-05-20', sender: 'Health Hub', receiver: 'PillPath', amount: 7.00, type: 'Commission Payment', pharmacyName: 'Health Hub' }, // 10% of 70
  { id: 'COM011', date: '2023-06-04', sender: 'City Pharmacy', receiver: 'PillPath', amount: 9.50, type: 'Commission Payment', pharmacyName: 'City Pharmacy' }, // 10% of 95
  { id: 'COM012', date: '2023-06-29', sender: 'MediCare Drugstore', receiver: 'PillPath', amount: 13.00, type: 'Commission Payment', pharmacyName: 'MediCare Drugstore' }, // 10% of 130
  { id: 'COM013', date: '2023-07-08', sender: 'Quick Meds', receiver: 'PillPath', amount: 8.80, type: 'Commission Payment', pharmacyName: 'Quick Meds' }, // 10% of 88
  { id: 'COM014', date: '2023-07-15', sender: 'Health Hub', receiver: 'PillPath', amount: 10.50, type: 'Commission Payment', pharmacyName: 'Health Hub' }, // 10% of 105

  
  { id: 'PAY001', date: '2023-01-25', sender: 'PillPath', receiver: 'City Pharmacy', amount: 90.00, type: 'Payout', pharmacyName: 'City Pharmacy' }, 
  { id: 'PAY002', date: '2023-02-28', sender: 'PillPath', receiver: 'MediCare Drugstore', amount: 67.50, type: 'Payout', pharmacyName: 'MediCare Drugstore' }, 
  { id: 'PAY003', date: '2023-03-15', sender: 'PillPath', receiver: 'Quick Meds', amount: 81.00, type: 'Payout', pharmacyName: 'Quick Meds' }, 
  { id: 'PAY004', date: '2023-04-10', sender: 'PillPath', receiver: 'City Pharmacy', amount: 99.00, type: 'Payout', pharmacyName: 'City Pharmacy' }, 
  { id: 'PAY005', date: '2023-05-10', sender: 'PillPath', receiver: 'Quick Meds', amount: 135.00, type: 'Payout', pharmacyName: 'Quick Meds' }, 
  { id: 'PAY006', date: '2023-06-10', sender: 'PillPath', receiver: 'City Pharmacy', amount: 85.50, type: 'Payout', pharmacyName: 'City Pharmacy' }, 
  { id: 'PAY007', date: '2023-07-20', sender: 'PillPath', receiver: 'Quick Meds', amount: 79.20, type: 'Payout', pharmacyName: 'Quick Meds' }, 
];

const months = [
  { value: 'All', label: 'All Months' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const years = ['All', '2023', '2024'];

const Sales = () => {

        const [transactions, setTransactions] = useState(mockSalesTransactions);
        const [filterMonth, setFilterMonth] = useState('All');
        const [filterYear, setFilterYear] = useState('All');
        const [searchTerm, setSearchTerm] = useState('');
        const [visibleRows, setVisibleRows] = useState(10);
        const [filterStatus, setFilterStatus] = useState('All');

        //calculate all payments recieved to pillpath
        const totalPaymentsRecieved = transactions.reduce((total, transaction) => {
          if (transaction.type === 'Commission Payment') {
            return total + transaction.amount;
          }
          return total;
        }, 0);

        //calculate all payouts to pharmacies
        const totalPayoutsToPharmacies = transactions.reduce((total, transaction) => {
          if (transaction.type === 'Payout') {
            return total + transaction.amount;
          }
          return total;
        }, 0);
    

    const filteredSales = transactions.filter(transaction => {
      const matchesSearch =
        transaction.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.date.includes(searchTerm);

    const matchesStatus =
      filterStatus === 'All' || transaction.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Get only the visible transactions based on visibleRows
    const visibleTransactions = filteredSales.slice(0, visibleRows);
    const hasMoreTransactions = filteredSales.length > visibleRows;

    // Handle "View More" button click
    const handleViewMore = () => {
        setVisibleRows(prev => prev + 10);
    };

    // Reset visible rows when filters change
    const handleFilterChange = (setter) => (value) => {
        setter(value);
        setVisibleRows(10);
    };

        
    
        

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <PageHeader 
            icon={Activity} 
            title="Sales & Financial Overview"  
            subtitle="Comprehensive view of all financial transactions within the system." 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
            <StatCard label="Total Payments Recieved" value={`Rs. ${totalPaymentsRecieved.toFixed(2)}`} icon={<TrendingUp size={48} className="text-blue-500" />} />
            <StatCard label="Total Payouts to Pharmacies" value={`Rs. ${totalPayoutsToPharmacies.toFixed(2)}`}  icon={<TrendingDown size={48} className="text-red-500" />} />

        </div>

        

        {/*display table of all transactions */}
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Transaction ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Sender</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Reciever</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Amount</th>
                      
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {visibleTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.sender}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.receiver}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.type === 'Order Payment' ? 'bg-blue-100 text-blue-800' :
                            transaction.type === 'Commission Payment' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                            
                        }`}>
                            {transaction.type}
                        </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.amount}</td>
                        
                        
                      </tr>
                    ))}
                  </tbody>
                </table>

                {hasMoreTransactions && (
                    <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleViewMore}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                        <span>View More ({Math.min(10, filteredSales.length - visibleRows)} more)</span>
                    </button>
                    </div>
                )}

                {/* Show total count */}
                <div className="mt-4 text-center text-sm text-gray-500">
                    Showing {visibleTransactions.length} of {filteredSales.length} transactions
                </div>

        </div>

        
        
        

        
    </div>
  )
}

export default Sales

 