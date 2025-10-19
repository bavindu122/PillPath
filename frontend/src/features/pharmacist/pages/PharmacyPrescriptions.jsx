import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  MessageCircle,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import PharmaPageLayout from "../components/PharmaPageLayout";
import { prescriptionService } from "../services/prescriptionService";
import { orderService } from "../services/orderService";
import "./index-pharmacist.css";

/**
 * PharmacyPrescriptions - Displays prescriptions for a specific pharmacy
 * Used when pharmacists click "New Prescription" notifications
 * Endpoint: GET /api/v1/prescriptions/pharmacy/{pharmacyId}
 */
const PharmacyPrescriptions = () => {
  const { pharmacyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Get prescriptionId from query params if navigating from notification
  const focusPrescriptionId = (() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("prescriptionId");
    return id ? Number(id) : location.state?.prescriptionId;
  })();

  useEffect(() => {
    loadPrescriptions();
  }, [pharmacyId]);

  const loadPrescriptions = async () => {
    if (!pharmacyId) {
      setError("Pharmacy ID is required");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await prescriptionService.loadPharmacyPrescriptions(pharmacyId);
      setPrescriptions(data);

      // If we have a focus prescription from notification, scroll to it after render
      if (focusPrescriptionId) {
        setTimeout(() => {
          const element = document.getElementById(`prescription-${focusPrescriptionId}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.classList.add("ring-2", "ring-blue-500");
          }
        }, 300);
      }
    } catch (err) {
      console.error("Failed to load pharmacy prescriptions:", err);
      setError(err.message || "Failed to load prescriptions");
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High Priority":
        return "bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200";
      case "Medium Priority":
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200";
      case "Low Priority":
        return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending_review":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "clarification_needed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ready_for_pickup":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending_review":
        return "Pending Review";
      case "in_progress":
        return "In Progress";
      case "clarification_needed":
        return "Needs Clarification";
      case "ready_for_pickup":
        return "Ready for Pickup";
      default:
        return "Unknown";
    }
  };

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      await prescriptionService.updateStatus(id, "IN_PROGRESS");
      await loadPrescriptions(); // Reload to get updated status
    } catch (err) {
      console.error("Failed to approve:", err);
      alert(err?.message || "Could not approve this submission.");
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Are you sure you want to reject this prescription?")) return;
    
    try {
      await prescriptionService.deleteSubmission(id);
      await loadPrescriptions(); // Reload list
    } catch (err) {
      console.error("Failed to reject:", err);
      alert(err?.message || "Could not reject this submission.");
    }
  };

  const handleClarify = async (id) => {
    try {
      await prescriptionService.updateStatus(id, "CLARIFICATION_NEEDED");
      await loadPrescriptions(); // Reload to get updated status
    } catch (err) {
      console.error("Failed to set clarification:", err);
      alert(err?.message || "Could not update status.");
    }
  };

  const handleReview = async (prescription) => {
    // Try to find matching order first
    try {
      const orders = await orderService.listOrders();
      const match = orders.find((o) => o.prescriptionCode === prescription.code);
      if (match?.id) {
        navigate(`/pharmacist/orders/${match.id}`, {
          state: { activeOverride: "prescriptions" },
        });
        return;
      }
    } catch (e) {
      console.warn("Could not list orders:", e);
    }

    // Fallback to review page
    navigate(`/pharmacist/review/${prescription.reviewId || prescription.id}`, {
      state: {
        activeOverride: "prescriptions",
        fallback: {
          id: prescription.reviewId || prescription.id,
          submissionId: prescription.submissionId || prescription.id,
          code: prescription.code,
          customerName: prescription.patientName,
          imageUrl: prescription.imageUrl,
          status: (prescription.status || "").toUpperCase(),
        },
      },
    });
  };

  // Filter prescriptions by search term
  const filteredPrescriptions = prescriptions.filter((p) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      p.code?.toLowerCase().includes(searchLower) ||
      p.patientName?.toLowerCase().includes(searchLower) ||
      p.customerName?.toLowerCase().includes(searchLower)
    );
  });

  const headerActions = (
    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-full shadow-sm">
      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>
      <p className="text-sm font-semibold text-purple-700">
        {filteredPrescriptions.length} prescription{filteredPrescriptions.length !== 1 ? "s" : ""}
      </p>
    </div>
  );

  if (error && !isLoading) {
    return (
      <PharmaPageLayout
        title="Pharmacy Prescriptions"
        subtitle={`Pharmacy ID: ${pharmacyId}`}
        showBackButton={true}
      >
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Prescriptions</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/pharmacist/queue")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Prescription Queue
          </button>
        </div>
      </PharmaPageLayout>
    );
  }

  return (
    <PharmaPageLayout
      title="Pharmacy Prescriptions"
      subtitle={`Pharmacy ID: ${pharmacyId}${focusPrescriptionId ? ` • Focusing on Prescription #${focusPrescriptionId}` : ""}`}
      isLoading={isLoading}
      loadingMessage="Loading prescriptions..."
      showBackButton={true}
      headerActions={headerActions}
    >
      {/* Search Bar */}
      <div className="dashboard-fade-in-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search code, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>
      </div>

      {/* Prescription Cards */}
      <div className="dashboard-fade-in-3">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {filteredPrescriptions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium">No prescriptions found</p>
                  <p className="text-sm">
                    {searchTerm ? "Try adjusting your search" : "No prescriptions available for this pharmacy"}
                  </p>
                </div>
              ) : (
                filteredPrescriptions.map((prescription, index) => (
                  <div
                    key={prescription.id}
                    id={`prescription-${prescription.id}`}
                    className={`border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white group ${
                      prescription.id === focusPrescriptionId ? "ring-2 ring-blue-400" : ""
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="relative flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center group-hover:shadow-md transition-shadow">
                            <User className="h-7 w-7 text-gray-600" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors font-mono">
                              {prescription.code}
                            </h3>
                            <div className="flex gap-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(prescription.priority)}`}>
                                {prescription.priority}
                              </span>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(prescription.status)}`}>
                                {getStatusText(prescription.status)}
                              </span>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                            <User className="h-3 w-3" />
                            <span>{prescription.patientName}</span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{prescription.time}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{prescription.date}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReview(prescription)}
                          className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 hover:shadow-md transform hover:scale-105 transition-all"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Review</span>
                        </button>
                        <button
                          onClick={() => handleApprove(prescription.id)}
                          disabled={approvingId === prescription.id}
                          className={`flex items-center space-x-1 px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                            approvingId === prescription.id
                              ? "bg-green-100 text-green-500 cursor-not-allowed"
                              : "bg-green-500 text-white hover:bg-green-600 hover:shadow-md transform hover:scale-105"
                          }`}
                        >
                          {approvingId === prescription.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          <span>{approvingId === prescription.id ? "..." : "Approve"}</span>
                        </button>
                        <button
                          onClick={() => handleClarify(prescription.id)}
                          className="flex items-center space-x-1 px-4 py-2 bg-yellow-500 text-white text-xs font-medium rounded-lg hover:bg-yellow-600 hover:shadow-md transform hover:scale-105 transition-all"
                        >
                          <MessageCircle className="h-3 w-3" />
                          <span>Clarify</span>
                        </button>
                        <button
                          onClick={() => handleReject(prescription.id)}
                          className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 hover:shadow-md transform hover:scale-105 transition-all"
                        >
                          <XCircle className="h-3 w-3" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </PharmaPageLayout>
  );
};

export default PharmacyPrescriptions;
