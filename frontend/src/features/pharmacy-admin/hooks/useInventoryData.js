import { useState, useMemo } from 'react';

// Fix image import paths to be consistent
import paracetamolImg from '../../../assets/img/meds/paracetamol.webp';
import vitaminCImg from '../../../assets/img/meds/Vitamin_c.jpg';
import ibuprofenImg from '../../../assets/img/meds/Ibuprofen.jpg';
import aspirinImg from '../../../assets/img/meds/Panadol.jpg';
import multivitaminImg from '../../../assets/img/meds/allergy_relief.jpg';
import coughSyrupImg from '../../../assets/img/meds/cough_syrup.jpg';
import sanitizerImg from '../../../assets/img/meds/Antacid.jpg';

const DUMMY_PRODUCTS = [
  { 
    id: 'p1', 
    name: 'Paracetamol 500mg Tablets', 
    description: 'Pain relief medication', 
    price: 12.99, 
    addedToStore: false,
    imageUrl: paracetamolImg
  },
  { 
    id: 'p2', 
    name: 'Vitamin D3 1000IU Capsules', 
    description: 'Dietary supplement', 
    price: 18.50, 
    addedToStore: false,
    imageUrl: vitaminCImg 
  },
  { 
    id: 'p3', 
    name: 'Ibuprofen 200mg Tablets', 
    description: 'Anti-inflammatory', 
    price: 8.75, 
    addedToStore: false,
    imageUrl: ibuprofenImg
  },
  { 
    id: 'p4', 
    name: 'Aspirin 325mg Tablets', 
    description: 'Pain reliever', 
    price: 9.99, 
    stock: 45, 
    status: 'In Stock', 
    addedToStore: true,
    imageUrl: aspirinImg
  },
  { 
    id: 'p5', 
    name: 'Multivitamin Tablets', 
    description: 'Daily supplement', 
    price: 24.99, 
    stock: 8, 
    status: 'Low Stock', 
    addedToStore: true,
    imageUrl: multivitaminImg
  },
  { 
    id: 'p6', 
    name: 'Cough Syrup 100ml', 
    description: 'Cough suppressant', 
    price: 14.50, 
    stock: 0, 
    status: 'Out of Stock', 
    addedToStore: true,
    imageUrl: coughSyrupImg
  },
  { 
    id: 'p7', 
    name: 'Hand Sanitizer 250ml', 
    description: 'Antiseptic gel', 
    price: 6.99, 
    stock: 120, 
    status: 'In Stock', 
    addedToStore: true,
    imageUrl: sanitizerImg
  },
];

export const useInventoryData = () => {
  const [products, setProducts] = useState(DUMMY_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');

  // Add function to add new products to the main products array
  const addNewProduct = (newProduct) => {
    const productWithDefaults = {
      ...newProduct,
      addedToStore: false, // New products start as not added to store
      id: `custom_${Date.now()}`, // Generate unique ID
    };
    setProducts(prevProducts => [...prevProducts, productWithDefaults]);
  };

  // Add function to update existing products
  const updateProduct = (updatedProduct) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const totalProducts = products.filter(p => p.addedToStore).length;
  const inStock = products.filter(p => p.addedToStore && p.stock > 10).length;
  const lowStock = products.filter(p => p.addedToStore && p.stock <= 10 && p.stock > 0).length;
  const outOfStock = products.filter(p => p.addedToStore && p.stock === 0).length;

  const inventorySummary = useMemo(() => ([
    { type: 'Total Products', count: totalProducts },
    { type: 'In Stock', count: inStock },
    { type: 'Low Stock', count: lowStock },
    { type: 'Out of Stock', count: outOfStock },
  ]), [totalProducts, inStock, lowStock, outOfStock]);

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
        product.id === id ? { 
          ...product, 
          addedToStore: true, 
          stock: product.stock || Math.floor(Math.random() * 50) + 1, 
          status: product.status || 'In Stock'
        } : product
      )
    );
  };

  const removeProductFromStore = (id) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === id ? { 
          ...product, 
          addedToStore: false, 
          stock: undefined, 
          status: undefined 
        } : product
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
    addNewProduct,
    updateProduct, // Export the new update function
  };
};







