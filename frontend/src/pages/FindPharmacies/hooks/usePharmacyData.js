import { useState, useEffect } from "react";
import { filterPharmacies } from "../utils/filterHelpers";
import PharmacyService from "../../../services/api/PharmacyService";

export const usePharmacyData = (currentLocation) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    radius: 10, // Increased default radius to match backend default
    minRating: 0,
    openNow: false,
    hasDelivery: false,
    acceptsInsurance: false,
    has24HourService: false,
    hasVaccinations: false,
  });

  // ✅ Transform backend data to match frontend format
  const transformPharmacyData = (backendPharmacy) => {
    return {
      id: backendPharmacy.id,
      name: backendPharmacy.name,
      address: backendPharmacy.address,
      lat: parseFloat(backendPharmacy.latitude),
      lng: parseFloat(backendPharmacy.longitude),
      latitude: parseFloat(backendPharmacy.latitude), // Keep both for compatibility
      longitude: parseFloat(backendPharmacy.longitude),
      rating: backendPharmacy.averageRating || 0,
      phone: backendPharmacy.phoneNumber,
      phoneNumber: backendPharmacy.phoneNumber,
      hasDelivery: backendPharmacy.deliveryAvailable,
      deliveryAvailable: backendPharmacy.deliveryAvailable,
      has24HourService: backendPharmacy.has24HourService,
      logo: backendPharmacy.logoUrl,
      logoUrl: backendPharmacy.logoUrl,
      operatingHours: backendPharmacy.operatingHours || {},
      hours: backendPharmacy.currentStatus || "Check for hours",
      currentStatus: backendPharmacy.currentStatus,
      isActive: backendPharmacy.isActive,
      isVerified: backendPharmacy.isVerified,
      // Add computed fields for compatibility
      acceptsInsurance: true, // Default value, can be updated when backend provides this
      hasVaccinations: false, // Default value, can be updated when backend provides this
    };
  };

  // ✅ Fetch pharmacies from real API
  useEffect(() => {
    const fetchPharmacies = async () => {
      if (!currentLocation) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log(
          "Fetching pharmacies from API with location:",
          currentLocation
        );

        // ✅ Call the real API endpoint
        const response = await PharmacyService.getPharmaciesForMap({
          userLat: currentLocation.lat,
          userLng: currentLocation.lng,
          radiusKm: filters.radius,
        });

        console.log("API Response:", response);

        // ✅ Transform the data to match frontend format
        const transformedPharmacies = response.map(transformPharmacyData);

        console.log("Transformed pharmacies:", transformedPharmacies);

        setPharmacies(transformedPharmacies);
        setError(null);
      } catch (err) {
        console.error("Error fetching pharmacies:", err);
        setError("Failed to load pharmacies. Please try again later.");

        // ✅ Fallback to empty array instead of mock data
        setPharmacies([]);
        let errorMessage = "Failed to load pharmacies. Please try again later.";
        // More specific error handling
        if (err.response) {
          // Server responded with a status code outside 2xx
          if (err.response.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (err.response.status === 404) {
            errorMessage = "No pharmacies found in your area.";
          } else if (err.response.status === 401 || err.response.status === 403) {
            errorMessage = "You are not authorized to access pharmacy data.";
          } else {
            errorMessage = `Error: ${err.response.statusText || "Unexpected error."}`;
          }
        } else if (err.request) {
          // Request was made but no response received
          errorMessage = "Network error. Please check your internet connection.";
        } else if (err.message && err.message.toLowerCase().includes("timeout")) {
         errorMessage = "Request timed out. Please try again.";
       }
       setError(errorMessage);

       // ✅ Fallback to empty array instead of mock data
       setPharmacies([]);
     } finally {
        setLoading(false);
      }
    };

    fetchPharmacies();
  }, [currentLocation, filters.radius]); // Re-fetch when location or radius changes

  // ✅ Apply client-side filters to the real API data
  const filteredPharmacies = filterPharmacies(
    pharmacies,
    filters,
    currentLocation
  );

  return {
    pharmacies,
    loading,
    error,
    filters,
    setFilters,
    filteredPharmacies,
  };
};
