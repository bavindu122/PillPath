import React from "react";
import { Truck, Clock, Shield, Pill, CheckCircle } from "lucide-react";

const ServicesSection = ({ pharmacy }) => {
  if (!pharmacy) return null;

  const services = [
    {
      id: "delivery",
      name: "Home Delivery",
      icon: Truck,
      available: pharmacy.hasDelivery,
      description: "Free delivery within 5km radius"
    },
    {
      id: "24hour",
      name: "24/7 Service",
      icon: Clock,
      available: pharmacy.has24HourService,
      description: "Round-the-clock pharmacy services"
    },
    {
      id: "insurance",
      name: "Insurance Coverage",
      icon: Shield,
      available: pharmacy.acceptsInsurance,
      description: "Accepts major insurance plans"
    },
    {
      id: "vaccinations",
      name: "Vaccination Services",
      icon: Pill,
      available: pharmacy.hasVaccinations,
      description: "COVID-19, flu, and other vaccines"
    }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Services & Amenities</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => {
          const IconComponent = service.icon;
          const isAvailable = service.available;
          
          return (
            <div
              key={service.id}
              className={`p-4 rounded-xl border ${
                isAvailable
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isAvailable ? "bg-green-100" : "bg-gray-100"
                }`}>
                  <IconComponent
                    size={20}
                    className={isAvailable ? "text-green-600" : "text-gray-400"}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${
                      isAvailable ? "text-gray-800" : "text-gray-500"
                    }`}>
                      {service.name}
                    </h3>
                    {isAvailable && (
                      <CheckCircle size={16} className="text-green-500" />
                    )}
                  </div>
                  <p className={`text-sm ${
                    isAvailable ? "text-gray-600" : "text-gray-400"
                  }`}>
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesSection;