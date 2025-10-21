import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation } from "lucide-react";
import { calculateDistance } from "../utils/mapHelpers";
import logo3 from "../../../assets/img/find/logo3.png";

// Fix for Leaflet default icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Helper function to generate star rating display
const generateStarRating = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let stars = "";
  for (let i = 0; i < fullStars; i++) stars += "★";
  if (hasHalfStar) stars += "☆";
  for (let i = 0; i < emptyStars; i++) stars += "☆";
  return stars;
};

// Helper to convert camelCase style object to CSS string
function convertStyleObjectToString(styleObj) {
  return Object.entries(styleObj)
    .map(
      ([key, value]) =>
        `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value}`
    )
    .join("; ");
}

// ✅ Helper to format operating hours for display
const formatOperatingHours = (operatingHours) => {
  if (!operatingHours || Object.keys(operatingHours).length === 0) {
    return "Hours not available";
  }

  const today = new Date().getDay();
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const todayName = days[today];

  if (operatingHours[todayName]) {
    return `Today: ${operatingHours[todayName]}`;
  }

  // Return first available day's hours
  const firstDay = Object.keys(operatingHours)[0];
  return `${firstDay.charAt(0).toUpperCase() + firstDay.slice(1)}: ${
    operatingHours[firstDay]
  }`;
};

const PharmacyMap = ({
  pharmacies,
  selectedPharmacy,
  setSelectedPharmacy,
  currentLocation,
  viewMode,
  isMultiSelect = false,
  selectedPharmacies = [],
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
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      // Add current location marker
      const currentLocationIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="position: relative; width: 20px; height: 20px;">
                 <div style="width: 20px; height: 20px; background-color: #2884f4; border-radius: 50%; border: 3px solid white; position: absolute; top: 0; left: 0; z-index: 2;"></div>
                 <div style="width: 40px; height: 40px; background-color: rgba(40, 132, 244, 0.4); border-radius: 50%; position: absolute; top: -10px; left: -10px; z-index: 1; animation: pulse 2s infinite;"></div>
               </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      L.marker([currentLocation.lat, currentLocation.lng], {
        icon: currentLocationIcon,
      })
        .addTo(mapInstanceRef.current)
        .bindPopup("<b>Your Location</b>")
        .openPopup();
    }

    // Add CSS animations for pulse effect
    if (!document.getElementById("map-animations")) {
      const style = document.createElement("style");
      style.id = "map-animations";
      style.innerHTML = `
        @keyframes pulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes greenPulse {
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
      Object.values(markersRef.current).forEach((marker) => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = {};

      // Helper to check if a pharmacy is selected (multi or single)
      const isPharmacySelected = (pharmacy) => {
        if (isMultiSelect) {
          return selectedPharmacies.some((p) => p.id === pharmacy.id);
        }
        return selectedPharmacy && selectedPharmacy.id === pharmacy.id;
      };

      // Add markers for each pharmacy
      pharmacies.forEach((pharmacy) => {
        const isSelected = isPharmacySelected(pharmacy);

        const markerStyle = {
          width: "36px",
          height: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          borderRadius: "50%",
          boxShadow: isSelected
            ? "0 8px 24px rgba(76, 175, 80, 0.4)"
            : "0 4px 12px rgba(0, 0, 0, 0.15)",
          border: isSelected ? "2px solid #45a049" : "2px solid #4CAF50",
          color: isSelected ? "white" : "#4CAF50",
          fontSize: "18px",
          transition: "all 0.3s ease",
          position: "relative",
          transform: isSelected ? "scale(1.2)" : "scale(1)",
          zIndex: isSelected ? "1000" : "auto",
        };

        const pharmacyIcon = L.divIcon({
          className: "custom-div-icon",
          html: `<div style="position: relative; width: 36px; height: 36px;">
                  <div style="${convertStyleObjectToString(markerStyle)}"
                       onmouseover="if (!this.classList.contains('selected')) { this.style.background='#f5f5f5'; this.style.transform='scale(1.1)'; this.style.boxShadow='0 6px 20px rgba(0, 0, 0, 0.2)'; }"
                       onmouseout="if (!this.classList.contains('selected')) { this.style.background='white'; this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.15)'; }"
                       class="${isSelected ? "selected" : ""}">
                    <img src="${
                      pharmacy.logoUrl || logo3
                    }" alt="Pharmacy" style="width: 20px; height: 20px; object-fit: contain;" />
                  </div>
                  ${
                    isSelected
                      ? `<div style="position: absolute; top: -9px; left: -9px; width: 54px; height: 54px; background-color: rgba(34, 139, 34, 0.5); border-radius: 50%; animation: greenPulse 2s infinite; z-index: -1;"></div>`
                      : ""
                  }
                </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([pharmacy.lat, pharmacy.lng], {
          icon: pharmacyIcon,
        })
          .addTo(mapInstanceRef.current)
          .on("click", () => {
            setSelectedPharmacy(pharmacy);
          });

        // ✅ Create custom popup with real backend data
        const popupContent = `
          <div style="width: 280px; border-radius: 12px; overflow: hidden; background: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="background: white; color: #333; padding: 16px 20px 12px 20px; font-weight: 600; font-size: 18px; display: flex; align-items: center; gap: 12px;">
              <img src="${pharmacy.logoUrl || logo3}" alt="${
          pharmacy.name
        }" style="width: 40px; height: 40px; object-fit: contain; border-radius: 8px; border: 1px solid #e0e0e0;" />
              <span class="notranslate" translate="no">${pharmacy.name}</span>
            </div>
            <div style="padding: 12px 20px; background: white; color: #666; font-size: 14px; line-height: 1.5;">
              <div style="display: flex; align-items: center; gap: 6px; margin: 8px 0;">
                <span style="color: #ffc107; font-size: 16px;">${generateStarRating(
                  pharmacy.rating || 0
                )}</span>
                <span style="color: #666; font-size: 14px;">${
                  pharmacy.rating || 0
                } ${pharmacy.isVerified ? "(Verified)" : ""}</span>
              </div>
              <p style="margin: 0 0 8px 0; color: #666;">${pharmacy.address}</p>
              <div style="display: flex; align-items: center; gap: 6px; margin: 8px 0; color: #4CAF50; font-weight: 500;">
                <span>${
                  pharmacy.currentStatus ||
                  formatOperatingHours(pharmacy.operatingHours)
                }</span>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0;">
                ${
                  pharmacy.deliveryAvailable || pharmacy.hasDelivery
                    ? '<span style="background: #f0f8f0; color: #4CAF50; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">Delivery</span>'
                    : ""
                }
                ${
                  pharmacy.has24HourService
                    ? '<span style="background: #ffedd4; color: #ba6240ff; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">24 Hours</span>'
                    : ""
                }
                ${
                  pharmacy.isVerified
                    ? '<span style="background: #e8f5e8; color: #2e7d32; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">Verified</span>'
                    : ""
                }
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 12px; padding: 16px 20px; background: white;">
              <button style="flex: 1; padding: 10px 16px; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; text-align: center; background: #4CAF50; color: white;" 
                      onmouseover="this.style.background='#45a049'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(76, 175, 80, 0.3)'"
                      onmouseout="this.style.background='#4CAF50'; this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                      onclick="window.location.href='/pharma-profile/${
                        pharmacy.id
                      }'">
                View Details
              </button>
              <button style="flex: 1; padding: 10px 16px; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; text-align: center; background: #f5f5f5; color: #666;" 
                      onmouseover="this.style.background='#e0e0e0'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 2px 8px rgba(0, 0, 0, 0.1)'"
                      onmouseout="this.style.background='#f5f5f5'; this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                      onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${
                        pharmacy.lat
                      },${pharmacy.lng}', '_blank')">
                Directions
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          className: "custom-popup",
          closeButton: true,
          autoPan: true,
        });
        markersRef.current[pharmacy.id] = marker;
      });

      // If a pharmacy is selected, open its popup
      if (selectedPharmacy) {
        const marker = markersRef.current[selectedPharmacy.id];
        if (marker) {
          marker.openPopup();
          mapInstanceRef.current.setView(
            [selectedPharmacy.lat, selectedPharmacy.lng],
            15
          );
        }
      }
    }
  }, [
    pharmacies,
    selectedPharmacy,
    setSelectedPharmacy,
    currentLocation,
    isMultiSelect,
    selectedPharmacies,
  ]);

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
          className={`w-full ${
            viewMode === "split" ? "h-[600px]" : "h-[70vh]"
          }`}
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
              mapInstanceRef.current.setView(
                [currentLocation.lat, currentLocation.lng],
                14
              );
            }
          }}
        >
          <Navigation size={20} className="text-primary" />
        </button>
      </div>

      <style jsx>{`
        .leaflet-popup-content-wrapper {
          background: white !important;
          border: 1px solid var(--color-primary, #4caf50) !important;
          border-radius: 12px !important;
          padding: 0 !important;
          overflow: hidden !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
        }
        .leaflet-popup-tip {
          background: white !important;
          border: 1px solid #43b611ff !important;
        }
      `}</style>
    </div>
  );
};

export default PharmacyMap;
