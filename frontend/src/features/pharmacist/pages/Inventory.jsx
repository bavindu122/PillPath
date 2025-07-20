import React from 'react';
import { Package, Search, Filter, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import PharmaPageLayout from '../components/PharmaPageLayout';
import InventoryStats from '../components/InventoryStats';
import InventoryFilters from '../components/InventoryFilters';
import InventoryTable from '../components/InventoryTable';
import ProductEditModal from '../components/ProductEditModal';
import { useInventoryData } from '../hooks/useInventoryData';
import '../pages/index-pharmacist.css';

const Inventory = () => {
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

  if (loading) {
    return (
      <PharmaPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--pharma-blue)' }}></div>
        </div>
      </PharmaPageLayout>
    );
  }

  if (error) {
    return (
      <PharmaPageLayout>
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
    <PharmaPageLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--pharma-text-dark)' }}>
              <Package className="h-7 w-7" style={{ color: 'var(--pharma-blue)' }} />
              Inventory Management
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--pharma-text-muted)' }}>
              Manage product prices and stock quantities
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: 'var(--pharma-blue)', color: 'var(--pharma-text-light)' }}
            >
              <TrendingUp className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Inventory Stats */}
        <InventoryStats 
          totalProducts={totalProducts}
          lowStockCount={lowStockCount}
          filteredCount={filteredProducts.length}
        />

        {/* Filters and Search */}
        <InventoryFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          categories={categories}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />

        {/* Inventory Table */}
        <InventoryTable
          products={filteredProducts}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={setSortBy}
          onEditProduct={setEditingProduct}
        />

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
