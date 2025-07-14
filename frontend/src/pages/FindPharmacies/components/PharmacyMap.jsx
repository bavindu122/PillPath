import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation } from "lucide-react";
import { calculateDistance } from "../utils/mapHelpers";

// Fix for Leaflet default icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PharmacyMap = ({ 
  pharmacies, 
  selectedPharmacy, 
  setSelectedPharmacy, 
  currentLocation,
  viewMode 
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Initialize map when component mounts and currentLocation is available
  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current && currentLocation) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [currentLocation.lat, currentLocation.lng],
        14
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      // Add current location marker
      const currentLocationIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="current-location-marker">
                 <div class="current-location-dot"></div>
                 <div class="current-location-pulse"></div>
               </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      L.marker([currentLocation.lat, currentLocation.lng], { icon: currentLocationIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('<b>Your Location</b>')
        .openPopup();
    }

    // Apply custom CSS for current location marker
    if (!document.getElementById('map-custom-css')) {
      const style = document.createElement('style');
      style.id = 'map-custom-css';
      style.innerHTML = `
        .current-location-marker {
          position: relative;
          width: 20px;
          height: 20px;
        }
        .current-location-dot {
          width: 20px;
          height: 20px;
          background-color: #2D5DA0;
          border-radius: 50%;
          border: 3px solid white;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
        }
        .current-location-pulse {
          width: 40px;
          height: 40px;
          background-color: rgba(45, 93, 160, 0.4);
          border-radius: 50%;
          position: absolute;
          top: -10px;
          left: -10px;
          z-index: 1;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .pharmacy-marker {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          border: 2px solid #4CAF50;
          color: #4CAF50;
          font-size: 18px;
        }
        .pharmacy-marker-selected {
          background: #4CAF50;
          color: white;
          border: 2px solid white;
          transform: scale(1.2);
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.3);
          z-index: 1000 !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 15px;
          padding: 0;
          overflow: hidden;
        }
        .pharmacy-popup {
          width: 250px;
          border-radius: 15px;
          overflow: hidden;
        }
        .pharmacy-popup-header {
          background: linear-gradient(to right, #2D5DA0, #1D4A80);
          color: white;
          padding: 10px 15px;
          font-weight: bold;
        }
        .pharmacy-popup-content {
          padding: 10px 15px;
        }
        .pharmacy-popup-footer {
          display: flex;
          justify-content: space-between;
          padding: 10px 15px;
          background: #f5f5f5;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [currentLocation]);

  // Update markers when pharmacies change
  useEffect(() => {
    if (mapInstanceRef.current && pharmacies && pharmacies.length > 0) {
      // Clear existing markers
      Object.values(markersRef.current).forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = {};

      // Add markers for each pharmacy
      pharmacies.forEach(pharmacy => {
        const isSelected = selectedPharmacy && selectedPharmacy.id === pharmacy.id;
        
        const pharmacyIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="pharmacy-marker ${isSelected ? 'pharmacy-marker-selected' : ''}">
                   <i data-lucide="pill"></i>
                 </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        const marker = L.marker([pharmacy.lat, pharmacy.lng], { icon: pharmacyIcon })
          .addTo(mapInstanceRef.current)
          .on('click', () => {
            setSelectedPharmacy(pharmacy);
          });

        // Create custom popup
        const popupContent = `
          <div class="pharmacy-popup">
            <div class="pharmacy-popup-header">
              ${pharmacy.name}
            </div>
            <div class="pharmacy-popup-content">
              <p>${pharmacy.address}</p>
              <p class="mt-2"><strong>Rating:</strong> ${pharmacy.rating}⭐</p>
              ${currentLocation ? `<p><strong>Distance:</strong> ${calculateDistance(
                currentLocation.lat, 
                currentLocation.lng, 
                pharmacy.lat, 
                pharmacy.lng
              ).toFixed(1)} km</p>` : ''}
              <p><strong>Hours:</strong> ${pharmacy.hours}</p>
            </div>
            <div class="pharmacy-popup-footer">
              <button class="text-primary hover:underline">Details</button>
              <button class="text-secondary hover:underline">Directions</button>
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        markersRef.current[pharmacy.id] = marker;
      });

      // If a pharmacy is selected, open its popup
      if (selectedPharmacy) {
        const marker = markersRef.current[selectedPharmacy.id];
        if (marker) {
          marker.openPopup();
          mapInstanceRef.current.setView([selectedPharmacy.lat, selectedPharmacy.lng], 15);
        }
      }
    }
  }, [pharmacies, selectedPharmacy, setSelectedPharmacy, currentLocation]);

  // Adjust map when viewMode changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
    }
  }, [viewMode]);

  return (
    <div className="relative">
      {currentLocation && (
        <div 
          ref={mapRef} 
          className={`w-full ${viewMode === "split" ? "h-[600px]" : "h-[70vh]"}`}
        ></div>
      )}
      
      {!currentLocation && (
        <div className="flex items-center justify-center h-[500px] bg-gray-100">
          <div className="text-center p-8">
            <MapPin size={40} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button 
          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          onClick={() => {
            if (mapInstanceRef.current && currentLocation) {
              mapInstanceRef.current.setView([currentLocation.lat, currentLocation.lng], 14);
            }
          }}
        >
          <Navigation size={20} className="text-primary" />
        </button>
      </div>
    </div>
  );
};

export default PharmacyMap;