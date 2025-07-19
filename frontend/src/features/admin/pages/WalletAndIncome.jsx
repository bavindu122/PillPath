import React from 'react'
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { Wallet,HandCoins,Handshake,CreditCard ,Search,Filter} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import ChartCard from '../components/ChartCard';
import { useState } from 'react';

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

const commissionRate = 0.10;



const WalletAndIncome = () => {

    const [transactions, setTransactions] = useState(mockTransactions);
    const [filterMonth, setFilterMonth] = useState('All');
    const [filterYear, setFilterYear] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleRows, setVisibleRows] = useState(10);

    const transactionsWithCalculatedFields = transactions.map(tx => {
        const commission = tx.amount * commissionRate;
        // displayCommission is signed: positive for online, negative for on-hand
        const displayCommission = tx.paymentType === 'On-Hand' ? -commission : commission;
        return {
        ...tx,
        commission: commission, // This is the absolute commission for total income calculation
        displayCommission: displayCommission // This is the signed commission for table display
        };
    });

    const filteredTransactions = transactionsWithCalculatedFields.filter(tx => {
        const txDate = new Date(tx.date);
        const matchesMonth = filterMonth === 'All' || (txDate.getMonth() + 1).toString() === filterMonth;
        const matchesYear = filterYear === 'All' || txDate.getFullYear().toString() === filterYear;
        const matchesSearch = searchTerm === '' ||
                            tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tx.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tx.pharmacy.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesMonth && matchesYear && matchesSearch;
    });

    // Total commission income (always positive, represents gross earnings)
    const totalCommissionIncome = filteredTransactions.reduce((sum, tx) => sum + tx.amount * commissionRate, 0);
    // Total amounts for online and on-hand payments
    const totalOnlinePayments = filteredTransactions.filter(tx => tx.paymentType === 'Online').reduce((sum, tx) => sum + tx.commission, 0);
    const totalOnHandPayments = filteredTransactions.filter(tx => tx.paymentType === 'On-Hand').reduce((sum, tx) => sum + tx.commission, 0);
    // Wallet balance based on net cash flow through the system
    const walletBalance = totalCommissionIncome - totalOnHandPayments;

    // Prepare data for the income chart (using absolute commission for overall trend)
  const incomeByMonth = filteredTransactions.reduce((acc, tx) => {
    const monthYear = new Date(tx.date).toLocaleString('en-US', { month: 'short', year: 'numeric' });
    acc[monthYear] = (acc[monthYear] || 0) + tx.commission; // Use absolute commission for total income trend
    return acc;
  }, {});

  const chartDataIncome = Object.keys(incomeByMonth).map(key => ({
    name: key,
    income: parseFloat(incomeByMonth[key].toFixed(2))
  })).sort((a, b) => new Date(a.name) - new Date(b.name)); // Sort by date


    const paymentsByMonth = filteredTransactions.reduce((acc, tx) => {
    const monthYear = new Date(tx.date).toLocaleString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[monthYear]) {
        acc[monthYear] = { online: 0, onHand: 0 };
    }
    if (tx.paymentType === 'Online') {
        acc[monthYear].online += tx.amount;
    } else {
        acc[monthYear].onHand += tx.amount;
    }
    return acc;
    }, {});

    const chartDataPayments = Object.keys(paymentsByMonth).map(key => ({
    name: key,
    online: parseFloat(paymentsByMonth[key].online.toFixed(2)),
    onHand: parseFloat(paymentsByMonth[key].onHand.toFixed(2))
    })).sort((a, b) => new Date(a.name) - new Date(b.name));


    // Get only the visible transactions based on visibleRows
    const visibleTransactions = filteredTransactions.slice(0, visibleRows);
    const hasMoreTransactions = filteredTransactions.length > visibleRows;

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
            icon={Wallet} 
            title="Wallet & Income Overview"  
            subtitle="Detailed financial insights into PillPath transactions and earnings" 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
            <StatCard label="Total Revenue" value={`Rs. ${totalCommissionIncome.toLocaleString()}`} icon={<HandCoins size={48} className="text-green-500" />} />
            <StatCard label="Total Online Payments Income" value={`Rs. ${totalOnlinePayments.toLocaleString()}`}  icon={<CreditCard size={48} className="text-pink-500" />} />
            <StatCard label="Total On-Hand Payments Income" value={`Rs. ${totalOnHandPayments.toLocaleString()}`}  icon={<Handshake size={48} className="text-purple-500" />} />
            <StatCard label="Current Wallet Balance" value={`Rs. ${walletBalance.toLocaleString()}`}  icon={<Wallet size={48} className="text-blue-500" />} />
        </div>

        
        

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-1/3">
                <input
                type="text"
                placeholder="Search by ID, patient, or pharmacy..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <div className="w-full md:w-1/4">
                <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                >
                {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                ))}
                </select>
            </div>
            <div className="w-full md:w-1/4">
                <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                >
                {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
                </select>
            </div>
            </div>
        </div >

        {/** Income Chart Card */}
        <ChartCard title="Monthly Commission Income Trend">
            <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartDataIncome}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `Rs. ${value.toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#8884d8" activeDot={{ r: 8 }} name="Commission Income" />
            </LineChart>
            </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Online vs. On-Hand Payments" >
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartDataPayments} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `Rs. ${value.toFixed(2)}`} />
                        <Bar dataKey="online" fill="#3b82f6" name="Online Payments" radius={[5, 5, 0, 0]} />
                        <Bar dataKey="onHand" fill="#a855f7" name="On-Hand Payments" radius={[5, 5, 0, 0]} />
                        <Legend />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>

        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Transaction id</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Pharmacy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Payment Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Amount (Rs.)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">Commission (Rs.)</th>
              
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              visibleTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.patient}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.pharmacy}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    tx.paymentType === 'Online' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                    
                  }`}>
                    {tx.paymentType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`${tx.displayCommission < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {tx.displayCommission.toFixed(2)}
                    </span></td>
                
                
              </tr>
            ))
            ) : (
                <tr>
                <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  No transactions found matching your criteria.
                </td>
              </tr>
            )}
                
          </tbody>
        </table>

        {hasMoreTransactions && (
            <div className="mt-6 flex justify-center">
            <button
                onClick={handleViewMore}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
                <span>View More ({Math.min(10, filteredTransactions.length - visibleRows)} more)</span>
            </button>
            </div>
        )}

        {/* Show total count */}
        <div className="mt-4 text-center text-sm text-gray-500">
            Showing {visibleTransactions.length} of {filteredTransactions.length} transactions
        </div>
      </div>
    </div>
  )
}

export default WalletAndIncome

