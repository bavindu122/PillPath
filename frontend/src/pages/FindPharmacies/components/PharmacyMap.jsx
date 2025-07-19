import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation } from "lucide-react";
import { calculateDistance } from "../utils/mapHelpers";
import logo3 from "../../../assets/img/find/logo3.png";

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
        html: `<div style="position: relative; width: 20px; height: 20px;">
                 <div style="width: 20px; height: 20px; background-color: #2884f4; border-radius: 50%; border: 3px solid white; position: absolute; top: 0; left: 0; z-index: 2;"></div>
                 <div style="width: 40px; height: 40px; background-color: rgba(40, 132, 244, 0.4); border-radius: 50%; position: absolute; top: -10px; left: -10px; z-index: 1; animation: pulse 2s infinite;"></div>
               </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      L.marker([currentLocation.lat, currentLocation.lng], { icon: currentLocationIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('<b>Your Location</b>')
        .openPopup();
    }

    // Add CSS animations for pulse effect
    if (!document.getElementById('map-animations')) {
      const style = document.createElement('style');
      style.id = 'map-animations';
      style.innerHTML = `
        @keyframes pulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
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
        
        const markerStyle = {
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          borderRadius: '50%',
          boxShadow: isSelected ? '0 8px 24px rgba(76, 175, 80, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: isSelected ? '2px solid #45a049' : '2px solid #4CAF50',
          color: isSelected ? 'white' : '#4CAF50',
          fontSize: '18px',
          transition: 'all 0.3s ease',
          position: 'relative',
          transform: isSelected ? 'scale(1.2)' : 'scale(1)',
          zIndex: isSelected ? '1000' : 'auto'
        };

        const pharmacyIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="${Object.entries(markerStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')}">
                  <img src="${logo3}" alt="Pharmacy" style="width: 20px; height: 20px; object-fit: contain;" />
                </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        const marker = L.marker([pharmacy.lat, pharmacy.lng], { icon: pharmacyIcon })
          .addTo(mapInstanceRef.current)
          .on('click', () => {
            setSelectedPharmacy(pharmacy);
          });

        // Create custom popup with inline styles
        const popupContent = `
          <div style="width: 280px; border-radius: 12px; overflow: hidden; background: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="background: white; color: #333; padding: 16px 20px 12px 20px; font-weight: 600; font-size: 18px; border-bottom: 1px solid #f0f0f0;">
              ${pharmacy.name}
            </div>
            <div style="padding: 12px 20px; background: white; color: #666; font-size: 14px; line-height: 1.5;">
              <div style="display: flex; align-items: center; gap: 6px; margin: 8px 0;">
                <span style="color: #ffc107; font-size: 16px;">★★★★★</span>
                <span style="color: #666; font-size: 14px;">${pharmacy.rating} (142 reviews)</span>
              </div>
              <p style="margin: 0 0 8px 0; color: #666;">${pharmacy.address}</p>
              <div style="display: flex; align-items: center; gap: 6px; margin: 8px 0; color: #4CAF50; font-weight: 500;">
                <span>${pharmacy.hours}</span>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0;">
                ${pharmacy.hasDelivery ? '<span style="background: #f0f8f0; color: #4CAF50; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">Delivery</span>' : ''}
                ${pharmacy.has24HourService ? '<span style="background: #f0f8f0; color: #4CAF50; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">Mobile App</span>' : ''}
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 12px; padding: 16px 20px; background: white; border-top: 1px solid #f0f0f0;">
              <button style="flex: 1; padding: 10px 16px; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; text-align: center; background: #4CAF50; color: white;" onclick="console.log('View details for ${pharmacy.name}')">
                View Details
              </button>
              <button style="flex: 1; padding: 10px 16px; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; text-align: center; background: #f5f5f5; color: #666;" onclick="console.log('Get directions to ${pharmacy.name}')">
                Directions
              </button>
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent, {
          className: 'custom-popup',
          closeButton: true,
          autoPan: true
        });
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
        <div className="flex items-center justify-center h-[500px] bg-gray-100/60 backdrop-blur-md rounded-2xl border border-white/30">
          <div className="text-center p-8">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button 
          className="p-3 bg-white/60 backdrop-blur-md rounded-full shadow-lg hover:bg-white/90 transition-all duration-300 border border-white/30"
          onClick={() => {
            if (mapInstanceRef.current && currentLocation) {
              mapInstanceRef.current.setView([currentLocation.lat, currentLocation.lng], 14);
            }
          }}
        >
          <Navigation size={20} className="text-primary" />
        </button>
      </div>

      <style jsx>{`
        .leaflet-popup-content-wrapper {
          background: white !important;
          border: 1px solid #e0e0e0 !important;
          border-radius: 12px !important;
          padding: 0 !important;
          overflow: hidden !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
        }
        .leaflet-popup-tip {
          background: white !important;
          border: 1px solid #e0e0e0 !important;
        }
      `}</style>
    </div>
  );
};

export default PharmacyMap;