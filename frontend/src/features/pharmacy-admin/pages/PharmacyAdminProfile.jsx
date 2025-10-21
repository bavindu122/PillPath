import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  Shield,
  Camera,
  Edit2,
  Save,
  X,
  MapPin,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Loader,
  Award,
  Key,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import pharmacyAdminProfileService from "../services/pharmacyAdminProfileService";

const PharmacyAdminProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // State management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Profile data
  const [profileData, setProfileData] = useState(null);
  const [editedData, setEditedData] = useState({});

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await pharmacyAdminProfileService.getMyProfile();
      setProfileData(data);
      setEditedData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePermissionToggle = (permission) => {
    const currentPermissions = editedData.permissions || [];
    const newPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter((p) => p !== permission)
      : [...currentPermissions, permission];
    setEditedData((prev) => ({ ...prev, permissions: newPermissions }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Prepare data for update
      const updateData = {
        fullName: editedData.fullName,
        email: editedData.email,
        phoneNumber: editedData.phoneNumber,
        dateOfBirth: editedData.dateOfBirth,
        address: editedData.address,
        position: editedData.position,
        permissions: editedData.permissions,
      };

      const updatedProfile = await pharmacyAdminProfileService.updateMyProfile(updateData);
      setProfileData(updatedProfile);
      setEditedData(updatedProfile);
      setIsEditMode(false);
      
      // Update localStorage user data to refresh header immediately
      const storedUser = localStorage.getItem("user_data");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUser = { 
          ...userData, 
          fullName: updatedProfile.fullName,
          email: updatedProfile.email,
          phoneNumber: updatedProfile.phoneNumber,
          dateOfBirth: updatedProfile.dateOfBirth,
          address: updatedProfile.address,
          position: updatedProfile.position
        };
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        // Trigger a storage event to update header and other components
        window.dispatchEvent(new Event('storage'));
      }
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditMode(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setUploadingImage(true);
      const result = await pharmacyAdminProfileService.uploadProfilePicture(file);
      setProfileData(result.profile);
      setEditedData(result.profile);
      
      // Update localStorage user data to refresh header
      const storedUser = localStorage.getItem("user_data");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUser = { ...userData, profilePictureUrl: result.profile.profilePictureUrl };
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        // Trigger a storage event to update other components
        window.dispatchEvent(new Event('storage'));
      }
      
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm("Are you sure you want to remove your profile picture?")) {
      return;
    }

    try {
      setUploadingImage(true);
      const result = await pharmacyAdminProfileService.deleteProfilePicture();
      setProfileData(result.profile);
      setEditedData(result.profile);
      
      // Update localStorage user data to refresh header
      const storedUser = localStorage.getItem("user_data");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUser = { ...userData, profilePictureUrl: null };
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        // Trigger a storage event to update other components
        window.dispatchEvent(new Event('storage'));
      }
      
      toast.success("Profile picture removed successfully!");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error(error.message || "Failed to remove image");
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load profile</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayData = isEditMode ? editedData : profileData;
  const availablePermissions = [
    "MANAGE_STAFF",
    "MANAGE_INVENTORY",
    "VIEW_REPORTS",
    "MANAGE_ORDERS",
    "FULL_ACCESS",
  ];

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/pharmacy")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 mb-4 transition-colors px-3 sm:px-4 py-2 rounded-lg group w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your professional information and settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Picture Section */}
          <div className="px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 overflow-hidden">
                  {displayData.profilePictureUrl ? (
                    <img
                      src={displayData.profilePictureUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-600">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                {!isEditMode && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImage ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5" />
                    )}
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 sm:mt-0">
                {!isEditMode ? (
                  <>
                    {displayData.profilePictureUrl && (
                      <button
                        onClick={handleRemoveImage}
                        disabled={uploadingImage}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Remove Photo
                      </button>
                    )}
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Basic Information
                </h2>
                {displayData.isPrimaryAdmin && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <Shield className="w-3 h-3" />
                    Primary Admin
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editedData.fullName || ""}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {displayData.fullName || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    {isEditMode ? (
                      <input
                        type="email"
                        value={editedData.email || ""}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="text-gray-900">{displayData.email || "Not provided"}</p>
                    )}
                    {displayData.emailVerified && (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2">
                    {isEditMode ? (
                      <input
                        type="tel"
                        value={editedData.phoneNumber || ""}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {displayData.phoneNumber || "Not provided"}
                      </p>
                    )}
                    {displayData.phoneVerified && (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    Date of Birth
                  </label>
                  {isEditMode ? (
                    <input
                      type="date"
                      value={editedData.dateOfBirth || ""}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {displayData.dateOfBirth
                        ? new Date(displayData.dateOfBirth).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editedData.address || ""}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="text-gray-900">{displayData.address || "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="mb-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Professional Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Position */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="w-4 h-4" />
                    Position
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editedData.position || ""}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Pharmacy Manager"
                    />
                  ) : (
                    <p className="text-gray-900">{displayData.position || "Not provided"}</p>
                  )}
                </div>

                {/* License Number */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Key className="w-4 h-4" />
                    License Number
                  </label>
                  <p className="text-gray-900 font-medium">
                    {displayData.licenseNumber || "Not provided"}
                  </p>
                </div>

                {/* Hire Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    Hire Date
                  </label>
                  <p className="text-gray-900">
                    {displayData.hireDate
                      ? new Date(displayData.hireDate).toLocaleDateString()
                      : "Not provided"}
                  </p>
                </div>

                {/* Username */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Username
                  </label>
                  <p className="text-gray-900">{displayData.username || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Pharmacy Information */}
            <div className="mb-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Pharmacy Information
              </h2>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <Building2 className="w-6 h-6 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {displayData.pharmacyName || "No pharmacy assigned"}
                    </h3>
                    {displayData.pharmacyId && (
                      <p className="text-sm text-gray-600">
                        Pharmacy ID: {displayData.pharmacyId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Permissions & Access
              </h2>

              {displayData.isPrimaryAdmin ? (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Full Access</h3>
                      <p className="text-sm text-gray-600">
                        As the primary admin, you have full access to all pharmacy features.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {isEditMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availablePermissions.map((permission) => (
                        <label
                          key={permission}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={(editedData.permissions || []).includes(permission)}
                            onChange={() => handlePermissionToggle(permission)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <div>
                            <span className="text-gray-900 font-medium">
                              {permission.replace(/_/g, " ")}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : displayData.permissions && displayData.permissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {displayData.permissions.map((permission, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-900">
                            {permission.replace(/_/g, " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>No specific permissions assigned</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyAdminProfile;
