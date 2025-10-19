import React from "react";
import StatCard from "../components/StatCard";
import PageHeader from "../components/PageHeader";
import SearchFilterBar from "../components/SearchFilterBar";
import {
  FileText,
  CheckLine,
  ClockAlert,
  Ban,
  User,
  Store,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import ChartCard from "../components/ChartCard";
import { useState, useEffect } from "react";
import AdminService from "../../../services/api/AdminService";

// Helper function to format datetime
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "";
  try {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    return dateTimeString; // Return original if parsing fails
  }
};

const statusColors = {
  // Completed status - Green
  Completed: "#10B981",
  COMPLETED: "#10B981",

  // Approved/In Progress/Order Processing - Blue
  Approved: "#3B82F6",
  APPROVED: "#3B82F6",
  IN_PROGRESS: "#3B82F6",
  ORDER_PLACED: "#3B82F6",
  PREPARING_ORDER: "#3B82F6",
  READY_FOR_PICKUP: "#3B82F6",

  // Pending/Review/Clarification - Yellow/Orange
  Pending: "#F59E0B",
  PENDING: "#F59E0B",
  PENDING_REVIEW: "#F59E0B",
  CLARIFICATION_NEEDED: "#F59E0B",

  // Rejected/Cancelled - Red
  Rejected: "#EF4444",
  REJECTED: "#EF4444",
  CANCELLED: "#EF4444",
};

const Prescription = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [prescriptions, setPrescriptions] = useState([]);
  const [statistics, setStatistics] = useState({
    acceptedPrescriptions: 0,
    pendingPrescriptions: 0,
    rejectedPrescriptions: 0,
    statusBreakdown: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch prescriptions from backend
  const fetchPrescriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminService.getPrescriptions();

      // Support paginated and non-paginated responses
      const data =
        response && response.content
          ? response.content
          : Array.isArray(response)
          ? response
          : [];

      // Sanitize prescription data
      const sanitizePrescription = (prescription) => {
        const sanitized = { ...prescription };

        // Ensure required fields exist
        if (sanitized.id === undefined) sanitized.id = "";
        if (sanitized.patient === undefined) sanitized.patient = "";
        if (sanitized.pharmacy === undefined) sanitized.pharmacy = "";
        if (sanitized.status === undefined) sanitized.status = "Pending";
        if (sanitized.totalPrice === undefined) sanitized.totalPrice = 0;
        if (sanitized.submitted === undefined) sanitized.submitted = "";

        return sanitized;
      };

      const sanitized = data.map(sanitizePrescription);
      setPrescriptions(sanitized);
    } catch (err) {
      console.error("Failed to load prescriptions:", err);
      setError(err.message || "Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  // Fetch prescription statistics
  const fetchStatistics = async () => {
    try {
      const response = await AdminService.getPrescriptionStatistics();
      if (response && response.data) {
        setStatistics(response.data);
      }
    } catch (err) {
      console.error("Failed to load prescription statistics:", err);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchPrescriptions();
    fetchStatistics();
  }, []);

  // Calculate chart data from prescriptions (only for main statuses)
  const chartData = [
    {
      status: "PENDING_REVIEW",
      count: prescriptions.filter((p) => p.status === "PENDING_REVIEW").length,
    },
    {
      status: "COMPLETED",
      count: prescriptions.filter((p) => p.status === "COMPLETED").length,
    },
    {
      status: "REJECTED",
      count: prescriptions.filter((p) => p.status === "REJECTED").length,
    },
    {
      status: "CANCELLED",
      count: prescriptions.filter((p) => p.status === "CANCELLED").length,
    },
  ];

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.pharmacy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" ||
      prescription.status === filterStatus ||
      prescription.status === filterStatus.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <PageHeader
        icon={FileText}
        title="Prescription Management"
        subtitle="Monitor and manage all prescription orders."
      />

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <p>Loading prescriptions...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 ">
        <StatCard
          label="Completed Prescriptions"
          value={prescriptions.filter((p) => p.status === "COMPLETED").length}
          icon={<CheckLine size={48} className="text-green-500" />}
        />
        <StatCard
          label="Pending Review Prescriptions"
          value={
            prescriptions.filter((p) => p.status === "PENDING_REVIEW").length
          }
          icon={<ClockAlert size={48} className="text-yellow-500" />}
        />
        <StatCard
          label="Rejected Prescriptions"
          value={prescriptions.filter((p) => p.status === "REJECTED").length}
          icon={<Ban size={48} className="text-red-500" />}
        />
      </div>

      <ChartCard title="Prescription Status Overview">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={statusColors[entry.status] || "#3B82F6"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterValue={filterStatus}
        setFilterValue={setFilterStatus}
        placeholder="Search id, patient name, pharmacy name..."
        filterOptions={[
          "All",
          "PENDING_REVIEW",
          "IN_PROGRESS",
          "ORDER_PLACED",
          "PREPARING_ORDER",
          "CLARIFICATION_NEEDED",
          "READY_FOR_PICKUP",
          "REJECTED",
          "COMPLETED",
          "CANCELLED",
        ]}
      />

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Order id
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Pharmacy
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Submitted on
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPrescriptions.map((prescription) => (
              <tr key={prescription.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {prescription.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    {prescription.patientImage ? (
                      <img
                        src={prescription.patientImage}
                        alt={prescription.patient}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center ${
                        prescription.patientImage ? "hidden" : "flex"
                      }`}
                    >
                      <User size={16} className="text-gray-500" />
                    </div>
                    <span className="font-medium text-gray-900">
                      {prescription.patient}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    {prescription.pharmacyImage ? (
                      <img
                        src={prescription.pharmacyImage}
                        alt={prescription.pharmacy}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center ${
                        prescription.pharmacyImage ? "hidden" : "flex"
                      }`}
                    >
                      <Store size={16} className="text-gray-500" />
                    </div>
                    <span className="font-medium text-gray-900">
                      {prescription.pharmacy}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      prescription.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : prescription.status === "REJECTED" ||
                          prescription.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : prescription.status === "PENDING_REVIEW" ||
                          prescription.status === "CLARIFICATION_NEEDED"
                        ? "bg-yellow-100 text-yellow-800"
                        : prescription.status === "IN_PROGRESS" ||
                          prescription.status === "ORDER_PLACED" ||
                          prescription.status === "PREPARING_ORDER" ||
                          prescription.status === "READY_FOR_PICKUP"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {prescription.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Rs. {prescription.totalPrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(prescription.submitted)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Prescription;
