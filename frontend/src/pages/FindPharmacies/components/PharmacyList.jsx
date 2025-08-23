import React from "react";
import {
  MapPin,
  Star,
  Clock,
  Phone,
  Navigation,
  ArrowRight,
  Truck,
  Pill,
  Shield,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import { calculateDistance } from "../utils/mapHelpers";
import { ScrollContainer } from "../../../components/UIs";
import { useNavigate } from "react-router-dom";

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

const PharmacyList = ({
  pharmacies,
  loading,
  error,
  selectedPharmacy,
  setSelectedPharmacy,
  currentLocation,
  isMultiSelect = false,
  selectedPharmacies = [],
}) => {
  const navigate = useNavigate();

  const isPharmacySelected = (pharmacyId) => {
    return selectedPharmacies.some((p) => p.id === pharmacyId);
  };

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Finding nearby pharmacies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading pharmacies</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (pharmacies.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8">
        <div className="text-center">
          <MapPin size={40} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">
            No pharmacies found with the current filters
          </p>
          <p className="text-gray-500">
            Try adjusting your filters or increasing the search radius
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] overflow-y-auto bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-4">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-bold text-lg">
          Found {pharmacies.length}{" "}
          {pharmacies.length === 1 ? "pharmacy" : "pharmacies"}
        </h3>
        {isMultiSelect && selectedPharmacies.length > 0 && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <Check size={14} />
            <span>{selectedPharmacies.length} selected</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {pharmacies.map((pharmacy) => {
          const isSelected = isMultiSelect
            ? isPharmacySelected(pharmacy.id)
            : selectedPharmacy?.id === pharmacy.id;

          return (
            <div
              key={pharmacy.id}
              className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "bg-primary/10 border border-primary/30 ring-2 ring-primary/20"
                  : "bg-white/70 border border-white/50 hover:bg-white/90"
              }`}
              onClick={() => setSelectedPharmacy(pharmacy)}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div
                    className={`w-16 h-16 rounded-lg bg-white flex items-center justify-center shadow-md ${
                      isSelected
                        ? "border-2 border-primary"
                        : "border border-gray-200"
                    }`}
                  >
                    {pharmacy.logoUrl || pharmacy.logo ? (
                      <img
                        src={pharmacy.logoUrl || pharmacy.logo}
                        alt={pharmacy.name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <Pill size={30} className="text-primary" />
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-dark">
                        {pharmacy.name}
                      </h3>
                      {pharmacy.isVerified && (
                        <div className="flex items-center gap-1 mt-1">
                          <Shield size={14} className="text-green-600" />
                          <span className="text-green-600 text-xs font-medium">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-yellow-500">
                        <Star size={16} className="fill-yellow-500" />
                        <span className="ml-1 text-sm text-dark font-medium">
                          {pharmacy.rating || pharmacy.averageRating || 0}
                        </span>
                      </div>

                      {/* Multi-select button */}
                      {isMultiSelect && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPharmacy(pharmacy);
                          }}
                          className={`ml-2 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            isSelected
                              ? "bg-primary border-primary text-white"
                              : "border-gray-300 hover:border-primary/50 text-gray-400 hover:text-primary"
                          }`}
                        >
                          {isSelected ? (
                            <Check size={16} />
                          ) : (
                            <Plus size={16} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-2 flex items-center">
                    <MapPin size={14} className="inline mr-1 text-primary" />
                    {pharmacy.address}
                  </p>

                  {currentLocation && (
                    <p className="text-gray-600 text-sm mb-2 flex items-center">
                      <Navigation
                        size={14}
                        className="inline mr-1 text-secondary"
                      />
                      {calculateDistance(
                        currentLocation.lat,
                        currentLocation.lng,
                        pharmacy.lat || pharmacy.latitude,
                        pharmacy.lng || pharmacy.longitude
                      ).toFixed(1)}{" "}
                      km away
                    </p>
                  )}

                  <p className="text-gray-600 text-sm mb-3 flex items-center">
                    <Clock size={14} className="inline mr-1 text-accent" />
                    {pharmacy.currentStatus ||
                      pharmacy.hours ||
                      formatOperatingHours(pharmacy.operatingHours)}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {(pharmacy.hasDelivery || pharmacy.deliveryAvailable) && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 flex items-center">
                        <Truck size={12} className="mr-1" />
                        Delivery
                      </span>
                    )}
                    {pharmacy.has24HourService && (
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 flex items-center">
                        <Clock size={12} className="mr-1" />
                        24 Hours
                      </span>
                    )}
                    {pharmacy.isVerified && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 flex items-center">
                        <Shield size={12} className="mr-1" />
                        Verified
                      </span>
                    )}
                    {pharmacy.isActive && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 flex items-center">
                        Active
                      </span>
                    )}
                    {isSelected && isMultiSelect && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium flex items-center">
                        <Check size={12} className="mr-1" />
                        Selected
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <a
                      href={`tel:${pharmacy.phone || pharmacy.phoneNumber}`}
                      className="text-primary hover:text-primary-hover text-sm font-medium flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone size={14} className="mr-1" />
                      {pharmacy.phone || pharmacy.phoneNumber}
                    </a>


                    {!isMultiSelect && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/pharmacy/${pharmacy.id}`);
                        }}
                        className="text-sm text-primary hover:text-primary-hover font-medium flex items-center"
                      >
                        View Details
                        <ArrowRight size={14} className="ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PharmacyList;
