import { useState, useEffect } from 'react';

export const useInventoryData = () => {
  const [data, setData] = useState({
    products: [],
    categories: [],
    totalProducts: 0,
    lowStockCount: 0,
    loading: true,
    error: null,
    searchTerm: '',
    selectedCategory: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true }));
      
      // Replace with actual API calls
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);

      const lowStockCount = productsResponse.filter(product => product.quantity <= product.lowStockThreshold).length;

      setData(prev => ({
        ...prev,
        products: productsResponse,
        categories: categoriesResponse,
        totalProducts: productsResponse.length,
        lowStockCount,
        loading: false,
        error: null
      }));
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  // Mock API functions - replace with actual API calls
  const fetchProducts = () => {
    return Promise.resolve([
      {
        id: 1,
        name: "Paracetamol 500mg",
        category: "Pain Relief",
        price: 12.99,
        quantity: 150,
        lowStockThreshold: 20,
        sku: "PAR500-001",
        manufacturer: "PharmaCorp",
        expiryDate: "2025-12-31",
        batchNumber: "BC001",
        image: "/src/assets/img/meds/paracetamol.webp",
        description: "Effective pain and fever relief"
      },
      {
        id: 2,
        name: "Ibuprofen 400mg",
        category: "Pain Relief",
        price: 15.50,
        quantity: 8,
        lowStockThreshold: 15,
        sku: "IBU400-002",
        manufacturer: "MediCare",
        expiryDate: "2025-08-15",
        batchNumber: "BC002",
        image: "/src/assets/img/meds/Ibuprofen.jpg",
        description: "Anti-inflammatory pain relief"
      },
      {
        id: 3,
        name: "Vitamin C 1000mg",
        category: "Vitamins",
        price: 18.75,
        quantity: 75,
        lowStockThreshold: 25,
        sku: "VIT1000-003",
        manufacturer: "VitaLife",
        expiryDate: "2026-03-20",
        batchNumber: "BC003",
        image: "/src/assets/img/meds/Vitamin_c.jpg",
        description: "Immune system support"
      },
      {
        id: 4,
        name: "Cough Syrup 200ml",
        category: "Respiratory",
        price: 22.30,
        quantity: 5,
        lowStockThreshold: 10,
        sku: "CSY200-004",
        manufacturer: "RespiCare",
        expiryDate: "2025-09-10",
        batchNumber: "BC004",
        image: "/src/assets/img/meds/cough_syrup.jpg",
        description: "Effective cough relief"
      },
      {
        id: 5,
        name: "Allergy Relief 10mg",
        category: "Allergy",
        price: 25.99,
        quantity: 120,
        lowStockThreshold: 30,
        sku: "ALL010-005",
        manufacturer: "AllerFree",
        expiryDate: "2025-11-25",
        batchNumber: "BC005",
        image: "/src/assets/img/meds/allergy_relief.jpg",
        description: "24-hour allergy relief"
      },
      {
        id: 6,
        name: "Antacid Tablets",
        category: "Digestive",
        price: 8.99,
        quantity: 200,
        lowStockThreshold: 50,
        sku: "ANT001-006",
        manufacturer: "DigestEase",
        expiryDate: "2026-01-15",
        batchNumber: "BC006",
        image: "/src/assets/img/meds/Antacid.jpg",
        description: "Fast-acting heartburn relief"
      }
    ]);
  };

  const fetchCategories = () => {
    return Promise.resolve([
      { id: 'all', name: 'All Categories', count: 6 },
      { id: 'pain-relief', name: 'Pain Relief', count: 2 },
      { id: 'vitamins', name: 'Vitamins', count: 1 },
      { id: 'respiratory', name: 'Respiratory', count: 1 },
      { id: 'allergy', name: 'Allergy', count: 1 },
      { id: 'digestive', name: 'Digestive', count: 1 }
    ]);
  };

  const updateProduct = async (productId, updates) => {
    try {
      setIsUpdating(true);
      
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      setData(prev => ({
        ...prev,
        products: prev.products.map(product =>
          product.id === productId
            ? { ...product, ...updates }
            : product
        )
      }));
      
      setEditingProduct(null);
      setIsUpdating(false);
      return true;
    } catch (error) {
      setIsUpdating(false);
      throw new Error('Failed to update product');
    }
  };

  const setSearchTerm = (term) => {
    setData(prev => ({ ...prev, searchTerm: term }));
  };

  const setSelectedCategory = (category) => {
    setData(prev => ({ ...prev, selectedCategory: category }));
  };

  const setSortBy = (field) => {
    setData(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter and sort products
  const filteredProducts = data.products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(data.searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(data.searchTerm.toLowerCase());
      const matchesCategory = data.selectedCategory === 'all' || 
                             product.category.toLowerCase().replace(' ', '-') === data.selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const direction = data.sortOrder === 'asc' ? 1 : -1;
      if (data.sortBy === 'name') {
        return direction * a.name.localeCompare(b.name);
      } else if (data.sortBy === 'price') {
        return direction * (a.price - b.price);
      } else if (data.sortBy === 'quantity') {
        return direction * (a.quantity - b.quantity);
      } else if (data.sortBy === 'category') {
        return direction * a.category.localeCompare(b.category);
      }
      return 0;
    });

  return {
    ...data,
    filteredProducts,
    editingProduct,
    isUpdating,
    setEditingProduct,
    updateProduct,
    setSearchTerm,
    setSelectedCategory,
    setSortBy,
    refetch: fetchInventoryData
  };
};
