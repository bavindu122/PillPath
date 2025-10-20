import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  User,
  Building,
  FileText,
  Download,
  Eye,
  Calendar,
  Shield,
  Star,
  AlertCircle,
} from "lucide-react";
import PharmacyService from "../../../services/api/PharmacyService";

const PharmacyDetailsModal = ({
  isOpen,
  onClose,
  pharmacy,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  useEffect(() => {
    if (isOpen && pharmacy?.id) {
      // Mock documents for preview since backend isn't implemented
      setLoadingDocs(true);
      setTimeout(() => {
        setDocuments([
          {
            id: 1,
            name: "Business License",
            type: "license",
            fileName: "business_license.pdf",
            uploadDate: "2024-01-15",
            size: 2457600, // 2.4 MB in bytes
          },
          {
            id: 2,
            name: "Pharmacy Registration Certificate",
            type: "registration",
            fileName: "pharmacy_registration.pdf",
            uploadDate: "2024-01-15",
            size: 1887436, // 1.8 MB in bytes
          },
          {
            id: 3,
            name: "Tax Identification Certificate",
            type: "tax",
            fileName: "tax_certificate.pdf",
            uploadDate: "2024-01-16",
            size: 911360, // 890 KB in bytes
          },
          {
            id: 4,
            name: "Professional Insurance Document",
            type: "insurance",
            fileName: "insurance_document.pdf",
            uploadDate: "2024-01-16",
            size: 1258291, // 1.2 MB in bytes
          },
          {
            id: 5,
            name: "Pharmacist License",
            type: "pharmacist_license",
            fileName: "pharmacist_license.pdf",
            uploadDate: "2024-01-17",
            size: 1572864, // 1.5 MB in bytes
          },
        ]);
        setLoadingDocs(false);
      }, 1000); // Simulate API delay
    }
  }, [isOpen, pharmacy?.id]);

  const handleDownloadDocument = async (document) => {
    // Mock download functionality
    console.log("Download document:", document.fileName);
    alert(
      `Download functionality will be implemented. Document: ${document.fileName}`
    );
  };

  const handleViewDocument = async (document) => {
    // Mock view functionality
    console.log("View document:", document.fileName);
    alert(
      `Document viewer will be implemented. Document: ${document.fileName}`
    );
  };

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

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
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
                    <span>{safeGet(pharmacy, "rating", "4.2")}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Pharmacy Details
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "documents"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Documents ({documents.length})
            </button>
          </nav>
        </div>

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
              {/* Details Tab */}
              {activeTab === "details" && pharmacy && (
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

              {/* Documents Tab - keep existing documents code */}
              {activeTab === "documents" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Uploaded Documents
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {documents.length} document(s) uploaded
                      </span>
                      <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Preview Mode
                      </div>
                    </div>
                  </div>

                  {loadingDocs ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-3 text-gray-600">
                        Loading documents...
                      </span>
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText
                        size={48}
                        className="mx-auto text-gray-400 mb-4"
                      />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No documents uploaded
                      </h3>
                      <p className="text-gray-500">
                        This pharmacy hasn't uploaded any documents yet.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-2">
                          <AlertCircle size={20} className="text-blue-600" />
                          <div>
                            <p className="text-blue-800 font-medium">
                              Preview Mode
                            </p>
                            <p className="text-blue-600 text-sm">
                              These are sample documents for demonstration.
                              Backend integration pending.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documents.map((document) => (
                          <div
                            key={document.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start space-x-3 mb-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText size={20} className="text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {document.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {document.fileName}
                                </p>
                              </div>
                            </div>

                            <div className="text-sm text-gray-500 mb-4">
                              <p>Size: {formatFileSize(document.size)}</p>
                              <p>Uploaded: {formatDate(document.uploadDate)}</p>
                            </div>

                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewDocument(document)}
                                className="flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                <Eye size={16} />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => handleDownloadDocument(document)}
                                className="flex items-center space-x-1 bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                <Download size={16} />
                                <span>Download</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
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
