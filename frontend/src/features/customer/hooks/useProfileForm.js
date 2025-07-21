import { useState, useEffect } from "react";

/**
 * Custom hook to manage form state for profile editing
 * @param {object} initialProfile - Initial profile data
 * @returns {object} Object containing form state and handlers
 */
export const useProfileForm = (initialProfile = {}) => {
  const [formData, setFormData] = useState({
    firstName: initialProfile.firstName || "Senuja",
    lastName: initialProfile.lastName || "Udugampola",
    email: initialProfile.email || "senuja@email.com",
    phone: initialProfile.phone || "+94 703034515",
    dateOfBirth: initialProfile.dateOfBirth || "2002-10-22",
    gender: initialProfile.gender || "Male",
    bloodType: initialProfile.bloodType || "O+",
    height: initialProfile.height || "175",
    weight: initialProfile.weight || "70",
    address: initialProfile.address || "123 Main Street",
    city: initialProfile.city || "Karapitiya",
    state: initialProfile.state || "Galle",
    zipCode: initialProfile.zipCode || "10001",
    emergencyContactName: initialProfile.emergencyContactName || "Sanuthma Munasinghe",
    emergencyContactPhone: initialProfile.emergencyContactPhone || "+94 702745172",
    allergies: initialProfile.allergies || "",
    medications: initialProfile.medications || "",
    medicalConditions: initialProfile.medicalConditions || "",
    insuranceProvider: initialProfile.insuranceProvider || "",
    insurancePolicyNumber: initialProfile.insurancePolicyNumber || "",
  });

  const [errors, setErrors] = useState({});
  const [isModified, setIsModified] = useState(false);

  // Update form data when initial profile changes
  useEffect(() => {
    if (Object.keys(initialProfile).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...initialProfile
      }));
    }
  }, [initialProfile]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsModified(true);
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const resetForm = () => {
    setFormData({
      firstName: initialProfile.firstName || "Senuja",
      lastName: initialProfile.lastName || "Udugampola",
      email: initialProfile.email || "senuja@email.com",
      phone: initialProfile.phone || "+94 703034515",
      dateOfBirth: initialProfile.dateOfBirth || "2002-10-22",
      gender: initialProfile.gender || "Male",
      bloodType: initialProfile.bloodType || "O+",
      height: initialProfile.height || "175",
      weight: initialProfile.weight || "70",
      address: initialProfile.address || "123 Main Street",
      city: initialProfile.city || "Karapitiya",
      state: initialProfile.state || "Galle",
      zipCode: initialProfile.zipCode || "10001",
      emergencyContactName: initialProfile.emergencyContactName || "Sanuthma Munasinghe",
      emergencyContactPhone: initialProfile.emergencyContactPhone || "+94 702745172",
      allergies: initialProfile.allergies || "",
      medications: initialProfile.medications || "",
      medicalConditions: initialProfile.medicalConditions || "",
      insuranceProvider: initialProfile.insuranceProvider || "",
      insurancePolicyNumber: initialProfile.insurancePolicyNumber || "",
    });
    setErrors({});
    setIsModified(false);
  };

  const submitForm = (additionalData = {}) => {
    if (validateForm()) {
      // Combine form data with any additional data (like profile picture)
      const completeFormData = {
        ...formData,
        ...additionalData
      };
      
      // Here you would typically make an API call to save the data
      console.log("Profile updated:", completeFormData);
      setIsModified(false);
      return true;
    }
    return false;
  };

  return {
    formData,
    errors,
    isModified,
    handleInputChange,
    validateForm,
    resetForm,
    submitForm,
    setFormData
  };
};
