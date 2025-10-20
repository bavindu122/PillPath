import { useState, useEffect } from "react";

/**
 * Custom hook to manage form state for profile editing
 * @param {object} initialProfile - Initial profile data from backend
 * @returns {object} Object containing form state and handlers
 */
export const useProfileForm = (initialProfile = null) => {
  // Initialize with empty values if no profile data
  const getInitialFormData = (profile) => {
    if (!profile) {
      return {
        username: "",
        email: "",
        fullName: "",
        name: "",
        relation: "",
        age: "",
        phoneNumber: "",
        phone: "",
        dateOfBirth: "",
        address: "",
        profilePictureUrl: "",
        insuranceProvider: "",
        insuranceId: "",
        allergies: "",
        medicalConditions: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        bloodType: "",
      };
    }

    return {
      username: profile.username || "",
      email: profile.email || "",
      fullName: profile.fullName || profile.name || "",
      name: profile.name || profile.fullName || "",
      relation: profile.relation || "",
      age: profile.age || "",
      phoneNumber: profile.phoneNumber || profile.phone || "",
      phone: profile.phone || profile.phoneNumber || "",
      dateOfBirth: profile.dateOfBirth || "",
      address: profile.address || "",
      profilePictureUrl: profile.profilePictureUrl || profile.profilePicture || "",
      insuranceProvider: profile.insuranceProvider || "",
      insuranceId: profile.insuranceId || "",
      allergies: Array.isArray(profile.allergies)
        ? profile.allergies.join(", ")
        : profile.allergies || "",
      medicalConditions: Array.isArray(profile.medicalConditions)
        ? profile.medicalConditions.join(", ")
        : profile.medicalConditions || "",
      emergencyContactName: profile.emergencyContactName || "",
      emergencyContactPhone: profile.emergencyContactPhone || "",
      bloodType: profile.bloodType || "",
    };
  };

  const [formData, setFormData] = useState(() =>
    getInitialFormData(initialProfile)
  );
  const [originalData, setOriginalData] = useState(() =>
    getInitialFormData(initialProfile)
  );
  const [errors, setErrors] = useState({});
  const [isModified, setIsModified] = useState(false);

  // Update form data when initial profile changes
  useEffect(() => {
    if (initialProfile && Object.keys(initialProfile).length > 0) {
      const newFormData = getInitialFormData(initialProfile);

      // ✅ Only update if the data actually changed to prevent unnecessary re-renders
      setFormData((prevData) => {
        const dataChanged =
          JSON.stringify(prevData) !== JSON.stringify(newFormData);
        return dataChanged ? newFormData : prevData;
      });

      setOriginalData((prevOriginal) => {
        const originalChanged =
          JSON.stringify(prevOriginal) !== JSON.stringify(newFormData);
        return originalChanged ? newFormData : prevOriginal;
      });

      setIsModified(false);
    }
  }, [initialProfile]);
  
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value, // Always store as string during editing
    }));

    // Check if data has been modified
    setIsModified(true); // Simplified - just mark as modified when any change occurs

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.username?.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.fullName?.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const resetForm = () => {
    setFormData(originalData);
    setErrors({});
    setIsModified(false);
  };

  const submitForm = async () => {
    if (!validateForm()) {
      return false;
    }

    try {
      // Prepare data for backend - convert comma-separated strings back to arrays
      const submitData = {
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

      // TODO: Make API call to update profile
      console.log("Profile data to submit:", submitData);

      // Here you would make the API call:
      // const response = await ApiService.updateCustomerProfile(submitData);

      setIsModified(false);
      setOriginalData(formData);
      return true;
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Set error message
      setErrors({ submit: "Failed to update profile. Please try again." });
      return false;
    }
  };

  return {
    formData,
    errors,
    isModified,
    handleInputChange,
    validateForm,
    resetForm,
    submitForm,
    setFormData,
  };
};
