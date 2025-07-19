import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import OpeningHours from "./OpeningHours";

const ContactInfo = ({ pharmacy }) => {
  if (!pharmacy) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Operating Hours Component */}
      <OpeningHours pharmacy={pharmacy} />
      
      {/* Contact Information */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl h-[350px]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
              <p className="text-gray-600">{pharmacy.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
              <a href={`tel:${pharmacy.phone}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                {pharmacy.phone}
              </a>
            </div>
          </div>

          {pharmacy.email && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail size={20} className="text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                <a href={`mailto:${pharmacy.email}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                  {pharmacy.email}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;