// Calculate distance between two coordinates in kilometers using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

// Convert degrees to radians
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

// Generate a URL for Google Maps directions
export const getDirectionsUrl = (destLat, destLng, userLat, userLng) => {
  return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destLat},${destLng}&travelmode=driving`;
};

// Format a phone number for display
export const formatPhoneNumber = (phoneNumber) => {
  // Remove non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if the number is a valid length
  if (cleaned.length < 10) return phoneNumber;
  
  // Format as XXX-XXX-XXXX
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};

// Check if a pharmacy is currently open based on hours string
export const isPharmacyOpen = (hoursString) => {
  // For demo purposes - in a real app you would parse the hours string
  return hoursString.toLowerCase().includes('open') && 
        !hoursString.toLowerCase().includes('closed');
};