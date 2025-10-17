import { useState, useMemo, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080/api/otc';

// This function determines the stock status based on the stock amount
const calculateStatus = (stock) => {
  const stockNum = parseInt(stock);
  if (stockNum === 0) {
    return 'Out of Stock';
  } else if (stockNum <= 10) {
    return 'Low Stock';
  } else {
    return 'In Stock';
  }
};

// The hook now accepts a pharmacyId
export const useInventoryData = (pharmacyId) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all products for a specific pharmacy
  useEffect(() => {
    const fetchProducts = async () => {
      if (!pharmacyId) {
          setError("No pharmacy ID provided.");
          setLoading(false);
          return;
      }
      try {
        setLoading(true);
        setError(null);
        // Correctly form the URL using the passed pharmacyId
        const url = `${API_BASE_URL}/pharmacy/${pharmacyId}`;

        console.log('Fetching products from:', url);

        const response = await fetch(url);

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched products:', data);

        // Map over the fetched data to calculate and add the status for each product
        const productsWithStatus = data.map(product => ({
          ...product,
          status: calculateStatus(product.stock)
        }));

        setProducts(productsWithStatus);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pharmacyId]); // Dependency array to re-run effect when pharmacyId changes

  // ... (rest of the code is unchanged)

  const addNewProduct = async (newProduct) => {
    try {
      const url = `${API_BASE_URL}/pharmacy/${pharmacyId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to add new product.');
      }

      const addedProduct = await response.json();
      // Calculate and add the status to the new product before adding it to the state
      setProducts(prevProducts => [...prevProducts, { ...addedProduct, status: calculateStatus(addedProduct.stock) }]);
      return addedProduct;
    } catch (err) {
      console.error('Error adding new product:', err);
      throw err;
    }
  };


  const updateProduct = async (updatedProduct) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to update product.');
      }

      const data = await response.json();
      // Calculate and add the status to the updated product before updating the state
      const productWithStatus = { ...data, status: calculateStatus(data.stock) };
      setProducts(prevProducts => prevProducts.map(product => product.id === productWithStatus.id ? productWithStatus : product));
      return productWithStatus;
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  const removeProductFromStore = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product.');
      }

      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  const addProductToStore = (id) => {
    console.log(`Adding product with ID ${id} to store...`);
  };

  const updateProductStock = (id, newStock) => {
    console.log(`Updating product with ID ${id} stock to ${newStock}`);
  };

  const inventorySummary = useMemo(() => {
    const totalProducts = products.length;
    const inStock = products.filter(p => p.stock > 10).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = products.filter(p => p.stock === 0).length;

    return [
      { type: 'Total Products', count: totalProducts },
      { type: 'In Stock', count: inStock },
      { type: 'Low Stock', count: lowStock },
      { type: 'Out of Stock', count: outOfStock },
    ];
  }, [products]);

  const searchResults = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    const notInStoreProducts = products.filter(product => !product.addedToStore);

    return notInStoreProducts.filter(product =>
      product.name.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm, products]);

  const currentStorefrontProducts = products;

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
    updateProduct,
    loading,
    error,
    products
  };
};



















// import { useState, useMemo, useEffect } from 'react';

// const API_BASE_URL = 'http://localhost:8080/api/otc';

// // This function determines the stock status based on the stock amount
// const calculateStatus = (stock) => {
//   const stockNum = parseInt(stock);
//   if (stockNum === 0) {
//     return 'Out of Stock';
//   } else if (stockNum <= 10) {
//     return 'Low Stock';
//   } else {
//     return 'In Stock';
//   }
// };

// export const useInventoryData = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Fetch all products from backend
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         console.log('Fetching products from:', API_BASE_URL);

//         const response = await fetch(API_BASE_URL);

//         console.log('Response status:', response.status);

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log('Fetched products:', data);

//         // Map over the fetched data to calculate and add the status for each product
//         const productsWithStatus = data.map(product => ({
//           ...product,
//           status: calculateStatus(product.stock)
//         }));

//         setProducts(productsWithStatus);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // Add new product to backend and update state
//   const addNewProduct = async (newProduct) => {
//     try {
//       const url = `${API_BASE_URL}/pharmacy/${pharmacyId}`;
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newProduct),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add new product.');
//       }

//       const addedProduct = await response.json();
//       // Calculate and add the status to the new product before adding it to the state
//       setProducts(prevProducts => [...prevProducts, { ...addedProduct, status: calculateStatus(addedProduct.stock) }]);
//       return addedProduct;
//     } catch (err) {
//       console.error('Error adding new product:', err);
//       throw err;
//     }
//   };

//   const updateProduct = async (updatedProduct) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/${updatedProduct.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedProduct),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update product.');
//       }

//       const data = await response.json();
//       // Calculate and add the status to the updated product before updating the state
//       const productWithStatus = { ...data, status: calculateStatus(data.stock) };
//       setProducts(prevProducts => prevProducts.map(product => product.id === productWithStatus.id ? productWithStatus : product));
//       return productWithStatus;
//     } catch (err) {
//       console.error('Error updating product:', err);
//       throw err;
//     }
//   };

//   const removeProductFromStore = async (id) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/${id}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete product.');
//       }

//       setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
//     } catch (err) {
//       console.error('Error deleting product:', err);
//       throw err;
//     }
//   };

//   const addProductToStore = (id) => {
//     console.log(`Adding product with ID ${id} to store...`);
//   };

//   const updateProductStock = (id, newStock) => {
//     console.log(`Updating product with ID ${id} stock to ${newStock}`);
//   };

//   const inventorySummary = useMemo(() => {
//     const totalProducts = products.length;
//     const inStock = products.filter(p => p.stock > 10).length;
//     const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
//     const outOfStock = products.filter(p => p.stock === 0).length;

//     return [
//       { type: 'Total Products', count: totalProducts },
//       { type: 'In Stock', count: inStock },
//       { type: 'Low Stock', count: lowStock },
//       { type: 'Out of Stock', count: outOfStock },
//     ];
//   }, [products]);

//   const searchResults = useMemo(() => {
//     const lowercasedSearchTerm = searchTerm.toLowerCase();

//     const notInStoreProducts = products.filter(product => !product.addedToStore);

//     return notInStoreProducts.filter(product =>
//       product.name.toLowerCase().includes(lowercasedSearchTerm)
//     );
//   }, [searchTerm, products]);

//   const currentStorefrontProducts = products;

//   return {
//     inventorySummary,
//     searchTerm,
//     setSearchTerm,
//     searchResults,
//     currentStorefrontProducts,
//     addProductToStore,
//     removeProductFromStore,
//     updateProductStock,
//     addNewProduct,
//     updateProduct,
//     loading,
//     error,
//     products
//   };
// };
































// // import { useState, useMemo, useEffect } from 'react';

// // const API_BASE_URL = 'http://localhost:8080/api/otc';

// // export const useInventoryData = () => {
// //   const [products, setProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');

// //   // Fetch all products from backend
// //   useEffect(() => {
// //     const fetchProducts = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);

// //         console.log('Fetching products from:', API_BASE_URL);

// //         const response = await fetch(API_BASE_URL);

// //         console.log('Response status:', response.status);

// //         if (!response.ok) {
// //           throw new Error(`HTTP error! status: ${response.status}`);
// //         }

// //         const data = await response.json();
// //         console.log('Fetched products:', data);

// //         setProducts(data);
// //       } catch (error) {
// //         console.error('Error fetching products:', error);
// //         setError(error.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchProducts();
// //   }, []);

// //   // Add new product to backend and update state
// //   const addNewProduct = async (newProduct) => {
// //     try {
// //       const response = await fetch(API_BASE_URL, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(newProduct),
// //       });

// //       if (!response.ok) {
// //         throw new Error('Failed to add new product.');
// //       }

// //       const addedProduct = await response.json();
// //       setProducts(prevProducts => [...prevProducts, addedProduct]);
// //       return addedProduct;
// //     } catch (err) {
// //       console.error('Error adding new product:', err);
// //       throw err;
// //     }
// //   };

// //   const updateProduct = async (updatedProduct) => {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/${updatedProduct.id}`, {
// //         method: 'PUT',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(updatedProduct),
// //       });

// //       if (!response.ok) {
// //         throw new Error('Failed to update product.');
// //       }

// //       const data = await response.json();
// //       setProducts(prevProducts => prevProducts.map(product => product.id === data.id ? data : product));
// //       return data;
// //     } catch (err) {
// //       console.error('Error updating product:', err);
// //       throw err;
// //     }
// //   };

// //   const removeProductFromStore = async (id) => {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/${id}`, {
// //         method: 'DELETE',
// //       });

// //       if (!response.ok) {
// //         throw new Error('Failed to delete product.');
// //       }

// //       setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
// //     } catch (err) {
// //       console.error('Error deleting product:', err);
// //       throw err;
// //     }
// //   };

// //   const addProductToStore = (id) => {
// //     // This function is for UI logic, the backend should handle adding new items
// //     // This is currently a placeholder
// //     console.log(`Adding product with ID ${id} to store...`);
// //   };

// //   const updateProductStock = (id, newStock) => {
// //     // This is a placeholder for direct stock updates
// //     console.log(`Updating product with ID ${id} stock to ${newStock}`);
// //   };

// //   const inventorySummary = useMemo(() => {
// //     const totalProducts = products.length;
// //     const inStock = products.filter(p => p.stock > 10).length;
// //     const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
// //     const outOfStock = products.filter(p => p.stock === 0).length;

// //     return [
// //       { type: 'Total Products', count: totalProducts },
// //       { type: 'In Stock', count: inStock },
// //       { type: 'Low Stock', count: lowStock },
// //       { type: 'Out of Stock', count: outOfStock },
// //     ];
// //   }, [products]);
  
// //   // This is the key change. We are now filtering the products array
// //   // to only include products that are not added to the store (addedToStore is false)
// //   const searchResults = useMemo(() => {
// //     const lowercasedSearchTerm = searchTerm.toLowerCase();
    
// //     // Filter the products that are NOT yet in the store
// //     const notInStoreProducts = products.filter(product => !product.addedToStore);
    
// //     // Now, filter those results by the search term
// //     return notInStoreProducts.filter(product =>
// //       product.name.toLowerCase().includes(lowercasedSearchTerm)
// //     );
// //   }, [searchTerm, products]);
  
// //   // This is a placeholder for current storefront products, it should be the same as all products
// //   const currentStorefrontProducts = products;

// //   return {
// //     inventorySummary,
// //     searchTerm,
// //     setSearchTerm,
// //     searchResults,
// //     currentStorefrontProducts,
// //     addProductToStore,
// //     removeProductFromStore,
// //     updateProductStock,
// //     addNewProduct,
// //     updateProduct,
// //     loading,
// //     error,
// //     products
// //   };
// // };


































// // import { useState, useMemo, useEffect } from 'react';

// // const API_BASE_URL = 'http://localhost:8080/api/otc';

// // export const useInventoryData = () => {
// //   const [products, setProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');

// //   // Fetch all products from backend
// //   useEffect(() => {
// //     const fetchProducts = async () => {
// //       try {
// //         setLoading(true);
// //         setError(null);
        
// //         console.log('Fetching products from:', API_BASE_URL);
        
// //         const response = await fetch(API_BASE_URL);
        
// //         console.log('Response status:', response.status);
        
// //         if (!response.ok) {
// //           throw new Error(`HTTP error! status: ${response.status}`);
// //         }
        
// //         const data = await response.json();
// //         console.log('Fetched products:', data);
        
// //         setProducts(data);
// //       } catch (error) {
// //         console.error('Error fetching products:', error);
// //         setError(error.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchProducts();
// //   }, []);

// //   // Add new product to backend and update state
// //   const addNewProduct = async (newProduct) => {
// //     try {
// //       const response = await fetch(API_BASE_URL, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(newProduct),
// //       });

// //       if (!response.ok) {
// //         throw new Error('Failed to add new product.');
// //       }

// //       const addedProduct = await response.json();
// //       setProducts(prevProducts => [...prevProducts, addedProduct]);
// //       return addedProduct;
// //     } catch (err) {
// //       console.error('Error adding new product:', err);
// //       throw err;
// //     }
// //   };

// //   const updateProduct = async (updatedProduct) => {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/${updatedProduct.id}`, {
// //         method: 'PUT',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(updatedProduct),
// //       });

// //       if (!response.ok) {
// //         throw new Error('Failed to update product.');
// //       }
      
// //       const data = await response.json();
// //       setProducts(prevProducts => prevProducts.map(product => product.id === data.id ? data : product));
// //       return data;
// //     } catch (err) {
// //       console.error('Error updating product:', err);
// //       throw err;
// //     }
// //   };

// //   const removeProductFromStore = async (id) => {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/${id}`, {
// //         method: 'DELETE',
// //       });

// //       if (!response.ok) {
// //         throw new Error('Failed to delete product.');
// //       }
      
// //       setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
// //     } catch (err) {
// //       console.error('Error deleting product:', err);
// //       throw err;
// //     }
// //   };

// //   const addProductToStore = (id) => {
// //     // This function is for UI logic, the backend should handle adding new items
// //     // This is currently a placeholder
// //     console.log(`Adding product with ID ${id} to store...`);
// //   };

// //   const updateProductStock = (id, newStock) => {
// //     // This is a placeholder for direct stock updates
// //     console.log(`Updating product with ID ${id} stock to ${newStock}`);
// //   };

// //   const inventorySummary = useMemo(() => {
// //     const totalProducts = products.length;
// //     const inStock = products.filter(p => p.stock > 10).length;
// //     const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
// //     const outOfStock = products.filter(p => p.stock === 0).length;

// //     return [
// //       { type: 'Total Products', count: totalProducts },
// //       { type: 'In Stock', count: inStock },
// //       { type: 'Low Stock', count: lowStock },
// //       { type: 'Out of Stock', count: outOfStock },
// //     ];
// //   }, [products]);

// //   const searchResults = useMemo(() => {
// //     const lowercasedSearchTerm = searchTerm.toLowerCase();
// //     const allProducts = [...products];

// //     return allProducts.filter(product =>
// //       product.name.toLowerCase().includes(lowercasedSearchTerm)
// //     );
// //   }, [searchTerm, products]);
  
// //   // This is a placeholder for current storefront products, it should be the same as all products
// //   const currentStorefrontProducts = products;

// //   return {
// //     inventorySummary,
// //     searchTerm,
// //     setSearchTerm,
// //     searchResults,
// //     currentStorefrontProducts,
// //     addProductToStore,
// //     removeProductFromStore,
// //     updateProductStock,
// //     addNewProduct,
// //     updateProduct,
// //     loading,
// //     error,
// //     products
// //   };
// // };






































