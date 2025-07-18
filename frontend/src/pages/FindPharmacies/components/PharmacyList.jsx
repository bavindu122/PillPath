import React from "react";
import { MapPin, Star, Clock, Phone, Navigation, ArrowRight, Truck, Pill, Shield } from "lucide-react";
import { calculateDistance } from "../utils/mapHelpers";

const PharmacyList = ({ 
  pharmacies, 
  loading, 
  error, 
  selectedPharmacy, 
  setSelectedPharmacy,
  currentLocation 
}) => {
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
          <p className="text-gray-600 mb-2">No pharmacies found with the current filters</p>
          <p className="text-gray-500">Try adjusting your filters or increasing the search radius</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] overflow-y-auto bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-4">
      <h3 className="font-bold text-lg mb-4 px-2">
        Found {pharmacies.length} {pharmacies.length === 1 ? 'pharmacy' : 'pharmacies'}
      </h3>
      <div className="space-y-4">
        {pharmacies.map((pharmacy) => (
          <div
            key={pharmacy.id}
            className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
              selectedPharmacy?.id === pharmacy.id
                ? "bg-primary/10 border border-primary/30"
                : "bg-white/70 border border-white/50 hover:bg-white/90"
            }`}
            onClick={() => setSelectedPharmacy(pharmacy)}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className={`w-16 h-16 rounded-lg bg-white flex items-center justify-center shadow-md ${
                  selectedPharmacy?.id === pharmacy.id ? "border-2 border-primary" : "border border-gray-200"
                }`}>
                  {pharmacy.logo ? (
                    <img
                      src={pharmacy.logo}
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
                  <h3 className="font-bold text-lg text-dark">{pharmacy.name}</h3>
                  <div className="flex items-center text-yellow-500">
                    <Star size={16} className="fill-yellow-500" />
                    <span className="ml-1 text-sm font-medium">{pharmacy.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-2 flex items-center">
                  <MapPin size={14} className="inline mr-1 text-primary" />
                  {pharmacy.address}
                </p>
                
                {currentLocation && (
                  <p className="text-gray-600 text-sm mb-2 flex items-center">
                    <Navigation size={14} className="inline mr-1 text-secondary" />
                    {calculateDistance(
                      currentLocation.lat,
                      currentLocation.lng,
                      pharmacy.lat,
                      pharmacy.lng
                    ).toFixed(1)} km away
                  </p>
                )}
                
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                  <Clock size={14} className="inline mr-1 text-accent" />
                  {pharmacy.hours}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {pharmacy.hasDelivery && (
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
                </div>
                
                <div className="flex items-center justify-between">
                  <a 
                    href={`tel:${pharmacy.phone}`}
                    className="text-primary hover:text-primary-hover text-sm font-medium flex items-center"
                  >
                    <Phone size={14} className="mr-1" />
                    {pharmacy.phone}
                  </a>
                  
                  <button className="text-sm text-primary hover:text-primary-hover font-medium flex items-center">
                    View Details
                    <ArrowRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PharmacyList;