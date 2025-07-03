import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

const MedicineSearch = ({ onAddMedicine }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock medicine database
  const mockMedicines = [
    {
      id: 1,
      name: "Paracetamol",
      genericName: "Generic Name: Acetaminophen",
      price: 15.99,
      available: true,
      defaultQuantity: 30
    },
    {
      id: 2,
      name: "Amoxicillin",
      genericName: "Antibiotic",
      price: 24.50,
      available: true,
      defaultQuantity: 14
    }
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const results = mockMedicines.filter(medicine =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Medicines to Order</h3>
        
        {/* Search Input */}
        <div className="flex space-x-3 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search medicine name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            <span>{isSearching ? 'Searching...' : 'Search'}</span>
          </button>
        </div>

        {/* Default medicines display */}
        <div className="space-y-3">
          {mockMedicines.slice(0, 2).map((medicine) => (
            <div
              key={medicine.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{medicine.name}</h4>
                <p className="text-sm text-gray-600">{medicine.genericName}</p>
              </div>
              
              <button
                onClick={() => onAddMedicine(medicine)}
                disabled={!medicine.available}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <span>Add</span>
              </button>
            </div>
          ))}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Search Results</h4>
            <div className="space-y-3">
              {searchResults.map((medicine) => (
                <div
                  key={medicine.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{medicine.name}</h4>
                    <p className="text-sm text-gray-600">{medicine.genericName}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-medium text-gray-900">${medicine.price}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        medicine.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {medicine.available ? 'Available' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onAddMedicine(medicine)}
                    disabled={!medicine.available}
                    className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchTerm && searchResults.length === 0 && !isSearching && (
          <div className="text-center py-8 text-gray-500">
            No medicines found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineSearch;