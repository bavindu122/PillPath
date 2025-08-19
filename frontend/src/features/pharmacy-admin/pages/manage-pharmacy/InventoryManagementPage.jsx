import React, { useState } from "react";
import { useInventoryData } from "../../hooks/useInventoryData";
import InventorySummaryCard from "../../components/InventorySettings/InventorySummaryCard";
import SearchBar from "../../components/InventorySettings/SearchBar";
import SearchProductCard from "../../components/InventorySettings/SearchProductCard";
import CurrentStorefrontProductCard from "../../components/InventorySettings/CurrentStorefrontProductCard";
import AddItem from "../../components/InventorySettings/AddItem";

const InventoryManagementPage = () => {
  const {
    inventorySummary,
    searchTerm,
    setSearchTerm,
    currentStorefrontProducts,
    addProductToStore,
    removeProductFromStore,
    updateProductStock,
    addNewProduct,
    updateProduct,
    loading,
    error,
    products
  } = useInventoryData();

  // The searchResults are explicitly set to an empty array to prevent
  // any products from the main database from being displayed in the search section.
  const searchResults = [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Debug logging
  console.log('Debug - All products:', products);
  console.log('Debug - Search results:', searchResults);
  console.log('Debug - Storefront products:', currentStorefrontProducts);
  console.log('Debug - Loading:', loading);
  console.log('Debug - Error:', error);

  // Show notification for 3 seconds
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddNewProduct = async (newProduct) => {
    try {
      await addNewProduct(newProduct);
      showNotification('Product added successfully!');
    } catch (err) {
      showNotification('Failed to add product.', 'error');
    }
    setIsModalOpen(false);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      await updateProduct(updatedProduct);
      showNotification('Product updated successfully!');
    } catch (err) {
      showNotification('Failed to update product.', 'error');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Inventory Management</h1>

      {notification && (
        <div className={`p-4 mb-4 text-sm rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {notification.message}
        </div>
      )}


      <InventorySummaryCard inventoryStats={inventorySummary} />

            {/* New container for the Add New Item button */}
      <div className="flex justify-end mb-6 mt-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Add New Item
        </button>
      </div>



      <div className="flex flex-col md:flex-row md:space-x-6">
        {/* Search Section */}
        <div className="md:w-1/2 bg-white rounded-lg shadow p-6 mb-6 md:mb-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Product Search</h2>
          </div>
          <p className="text-gray-600 mb-4">Search for products to add to your storefront</p>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading products...</p>
            </div>
          ) : error ? (
            <p className="text-center text-red-500 py-8">Error: {error}</p>
          ) : (
            <div className="space-y-4 mt-4">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <SearchProductCard
                    key={product.id}
                    product={product}
                    onAddToStore={() => addProductToStore(product.id)}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No products found or all products are in storefront.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Current Storefront Section */}
        <div className="md:w-1/2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Current Storefront Products
          </h2>
          <p className="text-gray-600 mb-4">Manage your listed OTC products</p>
          <div className="space-y-4">
            {products.length > 0 ? (
              products.map((product) => (
                <CurrentStorefrontProductCard
                  key={product.id}
                  product={product}
                  onRemoveFromStore={removeProductFromStore}
                  onUpdateProduct={handleUpdateProduct}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No products in your storefront yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <AddItem
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddNewProduct}
      />
    </div>
  );
};

export default InventoryManagementPage;








































// import React, { useState } from "react";
// import { useInventoryData } from "../../hooks/useInventoryData";
// import InventorySummaryCard from "../../components/InventorySettings/InventorySummaryCard";
// import SearchBar from "../../components/InventorySettings/SearchBar";
// import SearchProductCard from "../../components/InventorySettings/SearchProductCard";
// import CurrentStorefrontProductCard from "../../components/InventorySettings/CurrentStorefrontProductCard";
// import AddItem from "../../components/InventorySettings/AddItem";

// const InventoryManagementPage = () => {
//   const {
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
//   } = useInventoryData();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [notification, setNotification] = useState(null);

//   // Debug logging
//   console.log('Debug - All products:', products);
//   console.log('Debug - Search results:', searchResults);
//   console.log('Debug - Storefront products:', currentStorefrontProducts);
//   console.log('Debug - Loading:', loading);
//   console.log('Debug - Error:', error);

//   // Show notification for 3 seconds
//   const showNotification = (message, type = 'success') => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const handleAddNewProduct = async (newProduct) => {
//     try {
//       await addNewProduct(newProduct);
//       showNotification('Product added successfully!');
//     } catch (err) {
//       showNotification('Failed to add product.', 'error');
//     }
//     setIsModalOpen(false);
//   };

//   const handleUpdateProduct = async (updatedProduct) => {
//     try {
//       await updateProduct(updatedProduct);
//       showNotification('Product updated successfully!');
//     } catch (err) {
//       showNotification('Failed to update product.', 'error');
//     }
//   };

//   return (
//     <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-900 mb-6">Inventory Management</h1>

//       {notification && (
//         <div className={`p-4 mb-4 text-sm rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//           {notification.message}
//         </div>
//       )}

//       {/* Summary Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <InventorySummaryCard inventoryStats={inventorySummary} />
//       </div>

//       <div className="flex flex-col md:flex-row md:space-x-6">
//         {/* Search Section */}
//         <div className="md:w-1/2 bg-white rounded-lg shadow p-6 mb-6 md:mb-0">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-gray-800">Product Search</h2>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
//             >
//               Add New Item
//             </button>
//           </div>
//           <p className="text-gray-600 mb-4">Search for products to add to your storefront</p>
//           <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

//           {loading ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
//               <p className="mt-2 text-gray-500">Loading products...</p>
//             </div>
//           ) : error ? (
//             <p className="text-center text-red-500 py-8">Error: {error}</p>
//           ) : (
//             <div className="space-y-4 mt-4">
//               {searchResults.length > 0 ? (
//                 searchResults.map((product) => (
//                   <SearchProductCard
//                     key={product.id}
//                     product={product}
//                     onAddToStore={() => addProductToStore(product.id)}
//                   />
//                 ))
//               ) : (
//                 <p className="text-center text-gray-500">
//                   No products found or all products are in storefront.
//                 </p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Current Storefront Section */}
//         <div className="md:w-1/2 bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Current Storefront Products
//           </h2>
//           <p className="text-gray-600 mb-4">Manage your listed OTC products</p>
//           <div className="space-y-4">
//             {products.length > 0 ? (
//               products.map((product) => (
//                 <CurrentStorefrontProductCard
//                   key={product.id}
//                   product={product}
//                   onRemoveFromStore={removeProductFromStore}
//                   onUpdateProduct={handleUpdateProduct}
//                 />
//               ))
//             ) : (
//               <p className="text-center text-gray-500">
//                 No products in your storefront yet.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Add Item Modal */}
//       <AddItem
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleAddNewProduct}
//       />
//     </div>
//   );
// };

// export default InventoryManagementPage;














































// import React, { useState } from "react";
// import { useInventoryData } from "../../hooks/useInventoryData";
// import InventorySummaryCard from "../../components/InventorySettings/InventorySummaryCard";
// import SearchBar from "../../components/InventorySettings/SearchBar";
// import SearchProductCard from "../../components/InventorySettings/SearchProductCard";
// import CurrentStorefrontProductCard from "../../components/InventorySettings/CurrentStorefrontProductCard";
// import AddItem from "../../components/InventorySettings/AddItem";

// const InventoryManagementPage = () => {
//   const {
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
//   } = useInventoryData();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [notification, setNotification] = useState(null);

//   // Debug logging
//   console.log('Debug - All products:', products);
//   console.log('Debug - Search results:', searchResults);
//   console.log('Debug - Storefront products:', currentStorefrontProducts);
//   console.log('Debug - Loading:', loading);
//   console.log('Debug - Error:', error);

//   // Show notification for 3 seconds
//   const showNotification = (message, type = 'success') => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const handleAddNewProduct = async (newProduct) => {
//     try {
//       await addNewProduct(newProduct);
//       setIsModalOpen(false);
//       showNotification('Product added to storefront successfully!', 'success');
//     } catch (error) {
//       console.error('Failed to add product:', error);
//       showNotification('Failed to add product. Please try again.', 'error');
//       throw error;
//     }
//   };

//   const handleUpdateProduct = async (updatedProduct) => {
//     try {
//       await updateProduct(updatedProduct);
//       showNotification('Product updated successfully!', 'success');
//     } catch (error) {
//       console.error('Failed to update product:', error);
//       showNotification('Failed to update product. Please try again.', 'error');
//       throw error;
//     }
//   };

//   const handleAddToStore = async (productId) => {
//     try {
//       await addProductToStore(productId);
//       showNotification('Product added to storefront!', 'success');
//     } catch (error) {
//       console.error('Failed to add product to store:', error);
//       showNotification('Failed to add product to storefront. Please try again.', 'error');
//     }
//   };

//   const handleRemoveFromStore = async (productId) => {
//     try {
//       await removeProductFromStore(productId);
//       showNotification('Product removed from storefront!', 'success');
//     } catch (error) {
//       console.error('Failed to remove product from store:', error);
//       showNotification('Failed to remove product from storefront. Please try again.', 'error');
//     }
//   };

//   const handleUpdateStock = async (productId, newStock) => {
//     try {
//       await updateProductStock(productId, newStock);
//       showNotification('Stock updated successfully!', 'success');
//     } catch (error) {
//       console.error('Failed to update stock:', error);
//       showNotification('Failed to update stock. Please try again.', 'error');
//     }
//   };

//   // Show loading state
//   if (loading && products.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//         <span className="ml-3 text-gray-600">Loading inventory...</span>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Notification */}
//       {notification && (
//         <div
//           className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
//             notification.type === 'success'
//               ? 'bg-green-500 text-white'
//               : 'bg-red-500 text-white'
//           }`}
//         >
//           <div className="flex items-center">
//             {notification.type === 'success' ? (
//               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//               </svg>
//             ) : (
//               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             )}
//             {notification.message}
//           </div>
//         </div>
//       )}

//       {/* Error Display */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//           <div className="flex">
//             <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             <div>
//               <h3 className="text-sm font-medium text-red-800">Error loading inventory</h3>
//               <p className="text-sm text-red-700 mt-1">{error}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <h1 className="text-3xl font-bold text-gray-900 mb-2">
//         Inventory Management
//       </h1>
//       <p className="text-gray-600 mb-8">
//         Update stock levels and manage your OTC storefront
//       </p>

//       {/* Inventory Summary Cards */}
//       <InventorySummaryCard inventoryStats={inventorySummary} />

//       <div className="flex justify-end mb-6 mt-6">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           disabled={loading}
//           className="px-6 py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//         >
//           {loading ? (
//             <div className="flex items-center">
//               <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Loading...
//             </div>
//           ) : (
//             'Add New Product'
//           )}
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//         {/* Add New Product Section - CHANGED: Now shows instructions */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Search External Products
//           </h2>
//           <p className="text-gray-600 mb-4">
//             Search for additional products to add to your storefront
//           </p>
//           <div className="mb-4">
//             <SearchBar 
//               searchTerm={searchTerm} 
//               setSearchTerm={setSearchTerm}
//               disabled={loading}
//             />
//           </div>
//           <div className="space-y-4">
//             {loading && searchResults.length === 0 ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
//               </div>
//             ) : searchResults.length > 0 ? (
//               searchResults.map((product) => (
//                 <SearchProductCard
//                   key={product.id}
//                   product={product}
//                   onAddToStore={handleAddToStore}
//                 />
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 {!searchTerm ? (
//                   <div className="text-gray-500">
//                     <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                     </svg>
//                     <p className="text-lg font-medium">Search for products</p>
//                     <p className="text-sm mt-1">Enter a product name to search for additional products</p>
//                   </div>
//                 ) : (
//                   <p className="text-gray-500">No products found matching "{searchTerm}"</p>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Current Storefront Section - CHANGED: Shows all database products */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Current Storefront
//           </h2>
//           <p className="text-gray-600 mb-4">Manage your OTC products</p>
//           <div className="space-y-4">
//             {loading && currentStorefrontProducts.length === 0 ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
//               </div>
//             ) : currentStorefrontProducts.length > 0 ? (
//               currentStorefrontProducts.map((product) => (
//                 <CurrentStorefrontProductCard
//                   key={product.id}
//                   product={product}
//                   onRemoveFromStore={handleRemoveFromStore}
//                   onUpdateProduct={handleUpdateProduct}
//                   onUpdateStock={handleUpdateStock}
//                 />
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <div className="text-gray-500">
//                   <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                   </svg>
//                   <p className="text-lg font-medium">No products in storefront</p>
//                   <p className="text-sm mt-1">Click "Add New Product" to add your first product</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Add Item Modal */}
//       <AddItem
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleAddNewProduct}
//       />
//     </>
//   );
// };

// export default InventoryManagementPage;


































// import React, { useState } from "react";
// import { useInventoryData } from "../../hooks/useInventoryData";
// import InventorySummaryCard from "../../components/InventorySettings/InventorySummaryCard";
// import SearchBar from "../../components/InventorySettings/SearchBar";
// import SearchProductCard from "../../components/InventorySettings/SearchProductCard";
// import CurrentStorefrontProductCard from "../../components/InventorySettings/CurrentStorefrontProductCard";
// import AddItem from "../../components/InventorySettings/AddItem";

// const InventoryManagementPage = () => {
//   const {
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
//     products // For debugging
//   } = useInventoryData();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [notification, setNotification] = useState(null);

//   // Debug logging
//   console.log('Debug - All products:', products);
//   console.log('Debug - Search results:', searchResults);
//   console.log('Debug - Storefront products:', currentStorefrontProducts);
//   console.log('Debug - Loading:', loading);
//   console.log('Debug - Error:', error);

//   // Show notification for 3 seconds
//   const showNotification = (message, type = 'success') => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const handleAddNewProduct = async (newProduct) => {
//     try {
//       await addNewProduct(newProduct);
//       setIsModalOpen(false);
//       showNotification('Product added successfully!', 'success');
//     } catch (error) {
//       console.error('Failed to add product:', error);
//       showNotification('Failed to add product. Please try again.', 'error');
//       throw error;
//     }
//   };

//   const handleUpdateProduct = async (updatedProduct) => {
//     try {
//       await updateProduct(updatedProduct);
//       showNotification('Product updated successfully!', 'success');
//     } catch (error) {
//       console.error('Failed to update product:', error);
//       showNotification('Failed to update product. Please try again.', 'error');
//       throw error;
//     }
//   };

//   const handleAddToStore = async (productId) => {
//     try {
//       await addProductToStore(productId);
//       showNotification('Product added to storefront!', 'success');
//     } catch (error) {
//       console.error('Failed to add product to store:', error);
//       showNotification('Failed to add product to storefront. Please try again.', 'error');
//     }
//   };

//   const handleRemoveFromStore = async (productId) => {
//     try {
//       await removeProductFromStore(productId);
//       showNotification('Product removed from storefront!', 'success');
//     } catch (error) {
//       console.error('Failed to remove product from store:', error);
//       showNotification('Failed to remove product from storefront. Please try again.', 'error');
//     }
//   };

//   const handleUpdateStock = async (productId, newStock) => {
//     try {
//       await updateProductStock(productId, newStock);
//       showNotification('Stock updated successfully!', 'success');
//     } catch (error) {
//       console.error('Failed to update stock:', error);
//       showNotification('Failed to update stock. Please try again.', 'error');
//     }
//   };

//   // Show loading state
//   if (loading && products.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//         <span className="ml-3 text-gray-600">Loading inventory...</span>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Notification */}
//       {notification && (
//         <div
//           className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
//             notification.type === 'success'
//               ? 'bg-green-500 text-white'
//               : 'bg-red-500 text-white'
//           }`}
//         >
//           <div className="flex items-center">
//             {notification.type === 'success' ? (
//               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//               </svg>
//             ) : (
//               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             )}
//             {notification.message}
//           </div>
//         </div>
//       )}

//       {/* Error Display */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//           <div className="flex">
//             <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             <div>
//               <h3 className="text-sm font-medium text-red-800">Error loading inventory</h3>
//               <p className="text-sm text-red-700 mt-1">{error}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Debug Information (remove this in production) */}
//       {/* <div className="bg-gray-100 p-4 rounded-lg mb-6 text-sm">
//         <h3 className="font-bold mb-2">Debug Info:</h3>
//         <p>Total products: {products.length}</p>
//         <p>Search results: {searchResults.length}</p>
//         <p>Storefront products: {currentStorefrontProducts.length}</p>
//         <p>Loading: {loading ? 'Yes' : 'No'}</p>
//         <p>Error: {error || 'None'}</p>
//       </div> */}

//       <h1 className="text-3xl font-bold text-gray-900 mb-2">
//         Inventory Management
//       </h1>
//       <p className="text-gray-600 mb-8">
//         Update stock levels and manage your OTC storefront
//       </p>

//       {/* Inventory Summary Cards */}
//       <InventorySummaryCard inventoryStats={inventorySummary} />

//       <div className="flex justify-end mb-6 mt-6">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           disabled={loading}
//           className="px-6 py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//         >
//           {loading ? (
//             <div className="flex items-center">
//               <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Loading...
//             </div>
//           ) : (
//             'Add New Item'
//           )}
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//         {/* Add New Product Section */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Add New Product
//           </h2>
//           <p className="text-gray-600 mb-4">
//             Search and add OTC products to your storefront
//           </p>
//           <div className="mb-4">
//             <SearchBar 
//               searchTerm={searchTerm} 
//               setSearchTerm={setSearchTerm}
//               disabled={loading}
//             />
//           </div>
//           <div className="space-y-4">
//             {loading && searchResults.length === 0 ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
//               </div>
//             ) : searchResults.length > 0 ? (
//               searchResults.map((product) => (
//                 <SearchProductCard
//                   key={product.id}
//                   product={product}
//                   onAddToStore={handleAddToStore}
//                 />
//               ))
//             ) : (
//               <p className="text-center text-gray-500 py-8">
//                 {searchTerm 
//                   ? 'No products found matching your search.' 
//                   : products.length === 0 
//                     ? 'No products in database. Add some products to get started!'
//                     : 'All products are already in your storefront.'
//                 }
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Current Storefront Section */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Current Storefront
//           </h2>
//           <p className="text-gray-600 mb-4">Manage your listed OTC products</p>
//           <div className="space-y-4">
//             {loading && currentStorefrontProducts.length === 0 ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
//               </div>
//             ) : currentStorefrontProducts.length > 0 ? (
//               currentStorefrontProducts.map((product) => (
//                 <CurrentStorefrontProductCard
//                   key={product.id}
//                   product={product}
//                   onRemoveFromStore={handleRemoveFromStore}
//                   onUpdateProduct={handleUpdateProduct}
//                   onUpdateStock={handleUpdateStock}
//                 />
//               ))
//             ) : (
//               <p className="text-center text-gray-500 py-8">
//                 No products in your storefront yet. Add some products to get started!
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Add Item Modal */}
//       <AddItem
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleAddNewProduct}
//       />
//     </>
//   );
// };

// export default InventoryManagementPage;





























// import React, { useState } from "react";
// import { useInventoryData } from "../../hooks/useInventoryData";
// import InventorySummaryCard from "../../components/InventorySettings/InventorySummaryCard";
// import SearchBar from "../../components/InventorySettings/SearchBar";
// import SearchProductCard from "../../components/InventorySettings/SearchProductCard";
// import CurrentStorefrontProductCard from "../../components/InventorySettings/CurrentStorefrontProductCard";
// import AddItem from "../../components/InventorySettings/AddItem";

// const InventoryManagementPage = () => {
//   const {
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
//     error
//   } = useInventoryData();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [notification, setNotification] = useState(null);

//   // Show notification for 3 seconds
//   const showNotification = (message, type = 'success') => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const handleAddNewProduct = async (newProduct) => {
//     try {
//       await addNewProduct(newProduct);
//       setIsModalOpen(false);
//       showNotification('Product added successfully!', 'success');
//     } catch (error) {
//       console.error('Failed to add product:', error);
//       showNotification('Failed to add product. Please try again.', 'error');
//       throw error; // Re-throw so AddItem component can handle it
//     }
//   };

//   const handleUpdateProduct = async (updatedProduct) => {
//     try {
//       await updateProduct(updatedProduct);
//       showNotification('Product updated successfully!', 'success');
//     } catch (error) {
//       console.error('Failed to update product:', error);
//       showNotification('Failed to update product. Please try again.', 'error');
//       throw error;
//     }
//   };

//   const handleAddToStore = async (productId) => {
//     try {
//       await addProductToStore(productId);
//       showNotification('Product added to storefront!', 'success');
//     } catch (error) {
//       console.error('Failed to add product to store:', error);
//       showNotification('Failed to add product to storefront. Please try again.', 'error');
//     }
//   };

//   const handleRemoveFromStore = async (productId) => {
//     try {
//       await removeProductFromStore(productId);
//       showNotification('Product removed from storefront!', 'success');
//     } catch (error) {
//       console.error('Failed to remove product from store:', error);
//       showNotification('Failed to remove product from storefront. Please try again.', 'error');
//     }
//   };

//   const handleUpdateStock = async (productId, newStock) => {
//     try {
//       await updateProductStock(productId, newStock);
//       showNotification('Stock updated successfully!', 'success');
//     } catch (error) {
//       console.error('Failed to update stock:', error);
//       showNotification('Failed to update stock. Please try again.', 'error');
//     }
//   };

//   // Show loading state
//   if (loading && !notification) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//         <span className="ml-3 text-gray-600">Loading inventory...</span>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Notification */}
//       {notification && (
//         <div
//           className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
//             notification.type === 'success'
//               ? 'bg-green-500 text-white'
//               : 'bg-red-500 text-white'
//           }`}
//         >
//           <div className="flex items-center">
//             {notification.type === 'success' ? (
//               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//               </svg>
//             ) : (
//               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             )}
//             {notification.message}
//           </div>
//         </div>
//       )}

//       {/* Error Display */}
//       {error && !loading && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//           <div className="flex">
//             <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             <div>
//               <h3 className="text-sm font-medium text-red-800">Error loading inventory</h3>
//               <p className="text-sm text-red-700 mt-1">{error}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <h1 className="text-3xl font-bold text-gray-900 mb-2">
//         Inventory Management
//       </h1>
//       <p className="text-gray-600 mb-8">
//         Update stock levels and manage your OTC storefront
//       </p>

//       {/* Inventory Summary Cards */}
//       <InventorySummaryCard inventoryStats={inventorySummary} />

//       <div className="flex justify-end mb-6 mt-6">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           disabled={loading}
//           className="px-6 py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//         >
//           {loading ? (
//             <div className="flex items-center">
//               <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Loading...
//             </div>
//           ) : (
//             'Add New Item'
//           )}
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//         {/* Add New Product Section */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Add New Product
//           </h2>
//           <p className="text-gray-600 mb-4">
//             Search and add OTC products to your storefront
//           </p>
//           <div className="mb-4">
//             <SearchBar 
//               searchTerm={searchTerm} 
//               setSearchTerm={setSearchTerm}
//               disabled={loading}
//             />
//           </div>
//           <div className="space-y-4">
//             {loading ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
//               </div>
//             ) : searchResults.length > 0 ? (
//               searchResults.map((product) => (
//                 <SearchProductCard
//                   key={product.id}
//                   product={product}
//                   onAddToStore={handleAddToStore}
//                 />
//               ))
//             ) : (
//               <p className="text-center text-gray-500 py-8">
//                 {searchTerm ? 'No products found matching your search.' : 'No products available to add to storefront.'}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Current Storefront Section */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Current Storefront
//           </h2>
//           <p className="text-gray-600 mb-4">Manage your listed OTC products</p>
//           <div className="space-y-4">
//             {loading ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
//               </div>
//             ) : currentStorefrontProducts.length > 0 ? (
//               currentStorefrontProducts.map((product) => (
//                 <CurrentStorefrontProductCard
//                   key={product.id}
//                   product={product}
//                   onRemoveFromStore={handleRemoveFromStore}
//                   onUpdateProduct={handleUpdateProduct}
//                   onUpdateStock={handleUpdateStock}
//                 />
//               ))
//             ) : (
//               <p className="text-center text-gray-500 py-8">
//                 No products in your storefront yet. Add some products to get started!
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Add Item Modal */}
//       <AddItem
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleAddNewProduct}
//       />
//     </>
//   );
// };

// export default InventoryManagementPage;



























// import React, { useState } from "react";
// import { useInventoryData } from "../../hooks/useInventoryData";
// import InventorySummaryCard from "../../components/InventorySettings/InventorySummaryCard";
// import SearchBar from "../../components/InventorySettings/SearchBar";
// import SearchProductCard from "../../components/InventorySettings/SearchProductCard";
// import CurrentStorefrontProductCard from "../../components/InventorySettings/CurrentStorefrontProductCard";
// import AddItem from "../../components/InventorySettings/AddItem";

// const InventoryManagementPage = () => {
//   const {
//     inventorySummary,
//     searchTerm,
//     setSearchTerm,
//     searchResults,
//     currentStorefrontProducts,
//     addProductToStore,
//     removeProductFromStore,
//     updateProductStock,
//     addNewProduct,
//     updateProduct, // Get the update function
//   } = useInventoryData();

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleAddNewProduct = (newProduct) => {
//     // Add the new product to the main products array
//     addNewProduct(newProduct);
//     setIsModalOpen(false);
//   };

//   const handleUpdateProduct = (updatedProduct) => {
//     // Update the existing product
//     updateProduct(updatedProduct);
//   };

//   return (
//     <>
//       <h1 className="text-3xl font-bold text-gray-900 mb-2">
//         Inventory Management
//       </h1>
//       <p className="text-gray-600 mb-8">
//         Update stock levels and manage your OTC storefront
//       </p>

//       {/* Inventory Summary Cards */}
//       <InventorySummaryCard inventoryStats={inventorySummary} />

//       <div className="flex justify-end mb-6 mt-6">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="px-6 py-3  bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//         >
//           Add New Item
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//         {/* Add New Product Section */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Add New Product
//           </h2>
//           <p className="text-gray-600 mb-4">
//             Search and add OTC products to your storefront
//           </p>
//           <div className="mb-4">
//             <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//           </div>
//           <div className="space-y-4">
//             {searchResults.length > 0 ? (
//               searchResults.map((product) => (
//                 <SearchProductCard
//                   key={product.id}
//                   product={product}
//                   onAddToStore={addProductToStore}
//                 />
//               ))
//             ) : (
//               <p className="text-center text-gray-500">
//                 No products found or all products are in storefront.
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Current Storefront Section */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Current Storefront
//           </h2>
//           <p className="text-gray-600 mb-4">Manage your listed OTC products</p>
//           <div className="space-y-4">
//             {currentStorefrontProducts.length > 0 ? (
//               currentStorefrontProducts.map((product) => (
//                 <CurrentStorefrontProductCard
//                   key={product.id}
//                   product={product}
//                   onRemoveFromStore={removeProductFromStore}
//                   onUpdateProduct={handleUpdateProduct} // Pass the update function
//                 />
//               ))
//             ) : (
//               <p className="text-center text-gray-500">
//                 No products in your storefront yet.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Add Item Modal */}
//       <AddItem
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleAddNewProduct}
//       />
//     </>
//   );
// };

// export default InventoryManagementPage;





  