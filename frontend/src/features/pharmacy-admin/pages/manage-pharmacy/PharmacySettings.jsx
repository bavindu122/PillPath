import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  MapPin,
  Phone,
  Mail,
  Store,
  Edit,
  Sparkles,
  Shield,
  Award,
  Save,
  X,
  Target,
  Clock,
  Truck,
  Star,
  Upload,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { usePharmacyProfile } from "../../../../hooks/usePharmacyProfile";

// Fix for Leaflet default icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function PharmacySettings() {
  // ✅ Use the custom hook for pharmacy profile management
  const {
    pharmacyProfile,
    loading,
    saving,
    uploading,
    error,
    updateProfile,
    uploadImage,
    updateLocalProfile,
    clearError,
  } = usePharmacyProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Image handling
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  // Location handling
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Track created object URLs for cleanup
  const objectUrlsRef = useRef([]);

  // Success message state
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Initialize form data when pharmacy profile loads
  useEffect(() => {
    if (pharmacyProfile) {
      setFormData({
        name: pharmacyProfile.name || "",
        address: pharmacyProfile.address || "",
        phoneNumber: pharmacyProfile.phoneNumber || "",
        latitude: pharmacyProfile.latitude || 6.9271,
        longitude: pharmacyProfile.longitude || 79.8612,
        operatingHours: pharmacyProfile.operatingHours || {
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        services: pharmacyProfile.services || [],
        deliveryAvailable: pharmacyProfile.deliveryAvailable || false,
        deliveryRadius: pharmacyProfile.deliveryRadius || 10,
      });
    }
  }, [pharmacyProfile]);

  // ✅ Initialize map when location picker is opened
  useEffect(() => {
    if (
      showLocationPicker &&
      mapRef.current &&
      !mapInstanceRef.current &&
      formData.latitude &&
      formData.longitude
    ) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [formData.latitude, formData.longitude],
        15
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      // Add draggable marker
      markerRef.current = L.marker([formData.latitude, formData.longitude], {
        draggable: isEditing,
      }).addTo(mapInstanceRef.current);

      // Update coordinates when marker is dragged
      markerRef.current.on("dragend", (event) => {
        const newPosition = event.target.getLatLng();
        setFormData((prev) => ({
          ...prev,
          latitude: newPosition.lat,
          longitude: newPosition.lng,
        }));
      });

      // Update coordinates when map is clicked
      mapInstanceRef.current.on("click", (event) => {
        if (isEditing) {
          const { lat, lng } = event.latlng;
          markerRef.current.setLatLng([lat, lng]);
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showLocationPicker, isEditing, formData.latitude, formData.longitude]);

  // ✅ Handle logo upload
  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setLogoFile(file);
        const url = URL.createObjectURL(file);
        objectUrlsRef.current.push(url);
        setLogoPreview(url);

        // If not in editing mode, upload immediately
        if (!isEditing) {
          await uploadImage(file, "logo");
          setSuccessMessage("Logo updated successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        }
      } catch (error) {
        console.error("Error handling logo upload:", error);
      }
    }
  };

  // ✅ Handle banner upload
  const handleBannerUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setBannerFile(file);
        const url = URL.createObjectURL(file);
        objectUrlsRef.current.push(url);
        setBannerPreview(url);

        // If not in editing mode, upload immediately
        if (!isEditing) {
          await uploadImage(file, "banner");
          setSuccessMessage("Banner updated successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        }
      } catch (error) {
        console.error("Error handling banner upload:", error);
      }
    }
  };

  // ✅ Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Handle operating hours change
  const handleOperatingHoursChange = (day, value) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: value,
      },
    }));
  };

  // ✅ Handle services change
  const handleServicesChange = (value) => {
    const servicesArray = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setFormData((prev) => ({
      ...prev,
      services: servicesArray,
    }));
  };

  // ✅ Remove image
  const removeImage = (type) => {
    if (type === "logo") {
      setLogoPreview(null);
      setLogoFile(null);
      // You might want to add API call to remove image from server
    } else {
      setBannerPreview(null);
      setBannerFile(null);
      // You might want to add API call to remove image from server
    }
  };

  // ✅ Save changes
  const handleSave = async () => {
    try {
      clearError();

      // Upload pending images first
      if (logoFile && isEditing) {
        await uploadImage(logoFile, "logo");
      }
      if (bannerFile && isEditing) {
        await uploadImage(bannerFile, "banner");
      }

      // Update profile data
      await updateProfile(formData);

      setIsEditing(false);
      setSuccessMessage("Pharmacy profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);

      // Clear pending uploads
      setLogoFile(null);
      setBannerFile(null);
      setLogoPreview(null);
      setBannerPreview(null);
    } catch (error) {
      console.error("Error saving pharmacy data:", error);
      // Error is handled by the hook
    }
  };

  // ✅ Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original profile data
    if (pharmacyProfile) {
      setFormData({
        name: pharmacyProfile.name || "",
        address: pharmacyProfile.address || "",
        phoneNumber: pharmacyProfile.phoneNumber || "",
        latitude: pharmacyProfile.latitude || 6.9271,
        longitude: pharmacyProfile.longitude || 79.8612,
        operatingHours: pharmacyProfile.operatingHours || {},
        services: pharmacyProfile.services || [],
        deliveryAvailable: pharmacyProfile.deliveryAvailable || false,
        deliveryRadius: pharmacyProfile.deliveryRadius || 10,
      });
    }
    // Clear pending uploads
    setLogoFile(null);
    setBannerFile(null);
    setLogoPreview(null);
    setBannerPreview(null);
    clearError();
  };

  // ✅ Cleanup object URLs
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  // ✅ Loading state
  if (loading && !pharmacyProfile) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading pharmacy profile...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error && !pharmacyProfile) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
            <button
              onClick={clearError}
              className="ml-auto text-red-700 hover:text-red-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* ✅ Banner Section */}
          <div className="relative top-[-30px] h-48 bg-gradient-to-r from-blue-500 to-blue-600">
            {(bannerPreview || pharmacyProfile?.bannerUrl) && (
              <img
                src={bannerPreview || pharmacyProfile.bannerUrl}
                alt="Pharmacy Banner"
                className="w-full h-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="flex gap-2">
                <label className="px-4 py-2 bg-white/90 text-gray-800 rounded-lg cursor-pointer hover:bg-white transition-colors flex items-center">
                  {uploading ? (
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Camera className="h-4 w-4 mr-2" />
                  )}
                  {uploading ? "Uploading..." : "Change Banner"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleBannerUpload}
                    accept="image/*"
                    disabled={uploading}
                  />
                </label>
                {(bannerPreview || pharmacyProfile?.bannerUrl) && (
                  <button
                    onClick={() => removeImage("banner")}
                    className="px-4 py-2 bg-red-500/90 text-white rounded-lg hover:bg-red-600 transition-colors"
                    disabled={uploading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Header with Logo and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 -mt-16 sm:-mt-20">
              {/* ✅ Logo Section */}
              <div className="flex items-end space-x-4 mb-4 sm:mb-0">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden">
                    {logoPreview || pharmacyProfile?.logoUrl ? (
                      <img
                        src={logoPreview || pharmacyProfile.logoUrl}
                        alt="Pharmacy Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Store className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <label className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                      {uploading ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleLogoUpload}
                        accept="image/*"
                        disabled={uploading}
                      />
                    </label>
                    {(logoPreview || pharmacyProfile?.logoUrl) && (
                      <button
                        onClick={() => removeImage("logo")}
                        className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        disabled={uploading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-8">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {pharmacyProfile?.name || "Pharmacy Name"}
                  </h2>
                  <div className="flex items-center space-x-4 mt-2">
                    {pharmacyProfile?.isVerified && (
                      <div className="flex items-center space-x-1">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          Verified
                        </span>
                      </div>
                    )}
                    {pharmacyProfile?.averageRating && (
                      <div className="flex items-center space-x-1 ">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-600">
                          {pharmacyProfile.averageRating} (
                          {pharmacyProfile.totalReviews || 0} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                      {saving ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Basic Information
                </h3>

                {/* Pharmacy Name */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Store className="h-4 w-4 text-blue-600 mr-2" />
                    Pharmacy Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      isEditing
                        ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        : "border-gray-200 bg-gray-50 cursor-not-allowed"
                    }`}
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                    Address *
                  </label>
                  <textarea
                    value={formData.address || ""}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows="3"
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg resize-none ${
                      isEditing
                        ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        : "border-gray-200 bg-gray-50 cursor-not-allowed"
                    }`}
                    required
                  />
                </div>

                {/* ✅ Location Coordinates */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Target className="h-4 w-4 text-blue-600 mr-2" />
                      Location Coordinates
                    </label>
                    {isEditing && (
                      <button
                        onClick={() =>
                          setShowLocationPicker(!showLocationPicker)
                        }
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {showLocationPicker ? "Hide Map" : "Pick on Map"}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Latitude</label>
                      <input
                        type="number"
                        value={formData.latitude || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "latitude",
                            parseFloat(e.target.value)
                          )
                        }
                        step="any"
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg text-sm ${
                          isEditing
                            ? "border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                            : "border-gray-200 bg-gray-50 cursor-not-allowed"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Longitude</label>
                      <input
                        type="number"
                        value={formData.longitude || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "longitude",
                            parseFloat(e.target.value)
                          )
                        }
                        step="any"
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg text-sm ${
                          isEditing
                            ? "border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                            : "border-gray-200 bg-gray-50 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>

                  {/* ✅ Interactive Map */}
                  {showLocationPicker && isEditing && (
                    <div className="mt-4">
                      <div
                        ref={mapRef}
                        className="w-full h-64 border rounded-lg"
                      ></div>
                      <p className="text-xs text-gray-500 mt-2">
                        Click on the map or drag the marker to update location
                      </p>
                    </div>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 text-blue-600 mr-2" />
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.phoneNumber || ""}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      isEditing
                        ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        : "border-gray-200 bg-gray-50 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    Email Address (Read-only)
                  </label>
                  <input
                    type="email"
                    value={pharmacyProfile?.email || ""}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg cursor-not-allowed text-gray-500"
                  />
                </div>
              </div>

              {/* Right Column - Additional Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Additional Information
                </h3>

                {/* ✅ Operating Hours */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <Clock className="h-4 w-4 text-blue-600 mr-2" />
                    Operating Hours
                  </label>
                  <div className="space-y-2">
                    {Object.entries(formData.operatingHours || {}).map(
                      ([day, hours]) => (
                        <div key={day} className="flex items-center space-x-3">
                          <div className="w-20 text-sm font-medium text-gray-600 capitalize">
                            {day}
                          </div>
                          <input
                            type="text"
                            value={hours || ""}
                            onChange={(e) =>
                              handleOperatingHoursChange(day, e.target.value)
                            }
                            placeholder="e.g. 09:00-18:00"
                            disabled={!isEditing}
                            className={`flex-1 px-3 py-2 border rounded-lg text-sm ${
                              isEditing
                                ? "border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                : "border-gray-200 bg-gray-50 cursor-not-allowed"
                            }`}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* ✅ Services */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
                    Services Offered
                  </label>
                  <textarea
                    value={(formData.services || []).join(", ")}
                    onChange={(e) => handleServicesChange(e.target.value)}
                    placeholder="Enter services separated by commas"
                    rows="3"
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg resize-none ${
                      isEditing
                        ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        : "border-gray-200 bg-gray-50 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* ✅ Delivery Settings */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <Truck className="h-4 w-4 text-blue-600 mr-2" />
                    Delivery Service
                  </label>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.deliveryAvailable || false}
                        onChange={(e) =>
                          handleInputChange(
                            "deliveryAvailable",
                            e.target.checked
                          )
                        }
                        disabled={!isEditing}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Delivery service available
                      </span>
                    </label>

                    {formData.deliveryAvailable && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Delivery Radius (km)
                        </label>
                        <input
                          type="number"
                          value={formData.deliveryRadius || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "deliveryRadius",
                              parseInt(e.target.value)
                            )
                          }
                          min="1"
                          max="50"
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border rounded-lg text-sm ${
                            isEditing
                              ? "border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                              : "border-gray-200 bg-gray-50 cursor-not-allowed"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* License Information (Read-only) */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Shield className="h-4 w-4 text-gray-400 mr-2" />
                    License Information (Read-only)
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      type="text"
                      value={pharmacyProfile?.licenseNumber || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm cursor-not-allowed text-gray-500"
                      placeholder="License Number"
                    />
                    <input
                      type="date"
                      value={pharmacyProfile?.licenseExpiryDate || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm cursor-not-allowed text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
