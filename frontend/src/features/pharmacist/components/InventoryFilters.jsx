import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import '../pages/index-pharmacist.css';

const InventoryFilters = ({ 
  searchTerm, 
  selectedCategory, 
  categories, 
  onSearchChange, 
  onCategoryChange 
}) => {
  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all';

  return (
    <div className="inventory-filters-card border rounded-xl p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--pharma-gray-400)' }} />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{
                borderColor: 'var(--pharma-border)',
                backgroundColor: 'var(--pharma-gray-50)',
                color: 'var(--pharma-text-dark)',
                '--tw-ring-color': 'var(--pharma-blue)'
              }}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="lg:w-64">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--pharma-gray-400)' }} />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2"
              style={{
                borderColor: 'var(--pharma-border)',
                backgroundColor: 'var(--pharma-gray-50)',
                color: 'var(--pharma-text-dark)',
                '--tw-ring-color': 'var(--pharma-blue)'
              }}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors hover:opacity-80"
            style={{
              borderColor: 'var(--pharma-red-200)',
              backgroundColor: 'var(--pharma-red-50)',
              color: 'var(--pharma-red-600)'
            }}
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--pharma-border)' }}>
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'var(--pharma-blue-100)', color: 'var(--pharma-blue-800)' }}>
                Search: "{searchTerm}"
                <button onClick={() => onSearchChange('')} className="ml-1 hover:opacity-70">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'var(--pharma-green-100)', color: 'var(--pharma-green-800)' }}>
                Category: {categories.find(c => c.id === selectedCategory)?.name}
                <button onClick={() => onCategoryChange('all')} className="ml-1 hover:opacity-70">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryFilters;
