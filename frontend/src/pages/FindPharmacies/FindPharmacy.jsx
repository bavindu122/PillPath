import React, { useState, useEffect } from "react";
import { MapPin, Sliders, Search, ChevronLeft, List, Map as MapIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PharmacyMap from "./components/PharmacyMap";
import PharmacyFilters from "./components/PharmacyFilters";
import PharmacyList from "./components/PharmacyList";
import { usePharmacyData } from "./hooks/usePharmacyData";


const FindPharmacy = () => {
  const [searchParams] = useSearchParams();
  const isFromDashboard = searchParams.get('from') === 'dashboard';
  
  const [viewMode, setViewMode] = useState("split"); // "map", "list", or "split"
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  
  const {
    pharmacies,
    loading,
    error,
    filters,
    setFilters,
    filteredPharmacies,
  } = usePharmacyData(currentLocation);

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to Colombo, Sri Lanka if location access is denied
          setCurrentLocation({ lat: 6.9271, lng: 79.8612 });
        }
      );
    } else {
      // Default to Colombo, Sri Lanka if geolocation is not supported
      setCurrentLocation({ lat: 6.9271, lng: 79.8612 });
    }
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter pharmacies based on search query
  const searchedPharmacies = searchQuery
    ? filteredPharmacies.filter((pharmacy) =>
        pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredPharmacies;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 pt-20 pb-12">
        {/* Floating background elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-24 h-24 bg-purple-500/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-green-500/5 rounded-full blur-lg animate-pulse"></div>
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Header section */}
          <div className="mb-8 text-center md:text-left">
            <div className="inline-flex items-center mb-4">
              <a 
                href={isFromDashboard ? "/customer" : "/"} 
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 hover:bg-white/10 px-3 py-2 rounded-lg group w-fit"
              >
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium text-sm sm:text-base">
                  {isFromDashboard ? "Back to Dashboard" : "Back to Home"}
                </span>
              </a>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              Find Nearby Pharmacies
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto md:mx-0">
              Discover pharmacies near you, check their ratings, operating hours, and available services.
              Use filters to find exactly what you need.
            </p>
          </div>

          {/* Search and view toggle */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-white/50" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-white/20 bg-white/10 backdrop-blur-md rounded-xl 
                           text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                placeholder="Search by pharmacy name or location..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-center px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md 
                           border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                <Sliders size={18} className="mr-2" />
                Filters
              </button>
              
              <div className="hidden sm:flex items-center rounded-xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-md">
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center justify-center px-4 py-3 ${
                    viewMode === "map" 
                      ? "bg-white text-blue-600 shadow-md" 
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  } transition-all duration-300`}
                >
                  <MapIcon size={18} className="mr-2" />
                  Map
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center justify-center px-4 py-3 ${
                    viewMode === "list" 
                      ? "bg-white text-blue-600 shadow-md" 
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  } transition-all duration-300`}
                >
                  <List size={18} className="mr-2" />
                  List
                </button>
                <button
                  onClick={() => setViewMode("split")}
                  className={`flex items-center justify-center px-4 py-3 ${
                    viewMode === "split" 
                      ? "bg-white text-blue-600 shadow-md" 
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  } transition-all duration-300`}
                >
                  Split View
                </button>
              </div>
            </div>
          </div>

          {/* Mobile view toggle */}
          <div className="flex sm:hidden gap-2 mb-4">
            <button
              onClick={() => setViewMode("map")}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl ${
                viewMode === "map" 
                  ? "bg-white text-blue-600 shadow-md" 
                  : "bg-white/10 backdrop-blur-md text-white/80 border border-white/20 hover:bg-white/20"
              } transition-all duration-300`}
            >
              <MapIcon size={18} className="mr-2" />
              Map
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl ${
                viewMode === "list" 
                  ? "bg-white text-blue-600 shadow-md" 
                  : "bg-white/10 backdrop-blur-md text-white/80 border border-white/20 hover:bg-white/20"
              } transition-all duration-300`}
            >
              <List size={18} className="mr-2" />
              List
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl ${
                viewMode === "split" 
                  ? "bg-white text-blue-600 shadow-md" 
                  : "bg-white/10 backdrop-blur-md text-white/80 border border-white/20 hover:bg-white/20"
              } transition-all duration-300`}
            >
              Split
            </button>
          </div>

          {/* Filter section - slides in/out */}
          <div
            className={`${
              isFilterOpen ? "max-h-[500px] opacity-100 mb-6" : "max-h-0 opacity-0 overflow-hidden"
            } transition-all duration-300 ease-in-out bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl`}
          >
            <PharmacyFilters 
              filters={filters} 
              setFilters={setFilters} 
              closeFilters={() => setIsFilterOpen(false)} 
            />
          </div>

          {/* Main content - Map and List */}
          <div className={`grid ${
            viewMode === "split" ? "grid-cols-1 lg:grid-cols-2 gap-6" : "grid-cols-1"
          }`}>
            {/* Map container */}
            {(viewMode === "map" || viewMode === "split") && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                <PharmacyMap 
                  pharmacies={searchedPharmacies} 
                  selectedPharmacy={selectedPharmacy}
                  setSelectedPharmacy={setSelectedPharmacy}
                  currentLocation={currentLocation}
                  viewMode={viewMode}
                />
              </div>
            )}
            
            {/* List container */}
            {(viewMode === "list" || viewMode === "split") && (
              <div className={`${
                viewMode === "list" ? "max-w-3xl mx-auto w-full" : ""
              }`}>
                <PharmacyList 
                  pharmacies={searchedPharmacies}
                  loading={loading} 
                  error={error}
                  selectedPharmacy={selectedPharmacy}
                  setSelectedPharmacy={setSelectedPharmacy}
                  currentLocation={currentLocation}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FindPharmacy;