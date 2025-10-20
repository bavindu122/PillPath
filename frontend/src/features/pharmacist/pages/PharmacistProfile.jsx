import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  FileText,
  Award,
  Clock,
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
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import pharmacistProfileService from "../services/pharmacistProfileService";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const PharmacistProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      const data = await pharmacistProfileService.getMyProfile();
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

  const handleCertificationChange = (index, value) => {
    const newCertifications = [...(editedData.certifications || [])];
    newCertifications[index] = value;
    setEditedData((prev) => ({ ...prev, certifications: newCertifications }));
  };

  const addCertification = () => {
    setEditedData((prev) => ({
      ...prev,
      certifications: [...(prev.certifications || []), ""],
    }));
  };

  const removeCertification = (index) => {
    const newCertifications = [...(editedData.certifications || [])];
    newCertifications.splice(index, 1);
    setEditedData((prev) => ({ ...prev, certifications: newCertifications }));
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
        specialization: editedData.specialization,
        yearsOfExperience: editedData.yearsOfExperience,
        shiftSchedule: editedData.shiftSchedule,
        certifications: editedData.certifications?.filter((c) => c.trim() !== ""),
      };

      const updatedProfile = await pharmacistProfileService.updateMyProfile(updateData);
      setProfileData(updatedProfile);
      setEditedData(updatedProfile);
      setIsEditMode(false);
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
      const result = await pharmacistProfileService.uploadProfilePicture(file);
      setProfileData(result.profile);
      setEditedData(result.profile);
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
      const result = await pharmacistProfileService.deleteProfilePicture();
      setProfileData(result.profile);
      setEditedData(result.profile);
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
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <main className="flex-1 overflow-y-auto">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading profile...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <main className="flex-1 overflow-y-auto">
            <div className="flex items-center justify-center h-full">
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
          </main>
        </div>
      </div>
    );
  }

  const displayData = isEditMode ? editedData : profileData;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate("/pharmacist/dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 mb-4 transition-colors px-3 sm:px-4 py-2 rounded-lg group w-fit"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>

            {/* Header Section */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">
                Manage your professional information and settings
              </p>
            </div>            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Cover Section */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-700"></div>

              {/* Profile Picture Section */}
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6">
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
                    {displayData.isVerified && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Verified
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
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
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
                  </div>
                </div>

                {/* Professional Information */}
                <div className="mb-8 pt-8 border-t border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Professional Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* License Number */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4" />
                        License Number
                      </label>
                      <p className="text-gray-900 font-medium">
                        {displayData.licenseNumber || "Not provided"}
                      </p>
                    </div>

                    {/* License Expiry */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4" />
                        License Expiry Date
                      </label>
                      <p className="text-gray-900">
                        {displayData.licenseExpiryDate
                          ? new Date(displayData.licenseExpiryDate).toLocaleDateString()
                          : "Not provided"}
                      </p>
                    </div>

                    {/* Specialization */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Award className="w-4 h-4" />
                        Specialization
                      </label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editedData.specialization || ""}
                          onChange={(e) =>
                            handleInputChange("specialization", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Clinical Pharmacy"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {displayData.specialization || "Not provided"}
                        </p>
                      )}
                    </div>

                    {/* Years of Experience */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Briefcase className="w-4 h-4" />
                        Years of Experience
                      </label>
                      {isEditMode ? (
                        <input
                          type="number"
                          min="0"
                          value={editedData.yearsOfExperience || ""}
                          onChange={(e) =>
                            handleInputChange("yearsOfExperience", parseInt(e.target.value))
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Years of experience"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {displayData.yearsOfExperience
                            ? `${displayData.yearsOfExperience} years`
                            : "Not provided"}
                        </p>
                      )}
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

                    {/* Shift Schedule */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4" />
                        Shift Schedule
                      </label>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={editedData.shiftSchedule || ""}
                          onChange={(e) =>
                            handleInputChange("shiftSchedule", e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Monday-Friday, 9 AM - 5 PM"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {displayData.shiftSchedule || "Not provided"}
                        </p>
                      )}
                    </div>

                    {/* Employment Status */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Shield className="w-4 h-4" />
                        Employment Status
                      </label>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            displayData.employmentStatus === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {displayData.employmentStatus || "Unknown"}
                        </span>
                        {displayData.isActive && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
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

                {/* Certifications */}
                <div className="pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Certifications
                    </h2>
                    {isEditMode && (
                      <button
                        onClick={addCertification}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        + Add Certification
                      </button>
                    )}
                  </div>

                  {displayData.certifications && displayData.certifications.length > 0 ? (
                    <div className="space-y-3">
                      {displayData.certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          {isEditMode ? (
                            <>
                              <input
                                type="text"
                                value={cert}
                                onChange={(e) =>
                                  handleCertificationChange(index, e.target.value)
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter certification name"
                              />
                              <button
                                onClick={() => removeCertification(index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-900">{cert}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>No certifications added yet</p>
                      {isEditMode && (
                        <button
                          onClick={addCertification}
                          className="mt-3 text-blue-600 hover:text-blue-700"
                        >
                          Add your first certification
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Account Created:</span>
                  <span className="ml-2 text-gray-900 font-medium">
                    {displayData.createdAt
                      ? new Date(displayData.createdAt).toLocaleDateString()
                      : "Not available"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="ml-2 text-gray-900 font-medium">
                    {displayData.updatedAt
                      ? new Date(displayData.updatedAt).toLocaleDateString()
                      : "Not available"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PharmacistProfile;
