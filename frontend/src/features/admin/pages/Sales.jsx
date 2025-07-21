import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  Receipt, Wallet, Repeat,Activity,TrendingUp, TrendingDown
} from 'lucide-react'; // Using lucide-react for icons
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';


const dummySalesData = {
  transactions: [
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
]
};

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

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterMonth, setFilterMonth] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Calculate KPIs for sales
  const totalReceivedPayments = dummySalesData.transactions
    .filter(t => t.type === 'Order Payment' || t.type === 'Commission Payment')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayoutsToPharmacies = dummySalesData.transactions
    .filter(t => t.type === 'Payout')
    .reduce((sum, t) => sum + t.amount, 0);

  // Filter and Search Logic
  const filteredAndSearchedTransactions = dummySalesData.transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' ||
      transaction.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'All' || transaction.type === filterType;

    const transactionDate = new Date(transaction.date);
    const transactionMonth = transactionDate.toLocaleString('default', { month: 'long' });
    const matchesMonth = filterMonth === 'All' || transactionMonth === filterMonth;

    return matchesSearch && matchesType && matchesMonth;
  });

  // Pagination Logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredAndSearchedTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredAndSearchedTransactions.length / transactionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Data for chart (e.g., transactions by type)
  const transactionTypeData = Object.entries(dummySalesData.transactions.reduce((acc, transaction) => {
    acc[transaction.type] = (acc[transaction.type] || 0) + transaction.amount;
    return acc;
  }, {})).map(([name, amount]) => ({ name, amount }));

  // Get unique months for filter dropdown
  const uniqueMonths = [...new Set(dummySalesData.transactions.map(t => new Date(t.date).toLocaleString('default', { month: 'long' })))];

        
    
        

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <PageHeader 
            icon={Activity} 
            title="Sales & Financial Overview"  
            subtitle="Comprehensive view of all financial transactions within the system." 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <StatCard label="Total Payments Recieved" value={`Rs. ${totalReceivedPayments.toFixed(2)}`} icon={<TrendingUp size={48} className="text-blue-500" />} />
            <StatCard label="Total Payouts to Pharmacies" value={`Rs. ${totalPayoutsToPharmacies.toFixed(2)}`}  icon={<TrendingDown size={48} className="text-red-500" />} />
            <StatCard label="Total Transactions" value={dummySalesData.transactions.length} icon={<Repeat size={48} className="text-purple-500" />} />
        </div>

        <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Transaction Summary</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-medium text-gray-800 mb-4">Transactions by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionTypeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" barSize={40} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">All Transactions</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by ID, Sender, or Receiver"
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Order Payment">Order Payment</option>
              <option value="Commission Payment">Commission Payment</option>
              <option value="Payout">Payout</option>
            </select>
            <select
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option value="All">All Months</option>
              {uniqueMonths.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
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
                {currentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.sender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.receiver}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'Commission Payment' ? 'bg-green-100 text-green-800' :
                        transaction.type === 'Payout' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs.{transaction.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(totalPages).keys()].map(number => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                  currentPage === number + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {number + 1}
              </button>
            ))}
          </div>
        </div>
      </section>
        

        

                
      

        
        
        

        
    </div>
  )
}

export default Sales

 