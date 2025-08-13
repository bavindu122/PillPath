import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Star,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Pause,
  Play,
  Eye,
  Award,
  Truck,
  Shield,
  Loader2,
} from "lucide-react";

const PharmacyCard = ({
  pharmacy,
  onSuspend,
  onActivate,
  onAcceptRegistration,
  onRejectRegistration,
  onViewDetails,
}) => {
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // ✅ Handle action with loading state
  const handleAction = async (actionFn, actionType, ...args) => {
    try {
      setActionLoading(actionType);
      await actionFn(...args);
    } catch (error) {
      console.error(`Action ${actionType} failed:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      case "Rejected":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatOperatingHours = (hours) => {
    if (!hours) return "Not specified";

    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const currentDay = days[new Date().getDay()];

    return hours[currentDay] || "Closed";
  };

  const handleSuspend = async () => {
    if (suspendReason.trim()) {
      await handleAction(onSuspend, "suspend", pharmacy, suspendReason);
      setShowSuspendModal(false);
      setSuspendReason("");
    }
  };

  const handleReject = async () => {
    if (rejectReason.trim()) {
      await handleAction(
        onRejectRegistration,
        "reject",
        pharmacy,
        rejectReason
      );
      setShowRejectModal(false);
      setRejectReason("");
    }
  };

  return (
    <>
      {/* ✅ Fixed layout with flex column and consistent height */}
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col h-full">
        
        {/* ✅ Header Image Section */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0">
          {pharmacy.logoUrl ? (
            <img
              src={pharmacy.logoUrl}
              alt={pharmacy.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}

          {/* Fallback for when no image or image fails to load */}
          <div
            className={`flex items-center justify-center h-full ${
              pharmacy.logoUrl ? "hidden" : ""
            }`}
          >
            <Building2 size={64} className="text-white/70" />
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                pharmacy.status
              )}`}
            >
              {pharmacy.status}
            </span>
          </div>

          {/* Verification Badge */}
          {pharmacy.isVerified && (
            <div className="absolute top-3 left-3">
              <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                <Shield size={14} className="text-blue-600" />
                <span className="text-xs font-medium text-blue-600">
                  Verified
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Content Section - flex-grow to fill available space */}
        <div className="p-6 flex flex-col flex-grow">
          
          {/* ✅ Pharmacy Info Section */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {pharmacy.name}
            </h3>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{pharmacy.address}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-400 flex-shrink-0" />
                <span>{pharmacy.phoneNumber || "N/A"}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">{pharmacy.email}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Award size={16} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">
                  License: {pharmacy.licenseNumber}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-gray-400 flex-shrink-0" />
                <span>
                  Today: {formatOperatingHours(pharmacy.operatingHours)}
                </span>
              </div>
            </div>
          </div>

          {/* ✅ Statistics Section */}
          <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center flex-1">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Star size={16} className="text-yellow-500" />
                <span className="font-semibold text-gray-900">
                  {pharmacy.averageRating?.toFixed(1) || "0.0"}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {pharmacy.totalReviews || 0} reviews
              </span>
            </div>

            <div className="text-center flex-1">
              <div className="font-semibold text-gray-900 mb-1">
                {pharmacy.deliveryAvailable ? "Yes" : "No"}
              </div>
              <div className="flex items-center justify-center space-x-1">
                <Truck size={14} className="text-gray-400" />
                <span className="text-xs text-gray-500">
                  {pharmacy.deliveryAvailable
                    ? `${pharmacy.deliveryRadius || 0}km`
                    : "No delivery"}
                </span>
              </div>
            </div>

            <div className="text-center flex-1">
              <div className="font-semibold text-gray-900 mb-1">
                {formatDate(pharmacy.createdAt)}
              </div>
              <span className="text-xs text-gray-500">Joined</span>
            </div>
          </div>

          {/* ✅ Services Section - Only show if services exist */}
          {pharmacy.services && pharmacy.services.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Services:
              </h4>
              <div className="flex flex-wrap gap-1">
                {pharmacy.services.slice(0, 3).map((service, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {service}
                  </span>
                ))}
                {pharmacy.services.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{pharmacy.services.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ✅ Reason Display Section - Only show if reasons exist */}
          {(pharmacy.suspendReason || pharmacy.rejectReason) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-sm font-medium text-red-800 mb-1">
                {pharmacy.status === "Suspended"
                  ? "Suspension Reason:"
                  : "Rejection Reason:"}
              </h4>
              <p className="text-sm text-red-600">
                {pharmacy.suspendReason || pharmacy.rejectReason}
              </p>
            </div>
          )}

          {/* ✅ Spacer to push action buttons to bottom */}
          <div className="flex-grow"></div>

          {/* ✅ Action Buttons Section - Always at bottom */}
          <div className="space-y-2 mt-auto">
            
            {/* Details Button - Always visible */}
            <button
              onClick={async () => {
                if (onViewDetails) {
                  try {
                    setActionLoading("details");
                    const details = await onViewDetails(pharmacy.id);
                    console.log("Pharmacy details:", details);
                    setShowDetails(true);
                  } catch (error) {
                    console.error("Failed to load details:", error);
                  } finally {
                    setActionLoading(null);
                  }
                } else {
                  setShowDetails(true);
                }
              }}
              disabled={actionLoading === "details"}
              className="w-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              {actionLoading === "details" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Eye size={16} />
              )}
              <span>View Details</span>
            </button>

            {/* ✅ Status-specific action buttons */}
            {pharmacy.status === "Pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleAction(onAcceptRegistration, "accept", pharmacy)
                  }
                  disabled={actionLoading === "accept"}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                >
                  {actionLoading === "accept" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  <span>Accept</span>
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={actionLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                >
                  <XCircle size={16} />
                  <span>Reject</span>
                </button>
              </div>
            )}

            {pharmacy.status === "Active" && (
              <button
                onClick={() => setShowSuspendModal(true)}
                disabled={actionLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
              >
                <Pause size={16} />
                <span>Suspend Pharmacy</span>
              </button>
            )}

            {pharmacy.status === "Suspended" && (
              <button
                onClick={() => handleAction(onActivate, "activate", pharmacy)}
                disabled={actionLoading === "activate"}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
              >
                {actionLoading === "activate" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Play size={16} />
                )}
                <span>Activate Pharmacy</span>
              </button>
            )}

            {pharmacy.status === "Rejected" && (
              <div className="text-center py-2">
                <span className="text-sm text-gray-500 italic">
                  Registration was rejected
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Suspend Pharmacy</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for suspending{" "}
              <strong>{pharmacy.name}</strong>:
            </p>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Enter suspension reason..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                disabled={!suspendReason.trim() || actionLoading === "suspend"}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
              >
                {actionLoading === "suspend" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Suspending...</span>
                  </>
                ) : (
                  <span>Suspend</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Registration</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting{" "}
              <strong>{pharmacy.name}</strong>'s registration:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || actionLoading === "reject"}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
              >
                {actionLoading === "reject" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Rejecting...</span>
                  </>
                ) : (
                  <span>Reject</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PharmacyCard;