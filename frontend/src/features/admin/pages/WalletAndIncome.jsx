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
  Hand,
  HandCoins,
  Handshake,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

const mockInitialSalesTransactions = [
  // Customer to Pharmacy (Order Payments - Gross Sales)
  // Added paymentType to distinguish online vs. on-hand
  {
    id: "ORD001",
    date: "2023-01-10",
    sender: "Customer A",
    receiver: "City Pharmacy",
    amount: 100.0,
    type: "Order Payment",
    pharmacyName: "City Pharmacy",
    paymentType: "Online",
  },
  {
    id: "ORD002",
    date: "2023-01-12",
    sender: "Customer B",
    receiver: "Health Hub",
    amount: 50.0,
    type: "Order Payment",
    pharmacyName: "Health Hub",
    paymentType: "On-Hand",
  },
  {
    id: "ORD003",
    date: "2023-02-05",
    sender: "Customer C",
    receiver: "MediCare Drugstore",
    amount: 75.0,
    type: "Order Payment",
    pharmacyName: "MediCare Drugstore",
    paymentType: "Online",
  },
  {
    id: "ORD004",
    date: "2023-02-15",
    sender: "Customer D",
    receiver: "City Pharmacy",
    amount: 120.0,
    type: "Order Payment",
    pharmacyName: "City Pharmacy",
    paymentType: "On-Hand",
  },
  {
    id: "ORD005",
    date: "2023-03-01",
    sender: "Customer E",
    receiver: "Quick Meds",
    amount: 90.0,
    type: "Order Payment",
    pharmacyName: "Quick Meds",
    paymentType: "Online",
  },
  {
    id: "ORD006",
    date: "2023-03-20",
    sender: "Customer F",
    receiver: "Health Hub",
    amount: 65.0,
    type: "Order Payment",
    pharmacyName: "Health Hub",
    paymentType: "On-Hand",
  },
  {
    id: "ORD007",
    date: "2023-04-08",
    sender: "Customer G",
    receiver: "City Pharmacy",
    amount: 110.0,
    type: "Order Payment",
    pharmacyName: "City Pharmacy",
    paymentType: "Online",
  },
  {
    id: "ORD008",
    date: "2023-04-25",
    sender: "Customer H",
    receiver: "MediCare Drugstore",
    amount: 80.0,
    type: "Order Payment",
    pharmacyName: "MediCare Drugstore",
    paymentType: "On-Hand",
  },
  {
    id: "ORD009",
    date: "2023-05-02",
    sender: "Customer I",
    receiver: "Quick Meds",
    amount: 150.0,
    type: "Order Payment",
    pharmacyName: "Quick Meds",
    paymentType: "Online",
  },
  {
    id: "ORD010",
    date: "2023-05-19",
    sender: "Customer J",
    receiver: "Health Hub",
    amount: 70.0,
    type: "Order Payment",
    pharmacyName: "Health Hub",
    paymentType: "On-Hand",
  },
  {
    id: "ORD011",
    date: "2023-06-03",
    sender: "Customer K",
    receiver: "City Pharmacy",
    amount: 95.0,
    type: "Order Payment",
    pharmacyName: "City Pharmacy",
    paymentType: "Online",
  },
  {
    id: "ORD012",
    date: "2023-06-28",
    sender: "Customer L",
    receiver: "MediCare Drugstore",
    amount: 130.0,
    type: "Order Payment",
    pharmacyName: "MediCare Drugstore",
    paymentType: "On-Hand",
  },
  {
    id: "ORD013",
    date: "2023-07-07",
    sender: "Customer M",
    receiver: "Quick Meds",
    amount: 88.0,
    type: "Order Payment",
    pharmacyName: "Quick Meds",
    paymentType: "Online",
  },
  {
    id: "ORD014",
    date: "2023-07-14",
    sender: "Customer N",
    receiver: "Health Hub",
    amount: 105.0,
    type: "Order Payment",
    pharmacyName: "Health Hub",
    paymentType: "On-Hand",
  },
  {
    id: "ORD015",
    date: "2023-07-20",
    sender: "Customer O",
    receiver: "City Pharmacy",
    amount: 60.0,
    type: "Order Payment",
    pharmacyName: "City Pharmacy",
    paymentType: "Online",
  },
  {
    id: "ORD016",
    date: "2023-07-25",
    sender: "Customer P",
    receiver: "MediCare Drugstore",
    amount: 70.0,
    type: "Order Payment",
    pharmacyName: "MediCare Drugstore",
    paymentType: "On-Hand",
  },
  {
    id: "ORD017",
    date: "2023-08-01",
    sender: "Customer Q",
    receiver: "Health Hub",
    amount: 115.0,
    type: "Order Payment",
    pharmacyName: "Health Hub",
    paymentType: "Online",
  },
  {
    id: "ORD018",
    date: "2023-08-05",
    sender: "Customer R",
    receiver: "Quick Meds",
    amount: 85.0,
    type: "Order Payment",
    pharmacyName: "Quick Meds",
    paymentType: "On-Hand",
  },
];

const processFinancialData = (transactions, commissionRate = 0.1) => {
  const processedData = [];
  const pharmacies = new Set();

  transactions.forEach((tx) => {
    if (tx.type === "Order Payment") {
      pharmacies.add(tx.receiver); // Add pharmacy to set

      const commissionAmount = tx.amount * commissionRate;
      const payoutAmount = tx.amount * (1 - commissionRate);
      const transactionMonth = new Date(tx.date).toLocaleString("en-US", {
        month: "2-digit",
        year: "numeric",
      }); // MM/YYYY

      // Add the original order payment with its received status
      processedData.push({
        ...tx,
        receivedStatus: tx.paymentType === "Online" ? "Received" : "Unreceived", // Default status
        commissionAmount: commissionAmount, // Add commission amount for easy display
      });

      // Add Commission Payment (Pharmacy to PillPath)
      processedData.push({
        id: `COM-${tx.id}`,
        date: tx.date,
        sender: tx.receiver, // Pharmacy pays commission
        receiver: "PillPath",
        amount: commissionAmount,
        type: "Commission Payment",
        pharmacyName: tx.receiver,
        paymentType: tx.paymentType,
        commissionStatus: "Unpaid", // Default status for commissions due from pharmacy
        commissionMonth: transactionMonth,
        orderId: tx.id, // Link to original order
      });

      // Add Payout (PillPath to Pharmacy) only for Online payments
      if (tx.paymentType === "Online") {
        processedData.push({
          id: `PAY-${tx.id}`,
          date: tx.date,
          sender: "PillPath",
          receiver: tx.receiver,
          amount: payoutAmount,
          type: "Payout",
          pharmacyName: tx.receiver,
          payoutStatus: "Unpaid", // Default status for payouts from PillPath
          payoutMonth: transactionMonth,
          receiptUrl: null, // Placeholder for receipt
        });
      }
    }
  });

  return { processedData, uniquePharmacies: Array.from(pharmacies) };
};

const WalletAndIncome = () => {
  const { processedData, uniquePharmacies } = useMemo(
    () => processFinancialData(mockInitialSalesTransactions),
    []
  );
  const [transactions, setTransactions] = useState(processedData);
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
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

  const filteredTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    const matchesMonth =
      filterMonth === "All" ||
      (txDate.getMonth() + 1).toString() === filterMonth;
    const matchesYear =
      filterYear === "All" || txDate.getFullYear().toString() === filterYear;
    const matchesSearch =
      searchTerm === "" ||
      tx.id?.toLowerCase().includes(searchTerm.toLowerCase()) || // Use optional chaining for id
      tx.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.receiver?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMonth && matchesYear && matchesSearch;
  });

  // Pagination Logic (for Customer Payments & Commissions Table)
  const customerPayments = filteredTransactions.filter(
    (tx) => tx.type === "Order Payment"
  );
  const indexOfLastCustomerPayment = currentPage * transactionsPerPage;
  const indexOfFirstCustomerPayment =
    indexOfLastCustomerPayment - transactionsPerPage;
  const currentCustomerPayments = customerPayments.slice(
    indexOfFirstCustomerPayment,
    indexOfLastCustomerPayment
  );
  const totalCustomerPaymentPages = Math.ceil(
    customerPayments.length / transactionsPerPage
  );

  const paginateCustomerPayments = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate Stat Cards
  const totalRevenue = filteredTransactions
    .filter((tx) => tx.type === "Order Payment")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalOnlinePaymentIncome = filteredTransactions
    .filter((tx) => tx.type === "Order Payment" && tx.paymentType === "Online")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalOnHandPaymentIncome = filteredTransactions
    .filter((tx) => tx.type === "Order Payment" && tx.paymentType === "On-Hand")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalPayoutsToPharmacies = filteredTransactions
    .filter((tx) => tx.type === "Payout" && tx.payoutStatus === "Paid") // Only count paid payouts
    .reduce((sum, tx) => sum + tx.amount, 0);

  const currentWalletBalance =
    totalOnlinePaymentIncome - totalPayoutsToPharmacies;

  // Prepare data for Top 5 Pharmacies by Commission
  const commissionByPharmacy = filteredTransactions
    .filter((tx) => tx.type === "Commission Payment" && tx.pharmacyName)
    .reduce((acc, tx) => {
      acc[tx.pharmacyName] = (acc[tx.pharmacyName] || 0) + tx.amount;
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
  const paymentsByMonth = filteredTransactions.reduce((acc, tx) => {
    if (tx.type === "Order Payment") {
      // Only consider customer payments for this chart
      const monthYear = new Date(tx.date).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });
      if (!acc[monthYear]) {
        acc[monthYear] = { online: 0, onHand: 0 };
      }
      if (tx.paymentType === "Online") {
        acc[monthYear].online += tx.amount;
      } else {
        acc[monthYear].onHand += tx.amount;
      }
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

  const years = [
    "All",
    ...new Set(
      transactions.map((tx) => new Date(tx.date).getFullYear().toString())
    ),
  ].sort();

  const handleExportData = (reportName, data) => {
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
    const pharmacyTransactions = transactions.filter(
      (tx) => tx.pharmacyName === pharmacyName
    );

    const totalPaidCommissions = pharmacyTransactions
      .filter(
        (tx) =>
          tx.type === "Commission Payment" && tx.commissionStatus === "Paid"
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalPayoutsReceived = pharmacyTransactions
      .filter((tx) => tx.type === "Payout" && tx.payoutStatus === "Paid")
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalPaidCommissions: totalPaidCommissions.toFixed(2),
      totalPayoutsReceived: totalPayoutsReceived.toFixed(2),
    };
  };

  const handleViewPharmacyDetails = (pharmacyName) => {
    setSelectedPharmacy(pharmacyName);
    setIsPharmacyDetailsModalOpen(true);
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

  const handleConfirmPayoutPaid = () => {
    if (payoutToMark && selectedReceiptFile) {
      // In a real application, you would upload the file to your server here
      // For now, we'll simulate the upload and create a mock URL
      const mockUploadedUrl = `https://pillpath-receipts.com/uploads/${Date.now()}-${
        selectedReceiptFile.name
      }`;

      setTransactions((prevTransactions) =>
        prevTransactions.map((tx) =>
          tx.id === payoutToMark.id
            ? {
                ...tx,
                payoutStatus: "Paid",
                receiptUrl: mockUploadedUrl,
                receiptFileName: selectedReceiptFile.name,
                receiptFileType: selectedReceiptFile.type,
              }
            : tx
        )
      );

      console.log(
        `Payout ${payoutToMark.id} marked as Paid with receipt file: ${selectedReceiptFile.name}`
      );

      // Reset modal state
      setIsReceiptUploadModalOpen(false);
      setPayoutToMark(null);
      setReceiptUrlInput("");
      setSelectedReceiptFile(null);
      setReceiptPreview("");
    } else {
      alert("Please upload a receipt file before confirming the payout.");
    }
  };

  const handleMarkCommissionStatus = (txId, newStatus) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((tx) =>
        tx.id === txId ? { ...tx, commissionStatus: newStatus } : tx
      )
    );
    console.log(`Commission ${txId} marked as ${newStatus}`);
  };

  const handleMarkPaymentReceivedStatus = (txId, newStatus) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((tx) =>
        tx.id === txId ? { ...tx, receivedStatus: newStatus } : tx
      )
    );
    console.log(`Order Payment ${txId} marked as ${newStatus}`);
  };

  const getPharmacyDetailedTransactions = (pharmacyName) => {
    const customerPayments = transactions.filter(
      (tx) => tx.type === "Order Payment" && tx.receiver === pharmacyName
    );

    const payoutsFromSystem = transactions.filter(
      (tx) => tx.type === "Payout" && tx.receiver === pharmacyName
    );

    const commissionsDue = transactions.filter(
      (tx) =>
        tx.type === "Commission Payment" &&
        tx.sender === pharmacyName &&
        tx.paymentType === "On-Hand"
    );

    return { customerPayments, payoutsFromSystem, commissionsDue };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <PageHeader
        icon={Wallet}
        title="Wallet & Income Overview"
        subtitle="Detailed financial insights into PillPath transactions and earnings"
      />

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
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Store className="mr-2 text-gray-600" size={24} /> Pharmacy Wallet
          Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uniquePharmacies.map((pharmacyName) => {
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
                    ${summary.totalPaidCommissions}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Payouts Received:{" "}
                  <span className="font-medium text-blue-700">
                    ${summary.totalPayoutsReceived}
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
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-1/3">
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
          <div className="w-full md:w-1/4">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/4">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() =>
              handleExportData("PillPath_Sales", filteredTransactions)
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
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
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
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar
              dataKey="commission"
              fill="#82ca9d"
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
                    {tx.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.sender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.receiver}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tx.paymentType === "Online"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {tx.paymentType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.commissionAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tx.receivedStatus === "Received"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tx.receivedStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {tx.paymentType === "On-Hand" &&
                      tx.receivedStatus === "Unreceived" && (
                        <button
                          onClick={() =>
                            handleMarkPaymentReceivedStatus(tx.id, "Received")
                          }
                          className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition-colors"
                          title="Mark as Received"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                    {tx.paymentType === "On-Hand" &&
                      tx.receivedStatus === "Received" && (
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
                            {tx.id}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tx.date}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tx.sender}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                tx.paymentType === "Online"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {tx.paymentType}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tx.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tx.commissionAmount.toFixed(2)}
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
                            {tx.date}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tx.payoutMonth}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tx.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                tx.payoutStatus === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {tx.payoutStatus}
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
                            {tx.payoutStatus === "Unpaid" && (
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
                        Order ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-500 uppercase">
                        Order Date
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
                            {tx.orderId}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tx.date}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tx.commissionMonth}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {tx.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                tx.commissionStatus === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {tx.commissionStatus}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            {tx.commissionStatus === "Unpaid" ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleMarkCommissionStatus(tx.id, "Paid")
                                  }
                                  className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition-colors"
                                  title="Mark as Paid"
                                >
                                  <CheckCircle size={18} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleMarkCommissionStatus(
                                      tx.id,
                                      "Not Paid"
                                    )
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
