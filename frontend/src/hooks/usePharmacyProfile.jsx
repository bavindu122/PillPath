import { useState, useEffect, useCallback } from "react";
import PharmacyService from "../services/api/PharmacyService";

export const usePharmacyProfile = () => {
  const [pharmacyProfile, setPharmacyProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch pharmacy profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching pharmacy profile...");
      const profile = await PharmacyService.getPharmacyProfile();
      console.log("Pharmacy profile received:", profile);

      setPharmacyProfile(profile);
    } catch (error) {
      console.error("Failed to fetch pharmacy profile:", error);
      setError(error.message);

      // If authentication error, redirect to login
      if (
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        localStorage.removeItem("pharmacy_auth_token");
        window.location.href = "/pharmacy/login";
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Update pharmacy profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      setSaving(true);
      setError(null);

      console.log("Updating pharmacy profile:", profileData);
      const result = await PharmacyService.updatePharmacyProfile(profileData);
      console.log("Profile update response:", result);

      // Backend may return a wrapper { success, pharmacy, message }
      const normalizedProfile =
        result && result.pharmacy ? result.pharmacy : result;

      // Update local state with the normalized profile object
      setPharmacyProfile(normalizedProfile);

      // Return the normalized profile for callers
      return normalizedProfile;
    } catch (error) {
      console.error("Failed to update pharmacy profile:", error);
      setError(error.message);
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  // ✅ Upload pharmacy image
  const uploadImage = useCallback(async (imageFile, imageType) => {
    try {
      setUploading(true);
      setError(null);

      console.log("Uploading pharmacy image:", imageType, imageFile.name);
      const uploadResult = await PharmacyService.uploadPharmacyImage(
        imageFile,
        imageType
      );
      console.log("Image uploaded successfully:", uploadResult);

      // Update local state with new image URL
      if (uploadResult && uploadResult.imageUrl) {
        setPharmacyProfile((prev) => ({
          ...prev,
          [imageType === "logo" ? "logoUrl" : "bannerUrl"]:
            uploadResult.imageUrl,
          [imageType === "logo" ? "logoPublicId" : "bannerPublicId"]:
            uploadResult.publicId,
        }));
      }

      return uploadResult;
    } catch (error) {
      console.error("Failed to upload image:", error);
      setError(error.message);
      throw error;
    } finally {
      setUploading(false);
    }
  }, []);

  // ✅ Update local profile data (for optimistic updates)
  const updateLocalProfile = useCallback((updates) => {
    setPharmacyProfile((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  // ✅ Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ✅ Load profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    // State
    pharmacyProfile,
    loading,
    saving,
    uploading,
    error,

    // Actions
    fetchProfile,
    updateProfile,
    uploadImage,
    updateLocalProfile,
    clearError,
  };
};

export default usePharmacyProfile;
