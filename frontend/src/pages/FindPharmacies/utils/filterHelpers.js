import { calculateDistance } from './mapHelpers';
const NEARBY_DISTANCE_KM = 2; // 2 km for nearby pharmacies
const HIGH_RATING_THRESHOLD = 4.0; // Threshold for high-rated 

// Filter pharmacies based on the current filters
export const filterPharmacies = (pharmacies, filters, currentLocation) => {
  if (!pharmacies || pharmacies.length === 0) return [];

  return pharmacies.filter(pharmacy => {
    // Filter by distance (radius)
    if (currentLocation && filters.radius) {
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        pharmacy.lat,
        pharmacy.lng
      );
      if (distance > filters.radius) return false;
    }

    // Filter by rating
    if (pharmacy.rating < filters.minRating) return false;

    // Filter by open now
    if (filters.openNow) {
      const isOpen = pharmacy.hours.toLowerCase().includes('open') && 
                     !pharmacy.hours.toLowerCase().includes('closed');
      if (!isOpen) return false;
    }

    // Filter by 24-hour service
    if (filters.has24HourService && !pharmacy.has24HourService) return false;

    // Filter by delivery
    if (filters.hasDelivery && !pharmacy.hasDelivery) return false;

    // Filter by insurance
    if (filters.acceptsInsurance && !pharmacy.acceptsInsurance) return false;

    // Filter by vaccinations
    if (filters.hasVaccinations && !pharmacy.hasVaccinations) return false;

    return true;
  }).sort((a, b) => {
    // Sort by distance if we have current location
    if (currentLocation) {
      const distanceA = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        a.lat,
        a.lng
      );
      const distanceB = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        b.lat,
        b.lng
      );
      return distanceA - distanceB;
    }
    
    // Otherwise sort by rating
    return b.rating - a.rating;
  });
};

// Get a count of pharmacies for each filter
export const getFilterCounts = (pharmacies, currentLocation) => {
  if (!pharmacies || pharmacies.length === 0) return {};

  return {
    nearby: pharmacies.filter(pharmacy => {
      if (!currentLocation) return false;
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        pharmacy.lat,
        pharmacy.lng
      );
      return distance <= NEARBY_DISTANCE_KM; // Within 2km
    }).length,
    open24Hours: pharmacies.filter(p => p.has24HourService).length,
    delivery: pharmacies.filter(p => p.hasDelivery).length,
    insurance: pharmacies.filter(p => p.acceptsInsurance).length,
    vaccinations: pharmacies.filter(p => p.hasVaccinations).length,
    highRated: pharmacies.filter(p => p.rating >= HIGH_RATING_THRESHOLD).length,
  };
};