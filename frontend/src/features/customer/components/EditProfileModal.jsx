import React, { useState, useRef, useEffect } from "react";
import { X, Pencil, Save } from "lucide-react";
import Button from "./Button";

const EditProfileModal = ({ isOpen, onClose, userProfile = {} }) => {
  // Initialize form state with current user data
  const [formData, setFormData] = useState({
    firstName: userProfile.firstName || "John",
    lastName: userProfile.lastName || "Doe",
    email: userProfile.email || "john.doe@email.com",
    phone: userProfile.phone || "+1 (555) 123-4567",
    dateOfBirth: userProfile.dateOfBirth || "1990-05-15",
    gender: userProfile.gender || "Male",
    bloodType: userProfile.bloodType || "O+",
    height: userProfile.height || "175",
    weight: userProfile.weight || "70",
    address: userProfile.address || "123 Main Street",
    city: userProfile.city || "New York",
    state: userProfile.state || "NY",
    zipCode: userProfile.zipCode || "10001",
    emergencyContactName: userProfile.emergencyContactName || "Jane Doe",
    emergencyContactPhone: userProfile.emergencyContactPhone || "+1 (555) 987-6543",
    allergies: userProfile.allergies || "Penicillin, Shellfish",
    medicalConditions: userProfile.medicalConditions || "Hypertension, Diabetes",
    insurance: userProfile.insurance || "Blue Cross Blue Shield",
    insuranceId: userProfile.insuranceId || "BC123456789"
  });

  const [editingField, setEditingField] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFieldEdit = (field) => {
    setEditingField(field);
  };

  const handleFieldSave = () => {
    setEditingField(null);
  };

  const handleSave = () => {
    // Here you would typically save the data to your backend
    console.log("Saving profile data:", formData);
    onClose();
  };

  const handleCancel = () => {
    // Reset form data to original values if needed
    onClose();
  };

  const FormField = ({ label, field, type = "text", options = null, placeholder = "" }) => {
    const isEditing = editingField === field;
    
    return (
      <div className="mb-4">
        <label className="block text-white/90 text-sm font-medium mb-2">
          {label}
        </label>
        <div className="relative flex items-center">
          {type === "select" ? (
            <select
              value={formData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 pr-12 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 ${
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
              className={`w-full px-4 py-3 pr-12 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 resize-none ${
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
              className={`w-full px-4 py-3 pr-12 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 ${
                isEditing ? '' : 'cursor-not-allowed opacity-70'
              }`}
            />
          )}
          
          <button
            onClick={() => isEditing ? handleFieldSave() : handleFieldEdit(field)}
            className="absolute right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 group"
          >
            <Pencil size={16} className="text-white/70 group-hover:text-white" />
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
      role="dialog"
      aria-modal="true"
      ref={modalRef}
    >
      <div className="relative w-full max-w-4xl mx-4 max-h-[90vh] bg-gradient-to-br from-primary via-primary-hover to-accent backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-xl">
              <Pencil size={24} className="text-blue-300" />
            </div>
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 group"
          >
            <X size={24} className="text-white/70 group-hover:text-white" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                Personal Information
              </h3>
              
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
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                Medical Information
              </h3>
              
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
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                Address Information
              </h3>
              
              <FormField label="Street Address" field="address" />
              <FormField label="City" field="city" />
              <FormField label="State" field="state" />
              <FormField label="ZIP Code" field="zipCode" />
            </div>

            {/* Emergency & Insurance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-red-500 rounded-full"></div>
                Emergency & Insurance
              </h3>
              
              <FormField label="Emergency Contact Name" field="emergencyContactName" />
              <FormField label="Emergency Contact Phone" field="emergencyContactPhone" type="tel" />
              <FormField label="Insurance Provider" field="insurance" />
              <FormField label="Insurance ID" field="insuranceId" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/20 bg-white/5">
          <Button
            onClick={handleCancel}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-300"
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleSave}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center gap-2 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Save size={18} />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
