import { useState, useMemo } from 'react';

const DUMMY_PRODUCTS = [
  { id: 'p1', name: 'Paracetamol 500mg Tablets', description: 'Pain relief medication', price: 12.99, addedToStore: false },
  { id: 'p2', name: 'Vitamin D3 1000IU Capsules', description: 'Dietary supplement', price: 18.50, addedToStore: false },
  { id: 'p3', name: 'Ibuprofen 200mg Tablets', description: 'Anti-inflammatory', price: 8.75, addedToStore: false },
  { id: 'p4', name: 'Aspirin 325mg Tablets', description: 'Pain reliever', price: 9.99, stock: 45, status: 'In Stock', addedToStore: true },
  { id: 'p5', name: 'Multivitamin Tablets', description: 'Daily supplement', price: 24.99, stock: 8, status: 'Low Stock', addedToStore: true },
  { id: 'p6', name: 'Cough Syrup 100ml', description: 'Cough suppressant', price: 14.50, stock: 0, status: 'Out of Stock', addedToStore: true },
  { id: 'p7', name: 'Hand Sanitizer 250ml', description: 'Antiseptic gel', price: 6.99, stock: 120, status: 'In Stock', addedToStore: true },
];

export const useInventoryData = () => {
  const [products, setProducts] = useState(DUMMY_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');

  const totalProducts = products.length;
  const inStock = products.filter(p => p.addedToStore && p.stock > 10).length; // Assuming >10 is "In Stock" for storefront
  const lowStock = products.filter(p => p.addedToStore && p.stock <= 10 && p.stock > 0).length; // Assuming 1-10 is "Low Stock"
  const outOfStock = products.filter(p => p.addedToStore && p.stock === 0).length;

  // const inventorySummary = useMemo(() => ({
  //   totalProducts: totalProducts,
  //   inStock: inStock,
  //   lowStock: lowStock,
  //   outOfStock: outOfStock,
  // }), [totalProducts, inStock, lowStock, outOfStock]);

    const inventorySummary = useMemo(() => ([ // Changed to an array of objects
    { type: 'Total Products', count: totalProducts },
    { type: 'In Stock', count: inStock },
    { type: 'Low Stock', count: lowStock },
    { type: 'Out of Stock', count: outOfStock },
  ]), [totalProducts, inStock, lowStock, outOfStock]); // Dependencies for useMemo

  const searchResults = useMemo(() => {
    if (!searchTerm) {
      return products.filter(p => !p.addedToStore);
    }
    return products.filter(p =>
      !p.addedToStore &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  const currentStorefrontProducts = useMemo(() => {
    return products.filter(p => p.addedToStore);
  }, [products]);

  const addProductToStore = (id) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === id ? { ...product, addedToStore: true, stock: Math.floor(Math.random() * 50) + 1, status: 'In Stock' } : product
      )
    );
  };

  const removeProductFromStore = (id) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === id ? { ...product, addedToStore: false, stock: undefined, status: undefined } : product
      )
    );
  };

  const updateProductStock = (id, newStock) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === id) {
          let newStatus = '';
          if (newStock === 0) {
            newStatus = 'Out of Stock';
          } else if (newStock <= 10 && newStock > 0) {
            newStatus = 'Low Stock';
          } else {
            newStatus = 'In Stock';
          }
          return { ...product, stock: newStock, status: newStatus };
        }
        return product;
      })
    );
  };

  return {
    inventorySummary,
    searchTerm,
    setSearchTerm,
    searchResults,
    currentStorefrontProducts,
    addProductToStore,
    removeProductFromStore,
    updateProductStock,
  };
};