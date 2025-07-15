import React, { useState, useEffect } from "react";
import { MapPin, Sliders, Search, ChevronLeft, List, Map as MapIcon } from "lucide-react";
import PharmacyMap from "./components/PharmacyMap";
import PharmacyFilters from "./components/PharmacyFilters";
import PharmacyList from "./components/PharmacyList";
import { usePharmacyData } from "./hooks/usePharmacyData";


const FindPharmacy = () => {
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
  
      <div className="min-h-screen bg-gradient-to-br from-bg-light via-white to-upload-bg pt-20 pb-12">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-60 -z-10"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-40 -z-10"></div>
        
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header section */}
          <div className="mb-8 text-center md:text-left">
            <div className="inline-flex items-center mb-4">
              <a href="/" className="text-primary hover:text-primary-hover">
                <ChevronLeft size={16} className="inline mr-1" />
                Back to Home
              </a>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gradient-primary">
              Find Nearby Pharmacies
            </h1>
            <p className="text-dark/70 max-w-2xl mx-auto md:mx-0">
              Discover pharmacies near you, check their ratings, operating hours, and available services.
              Use filters to find exactly what you need.
            </p>
          </div>

          {/* Search and view toggle */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-white/30 bg-white/50 backdrop-blur-sm rounded-xl 
                           text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Search by pharmacy name or location..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-center px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm 
                           border border-white/30 text-dark hover:bg-white/70 transition-all"
              >
                <Sliders size={18} className="mr-2" />
                Filters
              </button>
              
              <div className="hidden sm:flex items-center rounded-xl overflow-hidden border border-white/30">
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center justify-center px-4 py-3 ${
                    viewMode === "map" 
                      ? "bg-primary text-white" 
                      : "bg-white/50 backdrop-blur-sm text-dark hover:bg-white/70"
                  } transition-all`}
                >
                  <MapIcon size={18} className="mr-2" />
                  Map
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center justify-center px-4 py-3 ${
                    viewMode === "list" 
                      ? "bg-primary text-white" 
                      : "bg-white/50 backdrop-blur-sm text-dark hover:bg-white/70"
                  } transition-all`}
                >
                  <List size={18} className="mr-2" />
                  List
                </button>
                <button
                  onClick={() => setViewMode("split")}
                  className={`flex items-center justify-center px-4 py-3 ${
                    viewMode === "split" 
                      ? "bg-primary text-white" 
                      : "bg-white/50 backdrop-blur-sm text-dark hover:bg-white/70"
                  } transition-all`}
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
                  ? "bg-primary text-white" 
                  : "bg-white/50 backdrop-blur-sm text-dark border border-white/30"
              } transition-all`}
            >
              <MapIcon size={18} className="mr-2" />
              Map
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl ${
                viewMode === "list" 
                  ? "bg-primary text-white" 
                  : "bg-white/50 backdrop-blur-sm text-dark border border-white/30"
              } transition-all`}
            >
              <List size={18} className="mr-2" />
              List
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl ${
                viewMode === "split" 
                  ? "bg-primary text-white" 
                  : "bg-white/50 backdrop-blur-sm text-dark border border-white/30"
              } transition-all`}
            >
              Split
            </button>
          </div>

          {/* Filter section - slides in/out */}
          <div
            className={`${
              isFilterOpen ? "max-h-[500px] opacity-100 mb-6" : "max-h-0 opacity-0 overflow-hidden"
            } transition-all duration-300 ease-in-out bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg`}
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
              <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg overflow-hidden">
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