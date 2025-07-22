import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
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
} from "lucide-react";

const PharmacyCard = ({
  pharmacy,
  onSuspend,
  onActivate,
  onAcceptRegistration,
  onRejectRegistration,
}) => {
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  // ✅ Updated to use backend fields
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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatOperatingHours = (hours) => {
    if (!hours) return "Not specified";

    const today = new Date().toLocaleLowerCase();
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

  const handleSuspend = () => {
    if (suspendReason.trim()) {
      onSuspend(pharmacy, suspendReason);
      setShowSuspendModal(false);
      setSuspendReason("");
    }
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      onRejectRegistration(pharmacy, rejectReason);
      setShowRejectModal(false);
      setRejectReason("");
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
        {/* ✅ Updated image handling */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600">
          {pharmacy.logoUrl ? (
            <img
              src={pharmacy.logoUrl}
              alt={pharmacy.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Building2 size={64} className="text-white/70" />
            </div>
          )}

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

        <div className="p-6">
          {/* ✅ Updated header info */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {pharmacy.name}
            </h3>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-gray-400" />
                <span>{pharmacy.address}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-400" />
                <span>{pharmacy.phoneNumber}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-400" />
                <span>{pharmacy.email}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Award size={16} className="text-gray-400" />
                <span>License: {pharmacy.licenseNumber}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-gray-400" />
                <span>
                  Today: {formatOperatingHours(pharmacy.operatingHours)}
                </span>
              </div>
            </div>
          </div>

          {/* ✅ Updated statistics */}
          <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Star size={16} className="text-yellow-500" />
                <span className="font-semibold text-gray-900">
                  {pharmacy.averageRating?.toFixed(1) || "0.0"}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {pharmacy.totalReviews} reviews
              </span>
            </div>

            <div className="text-center">
              <div className="font-semibold text-gray-900 mb-1">
                {pharmacy.deliveryAvailable ? "Yes" : "No"}
              </div>
              <div className="flex items-center justify-center space-x-1">
                <Truck size={14} className="text-gray-400" />
                <span className="text-xs text-gray-500">
                  {pharmacy.deliveryAvailable
                    ? `${pharmacy.deliveryRadius}km`
                    : "No delivery"}
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className="font-semibold text-gray-900 mb-1">
                {formatDate(pharmacy.createdAt)}
              </div>
              <span className="text-xs text-gray-500">Joined</span>
            </div>
          </div>

          {/* ✅ Updated services display */}
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

          {/* Reason display for suspended/rejected */}
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

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowDetails(true)}
              className="flex-1 min-w-[100px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <Eye size={16} />
              <span>Details</span>
            </button>

            {pharmacy.status === "Pending" && (
              <>
                <button
                  onClick={() => onAcceptRegistration(pharmacy)}
                  className="flex-1 min-w-[100px] bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                >
                  <CheckCircle size={16} />
                  <span>Accept</span>
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 min-w-[100px] bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                >
                  <XCircle size={16} />
                  <span>Reject</span>
                </button>
              </>
            )}

            {pharmacy.status === "Active" && (
              <button
                onClick={() => setShowSuspendModal(true)}
                className="flex-1 min-w-[100px] bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
              >
                <Pause size={16} />
                <span>Suspend</span>
              </button>
            )}

            {pharmacy.status === "Suspended" && (
              <button
                onClick={() => onActivate(pharmacy)}
                className="flex-1 min-w-[100px] bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
              >
                <Play size={16} />
                <span>Activate</span>
              </button>
            )}
          </div>
        </div>
      </div>
     
      {selectedPharmacy && (
        <ViewPharmacy
          pharmacy={selectedPharmacy}
          onClose={() => setSelectedPharmacy(null)}
          onAcceptRegistration={(pharmacy) => {
            onAcceptRegistration(pharmacy);
            setSelectedPharmacy(null); // ← This closes the popup
          }}
          onRejectRegistration={(pharmacy, reason) => {
            onRejectRegistration(pharmacy, reason);
            setSelectedPharmacy(null); // ← This closes the popup
          }}
        />
      )}
      {suspendPopup && (
        <SuspendPharmacy
          pharmacy={suspendPopup}
          reason={suspendReason}
          setReason={setSuspendReason}
          onCancel={() => setSuspendPopup(null)}
          onConfirm={handleSuspendConfirm}
        />
      )}
      {activatePopup && (
        <ActivePharmacy
          pharmacy={activatePopup}
          onCancel={() => setActivatePopup(null)}
          onConfirm={handleActivateConfirm}
        />
      )}
    </>
  );
};

export default PharmacyCard;
