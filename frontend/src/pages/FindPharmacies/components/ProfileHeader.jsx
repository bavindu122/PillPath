import React, { useState } from "react";
import { Star, MapPin, Clock, Phone, Share2, Navigation, Upload, Building2 } from "lucide-react";
import pharmaImage from "../../../assets/img/meds/pharma.jpg";
import pharmaLogo from "../../../assets/img/meds/pharmalogo.webp"; // Add this line
import PrescriptionUploadModal from "../../../components/Prescription/PrescriptionUploadModal";

const ProfileHeader = ({ pharmacy }) => {
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  if (!pharmacy) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pharmacy.name,
        text: `Check out ${pharmacy.name} on PillPath`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`;
    window.open(url, '_blank');
  };

  const handleUploadPrescription = () => {
    setIsPrescriptionModalOpen(true);
  };

  return (
    <>
      <div className="bg-grey/70 backdrop-blur-md rounded-2xl border border-white/40 shadow-xl mb-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[300px]">
          
          {/* Left Side - Pharmacy Details */}
          <div className="p-8 flex flex-col justify-between bg-gradient-to-br from-white/80 to-white/60">
            
            {/* Pharmacy Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white rounded-full shadow-lg border-4 border-blue-100 flex items-center justify-center overflow-hidden">
                <img
                  src={pharmaLogo}
                  alt={`${pharmacy.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Pharmacy Info */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
                {pharmacy.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={`${
                        star <= pharmacy.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-700">
                  {pharmacy.rating}
                </span>
                <span className="ml-1 text-gray-600 text-sm">
                  ({pharmacy.reviewCount || 0} reviews)
                </span>
              </div>

              {/* Contact Details */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <MapPin size={16} className="text-blue-600 mr-2 flex-shrink-0" />
                  <span className="text-center">{pharmacy.address}</span>
                </div>
                
                <div className="flex items-center justify-center">
                  <Clock size={16} className="text-green-600 mr-2 flex-shrink-0" />
                  <span className={pharmacy.isOpen ? "text-green-600" : "text-red-600"}>
                    Open until {pharmacy.hours}
                  </span>
                </div>
                
                <div className="flex items-center justify-center">
                  <Phone size={16} className="text-purple-600 mr-2 flex-shrink-0" />
                  <a 
                    href={`tel:${pharmacy.phone}`} 
                    className="hover:text-blue-600 transition-colors"
                  >
                    {pharmacy.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Pharmacy Image */}
          <div className="lg:col-span-2 relative overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={pharmaImage}
                alt="Pharmacy"
                className="w-full h-full object-cover"
              />
              {/* Overlay for better text/button visibility */}
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
            
            {/* Action Buttons - Top Right of Image */}
            <div className="absolute top-4 right-4 flex gap-3 z-10">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-lg transition-colors backdrop-blur-sm text-gray-800 shadow-lg"
              >
                <Share2 size={18} />
                Share
              </button>
              <button
                onClick={handleDirections}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Navigation size={18} />
                Directions
              </button>
            </div>

            {/* Upload Prescription Button - Bottom Right of Image */}
            <div className="absolute bottom-4 right-4 z-10">
              <button
                onClick={handleUploadPrescription}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg font-medium"
              >
                <Upload size={20} />
                Upload Prescription
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Upload Modal */}
      <PrescriptionUploadModal 
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
      />
    </>
  );
};

export default ProfileHeader;