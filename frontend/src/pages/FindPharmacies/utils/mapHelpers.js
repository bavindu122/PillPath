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
  return R * c;

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
  if (!hoursString) return false; // Return false if hoursString is missing or invalid
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  // Example format: "Open 9:00 AM - 5:00 PM"
  const match = hoursString.match(/open\s(\d{1,2}:\d{2}\s[APM]{2})\s-\s(\d{1,2}:\d{2}\s[APM]{2})/i);
  if (!match) return false; // Return false if the format is invalid
  
  const [_, openTime, closeTime] = match;
  
  const parseTime = (timeStr) => {
    const [hours, minutes] = new Date(`1970-01-01T${new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(`1970-01-01T${timeStr}`))}`).toTimeString().split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
  };
  
  const openMinutes = parseTime(openTime);
  const closeMinutes = parseTime(closeTime);
  
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};