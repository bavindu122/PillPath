import React from "react";
import { MapPin, Clock, Phone, Star, Navigation, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const NearbyPharmaciesCard = () => {
  const pharmacies = [
    {
      id: 1,
      name: "Central Pharmacy",
      distance: 0.5,
      hours: "Open until 10 PM",
      status: "Available",
      rating: 4.8,
      hasDelivery: true
    },
    {
      id: 2,
      name: "HealthCare Plus",
      distance: 1.2,
      hours: "24/7 Service",
      status: "Available",
      rating: 4.5,
      hasDelivery: true
    }
  ];

  return (
    <div>
      

      <div className="space-y-3 mb-3">
        {pharmacies.map((pharmacy) => (
          <motion.div 
            key={pharmacy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <h4 className="text-white font-medium">{pharmacy.name}</h4>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-300">
                    {pharmacy.status}
                  </span>
                </div>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-white/60 text-xs">
                    <Navigation size={12} className="mr-1 text-blue-300" />
                    {pharmacy.distance} km away
                  </div>
                  <div className="flex items-center text-white/60 text-xs">
                    <Clock size={12} className="mr-1 text-green-300" />
                    {pharmacy.hours}
                  </div>
                  <div className="flex items-center text-white/60 text-xs">
                    <Star size={12} className="mr-1 text-yellow-300" />
                    {pharmacy.rating} Rating
                  </div>
                </div>
              </div>
              <div>
                {pharmacy.hasDelivery && (
                  <div className="bg-white/20 rounded-full px-2 py-1 text-white text-xs">
                    Delivers
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button 
        whileHover={{ scale: 1.03 }}
        className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-colors rounded-xl text-white text-sm flex items-center justify-center gap-1 shadow-lg"
      >
        <MapPin size={14} />
        Find More Pharmacies
      </motion.button>
    </div>
  );
};

export default NearbyPharmaciesCard;