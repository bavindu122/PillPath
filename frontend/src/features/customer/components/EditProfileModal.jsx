import React, { useState, useRef, useEffect } from "react";
import { X, Pencil, Save, Upload, Camera, User, Loader2 } from "lucide-react";
import Button from "./Button";
import { useProfileForm } from "../hooks";
import { useAuth } from "../../../hooks/useAuth";
import { customerService } from "../../../services/api/CustomerService";

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, loading, updateUser } = useAuth();

  const {
    formData,
    errors,
    isModified,
    handleInputChange,
    validateForm,
    resetForm,
    submitForm,
  } = useProfileForm(user);

  const [editingField, setEditingField] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Set initial profile image preview
  useEffect(() => {
    if (user?.profilePictureUrl) {
      setProfileImagePreview(user.profilePictureUrl);
    }
  }, [user]);

  const handleFieldEdit = (field) => {
    setEditingField(field);
  };

  const handleFieldSave = () => {
    setEditingField(null);
  };

  // ✅ NEW: Upload profile picture to Cloudinary
  const uploadProfilePicture = async (file) => {
    setUploadingImage(true);
    try {
      const result = await customerService.uploadProfilePicture(file);

      if (result.success) {
        // Update local state
        setProfileImagePreview(result.imageUrl);
        handleInputChange("profilePictureUrl", result.imageUrl);

        // Update user context
        updateUser({ ...user, profilePictureUrl: result.imageUrl });

        return result.imageUrl;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      alert(`Failed to upload image: ${error.message}`);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setSavingProfile(true);
    try {
      // First upload image if selected
      if (selectedFile) {
        await uploadProfilePicture(selectedFile);
        setSelectedFile(null);
      }

      // Then update profile data if modified
      if (isModified) {
        // Prepare data for backend
        const profileData = {
          ...formData,
          allergies: formData.allergies
            ? formData.allergies
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item)
            : [],
          medicalConditions: formData.medicalConditions
            ? formData.medicalConditions
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item)
            : [],
        };

        const result = await customerService.updateProfile(profileData);

        if (result.success) {
          // Update user context with new data
          updateUser(result.customer);
          resetForm();
        } else {
          throw new Error(result.message);
        }
      }

      onClose();
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert(`Failed to save profile: ${error.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleClose = () => {
    resetForm();
    setProfileImagePreview(user?.profilePictureUrl || null);
    setSelectedFile(null);
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    setProfileImagePreview(user?.profilePictureUrl || null);
    setSelectedFile(null);
    onClose();
  };
  const handleFieldBlur = (field) => {
    if (editingField === field) {
      setEditingField(null);
    }
  };
  const handleFieldKeyDown = (e, field) => {
    if (e.key === "Enter" && editingField === field) {
      setEditingField(null);
    }
    if (e.key === "Escape" && editingField === field) {
      setEditingField(null);
    }
  };

  // Handle profile picture selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setProfileImagePreview(null);
    handleInputChange("profilePictureUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ✅ UPDATED: Upload image immediately when selected
  const handleImmediateUpload = async () => {
    if (selectedFile) {
      try {
        await uploadProfilePicture(selectedFile);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        // Error already handled in uploadProfilePicture
      }
    }
  };

  // Inside EditProfileModal.jsx
  const FormField = ({
    label,
    field,
    type = "text",
    options = null,
    placeholder = "",
  }) => {
    const isEditing = editingField === field;

    // ✅ Ensure consistent string value
    const fieldValue = React.useMemo(() => {
      const value = formData[field];
      if (value === null || value === undefined) return "";
      if (Array.isArray(value)) return value.join(", ");
      return String(value);
    }, [formData[field]]);

    return (
      <div className="mb-4">
        <label className="block text-white/80 text-sm mb-2">
          {label}
        </label>
        <div className="relative flex items-center">
          {type === "textarea" ? (
            <textarea
              value={fieldValue}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onBlur={() => handleFieldBlur?.(field)}
              onKeyDown={(e) => handleFieldKeyDown?.(e, field)}
              disabled={!isEditing}
              placeholder={placeholder}
              rows="3"
              className={`w-full px-4 py-3 pr-12 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 resize-none ${
                isEditing ? "" : "cursor-not-allowed opacity-70"
              }`}
              autoFocus={isEditing}
            />
          ) : (
            <input
              type={type}
              value={fieldValue}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onBlur={() => handleFieldBlur?.(field)}
              onKeyDown={(e) => handleFieldKeyDown?.(e, field)}
              disabled={!isEditing}
              placeholder={placeholder}
              className={`w-full px-4 py-3 pr-12 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 ${
                isEditing ? "" : "cursor-not-allowed opacity-70"
              }`}
              autoFocus={isEditing}
            />
          )}

          <button
            onClick={() =>
              isEditing ? handleFieldSave() : handleFieldEdit(field)
            }
            className="absolute right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 group"
            type="button"
          >
            {isEditing ? (
              <Save
                size={16}
                className="text-green-400 group-hover:text-green-300"
              />
            ) : (
              <Pencil
                size={16}
                className="text-white/70 group-hover:text-white"
              />
            )}
          </button>
        </div>
        {errors[field] && (
          <p className="text-red-400 text-xs mt-1">{errors[field]}</p>
        )}
      </div>
    );
  }; // Accessibility: focus trap and escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl mx-4 max-h-[90vh] bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Pencil className="h-6 w-6" />
            Edit Profile
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 group"
            type="button"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white/80">Loading profile data...</p>
          </div>
        ) : (
          <>
            {/* Form Content - Scrollable */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Profile Picture Section */}
              <div className="mb-8 text-center">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center justify-center gap-2">
                  <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                  Profile Picture
                </h3>

                <div className="flex flex-col items-center space-y-4">
                  {/* Profile Picture Preview */}
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 bg-white/10 backdrop-blur-sm shadow-lg">
                      {uploadingImage ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader2
                            size={32}
                            className="text-blue-400 animate-spin"
                          />
                        </div>
                      ) : profileImagePreview ? (
                        <img
                          src={profileImagePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={48} className="text-white/50" />
                        </div>
                      )}
                    </div>

                    {/* Overlay on hover */}
                    {!uploadingImage && (
                      <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Camera size={24} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Upload Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      type="button"
                    >
                      {uploadingImage ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      {uploadingImage ? "Uploading..." : "Upload Photo"}
                    </button>

                    {selectedFile && !uploadingImage && (
                      <button
                        onClick={handleImmediateUpload}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 rounded-xl transition-all duration-300"
                        type="button"
                      >
                        <Save size={16} />
                        Save Photo
                      </button>
                    )}

                    {(profileImagePreview || selectedFile) &&
                      !uploadingImage && (
                        <button
                          onClick={handleRemoveImage}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-xl transition-all duration-300"
                          type="button"
                        >
                          <X size={16} />
                          Remove
                        </button>
                      )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <p className="text-gray-400 text-xs">
                    Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                    Personal Information
                  </h3>

                  <FormField label="Username" field="username" />
                  <FormField label="Full Name" field="fullName" />
                  <FormField label="Email" field="email" type="email" />
                  <FormField
                    label="Phone Number"
                    field="phoneNumber"
                    type="tel"
                  />
                  <FormField
                    label="Date of Birth"
                    field="dateOfBirth"
                    type="date"
                  />
                </div>

                {/* Contact & Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                    Contact Information
                  </h3>

                  <FormField label="Address" field="address" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-white/10 rounded-xl border border-white/20">
                      <div
                        className={`text-sm ${
                          user?.emailVerified
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        Email{" "}
                        {user?.emailVerified ? "Verified" : "Not Verified"}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-xl border border-white/20">
                      <div
                        className={`text-sm ${
                          user?.phoneVerified
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        Phone{" "}
                        {user?.phoneVerified ? "Verified" : "Not Verified"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-yellow-500 rounded-full"></div>
                    Emergency & Insurance
                  </h3>

                  <FormField
                    key="allergies" // ✅ Add stable key
                    label="Allergies"
                    field="allergies"
                    type="textarea"
                    placeholder="List any known allergies (separate with commas)..."
                  />
                  <FormField
                    key="medicalConditions" // ✅ Add stable key
                    label="Medical Conditions"
                    field="medicalConditions"
                    type="textarea"
                    placeholder="List any chronic conditions (separate with commas)..."
                  />
                </div>

                {/* Emergency & Insurance */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-yellow-500 rounded-full"></div>
                    Emergency & Insurance
                  </h3>

                  <FormField
                    label="Emergency Contact Name"
                    field="emergencyContactName"
                  />
                  <FormField
                    label="Emergency Contact Phone"
                    field="emergencyContactPhone"
                    type="tel"
                  />
                  <FormField
                    label="Insurance Provider"
                    field="insuranceProvider"
                  />
                  <FormField label="Insurance ID" field="insuranceId" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-white/20 bg-white/5">
              <Button
                onClick={handleCancel}
                disabled={savingProfile || uploadingImage}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-300 disabled:opacity-50"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                disabled={
                  (!isModified && !selectedFile) ||
                  savingProfile ||
                  uploadingImage
                }
                className={`px-6 py-3 text-white flex items-center gap-2 transform transition-all duration-300 shadow-lg ${
                  (isModified || selectedFile) &&
                  !savingProfile &&
                  !uploadingImage
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105"
                    : "bg-gray-500/50 cursor-not-allowed"
                }`}
              >
                {savingProfile ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {savingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditProfileModal;
