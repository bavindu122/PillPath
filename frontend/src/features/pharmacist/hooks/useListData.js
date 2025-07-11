import { useState, useEffect } from 'react';

export const useListData = (dataLoader, filterConfig = {}) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState(filterConfig.defaultSort || 'time');

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await dataLoader();
        setData(result);
      } catch (error) {
        console.error('Error loading data:', error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay for better UX
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, [dataLoader]);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    filterAndSortData();
  }, [data, searchTerm, filters, sortBy]);

  const filterAndSortData = () => {
    let filtered = [...data];

    // Apply search filter
    if (searchTerm && filterConfig.searchFields) {
      filtered = filtered.filter(item =>
        filterConfig.searchFields.some(field => {
          const value = getNestedValue(item, field);
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply custom filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        const filterFn = filterConfig.customFilters?.[key];
        if (filterFn) {
          filtered = filtered.filter(item => filterFn(item, value));
        } else {
          // Default filter: exact match
          filtered = filtered.filter(item => getNestedValue(item, key) === value);
        }
      }
    });

    // Apply sorting
    if (sortBy && filterConfig.sortFunctions?.[sortBy]) {
      filtered.sort(filterConfig.sortFunctions[sortBy]);
    }

    setFilteredData(filtered);
  };

  // Helper function to get nested object values (e.g., 'patient.name')
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((value, key) => value?.[key], obj);
  };

  // Filter update functions
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setSortBy(filterConfig.defaultSort || 'time');
  };

  const updateData = (updater) => {
    setData(prev => {
      return typeof updater === 'function' ? updater(prev) : updater;

    });
  };

  return {
    data,
    filteredData,
    isLoading,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    sortBy,
    setSortBy,
    clearFilters,
    updateData,
    totalCount: data.length,
    filteredCount: filteredData.length
  };
};

export default useListData;
