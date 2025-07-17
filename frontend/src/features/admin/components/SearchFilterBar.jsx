import React from 'react';
import { Search } from 'lucide-react';

export default function SearchFilterBar({
  searchTerm,
  setSearchTerm,
  filterValue,
  setFilterValue,
  filterOptions = [],
  placeholder = 'Search...',
  filterLabel = 'Filter',
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 mt-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder={placeholder}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Filter Dropdown */}
        <div className="w-full md:w-1/4">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          >
            {filterOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
