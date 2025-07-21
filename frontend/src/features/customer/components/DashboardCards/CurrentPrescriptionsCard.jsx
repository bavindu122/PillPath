import React from "react";
import { Pill, Clock, CalendarClock, DollarSign, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const CurrentPrescriptionsCard = () => {
  const prescriptions = [
    {
      id: 1,
      name: "RX-250714-01",
      pharmacy: "HealthPlus ",
      distance: 5,
      status: "Ready to pickup",
      price: 250,
      color: "blue"
    },
    {
      id: 2,
      name: "RX-250714-02",
      pharmacy: "Central Pharmacy",
      distance: 12,
      status: "Packing",
      price: 1000,
      color: "purple"
    }
  ];

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600/20 p-2 rounded-lg">
            <Pill size={18} className="text-blue-200" />
          </span>
          <h3 className="text-white font-semibold">Current Prescriptions</h3>
        </div>
        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
          2 Active
        </span>
      </div>

      <div className="space-y-3 mb-3">
        {prescriptions.map((prescription) => (
          <motion.div 
            key={prescription.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300"
          >
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full bg-${prescription.color}-400 mr-2`}></div>
                  <h4 className="text-white font-medium">{prescription.name}</h4>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="flex items-center text-white/60 text-xs">
                    <Clock size={12} className="mr-1" />
                    {prescription.pharmacy}
                  </div>
                  <div className="flex items-center text-white/60 text-xs">
                    <CalendarClock size={12} className="mr-1" />
                    {prescription.distance} km
                  </div>
                  <div className="flex items-center text-white/60 text-xs">
                    <DollarSign size={12} className="mr-1" />
                    Rs. {prescription.price} 
                  </div>
                </div>
              </div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  prescription.status === "Ready" 
                    ? "bg-green-500/20 text-green-300" 
                    : "bg-yellow-500/20 text-yellow-300"
                }`}>
                  {prescription.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-white/80 hover:text-white text-sm flex items-center justify-center">
        View All Prescriptions <ChevronRight size={14} className="ml-1" />
      </button>
    </div>
  );
};

export default CurrentPrescriptionsCard;