import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, X, Minus } from "lucide-react";
import "../pages/index-pharmacist.css";
import { medicineService } from "../services/medicineService";

const MIN_SEARCH_LENGTH = 3; // adjustable (change to 4 if needed)
const DISPLAY_LIMIT = 5; // number of groups to show initially

const MedicineSearch = ({ onAddMedicine }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]); // grouped results
  const [variantOpen, setVariantOpen] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalDosage, setModalDosage] = useState("250mg");
  const [modalPrice, setModalPrice] = useState(0);
  const [modalAvailable, setModalAvailable] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Mock medicine database
  const mockMedicines = [];

  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  const performSearch = async (term) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    if (!term || term.trim().length < MIN_SEARCH_LENGTH) {
      // require min chars
      setSearchResults([]);
      setError(null);
      setIsSearching(false);
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setIsSearching(true);
    setError(null);
    try {
      const { groups } = await medicineService.search(term.trim(), 1, 20, {
        signal: controller.signal,
      });
      setSearchResults(groups);
      const init = {};
      groups.forEach((g) => {
        if (g.variants.length === 1) init[g.baseName] = true;
      });
      setVariantOpen(init);
    } catch (e) {
      if (e.name === "AbortError") return; // ignore aborted
      setError(e.message || "Search failed");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => performSearch(searchTerm);

  useEffect(() => {
    // Debounce user input
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(searchTerm);
    }, 400); // 400ms debounce
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAddMedicine = (medicine) => {
    setSelectedMedicine(medicine);
    setModalQuantity(1);
    setModalDosage("250mg");
    setModalPrice(medicine.price || 0);
    setModalAvailable(medicine.available !== false);
    setShowAddModal(true);
  };

  const handleModalAddMedicine = () => {
    if (selectedMedicine) {
      const newItem = {
        id: Date.now(),
        name: selectedMedicine.name,
        genericName: selectedMedicine.genericName,
        quantity: modalQuantity,
        dosage: modalDosage,
        price: modalPrice,
        available: !!modalAvailable,
      };

      // Call parent's add medicine function
      if (onAddMedicine) {
        onAddMedicine(newItem);
      }

      setShowAddModal(false);
      setSelectedMedicine(null);
    }
  };

  const handleModalCancel = () => {
    setShowAddModal(false);
    setSelectedMedicine(null);
    setModalQuantity(1);
    setModalDosage("250mg");
    setModalPrice(0);
    setModalAvailable(true);
  };

  const adjustQuantity = (change) => {
    const newQuantity = modalQuantity + change;
    if (newQuantity > 0) {
      setModalQuantity(newQuantity);
    }
  };

  const calculateModalTotal = () => {
    return (modalPrice * modalQuantity).toFixed(2);
  };

  return (
    <>
      <div className="pharma-bg-card rounded-xl shadow-lg border pharma-border">
        <div className="p-6">
          <h3 className="text-lg font-semibold pharma-text-dark mb-4">
            Add Medicines to Order
          </h3>

          {/* Search Input */}
          <div className="flex space-x-3 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search medicine name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 border pharma-border rounded-lg focus:ring-2 pharma-text-dark outline-none transition-colors duration-200"
                style={{
                  focusRingColor: "var(--pharma-blue)",
                  focusBorderColor: "var(--pharma-blue)",
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSearchResults([]);
                    setError(null);
                    setShowAll(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="flex items-center space-x-2 px-6 py-2 pharma-bg-success pharma-text-light rounded-lg hover:pharma-bg-success-hover transition-colors duration-200 disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              <span>{isSearching ? "Searching..." : "Search"}</span>
            </button>
          </div>

          {/* Search Results (scrollable) */}
          <div className="mt-4 space-y-4 max-h-96 overflow-y-auto pr-2">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}
            {searchTerm &&
              searchTerm.length < MIN_SEARCH_LENGTH &&
              !isSearching &&
              !error && (
                <div className="text-xs text-gray-500">
                  Type at least {MIN_SEARCH_LENGTH} letters to search.
                </div>
              )}
            {isSearching &&
              searchResults.length === 0 &&
              !error &&
              searchTerm.length >= MIN_SEARCH_LENGTH && (
                <div className="text-xs text-gray-500">Searching...</div>
              )}
            {searchResults.length > 0 &&
              (showAll
                ? searchResults
                : searchResults.slice(0, DISPLAY_LIMIT)
              ).map((group) => (
                <div
                  key={group.baseName}
                  className="border pharma-border rounded-lg overflow-hidden"
                >
                  <div
                    className="flex items-start justify-between p-4 bg-white hover:pharma-bg-gray-50 cursor-pointer"
                    onClick={() =>
                      setVariantOpen((v) => ({
                        ...v,
                        [group.baseName]: !v[group.baseName],
                      }))
                    }
                  >
                    <div className="flex-1">
                      <h4 className="font-medium pharma-text-dark">
                        {group.baseName}
                      </h4>
                      <p className="text-xs pharma-text-gray-600">
                        {group.variants.length} variant
                        {group.variants.length !== 1 && "s"}
                      </p>
                    </div>
                    <div className="text-xs pharma-text-gray-600">
                      {variantOpen[group.baseName] ? "Hide" : "Show"}
                    </div>
                  </div>
                  {variantOpen[group.baseName] && (
                    <div className="divide-y">
                      {group.variants.map((v) => (
                        <div
                          key={v.setId}
                          className="p-4 flex items-start justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                        >
                          <div className="flex-1 pr-4">
                            <p className="text-sm font-medium text-gray-800 break-words">
                              {v.title}
                            </p>
                            {v.genericName && (
                              <p className="text-xs text-gray-600 mt-1">
                                {v.genericName}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              handleAddMedicine({
                                id: v.setId,
                                name: v.baseName,
                                genericName: v.genericName || v.title,
                                price: 0,
                                available: true,
                              })
                            }
                            className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-xs"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            {searchResults.length > DISPLAY_LIMIT && !showAll && (
              <div className="pt-2">
                <button
                  onClick={() => setShowAll(true)}
                  className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-700 py-2 border border-blue-100 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-150"
                >
                  Show all {searchResults.length} results
                </button>
              </div>
            )}
            {showAll && searchResults.length > DISPLAY_LIMIT && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setShowAll(false);
                  }}
                  className="w-full text-center text-xs font-medium text-gray-600 hover:text-gray-700 py-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                >
                  Show fewer
                </button>
              </div>
            )}
            {searchTerm &&
              !isSearching &&
              searchResults.length === 0 &&
              !error && (
                <div className="text-center py-8 text-gray-500">
                  No medicines found matching "{searchTerm}"
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Medicine to Order
                </h3>
                <button
                  onClick={handleModalCancel}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Medicine Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medicine Name
                  </label>
                  <input
                    type="text"
                    value={selectedMedicine?.name || ""}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                {/* Generic Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generic Name
                  </label>
                  <input
                    type="text"
                    value={selectedMedicine?.genericName || ""}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                {/* Dosage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dosage
                  </label>
                  <select
                    value={modalDosage}
                    onChange={(e) => setModalDosage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="100mg">100mg</option>
                    <option value="200mg">200mg</option>
                    <option value="250mg">250mg</option>
                    <option value="500mg">500mg</option>
                    <option value="750mg">750mg</option>
                    <option value="1000mg">1000mg</option>
                  </select>
                </div>

                {/* Unit Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={modalPrice}
                    onChange={(e) =>
                      setModalPrice(parseFloat(e.target.value) || 0)
                    }
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setModalAvailable(!modalAvailable)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 ${
                        modalAvailable ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                          modalAvailable ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="text-sm text-gray-700">
                      {modalAvailable ? "Available" : "Out of Stock"}
                    </span>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => adjustQuantity(-1)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={modalQuantity}
                      onChange={(e) =>
                        setModalQuantity(parseInt(e.target.value) || 1)
                      }
                      min="1"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <button
                      onClick={() => adjustQuantity(1)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Total Price:
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      Rs.{calculateModalTotal()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleModalCancel}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalAddMedicine}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MedicineSearch;
