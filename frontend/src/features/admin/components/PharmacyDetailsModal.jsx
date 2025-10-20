import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  User,
  Building,
  Calendar,
  Shield,
  Star,
} from "lucide-react";

const PharmacyDetailsModal = ({
  isOpen,
  onClose,
  pharmacy,
  loading = false,
}) => {
  // Documents section removed

  // Helper function to safely get nested properties
  const safeGet = (obj, path, defaultValue = "Not specified") => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined
        ? current[key]
        : defaultValue;
    }, obj);
  };

  // Helper function to format operating hours
  const formatOperatingHours = (operatingHours) => {
    if (!operatingHours) {
      return "Hours not specified";
    }

    if (typeof operatingHours === "string") {
      return operatingHours;
    }

    if (typeof operatingHours === "object") {
      const daysOrder = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      const formattedHours = [];

      daysOrder.forEach((day) => {
        if (operatingHours[day]) {
          const dayName = day.charAt(0).toUpperCase() + day.slice(1, 3);
          formattedHours.push(`${dayName}: ${operatingHours[day]}`);
        }
      });

      return formattedHours.length > 0
        ? formattedHours.join(", ")
        : "Hours not specified";
    }

    return "Hours not available";
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "rejected":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Building size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                {loading
                  ? "Loading..."
                  : safeGet(pharmacy, "name", "Pharmacy Details")}
              </h2>
              {pharmacy && (
                <div className="flex items-center space-x-4 text-white/90">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      pharmacy.status
                    )} text-gray-800`}
                  >
                    {safeGet(pharmacy, "status", "Unknown")}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star size={16} />
                    <span>
                      {Number.isFinite(Number(pharmacy?.averageRating))
                        ? Number(pharmacy.averageRating).toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-200" />

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">
                Loading pharmacy details...
              </span>
            </div>
          ) : (
            <>
              {pharmacy && (
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                        Basic Information
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Building className="text-gray-400 mt-1" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Pharmacy Name
                            </p>
                            <p className="text-gray-900">
                              {safeGet(pharmacy, "name")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <User className="text-gray-400 mt-1" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Owner Name
                            </p>
                            <p className="text-gray-900">
                              {safeGet(pharmacy, "ownerName") ||
                                safeGet(pharmacy, "contactPerson") ||
                                safeGet(pharmacy, "pharmacistName")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Mail className="text-gray-400 mt-1" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Email
                            </p>
                            <p className="text-gray-900">
                              {safeGet(pharmacy, "email")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Phone className="text-gray-400 mt-1" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Phone
                            </p>
                            <p className="text-gray-900">
                              {safeGet(pharmacy, "phoneNumber")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Shield className="text-gray-400 mt-1" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              License Number
                            </p>
                            <p className="text-gray-900">
                              {safeGet(pharmacy, "licenseNumber")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                        Location & Status
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <MapPin className="text-gray-400 mt-1" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Address
                            </p>
                            <p className="text-gray-900">
                              {safeGet(pharmacy, "address")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Clock className="text-gray-400 mt-1" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Operating Hours
                            </p>
                            <p className="text-gray-900">
                              {formatOperatingHours(pharmacy.operatingHours)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Calendar className="text-gray-400 mt-1" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Registration Date
                            </p>
                            <p className="text-gray-900">
                              {formatDate(
                                pharmacy.registrationDate ||
                                  pharmacy.createdAt ||
                                  pharmacy.registeredAt
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Shield className="text-gray-400 mt-1" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Verification Status
                            </p>
                            <p
                              className={`font-medium ${
                                pharmacy.isVerified
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {pharmacy.isVerified
                                ? "Verified"
                                : "Pending Verification"}
                            </p>
                          </div>
                        </div>

                        {/* Additional fields that might be in your pharmacy data */}
                        {pharmacy.website && (
                          <div className="flex items-start space-x-3">
                            <Building
                              className="text-gray-400 mt-1"
                              size={20}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Website
                              </p>
                              <p className="text-gray-900">
                                {pharmacy.website}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {safeGet(
                        pharmacy,
                        "description",
                        "No description provided"
                      )}
                    </p>
                  </div>

                  {/* Services - if available in your data */}
                  {pharmacy.services && pharmacy.services.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                        Services Offered
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {pharmacy.services.map((service, index) => (
                          <div
                            key={index}
                            className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium"
                          >
                            {service}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rejection/Suspension Reason */}
                  {(pharmacy.rejectReason || pharmacy.suspendReason) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                        {pharmacy.rejectReason
                          ? "Rejection Reason"
                          : "Suspension Reason"}
                      </h3>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800">
                          {pharmacy.rejectReason || pharmacy.suspendReason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Additional pharmacy information if available */}
                  {pharmacy.coordinates && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                        Location Coordinates
                      </h3>
                      <p className="text-gray-700">
                        Latitude: {pharmacy.coordinates.lat}, Longitude:{" "}
                        {pharmacy.coordinates.lng}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-2 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDetailsModal;
