import React, { useState, useRef, useEffect } from "react";
import { X, Pencil, Save, Camera, Upload } from "lucide-react";
import Button from "./Button";
import { useProfileForm } from "../hooks";

const EditProfileModal = ({ isOpen, onClose, userProfile = {} }) => {
  const { 
    formData, 
    errors, 
    isModified, 
    handleInputChange, 
    validateForm, 
    resetForm, 
    submitForm 
  } = useProfileForm(userProfile);

  const [editingField, setEditingField] = useState(null);
  // Initialize with existing profile picture immediately
  const [profilePicture, setProfilePicture] = useState(userProfile?.profilePicture || null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(userProfile?.profilePicture || null);
  const fileInputRef = useRef(null);

  const handleFieldEdit = (field) => {
    setEditingField(field);
  };

  const handleFieldSave = () => {
    setEditingField(null);
  };

  const handleSave = () => {
    // Include profile picture in the form data
    const formDataWithPicture = {
      ...formData,
      profilePicture: profilePicture
    };
    
    if (submitForm(formDataWithPicture)) {
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    setProfilePicture(userProfile?.profilePicture || null);
    setProfilePicturePreview(userProfile?.profilePicture || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleCancel = () => {
    // Reset form data to original values if needed
    setProfilePicture(userProfile?.profilePicture || null);
    setProfilePicturePreview(userProfile?.profilePicture || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
      }

      setProfilePicture(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const FormField = ({ label, field, type = "text", options = null, placeholder = "" }) => {
    const isEditing = editingField === field;
    
    return (
      <div className="mb-4">
        <label className="block text-white/80 text-sm mb-2">
          {label}
        </label>
        <div className="relative flex items-center">
          {type === "select" ? (
            <select
              value={formData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              disabled={!isEditing}
              className={`w-full px-3 py-2 pr-12 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-all duration-300 ${
                isEditing ? '' : 'cursor-not-allowed opacity-70'
              }`}
            >
              {options?.map(option => (
                <option key={option} value={option} className="bg-gray-800 text-white">
                  {option}
                </option>
              ))}
            </select>
          ) : type === "textarea" ? (
            <textarea
              value={formData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              disabled={!isEditing}
              placeholder={placeholder}
              rows="3"
              className={`w-full px-3 py-2 pr-12 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-all duration-300 resize-none ${
                isEditing ? '' : 'cursor-not-allowed opacity-70'
              }`}
            />
          ) : (
            <input
              type={type}
              value={formData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              disabled={!isEditing}
              placeholder={placeholder}
              className={`w-full px-3 py-2 pr-12 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-all duration-300 ${
                isEditing ? '' : 'cursor-not-allowed opacity-70'
              }`}
            />
          )}
          
          <button
            onClick={() => isEditing ? handleFieldSave() : handleFieldEdit(field)}
            className="absolute right-3 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
          >
            <Pencil size={16} className="text-white/80" />
          </button>
        </div>
      </div>
    );
  };

  // Accessibility: focus trap and escape key
  const modalRef = useRef(null);
  const previouslyFocusedElement = useRef(null);
  
  useEffect(() => {
    if (!isOpen) return;
    
    previouslyFocusedElement.current = document.activeElement;
    
    // Focus the first focusable element in the modal
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];
    
    const modalNode = modalRef.current;
    const focusableEls = modalNode
      ? modalNode.querySelectorAll(focusableSelectors.join(','))
      : [];
    
    if (focusableEls.length) {
      focusableEls[0].focus();
    }
    
    // Focus trap handler
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      if (!modalNode) return;
      
      const focusable = Array.from(
        modalNode.querySelectorAll(focusableSelectors.join(','))
      ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
      
      if (!focusable.length) return;
      
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    
    // Escape key handler
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else {
        handleTab(e);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Initialize profile picture when userProfile changes
  useEffect(() => {
    console.log('userProfile changed:', userProfile?.profilePicture);
    if (userProfile?.profilePicture) {
      console.log('Setting profile picture:', userProfile.profilePicture);
      setProfilePicture(userProfile.profilePicture);
      setProfilePicturePreview(userProfile.profilePicture);
    }
  }, [userProfile?.profilePicture]);

  // Initialize profile picture when modal opens
  useEffect(() => {
    console.log('Modal opened, isOpen:', isOpen, 'userProfile pic:', userProfile?.profilePicture, 'current preview:', profilePicturePreview);
    if (isOpen && userProfile?.profilePicture && !profilePicturePreview) {
      console.log('Initializing profile picture on modal open');
      setProfilePicture(userProfile.profilePicture);
      setProfilePicturePreview(userProfile.profilePicture);
    }
  }, [isOpen, userProfile?.profilePicture, profilePicturePreview]);

  // Cleanup blob URLs when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      // Only revoke blob URLs created by FileReader, not existing server URLs
      if (profilePicturePreview && 
          profilePicturePreview.startsWith('blob:') && 
          profilePicturePreview !== userProfile?.profilePicture) {
        URL.revokeObjectURL(profilePicturePreview);
      }
    };
  }, [profilePicturePreview, userProfile?.profilePicture]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      ref={modalRef}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
        <style>
          {`
            .edit-profile-scroll::-webkit-scrollbar {
              width: 8px;
              background: transparent;
            }
            .edit-profile-scroll::-webkit-scrollbar-thumb {
              background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
              border-radius: 8px;
            }
            .edit-profile-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .edit-profile-scroll {
              scrollbar-width: thin;
              scrollbar-color: #3b82f6 #0000;
            }
          `}
        </style>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Pencil className="h-6 w-6" />
            Edit Profile
          </h2>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] edit-profile-scroll">
          
          {/* Profile Picture Section */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/40 bg-white/20 backdrop-blur-sm">
                {profilePicturePreview ? (
                  <img
                    src={profilePicturePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, show camera icon
                      console.log('Failed to load profile image:', profilePicturePreview);
                      setProfilePicturePreview(null);
                    }}
                    onLoad={() => {
                      console.log('Profile image loaded successfully:', profilePicturePreview);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera size={40} className="text-white/50" />
                    {console.log('Showing camera icon, profilePicturePreview:', profilePicturePreview)}
                  </div>
                )}
              </div>
              
              {/* Upload/Edit Button */}
              <button
                onClick={handleProfilePictureClick}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
              >
                <div className="text-white text-center">
                  <Upload size={24} className="mx-auto mb-1" />
                  <span className="text-xs font-medium">
                    {profilePicturePreview ? 'Change' : 'Upload'}
                  </span>
                </div>
              </button>
              
              {/* Remove Button */}
              {profilePicturePreview && (
                <button
                  onClick={removeProfilePicture}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm border border-white/20"
                >
                  <X size={16} className="text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="hidden"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              
              <FormField label="First Name" field="firstName" />
              <FormField label="Last Name" field="lastName" />
              <FormField label="Email" field="email" type="email" />
              <FormField label="Phone" field="phone" type="tel" />
              <FormField label="Date of Birth" field="dateOfBirth" type="date" />
              <FormField 
                label="Gender" 
                field="gender" 
                type="select" 
                options={["Male", "Female", "Other", "Prefer not to say"]} 
              />
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Medical Information</h3>
              
              <FormField 
                label="Blood Type" 
                field="bloodType" 
                type="select" 
                options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"]} 
              />
              <FormField label="Height (cm)" field="height" type="number" />
              <FormField label="Weight (kg)" field="weight" type="number" />
              <FormField 
                label="Allergies" 
                field="allergies" 
                type="textarea"
                placeholder="List any known allergies..."
              />
              <FormField 
                label="Medical Conditions" 
                field="medicalConditions" 
                type="textarea"
                placeholder="List any chronic conditions or ongoing medical issues..."
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Address Information</h3>
              
              <FormField label="Street Address" field="address" />
              <FormField label="City" field="city" />
              <FormField label="State" field="state" />
              <FormField label="ZIP Code" field="zipCode" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/20 bg-white/10">
          <button
            onClick={handleCancel}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 border border-white/30 mr-3"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
