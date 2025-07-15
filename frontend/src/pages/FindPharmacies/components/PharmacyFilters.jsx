import React from "react";
import { X, Check, Sliders, Clock, Star, Pill, Truck, CreditCard } from "lucide-react";

const PharmacyFilters = ({ filters, setFilters, closeFilters }) => {
  // Handle radius filter change
  const handleRadiusChange = (e) => {
    const value = parseInt(e.target.value);
    setFilters({ ...filters, radius: value });
  };

  // Handle rating filter change
  const handleRatingChange = (rating) => {
    setFilters({ ...filters, minRating: rating });
  };

  // Handle toggle filters
  const handleToggleFilter = (filterName) => {
    setFilters({ ...filters, [filterName]: !filters[filterName] });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      radius: 5,
      minRating: 0,
      openNow: false,
      hasDelivery: false,
      acceptsInsurance: false,
      has24HourService: false,
      hasVaccinations: false,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-dark">
          <Sliders size={20} className="text-primary" />
          Filter Pharmacies
        </h3>
        <button 
          onClick={closeFilters}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Distance filter */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <h4 className="font-semibold mb-3 text-dark">Distance (km)</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">0 km</span>
            <span className="text-sm text-gray-500">{filters.radius} km</span>
            <span className="text-sm text-gray-500">20 km</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={filters.radius}
            onChange={handleRadiusChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Rating filter */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <h4 className="font-semibold mb-3 text-dark">Minimum Rating</h4>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`flex-1 py-2 px-1 rounded-md transition-colors ${
                  filters.minRating === rating
                    ? "bg-primary text-white"
                    : "bg-white/60 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {rating === 0 ? "Any" : `${rating}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Services filter */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <h4 className="font-semibold mb-3 text-dark">Services</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <button
                onClick={() => handleToggleFilter("openNow")}
                className={`w-5 h-5 rounded mr-2 flex items-center justify-center ${
                  filters.openNow ? "bg-primary text-white" : "bg-white border border-gray-300"
                }`}
              >
                {filters.openNow && <Check size={12} />}
              </button>
              <label className="flex items-center text-gray-700 cursor-pointer">
                <Clock size={16} className="mr-2 text-primary" />
                Open Now
              </label>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleToggleFilter("has24HourService")}
                className={`w-5 h-5 rounded mr-2 flex items-center justify-center ${
                  filters.has24HourService ? "bg-primary text-white" : "bg-white border border-gray-300"
                }`}
              >
                {filters.has24HourService && <Check size={12} />}
              </button>
              <label className="flex items-center text-gray-700 cursor-pointer">
                <Clock size={16} className="mr-2 text-accent" />
                24-Hour Service
              </label>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleToggleFilter("hasDelivery")}
                className={`w-5 h-5 rounded mr-2 flex items-center justify-center ${
                  filters.hasDelivery ? "bg-primary text-white" : "bg-white border border-gray-300"
                }`}
              >
                {filters.hasDelivery && <Check size={12} />}
              </button>
              <label className="flex items-center text-gray-700 cursor-pointer">
                <Truck size={16} className="mr-2 text-secondary" />
                Delivery Available
              </label>
            </div>
          </div>
        </div>

        {/* Additional filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <h4 className="font-semibold mb-3 text-dark">Payment & Insurance</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <button
                onClick={() => handleToggleFilter("acceptsInsurance")}
                className={`w-5 h-5 rounded mr-2 flex items-center justify-center ${
                  filters.acceptsInsurance ? "bg-primary text-white" : "bg-white border border-gray-300"
                }`}
              >
                {filters.acceptsInsurance && <Check size={12} />}
              </button>
              <label className="flex items-center text-gray-700 cursor-pointer">
                <CreditCard size={16} className="mr-2 text-primary" />
                Accepts Insurance
              </label>
            </div>
          </div>
        </div>

        {/* Medical services */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <h4 className="font-semibold mb-3 text-dark">Medical Services</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <button
                onClick={() => handleToggleFilter("hasVaccinations")}
                className={`w-5 h-5 rounded mr-2 flex items-center justify-center ${
                  filters.hasVaccinations ? "bg-primary text-white" : "bg-white border border-gray-300"
                }`}
              >
                {filters.hasVaccinations && <Check size={12} />}
              </button>
              <label className="flex items-center text-gray-700 cursor-pointer">
                <Pill size={16} className="mr-2 text-secondary" />
                Vaccination Services
              </label>
            </div>
          </div>
        </div>

        {/* Reset button */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 flex items-center justify-center">
          <button 
            onClick={resetFilters}
            className="text-primary hover:text-primary-hover font-medium"
          >
            Reset All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default PharmacyFilters;