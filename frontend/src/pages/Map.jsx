
import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { MapPin, Navigation, Star, Clock, Phone } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const defaultCenter = {
  lat: 6.9271,
  lng: 79.8612,
};

const mockPharmacies = [
  {
    id: 1,
    name: 'HealthFirst Pharmacy',
    location: { lat: 6.9271, lng: 79.8612 },
    address: '123 Galle Road, Colombo',
    phone: '+94 11 234 5678',
    rating: 4.8,
    reviews: 156,
    openHours: '24/7',
    services: ['Prescription', 'Consultation', 'Delivery'],
  },
  {
    id: 2,
    name: 'MediCare Pharmacy',
    location: { lat: 6.9355, lng: 79.848 },
    address: '456 Hospital Street, Colombo',
    phone: '+94 11 345 6789',
    rating: 4.6,
    reviews: 89,
    openHours: '8:00 AM - 10:00 PM',
    services: ['Prescription', 'Health Checkup'],
  },
  {
    id: 3,
    name: 'Wellness Pharmacy',
    location: { lat: 6.9152, lng: 79.87 },
    address: '789 Wellness Lane, Colombo',
    phone: '+94 11 456 7890',
    rating: 4.9,
    reviews: 234,
    openHours: '6:00 AM - 11:00 PM',
    services: ['Prescription', 'Consultation', 'Lab Tests', 'Delivery'],
  },
  {
    id: 4,
    name: 'CityCare Pharmacy',
    location: { lat: 6.9, lng: 79.88 },
    address: '321 Main Road, Colombo',
    phone: '+94 11 567 8901',
    rating: 4.4,
    reviews: 67,
    openHours: '9:00 AM - 9:00 PM',
    services: ['Prescription', 'Delivery'],
  },
  {
    id: 5,
    name: 'PharmaPlus',
    location: { lat: 6.9400, lng: 79.8550 },
    address: '555 Independence Avenue, Colombo',
    phone: '+94 11 678 9012',
    rating: 4.7,
    reviews: 198,
    openHours: '7:00 AM - 11:00 PM',
    services: ['Prescription', 'Consultation', 'Lab Tests'],
  },
];

const getDistance = (loc1, loc2) => {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(loc1.lat)) *
      Math.cos(toRad(loc2.lat)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Custom marker icons
const createCustomIcon = (color, isUser = false) => {
  const svg = isUser 
    ? `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="3"/>
         <circle cx="12" cy="12" r="4" fill="white"/>
       </svg>`
    : `<svg width="32" height="40" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8z" fill="${color}" stroke="white" stroke-width="2"/>
         <circle cx="12" cy="8" r="3" fill="white"/>
         <path d="M12 5l1 2h2l-1.5 1.5L14 11l-2-1-2 1 .5-2.5L9 7h2l1-2z" fill="${color}"/>
       </svg>`;
  
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(0);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [hoveredPharmacy, setHoveredPharmacy] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBImu9Zmxy8iCcekQdhNi2To1JV8EwxqDs',
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        setUserLocation(defaultCenter);
      }
    );
  }, []);

  const getFilteredAndSortedPharmacies = () => {
    if (!userLocation) return [];
    
    let filtered = mockPharmacies.map(pharmacy => ({
      ...pharmacy,
      distance: getDistance(userLocation, pharmacy.location)
    }));

    if (radius > 0) {
      filtered = filtered.filter(pharmacy => pharmacy.distance <= radius);
    }

    return filtered.sort((a, b) => a.distance - b.distance);
  };

  const filteredPharmacies = getFilteredAndSortedPharmacies();

  if (loadError) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center p-8 glass rounded-2xl">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-danger mb-2">Error Loading Map</h2>
        <p className="text-muted">Unable to load Google Maps. Please check your connection.</p>
      </div>
    </div>
  );

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center p-8 glass rounded-2xl">
        <div className="animate-spin text-6xl mb-4">⏳</div>
        <h2 className="text-2xl font-bold text-primary-blue mb-2">Loading Map</h2>
        <p className="text-muted">Preparing your pharmacy finder...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20 blur-xl"></div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className="w-96 h-full glass border-r border-white/20 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <h1 className="text-2xl font-bold text-gradient-primary mb-2">
              Pharmacy Finder
            </h1>
            <p className="text-muted text-sm">
              Find nearby pharmacies with ease
            </p>
          </div>

          {/* Filter Controls */}
          <div className="p-6 border-b border-white/10">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Search Radius: {radius === 0 ? 'All' : `${radius} km`}
                </label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>All</span>
                  <span>25km</span>
                </div>
              </div>
              
              <div className="text-sm text-muted">
                Found {filteredPharmacies.length} pharmacies
                {radius > 0 && ` within ${radius}km`}
              </div>
            </div>
          </div>

          {/* Pharmacy List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-3">
              {filteredPharmacies.length > 0 ? (
                filteredPharmacies.map((pharmacy) => (
                  <div
                    key={pharmacy.id}
                    className={`pharmacy-card p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                      selectedPharmacy?.id === pharmacy.id ? 'ring-2 ring-blue-400 bg-white/30' : ''
                    }`}
                    onClick={() => setSelectedPharmacy(pharmacy)}
                    onMouseEnter={() => setHoveredPharmacy(pharmacy)}
                    onMouseLeave={() => setHoveredPharmacy(null)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-dark text-lg leading-tight">
                        {pharmacy.name}
                      </h3>
                      <div className="flex items-center bg-white/30 rounded-lg px-2 py-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                        <span className="text-xs font-medium text-dark">
                          {pharmacy.rating}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted">
                        <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="flex-1">{pharmacy.address}</span>
                      </div>
                      
                      <div className="flex items-center text-muted">
                        <Navigation className="w-4 h-4 mr-2 text-green-500" />
                        <span>{pharmacy.distance.toFixed(1)} km away</span>
                      </div>
                      
                      <div className="flex items-center text-muted">
                        <Clock className="w-4 h-4 mr-2 text-purple-500" />
                        <span>{pharmacy.openHours}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {pharmacy.services.slice(0, 3).map((service, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-2 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <span className="text-xs text-muted">
                        {pharmacy.reviews} reviews
                      </span>
                      <button className="text-xs text-primary-blue hover:text-primary font-medium transition-colors">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">🏥</div>
                  <h3 className="text-lg font-medium text-dark mb-2">
                    No pharmacies found
                  </h3>
                  <p className="text-muted text-sm">
                    Try increasing your search radius
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation || defaultCenter}
            zoom={14}
            options={{
              styles: [
                {
                  featureType: "all",
                  elementType: "geometry.fill",
                  stylers: [{ color: "#f8faff" }]
                },
                {
                  featureType: "water",
                  elementType: "geometry",
                  stylers: [{ color: "#c8e6ff" }]
                }
              ],
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
            }}
          >
            {/* User Location Marker */}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={createCustomIcon('#4FA4FF', true)}
                title="Your current location"
                zIndex={1000}
              />
            )}

            {/* Pharmacy Markers */}
            {filteredPharmacies.map((pharmacy) => (
              <Marker
                key={pharmacy.id}
                position={pharmacy.location}
                icon={createCustomIcon(
                  hoveredPharmacy?.id === pharmacy.id || selectedPharmacy?.id === pharmacy.id 
                    ? '#FF6B6B' 
                    : '#2D5DA0'
                )}
                title={pharmacy.name}
                onClick={() => setSelectedPharmacy(pharmacy)}
                onMouseOver={() => setHoveredPharmacy(pharmacy)}
                onMouseOut={() => setHoveredPharmacy(null)}
                zIndex={selectedPharmacy?.id === pharmacy.id ? 999 : 1}
              />
            ))}

            {/* Info Window */}
            {selectedPharmacy && (
              <InfoWindow
                position={selectedPharmacy.location}
                onCloseClick={() => setSelectedPharmacy(null)}
                options={{
                  pixelOffset: new window.google.maps.Size(0, -10),
                  maxWidth: 320,
                }}
              >
                <div className="p-4 bg-white rounded-lg shadow-xl max-w-sm">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800 leading-tight">
                      {selectedPharmacy.name}
                    </h3>
                    <div className="flex items-center bg-yellow-50 rounded-lg px-2 py-1 ml-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm font-medium text-gray-700">
                        {selectedPharmacy.rating}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                      <span>{selectedPharmacy.address}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                      <span>{selectedPharmacy.phone}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
                      <span>{selectedPharmacy.openHours}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Navigation className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                      <span>{selectedPharmacy.distance.toFixed(1)} km away</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {selectedPharmacy.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                    <span>{selectedPharmacy.reviews} reviews</span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      Get Directions
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};

export default Map;
