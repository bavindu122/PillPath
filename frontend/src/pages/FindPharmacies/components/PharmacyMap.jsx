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
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border-radius: 50%;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #4CAF50;
          font-size: 18px;
          transition: all 0.3s ease;
        }
        .pharmacy-marker:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }
        .pharmacy-marker-selected {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          transform: scale(1.2);
          box-shadow: 0 16px 48px rgba(76, 175, 80, 0.3);
          z-index: 1000 !important;
        }
        .leaflet-popup-content-wrapper {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        .leaflet-popup-tip {
          background: white;
          border: 1px solid #e0e0e0;
        }
        .pharmacy-popup {
          width: 250px;
          border-radius: 12px;
          overflow: hidden;
          background: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .pharmacy-popup-header {
          background: white;
          color: #333;
          padding: 16px 20px 12px 20px;
          font-weight: 600;
          font-size: 18px;
          border-bottom: 1px solid #f0f0f0;
        }
        .pharmacy-popup-content {
          padding: 12px 20px;
          background: white;
          color: #666;
          font-size: 14px;
          line-height: 1.5;
        }
        .pharmacy-popup-content p {
          margin: 0 0 8px 0;
          color: #666;
        }
        .pharmacy-popup-content strong {
          color: #333;
          font-weight: 500;
        }
        .pharmacy-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 8px 0;
        }
        .pharmacy-rating-stars {
          color: #ffc107;
          font-size: 16px;
        }
        .pharmacy-rating-text {
          color: #666;
          font-size: 14px;
        }
        .pharmacy-hours {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 8px 0;
          color: #4CAF50;
          font-weight: 500;
        }
        .pharmacy-services {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 12px 0;
        }
        .pharmacy-service-tag {
          background: #f0f8f0;
          color: #4CAF50;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        .pharmacy-popup-footer {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 20px;
          background: white;
          border-top: 1px solid #f0f0f0;
        }
        .pharmacy-popup-footer button {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }
        .pharmacy-popup-footer button:first-child {
          background: #4CAF50;
          color: white;
        }
        .pharmacy-popup-footer button:first-child:hover {
          background: #45a049;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
        }
        .pharmacy-popup-footer button:last-child {
          background: #f5f5f5;
          color: #666;
        }
        .pharmacy-popup-footer button:last-child:hover {
          background: #e0e0e0;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
              <div class="pharmacy-rating">
                <span class="pharmacy-rating-stars">★★★★★</span>
                <span class="pharmacy-rating-text">${pharmacy.rating} (142 reviews)</span>
              </div>
              <p>${pharmacy.address}</p>
              <div class="pharmacy-hours">
                <span>${pharmacy.hours}</span>
              </div>
            </div>
            <div class="pharmacy-popup-footer">
              <button onclick="console.log('View details for ${pharmacy.name}')">
                View
              </button>
              <button onclick="console.log('Get directions to ${pharmacy.name}')">
                Directions
              </button>
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