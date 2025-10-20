import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Receipt,
  Wallet,
  Repeat,
  Activity,
  TrendingUp,
  TrendingDown,
} from "lucide-react"; // Using lucide-react for icons
import StatCard from "../components/StatCard";
import PageHeader from "../components/PageHeader";
import {
  listOrderPayments,
  listCommissions,
  listPayouts,
} from "../../../services/api/AdminFinanceService";

// Helper to convert numeric month/year to MM/YYYY
const toMMYYYY = (month, year) => {
  if (!month || month === "All" || !year || year === "All") return undefined;
  return `${String(month).padStart(2, "0")}/${year}`;
};

const months = [
  { value: "All", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const years = ["All", "2023", "2024"];

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Server-backed data
  const [orders, setOrders] = useState([]); // /admin/order-payments
  const [commissions, setCommissions] = useState([]); // /admin/commissions
  const [payouts, setPayouts] = useState([]); // /admin/payouts
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data when filters/search change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const mmYYYY = toMMYYYY(filterMonth, filterYear);
        const [ordersResp, commissionsResp, payoutsResp] = await Promise.all([
          listOrderPayments({
            month: filterMonth !== "All" ? filterMonth : undefined,
            year: filterYear !== "All" ? filterYear : undefined,
            q: searchTerm || undefined,
            page: 1,
            size: 500,
          }),
          listCommissions({
            month: mmYYYY,
            year: filterYear !== "All" ? filterYear : undefined,
            page: 1,
            size: 500,
          }),
          listPayouts({
            month: mmYYYY,
            year: filterYear !== "All" ? filterYear : undefined,
            page: 1,
            size: 500,
          }),
        ]);
        setOrders(ordersResp?.items || []);
        setCommissions(commissionsResp?.items || []);
        setPayouts(payoutsResp?.items || []);
      } catch (e) {
        console.error("Failed to fetch sales data", e);
        setError(e?.message || "Failed to fetch sales data");
        setOrders([]);
        setCommissions([]);
        setPayouts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filterMonth, filterYear, searchTerm]);

  // Map backend DTOs to unified rows
  const mappedTransactions = useMemo(() => {
    const orderRows = (orders || []).map((o) => ({
      id: o.orderCode || o.id,
      date: o.date,
      _sortDate: o.date ? new Date(o.date) : new Date(0),
      sender: o.customerName || "Customer",
      receiver: o.pharmacyName || "Pharmacy",
      amount: Number(o.grossAmount || 0),
      type: "Order Payment",
      pharmacyName: o.pharmacyName || "",
    }));

    const commissionRows = (commissions || []).map((c) => {
      const paidAt = c.paidAt;
      const month = c.month; // MM/YYYY
      const d = paidAt
        ? new Date(paidAt)
        : month && month.includes("/")
        ? new Date(`${month.split("/")[1]}-${month.split("/")[0]}-01`)
        : new Date(0);
      return {
        id: c.id,
        date: paidAt || month || "",
        _sortDate: d,
        sender: c.pharmacyName || "Pharmacy",
        receiver: "PillPath",
        amount: Number(c.amount || 0),
        type: "Commission Payment",
        pharmacyName: c.pharmacyName || "",
      };
    });

    const payoutRows = (payouts || []).map((p) => {
      const paidAt = p.paidAt || p.date;
      const month = p.payoutMonth || p.month; // MM/YYYY
      const d = paidAt
        ? new Date(paidAt)
        : month && month.includes("/")
        ? new Date(`${month.split("/")[1]}-${month.split("/")[0]}-01`)
        : new Date(0);
      return {
        id: p.id,
        date: paidAt || month || "",
        _sortDate: d,
        sender: "PillPath",
        receiver: p.pharmacyName || "Pharmacy",
        amount: Number(p.amount || 0),
        type: "Payout",
        pharmacyName: p.pharmacyName || "",
      };
    });

    return [...orderRows, ...commissionRows, ...payoutRows]
      .filter((t) => !Number.isNaN(t.amount))
      .sort((a, b) => b._sortDate - a._sortDate);
  }, [orders, commissions, payouts]);

  // Filter and Search Logic
  const filteredAndSearchedTransactions = useMemo(() => {
    const lowered = (s) => (s || "").toString().toLowerCase();
    return mappedTransactions.filter((transaction) => {
      const matchesSearch =
        searchTerm === "" ||
        lowered(transaction.sender).includes(lowered(searchTerm)) ||
        lowered(transaction.receiver).includes(lowered(searchTerm)) ||
        lowered(transaction.id).includes(lowered(searchTerm)) ||
        lowered(transaction.pharmacyName).includes(lowered(searchTerm));

      const matchesType =
        filterType === "All" || transaction.type === filterType;

      // Month filter: apply client-side too (based on the transaction _sortDate month)
      const transactionDate =
        transaction._sortDate instanceof Date
          ? transaction._sortDate
          : new Date(transaction.date);
      const matchesMonth =
        filterMonth === "All" ||
        (transactionDate &&
          transactionDate.getMonth() + 1 === Number(filterMonth));

      const matchesYear =
        filterYear === "All" ||
        (transactionDate &&
          transactionDate.getFullYear() === Number(filterYear));

      return matchesSearch && matchesType && matchesMonth && matchesYear;
    });
  }, [mappedTransactions, searchTerm, filterType, filterMonth, filterYear]);

  // KPIs based on filtered data
  const totalReceivedPayments = filteredAndSearchedTransactions
    .filter(
      (t) => t.type === "Order Payment" || t.type === "Commission Payment"
    )
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalPayoutsToPharmacies = filteredAndSearchedTransactions
    .filter((t) => t.type === "Payout")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalTransactions = filteredAndSearchedTransactions.length;

  // Pagination Logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredAndSearchedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(
    filteredAndSearchedTransactions.length / transactionsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Chart Data
  const transactionTypeData = Object.entries(
    filteredAndSearchedTransactions.reduce((acc, transaction) => {
      acc[transaction.type] =
        (acc[transaction.type] || 0) + (Number(transaction.amount) || 0);
      return acc;
    }, {})
  ).map(([name, amount]) => ({ name, amount }));

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <PageHeader
        icon={Activity}
        title="Sales & Financial Overview"
        subtitle="Comprehensive view of all financial transactions within the system."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard
          label="Total Payments Received"
          value={`Rs. ${totalReceivedPayments.toFixed(2)}`}
          icon={<TrendingUp size={48} className="text-blue-500" />}
        />
        <StatCard
          label="Total Payouts to Pharmacies"
          value={`Rs. ${totalPayoutsToPharmacies.toFixed(2)}`}
          icon={<TrendingDown size={48} className="text-red-500" />}
        />
        <StatCard
          label="Total Transactions"
          value={totalTransactions}
          icon={<Repeat size={48} className="text-purple-500" />}
        />
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Transaction Summary
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-medium text-gray-800 mb-4">
            Transactions by Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Bar
                dataKey="amount"
                fill="#8884d8"
                barSize={40}
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          All Transactions
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by ID, Sender, or Receiver"
              className="flex-grow p-3 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="p-3 border border-gray-300 rounded-lg"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Order Payment">Order Payment</option>
              <option value="Commission Payment">Commission Payment</option>
              <option value="Payout">Payout</option>
            </select>
            <select
              className="p-3 border border-gray-300 rounded-lg"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select
              className="p-3 border border-gray-300 rounded-lg"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="mb-4 text-sm text-gray-600">
              Loading transactions…
            </div>
          )}
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                    Sender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                    Receiver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.sender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.receiver}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date
                        ? new Date(transaction.date).toString() !==
                          "Invalid Date"
                          ? new Date(transaction.date)
                              .toISOString()
                              .slice(0, 10)
                          : transaction.date
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === "Commission Payment"
                            ? "bg-green-100 text-green-800"
                            : transaction.type === "Payout"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs.{Number(transaction.amount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  currentPage === number + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {number + 1}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sales;
