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
import { useState } from "react";

const prescriptions = [
  {
    id: "PRX001",
    patient: "Alice Smith",
    pharmacy: "City Pharmacy",
    status: "Completed",
    submitted: "2023-06-01",
    amount: "1500",
    patientImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    pharmacyImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=150&h=150&fit=crop&crop=center",
  },
  {
    id: "PRX002",
    patient: "Bob Johnson",
    pharmacy: "Health Hub",
    status: "Pending",
    submitted: "2023-06-05",
    amount: "500",
    patientImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    // No pharmacy image - will show store icon
  },
  {
    id: "PRX003",
    patient: "Charlie Brown",
    pharmacy: "MediCare Drugstore",
    status: "Approved",
    submitted: "2023-06-10",
    amount: "1000",
    // No patient image - will show user icon
    pharmacyImage:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=150&h=150&fit=crop&crop=center",
  },
  {
    id: "PRX004",
    patient: "Diana Prince",
    pharmacy: "City Pharmacy",
    status: "Rejected",
    submitted: "2023-06-12",
    amount: "1600",
    patientImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    pharmacyImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=150&h=150&fit=crop&crop=center",
  },
  {
    id: "PRX005",
    patient: "Eve Adams",
    pharmacy: "Quick Meds",
    status: "Pending",
    submitted: "2023-06-15",
    amount: "1300",
    patientImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    // No pharmacy image - will show store icon
  },
];

const monthlyPrescriptionData = [
  { status: "Completed", count: 40 },
  { status: "Approved", count: 46 },
  { status: "Pending", count: 10 },
  { status: "Rejected", count: 5 },
];

const statusColors = {
  Completed: "#10B981", // Green
  Approved: "#3B82F6", // Blue
  Pending: "#F59E0B", // Yellow/Orange
  Rejected: "#EF4444", // Red
};

const Prescription = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredPrescriptions = prescriptions.filter((prescriptions) => {
    const matchesSearch =
      prescriptions.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescriptions.pharmacy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescriptions.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || prescriptions.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <PageHeader
        icon={FileText}
        title="Prescription Management"
        subtitle="Monitor and manage all prescription orders."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 ">
        <StatCard
          label="Accepted Prescriptions"
          value={250}
          icon={<CheckLine size={48} className="text-blue-500" />}
        />
        <StatCard
          label="Pending Prescriptions"
          value={16}
          icon={<ClockAlert size={48} className="text-yellow-500" />}
        />
        <StatCard
          label="Rejected Prescriptions"
          value={5}
          icon={<Ban size={48} className="text-red-500" />}
        />
      </div>

      <ChartCard title="Prescription Status Overview">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyPrescriptionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count">
              {monthlyPrescriptionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={statusColors[entry.status]} />
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
        filterOptions={["All", "Completed", "Approved", "Pending", "Rejected"]}
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
                      prescription.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : prescription.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : prescription.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {prescription.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Rs. {prescription.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prescription.submitted}
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
