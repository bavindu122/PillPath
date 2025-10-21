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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Store,
  Search,
  Filter,
  Calendar,
  Download,
  Wallet,
  Eye,
  CheckCircle,
  XCircle,
  Upload,
  CreditCard,
  HandCoins,
  Handshake,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import AdminFinanceService, {
  listOrderPayments,
  listCommissions,
  listPayouts,
  updateCommissionStatus,
  uploadPayoutReceipt,
  updatePayout,
} from "../../../services/api/AdminFinanceService";

// Helpers to map DTOs to UI needs
const receivedStatusLabel = (order) => {
  if (order.settlementChannel === "ONLINE") return "Received";
  if (order.onHandCommissionReceived === true) return "Received";
  if (order.onHandCommissionReceived === false) return "Unreceived";
  return "Not Paid"; // null -> NOT_PAID
};

const WalletAndIncome = () => {
  // Server-backed data
  const [orders, setOrders] = useState([]); // items from /admin/order-payments
  const [ordersPage, setOrdersPage] = useState(1);
  const transactionsPerPage = 10;
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [paidPayouts, setPaidPayouts] = useState([]); // items from /admin/payouts status=PAID (for current filters)
  const [paidCommissions, setPaidCommissions] = useState([]); // items from /admin/commissions status=PAID (for current filters)
  const [auxLoading, setAuxLoading] = useState(false);

  // Modal data
  const [modalCustomerPayments, setModalCustomerPayments] = useState([]);
  const [modalPayouts, setModalPayouts] = useState([]);
  const [modalCommissions, setModalCommissions] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPharmacyPage, setCurrentPharmacyPage] = useState(1);
  const pharmaciesPerPage = 6;
  const [isPharmacyDetailsModalOpen, setIsPharmacyDetailsModalOpen] =
    useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  // State for receipt upload modal
  const [isReceiptUploadModalOpen, setIsReceiptUploadModalOpen] =
    useState(false);
  const [payoutToMark, setPayoutToMark] = useState(null);
  const [receiptUrlInput, setReceiptUrlInput] = useState("");
  const [selectedReceiptFile, setSelectedReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState("");

  // Fetch orders when filters/search/page change
  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const resp = await listOrderPayments({
          month: filterMonth !== "All" ? filterMonth : undefined,
          year: filterYear !== "All" ? filterYear : undefined,
          q: searchTerm || undefined,
          page: currentPage,
          size: transactionsPerPage,
        });
        setOrders(resp.items || []);
        setOrdersTotal(resp.total || 0);
      } catch (e) {
        console.error("Failed to fetch order payments", e);
        setOrders([]);
        setOrdersTotal(0);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [filterMonth, filterYear, searchTerm, currentPage]);

  // Fetch paid payouts and commissions for current filters (used for cards and overview)
  useEffect(() => {
    const fetchAux = async () => {
      setAuxLoading(true);
      try {
        const mmYYYY =
          filterMonth !== "All" && filterYear !== "All"
            ? `${String(filterMonth).padStart(2, "0")}/${filterYear}`
            : undefined;
        const [payoutsResp, commissionsResp] = await Promise.all([
          listPayouts({
            month: mmYYYY,
            year: filterYear !== "All" ? filterYear : undefined,
            status: "PAID",
            page: 1,
            size: 1000,
          }),
          listCommissions({
            month: mmYYYY,
            year: filterYear !== "All" ? filterYear : undefined,
            status: "PAID",
            page: 1,
            size: 1000,
          }),
        ]);
        setPaidPayouts(payoutsResp.items || []);
        setPaidCommissions(commissionsResp.items || []);
      } catch (e) {
        console.error("Failed to fetch payouts/commissions", e);
        setPaidPayouts([]);
        setPaidCommissions([]);
      } finally {
        setAuxLoading(false);
      }
    };
    fetchAux();
  }, [filterMonth, filterYear]);

  // Server pagination for orders table
  const currentCustomerPayments = orders;
  const totalCustomerPaymentPages = Math.ceil(
    (ordersTotal || 0) / transactionsPerPage
  );

  const paginateCustomerPayments = (pageNumber) => setCurrentPage(pageNumber);

  // Pagination Logic for Pharmacy Wallet Overview
  // Derive unique pharmacies from current orders page
  const uniquePharmacies = useMemo(() => {
    const set = new Set();
    orders.forEach((o) => set.add(o.pharmacyName));
    return Array.from(set);
  }, [orders]);

  const indexOfLastPharmacy = currentPharmacyPage * pharmaciesPerPage;
  const indexOfFirstPharmacy = indexOfLastPharmacy - pharmaciesPerPage;
  const currentPharmacies = uniquePharmacies.slice(
    indexOfFirstPharmacy,
    indexOfLastPharmacy
  );
  const totalPharmacyPages = Math.ceil(
    uniquePharmacies.length / pharmaciesPerPage
  );

  const paginatePharmacies = (pageNumber) => setCurrentPharmacyPage(pageNumber);

  // Calculate Stat Cards
  const totalRevenue = orders.reduce((sum, o) => sum + (o.grossAmount || 0), 0);
  const totalOnlinePaymentIncome = orders
    .filter((o) => o.settlementChannel === "ONLINE")
    .reduce((sum, o) => sum + (o.grossAmount || 0), 0);
  const totalOnHandPaymentIncome = orders
    .filter((o) => o.settlementChannel === "ON_HAND")
    .reduce((sum, o) => sum + (o.grossAmount || 0), 0);
  const totalPayoutsToPharmacies = paidPayouts.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );
  const currentWalletBalance =
    totalOnlinePaymentIncome - totalPayoutsToPharmacies;

  // Prepare data for Top 5 Pharmacies by Commission (Paid, On-Hand only)
  const commissionByPharmacy = paidCommissions.reduce((acc, c) => {
    const name = c.pharmacyName;
    if (!name) return acc;
    acc[name] = (acc[name] || 0) + (c.amount || 0);
    return acc;
  }, {});

  const topPharmaciesData = Object.keys(commissionByPharmacy)
    .map((name) => ({
      name,
      commission: parseFloat(commissionByPharmacy[name].toFixed(2)),
    }))
    .sort((a, b) => b.commission - a.commission)
    .slice(0, 5);

  // Prepare data for Monthly Online vs. On-Hand Payments Chart
  const paymentsByMonth = orders.reduce((acc, o) => {
    const monthYear = new Date(o.date).toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });
    if (!acc[monthYear]) {
      acc[monthYear] = { online: 0, onHand: 0 };
    }
    if (o.settlementChannel === "ONLINE") {
      acc[monthYear].online += o.grossAmount || 0;
    } else {
      acc[monthYear].onHand += o.grossAmount || 0;
    }
    return acc;
  }, {});

  const chartDataPayments = Object.keys(paymentsByMonth)
    .map((key) => ({
      name: key,
      online: parseFloat(paymentsByMonth[key].online.toFixed(2)),
      onHand: parseFloat(paymentsByMonth[key].onHand.toFixed(2)),
    }))
    .sort((a, b) => new Date(a.name) - new Date(b.name)); // Sort by date

  // Filters removed from UI; default filterMonth/filterYear remain "All" for backend queries

  const handleExportData = (reportName, data) => {
    if (!data || data.length === 0) {
      alert("No data to export for the selected filters.");
      return;
    }
    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(data[0]).join(",") +
      "\n" +
      data.map((e) => Object.values(e).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportName}_sales.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(`Exporting ${reportName} data...`);
  };

  // --- Pharmacy Wallet Details Logic ---
  const getPharmacyWalletSummary = (pharmacyName) => {
    const totalPaidCommissions = paidCommissions
      .filter((c) => c.pharmacyName === pharmacyName)
      .reduce((sum, c) => sum + (c.amount || 0), 0);
    const totalPayoutsReceived = paidPayouts
      .filter((p) => p.pharmacyName === pharmacyName)
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    return {
      totalPaidCommissions: totalPaidCommissions.toFixed(2),
      totalPayoutsReceived: totalPayoutsReceived.toFixed(2),
    };
  };

  const handleViewPharmacyDetails = async (pharmacyName) => {
    setSelectedPharmacy(pharmacyName);
    setIsPharmacyDetailsModalOpen(true);
    setModalLoading(true);
    try {
      const mmYYYY =
        filterMonth !== "All" && filterYear !== "All"
          ? `${String(filterMonth).padStart(2, "0")}/${filterYear}`
          : undefined;
      // Fetch per-pharmacy datasets
      const [ordersResp, payoutsResp, commissionsResp] = await Promise.all([
        listOrderPayments({
          pharmacyId: orders.find((o) => o.pharmacyName === pharmacyName)
            ?.pharmacyId,
          month: filterMonth !== "All" ? filterMonth : undefined,
          year: filterYear !== "All" ? filterYear : undefined,
          page: 1,
          size: 100,
        }),
        listPayouts({
          pharmacyId: orders.find((o) => o.pharmacyName === pharmacyName)
            ?.pharmacyId,
          month: mmYYYY,
          year: filterYear !== "All" ? filterYear : undefined,
          page: 1,
          size: 100,
        }),
        listCommissions({
          pharmacyId: orders.find((o) => o.pharmacyName === pharmacyName)
            ?.pharmacyId,
          month: mmYYYY,
          year: filterYear !== "All" ? filterYear : undefined,
          page: 1,
          size: 100,
        }),
      ]);
      setModalCustomerPayments(ordersResp.items || []);
      setModalPayouts(payoutsResp.items || []);
      setModalCommissions(commissionsResp.items || []);
    } catch (e) {
      console.error("Failed to fetch pharmacy modal data", e);
      setModalCustomerPayments([]);
      setModalPayouts([]);
      setModalCommissions([]);
    } finally {
      setModalLoading(false);
    }
  };

  const handleClosePharmacyDetailsModal = () => {
    setIsPharmacyDetailsModalOpen(false);
    setSelectedPharmacy(null);
  };

  const handleMarkPayoutStatusInitiate = (payoutTx) => {
    setPayoutToMark(payoutTx);
    setReceiptUrlInput(payoutTx.receiptUrl || ""); // Pre-fill if already exists
    setSelectedReceiptFile(null);
    setReceiptPreview("");
    setIsReceiptUploadModalOpen(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        alert(
          "Please select a valid image file (JPEG, PNG, GIF) or PDF document."
        );
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert("File size must be less than 5MB.");
        return;
      }

      setSelectedReceiptFile(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setReceiptPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setReceiptPreview(""); // No preview for PDFs
      }
    }
  };

  const handleConfirmPayoutPaid = async () => {
    if (!(payoutToMark && selectedReceiptFile)) {
      alert("Please upload a receipt file before confirming the payout.");
      return;
    }
    try {
      const uploaded = await uploadPayoutReceipt(selectedReceiptFile);
      const updated = await updatePayout(payoutToMark.id, {
        status: "PAID",
        receiptUrl: uploaded.url,
        receiptFileName: uploaded.fileName,
        receiptFileType: uploaded.fileType,
        paidAt: new Date().toISOString(),
      });

      // Update modal payouts list
      setModalPayouts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      // Refresh paidPayouts cache
      setPaidPayouts((prev) => {
        const others = prev.filter((p) => p.id !== updated.id);
        return [...others, updated];
      });

      // Reset modal state
      setIsReceiptUploadModalOpen(false);
      setPayoutToMark(null);
      setReceiptUrlInput("");
      setSelectedReceiptFile(null);
      setReceiptPreview("");
    } catch (e) {
      console.error("Failed to mark payout as paid", e);
      alert("Failed to mark payout as paid. Please try again.");
    }
  };

  const handleMarkCommissionStatus = async (commissionId, newStatus) => {
    try {
      const updated = await updateCommissionStatus(commissionId, {
        status: newStatus,
      });
      // Update modal commissions list
      setModalCommissions((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      // Update orders where this commission belongs to
      setOrders((prev) =>
        prev.map((o) =>
          o.commissionId === updated.id
            ? {
                ...o,
                onHandCommissionReceived:
                  updated.status === "PAID"
                    ? true
                    : updated.status === "UNPAID"
                    ? false
                    : null,
              }
            : o
        )
      );
    } catch (e) {
      console.error("Failed to update commission status", e);
      alert("Failed to update commission status. Please try again.");
    }
  };

  // Payment received status is derived from settlementChannel and commission status.

  const getPharmacyDetailedTransactions = (pharmacyName) => {
    // Use modal datasets fetched for this pharmacy
    return {
      customerPayments: modalCustomerPayments.filter(
        (o) => o.pharmacyName === pharmacyName
      ),
      payoutsFromSystem: modalPayouts.filter(
        (p) => p.pharmacyName === pharmacyName
      ),
      commissionsDue: modalCommissions.filter(
        (c) => c.pharmacyName === pharmacyName
      ),
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <PageHeader
        icon={Wallet}
        title="Wallet & Income Overview"
        subtitle="Detailed financial insights into PillPath transactions and earnings"
      />

      {/* Manual payout info banner */}
      <div className="mt-4 mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <div className="flex items-start">
          <div className="mr-3 mt-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm10.5-4.125a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0zM9.75 10.5a.75.75 0 000 1.5h.75v4.125a.75.75 0 001.5 0V12h.75a.75.75 0 000-1.5h-3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium">Manual settlements policy</p>
            <p className="mt-1">
              PillPath settles customer card (Online) payments to pharmacies
              manually. Use the Payouts table in each pharmacy's details to mark
              a payout as Paid and attach the receipt. For On-Hand (cash)
              orders, pharmacies owe PillPath the commission; record incoming
              commission payments in the Commissions Due table.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
        <StatCard
          label="Total Revenue"
          value={`Rs. ${totalRevenue.toLocaleString()}`}
          icon={<HandCoins size={48} className="text-green-500" />}
        />
        <StatCard
          label="Total Online Payments Income"
          value={`Rs. ${totalOnlinePaymentIncome.toLocaleString()}`}
          icon={<CreditCard size={48} className="text-pink-500" />}
        />
        <StatCard
          label="Total On-Hand Payments Income"
          value={`Rs. ${totalOnHandPaymentIncome.toLocaleString()}`}
          icon={<Handshake size={48} className="text-purple-500" />}
        />
        <StatCard
          label="Current Wallet Balance"
          value={`Rs. ${currentWalletBalance.toLocaleString()}`}
          icon={<Wallet size={48} className="text-blue-500" />}
        />
      </div>

      {/* Pharmacy Wallet Overview */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Store className="mr-2 text-gray-600" size={24} /> Pharmacy Wallet
            Overview
          </div>
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstPharmacy + 1}-
            {Math.min(indexOfLastPharmacy, uniquePharmacies.length)} of{" "}
            {uniquePharmacies.length} pharmacies
          </div>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {currentPharmacies.map((pharmacyName) => {
            const summary = getPharmacyWalletSummary(pharmacyName);
            return (
              <div
                key={pharmacyName}
                className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <h4 className="font-semibold text-lg text-gray-800 mb-2">
                  {pharmacyName}
                </h4>
                <p className="text-sm text-gray-600">
                  Commissions Paid:{" "}
                  <span className="font-medium text-green-700">
                    Rs.{summary.totalPaidCommissions}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Payouts Received:{" "}
                  <span className="font-medium text-blue-700">
                    Rs.{summary.totalPayoutsReceived}
                  </span>
                </p>
                <button
                  onClick={() => handleViewPharmacyDetails(pharmacyName)}
                  className="mt-3 bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
                >
                  <Eye size={16} className="mr-1" /> View Details
                </button>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls for Pharmacy Wallet Overview */}
        {totalPharmacyPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPharmacyPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginatePharmacies(i + 1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  currentPharmacyPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search by ID, sender, or receiver..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <button
            onClick={() =>
              handleExportData(
                "PillPath_Sales",
                currentCustomerPayments.map((tx) => ({
                  orderId: tx.orderCode || tx.id,
                  date: new Date(tx.date).toISOString().slice(0, 10),
                  customer: tx.customerName,
                  pharmacy: tx.pharmacyName,
                  paymentType: tx.settlementChannel,
                  amount: Number(tx.grossAmount || 0).toFixed(2),
                  commission: Number(tx.commissionAmount || 0).toFixed(2),
                  receivedStatus: receivedStatusLabel(tx),
                }))
              )
            }
            className="  bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Download className="mr-2" size={20} /> Export
          </button>
        </div>
      </div>

      {/* Monthly Payment Type Breakdown Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Monthly Online vs. On-Hand Payments
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartDataPayments}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `Rs.${value.toFixed(2)}`} />
            <Legend />
            <Bar
              dataKey="online"
              fill="#4A90E2"
              name="Online Payments"
              radius={[5, 5, 0, 0]}
            />
            <Bar
              dataKey="onHand"
              fill="#9B59B6"
              name="On-Hand Payments"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Pharmacies by Commission Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex justify-between items-center">
          Top 5 Pharmacies by Commission Paid to PillPath
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={topPharmaciesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-15}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis />
            <Tooltip formatter={(value) => `Rs.${value.toFixed(2)}`} />
            <Legend />
            <Bar
              dataKey="commission"
              fill="#EC4899"
              name="Commission Paid"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Customer Payments & Commissions Table */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Customer Payments & Commissions
        </h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
              >
                Order ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
              >
                Pharmacy
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
              >
                Payment Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
              >
                Amount (Rs)
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
              >
                Commission (Rs)
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
              >
                Received Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCustomerPayments.length > 0 ? (
              currentCustomerPayments.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tx.orderCode || tx.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tx.date).toISOString().slice(0, 10)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.pharmacyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tx.settlementChannel === "ONLINE"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {tx.settlementChannel === "ONLINE" ? "Online" : "On-Hand"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Number(tx.grossAmount || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Number(tx.commissionAmount || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        receivedStatusLabel(tx) === "Received"
                          ? "bg-green-100 text-green-800"
                          : receivedStatusLabel(tx) === "Unreceived"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {receivedStatusLabel(tx)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {tx.settlementChannel === "ON_HAND" &&
                      receivedStatusLabel(tx) !== "Received" && (
                        <button
                          onClick={() =>
                            handleMarkCommissionStatus(tx.commissionId, "PAID")
                          }
                          className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition-colors"
                          title="Mark as Received"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                    {tx.settlementChannel === "ON_HAND" &&
                      receivedStatusLabel(tx) === "Received" && (
                        <span className="text-gray-500">N/A</span>
                      )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                >
                  No customer payments found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls for Customer Payments */}
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalCustomerPaymentPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginateCustomerPayments(i + 1)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Pharmacy Details Modal */}
      {isPharmacyDetailsModalOpen && selectedPharmacy && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Financial Details for {selectedPharmacy}
            </h3>

            {/* Customer Payments to this Pharmacy */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <TrendingUp size={20} className="mr-2 text-green-600" />{" "}
                Customer Payments Received by Pharmacy
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Order ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Customer
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Payment Type
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Amount (Rs)
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Commission (Rs)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getPharmacyDetailedTransactions(selectedPharmacy)
                      .customerPayments.length > 0 ? (
                      getPharmacyDetailedTransactions(
                        selectedPharmacy
                      ).customerPayments.map((tx) => (
                        <tr key={tx.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {tx.orderCode || tx.id}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {new Date(tx.date).toISOString().slice(0, 10)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tx.customerName}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                tx.settlementChannel === "ONLINE"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {tx.settlementChannel === "ONLINE"
                                ? "Online"
                                : "On-Hand"}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {Number(tx.grossAmount || 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {Number(tx.commissionAmount || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-4 py-2 text-center text-sm text-gray-500"
                        >
                          No customer payments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payouts from PillPath to this Pharmacy */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <TrendingDown size={20} className="mr-2 text-red-600" /> Payouts
                from PillPath
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Payout ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Month Due
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Amount (Rs)
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Receipt
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getPharmacyDetailedTransactions(selectedPharmacy)
                      .payoutsFromSystem.length > 0 ? (
                      getPharmacyDetailedTransactions(
                        selectedPharmacy
                      ).payoutsFromSystem.map((tx) => (
                        <tr key={tx.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {tx.id}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tx.paidAt || tx.date || "-"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tx.month || tx.payoutMonth}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tx.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                tx.status === "PAID"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {tx.status === "PAID" ? "Paid" : "Unpaid"}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tx.receiptUrl ? (
                              <div className="flex items-center space-x-2">
                                <a
                                  href={tx.receiptUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center"
                                >
                                  {tx.receiptFileType === "application/pdf" ? (
                                    <span>
                                      📄 {tx.receiptFileName || "Receipt.pdf"}
                                    </span>
                                  ) : (
                                    <span>
                                      🖼️ {tx.receiptFileName || "Receipt"}
                                    </span>
                                  )}
                                </a>
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            {tx.status !== "PAID" && (
                              <button
                                onClick={() =>
                                  handleMarkPayoutStatusInitiate(tx)
                                }
                                className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition-colors"
                                title="Mark as Paid"
                              >
                                <CheckCircle size={18} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-4 py-2 text-center text-sm text-gray-500"
                        >
                          No payouts from PillPath found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Commissions Due from this Pharmacy (for On-Hand Payments) */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <DollarSign size={20} className="mr-2 text-orange-600" />{" "}
                Commissions Due (On-Hand Payments)
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Commission ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Pharmacy
                      </th>

                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Month Due
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Amount (Rs)
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getPharmacyDetailedTransactions(selectedPharmacy)
                      .commissionsDue.length > 0 ? (
                      getPharmacyDetailedTransactions(
                        selectedPharmacy
                      ).commissionsDue.map((tx) => (
                        <tr key={tx.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {tx.id}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tx.pharmacyName}
                          </td>

                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tx.month}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {Number(tx.amount || 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                tx.status === "PAID"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            {tx.status === "UNPAID" ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleMarkCommissionStatus(tx.id, "PAID")
                                  }
                                  className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition-colors"
                                  title="Mark as Paid"
                                >
                                  <CheckCircle size={18} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleMarkCommissionStatus(tx.id, "UNPAID")
                                  }
                                  className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors ml-1"
                                  title="Mark as Not Paid"
                                >
                                  <XCircle size={18} />
                                </button>
                              </>
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-4 py-2 text-center text-sm text-gray-500"
                        >
                          No commissions due from this pharmacy.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleClosePharmacyDetailsModal}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Upload Modal */}
      {isReceiptUploadModalOpen && payoutToMark && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Upload Receipt for Payout
            </h3>
            <p className="text-gray-600 mb-6">
              Confirming payout for ID:{" "}
              <span className="font-semibold">{payoutToMark.id}</span>
            </p>

            {/* File Upload Section */}
            <div className="mb-6">
              <label
                htmlFor="receiptFile"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload Receipt (Image or PDF)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="receiptFile"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="receiptFile"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF or PDF (max 5MB)
                  </span>
                </label>
              </div>
            </div>

            {/* File Preview Section */}
            {selectedReceiptFile && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Selected File:
                </h4>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex-shrink-0">
                    {selectedReceiptFile.type === "application/pdf" ? (
                      <span className="text-2xl">📄</span>
                    ) : (
                      <span className="text-2xl">🖼️</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedReceiptFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedReceiptFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedReceiptFile(null);
                      setReceiptPreview("");
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <XCircle size={20} />
                  </button>
                </div>

                {/* Image Preview */}
                {receiptPreview && (
                  <div className="mt-3">
                    <img
                      src={receiptPreview}
                      alt="Receipt preview"
                      className="max-w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsReceiptUploadModalOpen(false);
                  setPayoutToMark(null);
                  setReceiptUrlInput("");
                  setSelectedReceiptFile(null);
                  setReceiptPreview("");
                }}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayoutPaid}
                disabled={!selectedReceiptFile}
                className={`px-5 py-2 rounded-lg transition-colors ${
                  selectedReceiptFile
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Confirm Paid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletAndIncome;
