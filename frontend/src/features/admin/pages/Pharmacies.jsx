import React, { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import PageHeader from "../components/PageHeader";
import SearchFilterBar from "../components/SearchFilterBar";
import PharmacyCard from "../components/PharmacyCard";
import {
  Store,
  Activity,
  Ban,
  ClockAlert,
  TriangleAlert,
  RefreshCw,
} from "lucide-react";
import usePharmacies from "../../../hooks/usePharmacies";

const Pharmacies = () => {
  const {
    pharmacies,
    stats,
    loading,
    error,
    pagination,
    fetchPharmacies,
    fetchStats,
    getPharmacyDetails,
    approvePharmacy,
    rejectPharmacy,
    suspendPharmacy,
    activatePharmacy,
  } = usePharmacies();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchStats(),
        fetchPharmacies({
          search: searchTerm,
          status: filterStatus,
          page: 0,
        }),
      ]);
    };

    loadInitialData();
  }, []);

  // ✅ Handle search and filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPharmacies({
        search: searchTerm,
        status: filterStatus,
        page: 0,
      });
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterStatus, fetchPharmacies]);

  // ✅ Handle pharmacy actions
  const handleSuspend = async (pharmacy, suspendReason) => {
    try {
      await suspendPharmacy(pharmacy.id, suspendReason);
      console.log(
        `Suspended pharmacy: ${pharmacy.name}, Reason: ${suspendReason}`
      );
    } catch (error) {
      console.error("Failed to suspend pharmacy:", error);
    }
  };

  const handleActivate = async (pharmacy) => {
    try {
      await activatePharmacy(pharmacy.id);
      console.log(`Activated pharmacy: ${pharmacy.name}`);
    } catch (error) {
      console.error("Failed to activate pharmacy:", error);
    }
  };

  const handleAcceptRegistration = async (pharmacy) => {
    try {
      await approvePharmacy(pharmacy.id);
      console.log(`Accepted registration for pharmacy: ${pharmacy.name}`);
    } catch (error) {
      console.error("Failed to accept pharmacy registration:", error);
    }
  };

  const handleRejectRegistration = async (pharmacy, reason) => {
    try {
      await rejectPharmacy(pharmacy.id, reason);
      console.log(
        `Rejected registration for pharmacy: ${pharmacy.name}, Reason: ${reason}`
      );
    } catch (error) {
      console.error("Failed to reject pharmacy registration:", error);
    }
  };

  // ✅ Handle pagination
  const handleLoadMore = () => {
    if (pagination.hasNext && !loading) {
      fetchPharmacies({
        search: searchTerm,
        status: filterStatus,
        page: pagination.page + 1,
      });
    }
  };

  // ✅ Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchPharmacies({
          search: searchTerm,
          status: filterStatus,
          page: 0,
        }),
      ]);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="flex items-center justify-between mb-8">
        <PageHeader
          icon={Store}
          title="Pharmacy Management"
          subtitle="Manage all registered pharmacies on the PillPath platform."
        />

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* ✅ Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          label="Active Pharmacies"
          value={stats.activePharmacies || 0}
          icon={<Activity size={48} className="text-blue-500" />}
        />
        <StatCard
          label="Rejected Pharmacies"
          value={stats.rejectedPharmacies || 0}
          icon={<TriangleAlert size={48} className="text-gray-500" />}
        />
        <StatCard
          label="Pending Approval"
          value={stats.pendingApproval || 0}
          icon={<ClockAlert size={48} className="text-yellow-500" />}
        />
        <StatCard
          label="Suspended Pharmacies"
          value={stats.suspendedPharmacies || 0}
          icon={<Ban size={48} className="text-red-500" />}
        />
      </div>

      {/* ✅ Search and Filter */}
      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterValue={filterStatus}
        setFilterValue={setFilterStatus}
        placeholder="Search by name, email, address, or license..."
        filterOptions={["All", "Active", "Pending", "Suspended", "Rejected"]}
      />

      {/* ✅ Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-700">Error: {error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* ✅ Pharmacies Grid */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        {loading && pharmacies.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading pharmacies...</span>
          </div>
        ) : pharmacies.length === 0 ? (
          <div className="text-center py-12">
            <Store size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No pharmacies found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "All"
                ? "Try adjusting your search or filter criteria."
                : "No pharmacies have been registered yet."}
            </p>
          </div>
        ) : (
          <>
            {/* ✅ Updated grid with consistent heights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pharmacies.map((pharmacy) => (
                <div key={pharmacy.id} className="h-full">
                  <PharmacyCard
                    pharmacy={pharmacy}
                    onSuspend={handleSuspend}
                    onActivate={handleActivate}
                    onAcceptRegistration={handleAcceptRegistration}
                    onRejectRegistration={handleRejectRegistration}
                    onViewDetails={getPharmacyDetails}
                  />
                </div>
              ))}
            </div>

            {/* ✅ Load More Button */}
            {pagination.hasNext && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>
                      Load More ({pagination.totalElements - pharmacies.length}{" "}
                      remaining)
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* ✅ Pagination Info */}
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing {pharmacies.length} of {pagination.totalElements}{" "}
              pharmacies
              {pagination.totalPages > 1 && (
                <span>
                  {" "}
                  • Page {pagination.page + 1} of {pagination.totalPages}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Pharmacies;
