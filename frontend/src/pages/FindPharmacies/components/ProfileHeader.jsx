import React from "react";
import { Star, MapPin, Clock, Phone, Share2, Navigation } from "lucide-react";
import pharmaImage from "../../../assets/img/meds/pharma.jpg";

const ProfileHeader = ({ pharmacy }) => {
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

  return (
    <div className="relative rounded-2xl shadow-xl mb-8 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={pharmaImage}
          alt="Pharmacy"
          className="w-full h-full object-cover"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 p-8">
        {/* Pharmacy Info - Left Aligned */}
        <div className="max-w-2xl">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                {pharmacy.name}
              </h1>
              <div className="flex items-center mb-3">
                <div className="flex items-center mr-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={`${
                        star <= pharmacy.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      } drop-shadow-sm`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-semibold text-white drop-shadow-lg">
                    {pharmacy.rating}
                  </span>
                  <span className="ml-1 text-gray-200 drop-shadow-sm">
                    ({pharmacy.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4 sm:mt-0">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-lg transition-colors backdrop-blur-sm text-gray-800"
              >
                <Share2 size={18} />
                Share
              </button>
              <button
                onClick={handleDirections}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Navigation size={18} />
                Directions
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
            <div className="flex items-center">
              <MapPin size={18} className="text-blue-300 mr-2 flex-shrink-0 drop-shadow-sm" />
              <span className="drop-shadow-sm">{pharmacy.address}</span>
            </div>
            <div className="flex items-center">
              <Clock size={18} className="text-green-300 mr-2 flex-shrink-0 drop-shadow-sm" />
              <span className={`drop-shadow-sm ${pharmacy.isOpen ? "text-green-300" : "text-red-300"}`}>
                {pharmacy.hours}
              </span>
            </div>
            <div className="flex items-center">
              <Phone size={18} className="text-purple-300 mr-2 flex-shrink-0 drop-shadow-sm" />
              <a href={`tel:${pharmacy.phone}`} className="hover:text-blue-300 transition-colors drop-shadow-sm">
                {pharmacy.phone}
              </a>
            </div>
          </div>

          {/* Service badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {pharmacy.hasDelivery && (
              <span className="px-3 py-1 bg-green-500/90 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                🚚 Delivery Available
              </span>
            )}
            {pharmacy.has24HourService && (
              <span className="px-3 py-1 bg-blue-500/90 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                🕐 24/7 Service
              </span>
            )}
            {pharmacy.acceptsInsurance && (
              <span className="px-3 py-1 bg-purple-500/90 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                🛡️ Insurance Accepted
              </span>
            )}
            {pharmacy.hasVaccinations && (
              <span className="px-3 py-1 bg-orange-500/90 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                💉 Vaccinations
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;