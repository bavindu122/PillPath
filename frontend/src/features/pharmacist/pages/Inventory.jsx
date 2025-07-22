import React from 'react';
import { Package, Search, Filter, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PharmaPageLayout from '../components/PharmaPageLayout';
import InventoryStats from '../components/InventoryStats';
import InventoryFilters from '../components/InventoryFilters';
import InventoryTable from '../components/InventoryTable';
import ProductEditModal from '../components/ProductEditModal';
import { useInventoryData } from '../hooks/useInventoryData';
import '../pages/index-pharmacist.css';

const Inventory = () => {
  const navigate = useNavigate();
  
  const {
    filteredProducts,
    categories,
    totalProducts,
    lowStockCount,
    loading,
    error,
    searchTerm,
    selectedCategory,
    sortBy,
    sortOrder,
    editingProduct,
    isUpdating,
    setEditingProduct,
    updateProduct,
    setSearchTerm,
    setSelectedCategory,
    setSortBy,
    refetch
  } = useInventoryData();

  // Header actions showing inventory count
  const headerActions = (
    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-full shadow-sm">
      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>
      <p className="text-sm font-semibold text-blue-700">
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} in inventory
      </p>
    </div>
  );

  if (loading) {
    return (
      <PharmaPageLayout
        title="Inventory Management"
        subtitle="Manage product prices and stock quantities"
        isLoading={true}
        loadingMessage="Loading Inventory..."
        showBackButton={false}
      />
    );
  }

  if (error) {
    return (
      <PharmaPageLayout
        title="Inventory Management"
        subtitle="Manage product prices and stock quantities"
        showBackButton={false}
      >
        <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: 'var(--pharma-red-50)', borderColor: 'var(--pharma-red-200)' }}>
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" style={{ color: 'var(--pharma-red-500)' }} />
            <p style={{ color: 'var(--pharma-red-800)' }}>Error loading inventory: {error}</p>
            <button
              onClick={refetch}
              className="ml-4 px-3 py-1 rounded text-sm hover:opacity-80 transition-opacity"
              style={{ backgroundColor: 'var(--pharma-red)', color: 'var(--pharma-text-light)' }}
            >
              Retry
            </button>
          </div>
        </div>
      </PharmaPageLayout>
    );
  }

  return (
    <PharmaPageLayout
      title="Inventory Management"
      subtitle="Manage product prices and stock quantities"
      isLoading={false}
      showBackButton={false}
      headerActions={headerActions}
    >
      <div className="space-y-6">
        {/* Inventory Stats */}
        <div className="dashboard-fade-in-2">
          <InventoryStats 
            totalProducts={totalProducts}
            lowStockCount={lowStockCount}
            filteredCount={filteredProducts.length}
          />
        </div>

        {/* Filters and Search */}
        <div className="dashboard-fade-in-3">
          <InventoryFilters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            categories={categories}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Inventory Table */}
        <div className="dashboard-fade-in-4">
          <InventoryTable
            products={filteredProducts}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={setSortBy}
            onEditProduct={setEditingProduct}
          />
        </div>

        {/* Product Edit Modal */}
        {editingProduct && (
          <ProductEditModal
            product={editingProduct}
            isUpdating={isUpdating}
            onSave={updateProduct}
            onClose={() => setEditingProduct(null)}
          />
        )}
      </div>
    </PharmaPageLayout>
  );
};

export default Inventory;