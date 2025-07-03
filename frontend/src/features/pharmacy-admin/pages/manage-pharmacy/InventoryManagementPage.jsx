import React from "react";
import { useInventoryData } from "../../hooks/useInventoryData";
import InventorySummaryCard from "../../components/InventorySettings/InventorySummaryCard";
import SearchBar from "../../components/InventorySettings/SearchBar";
import SearchProductCard from "../../components/InventorySettings/SearchProductCard";
import CurrentStorefrontProductCard from "../../components/InventorySettings/CurrentStorefrontProductCard";

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
  } = useInventoryData();

  return (
    // No need for outer container div as it's provided by the layout
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Inventory Management
      </h1>
      <p className="text-gray-600 mb-8">
        Update stock levels and manage your OTC storefront
      </p>

      {/* Inventory Summary Cards */}
      
        <InventorySummaryCard inventoryStats={inventorySummary} />
      

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
                  onUpdateStock={updateProductStock}
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
    </>
  );
};

export default InventoryManagementPage;
  