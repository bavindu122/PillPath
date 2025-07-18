import { useState, useEffect } from "react";
import { filterPharmacies } from "../utils/filterHelpers";
import { MOCK_API_DELAY_MS } from "../constants/mockApiConstants";

export const usePharmacyData = (currentLocation) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    radius: 5,
    minRating: 0,
    openNow: false,
    hasDelivery: false,
    acceptsInsurance: false,
    has24HourService: false,
    hasVaccinations: false,
  });

  // Fetch pharmacies data
  useEffect(() => {
    // In a real app, this would be an API call
    // For this example, we'll use mock data
    const fetchPharmacies = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY_MS));

        // Sample data - in a real app, this would come from your backend
        const mockPharmacies = [
          {
            id: 1,
            name: "HealthFirst Pharmacy",
            address: "123 Medical Lane, Colombo 05",
            lat: currentLocation ? currentLocation.lat + 0.01 : 6.9371,
            lng: currentLocation ? currentLocation.lng + 0.01 : 79.8712,
            rating: 4.8,
            hours: "Open until 10:00 PM",
            phone: "+94 11 234 5678",
            hasDelivery: true,
            has24HourService: false,
            logo: "/src/assets/img/find/healthfirst.jpeg"
          },
          {
            id: 2,
            name: "MediCare Plus",
            address: "45 Wellness Road, Colombo 07",
            lat: currentLocation ? currentLocation.lat - 0.008 : 6.9193,
            lng: currentLocation ? currentLocation.lng + 0.005 : 79.8662,
            rating: 4.7,
            hours: "Open 24 hours",
            phone: "+94 11 345 6789",
            hasDelivery: true,
            has24HourService: true,
            logo: "/src/assets/img/find/medicare.jpeg"
          },
          {
            id: 3,
            name: "Family Care Pharmacy",
            address: "78 Health Street, Colombo 03",
            lat: currentLocation ? currentLocation.lat + 0.005 : 6.9321,
            lng: currentLocation ? currentLocation.lng - 0.007 : 79.8542,
            rating: 4.5,
            hours: "Open until 9:00 PM",
            phone: "+94 11 456 7890",
            hasDelivery: false,
            has24HourService: false,
            logo: "/src/assets/img/find/familycare.jpeg"
          },
          {
            id: 4,
            name: "City Health Pharmacy",
            address: "120 Main Street, Colombo 04",
            lat: currentLocation ? currentLocation.lat - 0.012 : 6.9151,
            lng: currentLocation ? currentLocation.lng - 0.003 : 79.8582,
            rating: 4.3,
            hours: "Open until 8:00 PM",
            phone: "+94 11 567 8901",
            hasDelivery: true,
            has24HourService: false,
            logo: "/src/assets/img/find/cityhealth.png"
          },
          {
            id: 5,
            name: "24/7 MediCenter",
            address: "33 Hospital Road, Colombo 06",
            lat: currentLocation ? currentLocation.lat + 0.007 : 6.9341,
            lng: currentLocation ? currentLocation.lng + 0.015 : 79.8762,
            rating: 4.6,
            hours: "Open 24 hours",
            phone: "+94 11 678 9012",
            hasDelivery: true,
            has24HourService: true,
            logo: "/src/assets/img/find/24-7.png"
          },
          {
            id: 6,
            name: "QuickMed Pharmacy",
            address: "55 Express Lane, Colombo 08",
            lat: currentLocation ? currentLocation.lat - 0.018 : 6.9101,
            lng: currentLocation ? currentLocation.lng + 0.002 : 79.8632,
            rating: 4.2,
            hours: "Open until 11:00 PM",
            phone: "+94 11 789 0123",
            hasDelivery: true,
            has24HourService: false,
            logo: "/src/assets/img/find/quickmed.jpg"
          },
          {
            id: 7,
            name: "Union Pharmacy",
            address: "90 Central Avenue, Colombo 02",
            lat: currentLocation ? currentLocation.lat + 0.015 : 6.9421,
            lng: currentLocation ? currentLocation.lng - 0.012 : 79.8512,
            rating: 4.4,
            hours: "Open until 9:30 PM",
            phone: "+94 11 890 1234",
            hasDelivery: false,
            has24HourService: false,
            logo: "/src/assets/img/find/union.png"
          },
          {
            id: 8,
            name: "Wellness Pharmacy",
            address: "12 Health Park, Colombo 09",
            lat: currentLocation ? currentLocation.lat - 0.006 : 6.9215,
            lng: currentLocation ? currentLocation.lng - 0.018 : 79.8432,
            rating: 4.9,
            hours: "Open until 10:30 PM",
            phone: "+94 11 901 2345",
            hasDelivery: true,
            has24HourService: false,
            logo: "/src/assets/img/find/wellness.jpg"
          }
        ];
        
        setPharmacies(mockPharmacies);
        setError(null);
      } catch (err) {
        setError("Failed to load pharmacies. Please try again later.");
        console.error("Error fetching pharmacies:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentLocation) {
      fetchPharmacies();
    }
  }, [currentLocation]);

  // Apply filters to pharmacies
  const filteredPharmacies = filterPharmacies(pharmacies, filters, currentLocation);

  return {
    pharmacies,
    loading,
    error,
    filters,
    setFilters,
    filteredPharmacies,
  };
};