import React, { useState, useEffect, useCallback } from 'react';
import { X, Search, MapPin, Clock, Star, Phone } from 'lucide-react';
import api from '../../services/api';
import { useChat } from '../../contexts/ChatContextLive';
import { useAuth } from '../../hooks/useAuth';

const PharmacySearchModal = ({ isOpen, onClose, onPharmacySelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { startChat, searchPharmacies: searchPharmaciesFromContext } = useChat();
  const { user, token, userType } = useAuth();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search pharmacies
  const searchPharmacies = useCallback(async (query) => {
    if (!query.trim()) {
      setPharmacies([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Use the search function from chat context if available (for mock mode)
      if (searchPharmaciesFromContext) {
        const results = await searchPharmaciesFromContext(query);
        console.log('Search results from context:', results);
        setPharmacies(Array.isArray(results) ? results : []);
      } else {
        // Fallback to API call
        const response = await api.get(`/pharmacies/search?name=${encodeURIComponent(query)}`);
        console.log('Search results from API:', response);
        
        // Handle different response structures
        let pharmacyData = [];
        if (response?.data) {
          if (Array.isArray(response.data)) {
            pharmacyData = response.data;
          } else if (response.data.pharmacies && Array.isArray(response.data.pharmacies)) {
            pharmacyData = response.data.pharmacies;
          } else if (response.data.content && Array.isArray(response.data.content)) {
            pharmacyData = response.data.content;
          }
        }
        
        setPharmacies(pharmacyData);
      }
    } catch (err) {
      setError('Failed to search pharmacies');
      console.error('Search error:', err);
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  }, [searchPharmaciesFromContext]);

  // Effect to search when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      searchPharmacies(debouncedQuery);
    }
  }, [debouncedQuery, searchPharmacies]);

  // Handle pharmacy selection and start chat
  const handlePharmacySelect = async (pharmacy) => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Log authentication state
      console.log('Auth state:', { user, token, userType });
      console.log('Token in localStorage:', localStorage.getItem('auth_token'));
      console.log('Attempting to start chat with pharmacy:', pharmacy);
      
      // Check if user is authenticated
      if (!user || !token) {
        setError('Please log in to start chatting with pharmacies');
        return;
      }
      
      // Ensure we have a valid pharmacy ID
      const pharmacyId = pharmacy?.id || pharmacy?.pharmacyId || pharmacy?.uuid;
      if (!pharmacyId) {
        throw new Error('Invalid pharmacy data - missing ID');
      }
      
      console.log('Starting chat with pharmacy ID:', pharmacyId);
      
      try {
        const chat = await startChat(pharmacyId);
        console.log('Chat started successfully:', chat);
        
        onPharmacySelect?.(pharmacy, chat);
        onClose();
      } catch (apiError) {
        console.error('API Error details:', {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          message: apiError.message
        });
        
        // If it's a 403/401 error or any API error, show detailed info for debugging
        if (apiError.response?.status === 403) {
          setError(`Access denied (403). This usually means:
• The chat endpoint requires different permissions
• Your user role (${userType}) might not be allowed to start chats
• The backend /chats/start endpoint may not be properly configured for customers
• Check backend logs for more details`);
        } else if (apiError.response?.status === 401) {
          setError('Authentication failed (401). Please log out and log back in.');
        } else if (apiError.response?.status === 404) {
          setError('Chat endpoint not found (404). The /chats/start endpoint may not be implemented yet.');
        } else if (apiError.response?.status >= 500) {
          setError(`Server error (${apiError.response.status}). Please check backend logs.`);
        } else {
          setError(`Failed to start chat: ${apiError.response?.data?.message || apiError.message}`);
        }
        
        console.log('Available data for debugging:', {
          userType,
          userId: user?.id,
          pharmacyId,
          tokenPresent: !!token,
          apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"
        });
      }
      
    } catch (error) {
      console.error('Failed to start chat:', error);
      setError(`Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setPharmacies([]);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Search Pharmacies</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search pharmacies by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          
          {/* Debug info - remove this in production */}
          {user && (
            <div className="mt-2 text-xs text-gray-500">
              Logged in as: {user?.name || user?.firstName} ({userType}) | 
              API: {import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Searching pharmacies...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && searchQuery && pharmacies.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No pharmacies found for "{searchQuery}"</p>
            </div>
          )}

          {/* Initial State */}
          {!searchQuery && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Start typing to search for pharmacies</p>
            </div>
          )}

          {/* Pharmacy Results */}
          {pharmacies.length > 0 && (
            <div className="space-y-3">
              {pharmacies.map((pharmacy, index) => (
                <PharmacyCard
                  key={pharmacy.id || pharmacy.pharmacyId || pharmacy.uuid || `pharmacy-${index}`}
                  pharmacy={pharmacy}
                  onSelect={handlePharmacySelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Pharmacy Card Component
const PharmacyCard = ({ pharmacy, onSelect }) => {
  // Safely extract values with fallbacks
  const pharmacyName = pharmacy?.name || pharmacy?.pharmacyName || 'Unknown Pharmacy';
  const pharmacyAddress = pharmacy?.address || pharmacy?.location || '';
  const pharmacyPhone = pharmacy?.phone || pharmacy?.phoneNumber || pharmacy?.contactNumber || '';
  const pharmacyHours = pharmacy?.operatingHours || pharmacy?.hours || '';
  const pharmacyRating = pharmacy?.rating ? Number(pharmacy.rating) : null;
  const pharmacyReviews = pharmacy?.reviewCount || pharmacy?.reviews || 0;
  const pharmacyDescription = pharmacy?.description || '';
  const isPharmacyOpen = pharmacy?.isOpen !== undefined ? pharmacy.isOpen : true; // Default to open if not specified

  return (
    <div
      onClick={() => onSelect(pharmacy)}
      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{pharmacyName}</h3>
          
          {/* Address */}
          {pharmacyAddress && (
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{pharmacyAddress}</span>
            </div>
          )}

          {/* Phone */}
          {pharmacyPhone && (
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <Phone className="w-4 h-4 mr-1" />
              <span>{pharmacyPhone}</span>
            </div>
          )}

          {/* Operating Hours */}
          {pharmacyHours && (
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <Clock className="w-4 h-4 mr-1" />
              <span>{typeof pharmacyHours === 'string' ? pharmacyHours : 'Operating hours available'}</span>
            </div>
          )}

          {/* Rating */}
          {pharmacyRating && (
            <div className="flex items-center text-gray-600 text-sm">
              <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
              <span>{pharmacyRating.toFixed(1)} ({pharmacyReviews} reviews)</span>
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div className="ml-4">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              isPharmacyOpen
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isPharmacyOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Description */}
      {pharmacyDescription && (
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
          {pharmacyDescription}
        </p>
      )}

      {/* Action Button */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          Start Chat →
        </button>
      </div>
    </div>
  );
};

export default PharmacySearchModal;