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
    searchResults,
    currentStorefrontProducts,
    addProductToStore,
    removeProductFromStore,
    updateProductStock,
    addNewProduct,
    updateProduct, // Get the update function
  } = useInventoryData();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddNewProduct = (newProduct) => {
    // Add the new product to the main products array
    addNewProduct(newProduct);
    setIsModalOpen(false);
  };

  const handleUpdateProduct = (updatedProduct) => {
    // Update the existing product
    updateProduct(updatedProduct);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Inventory Management
      </h1>
      <p className="text-gray-600 mb-8">
        Update stock levels and manage your OTC storefront
      </p>

      {/* Inventory Summary Cards */}
      <InventorySummaryCard inventoryStats={inventorySummary} />

      <div className="flex justify-end mb-6 mt-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3  bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Add New Item
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Add New Product Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New Product
          </h2>
          <p className="text-gray-600 mb-4">
            Search and add OTC products to your storefront
          </p>
          <div className="mb-4">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          <div className="space-y-4">
            {searchResults.length > 0 ? (
              searchResults.map((product) => (
                <SearchProductCard
                  key={product.id}
                  product={product}
                  onAddToStore={addProductToStore}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No products found or all products are in storefront.
              </p>
            )}
          </div>
        </div>

        {/* Current Storefront Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Current Storefront
          </h2>
          <p className="text-gray-600 mb-4">Manage your listed OTC products</p>
          <div className="space-y-4">
            {currentStorefrontProducts.length > 0 ? (
              currentStorefrontProducts.map((product) => (
                <CurrentStorefrontProductCard
                  key={product.id}
                  product={product}
                  onRemoveFromStore={removeProductFromStore}
                  onUpdateProduct={handleUpdateProduct} // Pass the update function
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
    </>
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
//     addNewProduct, // Get the new function
//   } = useInventoryData();

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleAddNewProduct = (newProduct) => {
//     // Add the new product to the main products array
//     addNewProduct(newProduct);
//     setIsModalOpen(false);
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

//       <div className="flex justify-end mb-6">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="px-6 py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
//                   onUpdateStock={updateProductStock}
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


  