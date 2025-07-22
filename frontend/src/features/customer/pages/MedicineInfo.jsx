import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Pill, Clock, AlertTriangle, Shield, Info, ArrowLeft, Loader2 } from "lucide-react";
import { MedicineService } from "../../../services/api";

const MedicineInfo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState(null);

  // Load mock data on component mount
  useEffect(() => {
    const loadMedicines = () => {
      try {
        const mockData = MedicineService.getMockMedicineData();
        setMedicines(mockData);
      } catch (err) {
        setError("Failed to load medicine data");
        console.error("Error loading medicines:", err);
      }
    };

    loadMedicines();
  }, []);

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = async (term) => {
    setIsSearching(true);
    setError(null);
    
    try {
      // In a real app, this would call the API
      // const results = await MedicineService.searchMedicines(term);
      // setMedicines(results);
      
      // For now, simulate API call delay
      setTimeout(() => {
        setIsSearching(false);
      }, 500);
    } catch (err) {
      setError("Failed to search medicines");
      setIsSearching(false);
      console.error("Search error:", err);
    }
  };

  const handleMedicineSelect = async (medicine) => {
    setIsSearching(true);
    try {
      // In a real app, you might fetch more detailed info
      // const detailedInfo = await MedicineService.getMedicineDetails(medicine.id);
      // setSelectedMedicine(detailedInfo);
      
      setSelectedMedicine(medicine);
      setIsSearching(false);
    } catch (err) {
      setError("Failed to load medicine details");
      setIsSearching(false);
      console.error("Error loading medicine details:", err);
    }
  };

  const handleBackToSearch = () => {
    setSelectedMedicine(null);
    setError(null);
  };

  return (
    <div className="min-h-screen p-6 relative">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedMedicine ? (
            // Search View
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8"
                >
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Medicine Information</h1>
                
                <p className="text-white/70 text-lg max-w-2xl mx-auto">
                  Search for any medication to get detailed information about its uses, dosage, side effects, and precautions.
                </p>
                </motion.div>
              </div>

              {/* Search Bar */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl mx-auto mb-8"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search for medicine name, generic name, or brand..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </motion.div>

              {/* Search Results */}
              {searchTerm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {isSearching ? (
                    <div className="col-span-full flex justify-center py-12">
                      <div className="flex items-center gap-3 text-white/70">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span>Searching medicines...</span>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="col-span-full text-center py-12">
                      <div className="text-red-400 text-lg">{error}</div>
                    </div>
                  ) : filteredMedicines.length > 0 ? (
                    filteredMedicines.map((medicine, index) => (
                      <motion.div
                        key={medicine.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 cursor-pointer hover:bg-white/15 transition-all duration-300"
                        onClick={() => handleMedicineSelect(medicine)}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={medicine.image}
                            alt={medicine.name}
                            className="w-16 h-16 rounded-xl object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/64?text=Med";
                            }}
                          />
                          <div>
                            <h3 className="text-xl font-semibold text-white">{medicine.name}</h3>
                            <p className="text-white/70">{medicine.brand}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg">
                              {medicine.category}
                            </span>
                            <span className="text-sm bg-green-500/20 text-green-300 px-2 py-1 rounded-lg">
                              {medicine.dosage}
                            </span>
                          </div>
                          <p className="text-white/80 text-sm line-clamp-2">{medicine.description}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="text-white/60 text-lg">No medicines found matching your search.</div>
                    </div>
                  )}
                </motion.div>
              )}

              {!searchTerm && !error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center py-12"
                >
                  <div className="text-white/60 text-lg mb-4">Start typing to search for medicines</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
                    {medicines.slice(0, 5).map((medicine, index) => (
                      <motion.div
                        key={medicine.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-all duration-300"
                        onClick={() => handleMedicineSelect(medicine)}
                      >
                        <img
                          src={medicine.image}
                          alt={medicine.name}
                          className="w-full h-16 rounded-lg object-cover mb-2"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/100?text=Med";
                          }}
                        />
                        <div className="text-white font-medium text-sm text-center">{medicine.name}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            // Medicine Detail View
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back Button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleBackToSearch}
                className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Search
              </motion.button>

              {/* Medicine Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={selectedMedicine.image}
                    alt={selectedMedicine.name}
                    className="w-32 h-32 rounded-2xl object-cover mx-auto md:mx-0"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/128?text=Med";
                    }}
                  />
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-2">{selectedMedicine.name}</h1>
                    <p className="text-white/70 text-lg mb-4">Generic: {selectedMedicine.genericName}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-sm">
                        {selectedMedicine.category}
                      </span>
                      <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-sm">
                        {selectedMedicine.dosage}
                      </span>
                      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-sm">
                        {selectedMedicine.brand}
                      </span>
                    </div>
                    <p className="text-white/80">{selectedMedicine.description}</p>
                  </div>
                </div>
              </motion.div>

              {/* Medicine Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Uses */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Info className="h-6 w-6 text-blue-400" />
                    <h2 className="text-xl font-semibold text-white">Uses & Indications</h2>
                  </div>
                  <ul className="space-y-2">
                    {selectedMedicine.uses.map((use, index) => (
                      <li key={index} className="text-white/80 flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        {use}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Dosage */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-6 w-6 text-green-400" />
                    <h2 className="text-xl font-semibold text-white">Dosage Instructions</h2>
                  </div>
                  <p className="text-white/80">{selectedMedicine.dosageInstructions}</p>
                </motion.div>

                {/* Side Effects */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-yellow-400" />
                    <h2 className="text-xl font-semibold text-white">Side Effects</h2>
                  </div>
                  <ul className="space-y-2">
                    {selectedMedicine.sideEffects.map((effect, index) => (
                      <li key={index} className="text-white/80 flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">•</span>
                        {effect}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Precautions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-6 w-6 text-red-400" />
                    <h2 className="text-xl font-semibold text-white">Precautions</h2>
                  </div>
                  <ul className="space-y-2">
                    {selectedMedicine.precautions.map((precaution, index) => (
                      <li key={index} className="text-white/80 flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        {precaution}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Drug Interactions */}
              {selectedMedicine.interactions && selectedMedicine.interactions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mt-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-orange-400" />
                    <h2 className="text-xl font-semibold text-white">Drug Interactions</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMedicine.interactions.map((interaction, index) => (
                      <span
                        key={index}
                        className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-lg text-sm"
                      >
                        {interaction}
                      </span>
                    ))}
                  </div>
                  <p className="text-white/60 text-sm mt-4">
                    Always consult with your healthcare provider about potential drug interactions.
                  </p>
                </motion.div>
              )}

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mt-8"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-red-300 font-semibold mb-2">Important Disclaimer</h3>
                    <p className="text-red-200/80 text-sm">
                      This information is for educational purposes only and should not replace professional medical advice. 
                      Always consult with a qualified healthcare provider before starting, stopping, or changing any medication. 
                      Individual responses to medications may vary.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MedicineInfo;
