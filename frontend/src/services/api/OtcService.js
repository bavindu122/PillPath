const API_BASE_URL = 'http://localhost:8080/api/otc';

export const otcService = {
  // Fetch all OTC products (all pharmacies combined)
  getAllProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all OTC products:', error);
      throw error;
    }
  },

  // Fetch products from a specific pharmacy
  getProductsByPharmacy: async (pharmacyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pharmacy/${pharmacyId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching products for pharmacy ${pharmacyId}:`, error);
      throw error;
    }
  },

  // Fetch a specific product by ID
  getProductById: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${productId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  },

  // Fetch pharmacies that have a specific product by product name
  getPharmaciesWithProduct: async (productName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${encodeURIComponent(productName)}/pharmacies`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching pharmacies for product ${productName}:`, error);
      throw error;
    }
  },

  // Search products by name
  searchProducts: async (searchTerm) => {
    try {
      const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error searching products:`, error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await fetch(`${API_BASE_URL}/category/${encodeURIComponent(category)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw error;
    }
  },
};