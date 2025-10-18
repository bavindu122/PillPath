import { Users, User } from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import SearchFilterBar from "../components/SearchFilterBar";
import { useState, useEffect } from "react";
import React from "react";
import AdminService from "../../../services/api/AdminService";
import { Activity, Star, Ban, Eye, Trash2, UserPlus } from "lucide-react";
import ViewDetailsModal from "../components/popup/ViewDetailsModal";
import SuspendUserModal from "../components/popup/SuspendUserModal";
import ActivateUserModal from "../components/popup/ActivateUserModal";

// Removed dummy/sample customers - page will load real data from the backend

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

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [suspendPopup, setSuspendPopup] = useState(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [activatePopup, setActivatePopup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || customer.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleSuspend = (user) => {
    // Optimistic UI update, then call backend
    const prevState = customers;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === user.id ? { ...c, status: "Suspended", suspendReason } : c
      )
    );
    setSuspendPopup(null);
    setSuspendReason("");

    (async () => {
      try {
        await AdminService.suspendCustomer(user.id, suspendReason);
      } catch (err) {
        console.error("Failed to suspend customer:", err);
        setError(err.message || "Failed to suspend user");
        // revert
        setCustomers(prevState);
      }
    })();
  };

  const handleActivate = (user) => {
    const prevState = customers;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === user.id ? { ...c, status: "Active", suspendReason: null } : c
      )
    );
    setActivatePopup(null);

    (async () => {
      try {
        await AdminService.activateCustomer(user.id);
      } catch (err) {
        console.error("Failed to activate customer:", err);
        setError(err.message || "Failed to activate user");
        // revert
        setCustomers(prevState);
      }
    })();
  };

  // Fetch customers from backend on mount
  useEffect(() => {
    let mounted = true;
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminService.getCustomers({
          page: 0,
          size: 1000,
        });
        // Support paginated and non-paginated responses
        const data =
          response && response.content
            ? response.content
            : Array.isArray(response)
            ? response
            : [];

        // Preserve backend fields as-is (keep empty/null values) but normalize types to avoid runtime errors
        const sanitizeCustomer = (b) => {
          const merged = { ...b };

          // Ensure fields exist so UI won't crash; keep "empty" values when provided by backend
          if (merged.name === undefined) merged.name = "";
          if (merged.email === undefined) merged.email = "";
          if (merged.prescriptions === undefined) merged.prescriptions = 0;
          if (merged.orders === undefined) merged.orders = 0;

          return merged;
        };

        const sanitized = data.map(sanitizeCustomer);

        if (mounted) setCustomers(sanitized);
      } catch (err) {
        console.error("Failed to load customers:", err);
        if (mounted) setError(err.message || "Failed to load customers");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCustomers();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      className={`min-h-screen bg-gray-100 p-8 font-sans ${
        selectedCustomer ? "backdrop-blur-sm" : ""
      }`}
    >
      <PageHeader
        icon={Users}
        title="Customer Management"
        subtitle="Manage registered customers and their account details"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <StatCard
          label="Active Customers"
          value={
            customers.filter(
              (c) => c.isActive === true || c.status === "Active"
            ).length
          }
          icon={<Activity size={48} className="text-blue-500" />}
        />
        <StatCard
          label="Suspended Accounts"
          value={
            customers.filter(
              (c) => c.isActive === false || c.status === "Suspended"
            ).length
          }
          icon={<Ban size={48} className="text-red-500" />}
        />
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterValue={filterStatus}
        setFilterValue={setFilterStatus}
        placeholder="Search by name or email..."
        filterOptions={["All", "Active", "Suspended"]}
      />

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Prescriptions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-3">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={16} className="text-gray-500" />
                    </div>
                  )}
                  <span>{user.fullName}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {(() => {
                    // If backend provides isActive boolean, use it to show Active badge when true
                    const isActiveFlag = user.isActive;
                    const statusText =
                      isActiveFlag === true
                        ? "Active"
                        : user.status
                        ? user.status
                        : "Suspended";

                    const statusClass =
                      isActiveFlag === true
                        ? "bg-green-100 text-green-800"
                        : statusText === "Suspended"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800";

                    return (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}
                      >
                        {statusText}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.prescriptionCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.orderCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(user.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedCustomer(user)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {user.isActive === false || user.status === "Suspended" ? (
                      <button
                        className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-100 transition-colors"
                        title="Activate User"
                        onClick={() => setActivatePopup(user)}
                      >
                        <UserPlus size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setSuspendPopup(user)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                        title="Suspend User"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCustomer && (
        <ViewDetailsModal
          user={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {suspendPopup && (
        <SuspendUserModal
          user={suspendPopup}
          reason={suspendReason}
          setReason={setSuspendReason}
          onCancel={() => setSuspendPopup(null)}
          onConfirm={() => handleSuspend(suspendPopup)}
        />
      )}

      {activatePopup && (
        <ActivateUserModal
          user={activatePopup}
          onCancel={() => setActivatePopup(null)}
          onConfirm={() => handleActivate(activatePopup)}
        />
      )}
    </div>
  );
};

export default Customers;
