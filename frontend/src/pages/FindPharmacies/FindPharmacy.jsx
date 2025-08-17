import React, { useState, useEffect } from "react";
import {
  MapPin,
  Sliders,
  Search,
  ChevronLeft,
  List,
  Map as MapIcon,
  Upload,
  Check,
  Target,
  X,
  Navigation2,
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PharmacyMap from "./components/PharmacyMap";
import PharmacyFilters from "./components/PharmacyFilters";
import PharmacyList from "./components/PharmacyList";
import { usePharmacyData } from "./hooks/usePharmacyData";

const FindPharmacy = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isFromDashboard = searchParams.get("from") === "dashboard";
  const isFromPrescriptionUpload =
    searchParams.get("from") === "prescription-upload";

  const [viewMode, setViewMode] = useState("split");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedPharmacies, setSelectedPharmacies] = useState([]);
  const [prescriptionData, setPrescriptionData] = useState(null);

  // ✅ NEW: Location picker states
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [customLocationQuery, setCustomLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [activeLocation, setActiveLocation] = useState(null); // Current active location for search
  const [userLocation, setUserLocation] = useState(null); // User's actual GPS location

  const {
    pharmacies,
    loading,
    error,
    filters,
    setFilters,
    filteredPharmacies,
  } = usePharmacyData(currentLocation);

  // Load prescription data if coming from prescription upload
  useEffect(() => {
    if (isFromPrescriptionUpload) {
      const storedData = sessionStorage.getItem("prescriptionData");
      if (storedData) {
        setPrescriptionData(JSON.parse(storedData));
      }
    }
  }, [isFromPrescriptionUpload]);

  // ✅ UPDATED: Get user's current GPS location and set as default
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: "Your Current Location",
            type: "current",
          };
          setUserLocation(location);
          setCurrentLocation(location);
          setActiveLocation(location);
        },
        (error) => {
          console.error("Error getting location:", error);
          const defaultLocation = {
            lat: 6.9271,
            lng: 79.8612,
            name: "Colombo, Sri Lanka",
            type: "default",
          };
          setUserLocation(defaultLocation);
          setCurrentLocation(defaultLocation);
          setActiveLocation(defaultLocation);
        }
      );
    } else {
      const defaultLocation = {
        lat: 6.9271,
        lng: 79.8612,
        name: "Colombo, Sri Lanka",
        type: "default",
      };
      setUserLocation(defaultLocation);
      setCurrentLocation(defaultLocation);
      setActiveLocation(defaultLocation);
    }
  }, []);

  // ✅ NEW: Function to search for location suggestions using OpenStreetMap Nominatim API
  const searchLocationSuggestions = async (query) => {
    if (!query.trim() || query.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      // Using OpenStreetMap Nominatim API for location search
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&countrycodes=lk&addressdetails=1`
      );
      const data = await response.json();

      const suggestions = data.map((item, index) => ({
        id: index,
        name: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: "custom",
        details: {
          city:
            item.address?.city || item.address?.town || item.address?.village,
          district: item.address?.state_district || item.address?.county,
          province: item.address?.state,
        },
      }));

      setLocationSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setLocationSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // ✅ NEW: Debounced search for location suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocationSuggestions(customLocationQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [customLocationQuery]);

  // ✅ NEW: Handle location selection
  const handleLocationSelect = (location) => {
    setActiveLocation(location);
    setCurrentLocation(location);
    setCustomLocationQuery("");
    setLocationSuggestions([]);
    setIsLocationPickerOpen(false);
  };

  // ✅ NEW: Reset to user's current location
  const resetToCurrentLocation = () => {
    if (userLocation) {
      handleLocationSelect(userLocation);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePharmacySelect = (pharmacy) => {
    if (isFromPrescriptionUpload) {
      setSelectedPharmacies((prev) => {
        const isAlreadySelected = prev.find((p) => p.id === pharmacy.id);
        if (isAlreadySelected) {
          return prev.filter((p) => p.id !== pharmacy.id);
        } else {
          return [...prev, pharmacy];
        }
      });
    } else {
      setSelectedPharmacy(pharmacy);
    }
  };

  const handleUploadToPharmacies = async () => {
    if (selectedPharmacies.length === 0) {
      alert("Please select at least one pharmacy.");
      return;
    }

    // Simulate upload process
    const uploadPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    await uploadPromise;

    // Clean up session storage
    sessionStorage.removeItem("prescriptionData");

    // Show success message
    alert(
      `Prescription uploaded successfully to ${selectedPharmacies.length} pharmacy(ies)!`
    );

    // Navigate to activities page
    navigate("/customer/activities");
  };

  const getBackButtonText = () => {
    if (isFromPrescriptionUpload) return "Back to Upload";
    if (isFromDashboard) return "Back to Dashboard";
    return "Back to Home";
  };

  const getBackButtonLink = () => {
    if (isFromPrescriptionUpload) return "#"; // Stay on page or close modal
    if (isFromDashboard) return "/customer";
    return "/";
  };

  const searchedPharmacies = searchQuery
    ? filteredPharmacies.filter(
        (pharmacy) =>
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
              {!isFromPrescriptionUpload && (
                <a
                  href={getBackButtonLink()}
                  className="flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 hover:bg-white/10 px-3 py-2 rounded-lg group w-fit"
                >
                  <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="font-medium text-sm sm:text-base">
                    {getBackButtonText()}
                  </span>
                </a>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              {isFromPrescriptionUpload
                ? "Select Pharmacies for Upload"
                : "Find Nearby Pharmacies"}
            </h1>

            <p className="text-white/70 max-w-2xl mx-auto md:mx-0">
              {isFromPrescriptionUpload
                ? "Choose one or more pharmacies to send your prescription to. You can compare prices and services."
                : "Discover pharmacies near you, check their ratings, operating hours, and available services. Use filters to find exactly what you need."}
            </p>

            {/* ✅ NEW: Active Location Display */}
            {activeLocation && (
              <div className="mt-4 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activeLocation.type === "current"
                      ? "bg-green-400"
                      : activeLocation.type === "custom"
                      ? "bg-blue-400"
                      : "bg-yellow-400"
                  }`}
                ></div>
                <MapPin className="h-4 w-4 text-white/70" />
                <span className="text-white/90 text-sm font-medium">
                  Searching in: {activeLocation.name}
                </span>
                {activeLocation.type !== "current" && (
                  <button
                    onClick={resetToCurrentLocation}
                    className="text-white/60 hover:text-white/90 transition-colors duration-200"
                    title="Reset to current location"
                  >
                    <Navigation2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* Prescription Upload Status and Selected Pharmacies Counter - Side by Side */}
            {isFromPrescriptionUpload && (
              <div className="mt-4 flex flex-col md:flex-row justify-between items-start gap-6 w-full max-w-7xl mx-auto md:mx-0">
                {/* Prescription Upload Status */}
                {prescriptionData && (
                  <div className="w-[300px] p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          Prescription Ready
                        </p>
                        <p className="text-white/60 text-sm">
                          Select pharmacies to upload to
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected Pharmacies Counter */}
                {selectedPharmacies.length > 0 && (
                  <div className="w-[480px] p-6 bg-blue-500/20 backdrop-blur-md rounded-xl border border-blue-300/30 self-start md:self-auto">
                    <div className="flex items-center justify-between h-full">
                      <div className="flex items-center space-x-2 gap-2">
                        <MapPin className="h-5 w-5 text-blue-400" />
                        <div className="flex flex-col">
                          <span className="text-white font-medium">
                            {selectedPharmacies.length} Pharmacy(ies) Selected
                          </span>
                          <div className="text-white/60 text-sm">
                            {selectedPharmacies.map((p) => p.name).join(", ")}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleUploadToPharmacies}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 flex items-center space-x-2 self-center"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ✅ UPDATED: Search and view toggle with location picker */}
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
              {/* ✅ NEW: Location Picker Button */}
              <button
                onClick={() => setIsLocationPickerOpen(!isLocationPickerOpen)}
                className="flex items-center justify-center px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md 
                           border border-white/20 text-white hover:bg-white/20 transition-all duration-300 relative"
              >
                <Target size={18} className="mr-2" />
                Location
                {activeLocation?.type === "custom" && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full"></div>
                )}
              </button>

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

          {/* ✅ NEW: Location Picker Modal */}
          <div
            className={`${
              isLocationPickerOpen
                ? "max-h-[400px] opacity-100 mb-6"
                : "max-h-0 opacity-0 overflow-hidden"
            } transition-all duration-300 ease-in-out bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl relative`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">
                  Choose Search Location
                </h3>
                <button
                  onClick={() => setIsLocationPickerOpen(false)}
                  className="text-white/60 hover:text-white transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Current Location Option */}
              <div className="mb-4">
                <button
                  onClick={resetToCurrentLocation}
                  className={`w-full p-4 rounded-xl border transition-all duration-300 flex items-center space-x-3 ${
                    activeLocation?.type === "current"
                      ? "bg-green-500/20 border-green-400/50 text-white"
                      : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      activeLocation?.type === "current"
                        ? "bg-green-400"
                        : "bg-white/40"
                    }`}
                  ></div>
                  <Navigation2 className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Use Current Location</p>
                    <p className="text-sm opacity-70">
                      Search pharmacies near you
                    </p>
                  </div>
                </button>
              </div>

              {/* Custom Location Search */}
              <div className="mb-4">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Search for a specific location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-white/40" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl 
                               text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                    placeholder="Enter city, district, or area name..."
                    value={customLocationQuery}
                    onChange={(e) => setCustomLocationQuery(e.target.value)}
                  />
                  {isLoadingSuggestions && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Suggestions */}
              {locationSuggestions.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {locationSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleLocationSelect(suggestion)}
                      className="w-full p-3 text-left rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 text-white/90"
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">
                            {suggestion.name}
                          </p>
                          {suggestion.details.city && (
                            <p className="text-sm text-white/60 truncate">
                              {[
                                suggestion.details.city,
                                suggestion.details.district,
                                suggestion.details.province,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {customLocationQuery.length >= 3 &&
                locationSuggestions.length === 0 &&
                !isLoadingSuggestions && (
                  <div className="text-center py-6 text-white/60">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No locations found. Try a different search term.</p>
                  </div>
                )}
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

          {/* Filter section */}
          <div
            className={`${
              isFilterOpen
                ? "max-h-[500px] opacity-100 mb-6"
                : "max-h-0 opacity-0 overflow-hidden"
            } transition-all duration-300 ease-in-out bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl`}
          >
            <PharmacyFilters
              filters={filters}
              setFilters={setFilters}
              closeFilters={() => setIsFilterOpen(false)}
            />
          </div>

          {/* Main content - Map and List */}
          <div
            className={`grid ${
              viewMode === "split"
                ? "grid-cols-1 lg:grid-cols-2 gap-6"
                : "grid-cols-1"
            }`}
          >
            {/* Map container */}
            {(viewMode === "map" || viewMode === "split") && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                <PharmacyMap
                  pharmacies={searchedPharmacies}
                  selectedPharmacy={selectedPharmacy}
                  setSelectedPharmacy={setSelectedPharmacy}
                  currentLocation={currentLocation}
                  viewMode={viewMode}
                  isMultiSelect={isFromPrescriptionUpload}
                  selectedPharmacies={selectedPharmacies}
                />
              </div>
            )}

            {/* List container */}
            {(viewMode === "list" || viewMode === "split") && (
              <div
                className={`${
                  viewMode === "list" ? "max-w-3xl mx-auto w-full" : ""
                }`}
              >
                <PharmacyList
                  pharmacies={searchedPharmacies}
                  loading={loading}
                  error={error}
                  selectedPharmacy={selectedPharmacy}
                  setSelectedPharmacy={handlePharmacySelect}
                  currentLocation={currentLocation}
                  isMultiSelect={isFromPrescriptionUpload}
                  selectedPharmacies={selectedPharmacies}
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
