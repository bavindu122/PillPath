import React from 'react';
import { Edit3, ChevronUp, ChevronDown, AlertTriangle, Package } from 'lucide-react';
import '../pages/index-pharmacist.css';

const InventoryTable = ({ products, sortBy, sortOrder, onSort, onEditProduct }) => {
  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const getStockStatus = (product) => {
    if (product.quantity <= product.lowStockThreshold) {
      return { status: 'low', class: 'inventory-stock-low', text: 'Low Stock' };
    } else if (product.quantity <= product.lowStockThreshold * 2) {
      return { status: 'medium', class: 'inventory-stock-medium', text: 'Medium Stock' };
    } else {
      return { status: 'good', class: 'inventory-stock-good', text: 'In Stock' };
    }
  };

  const formatPrice = (price) => {
    return 'Rs.' + new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (products.length === 0) {
    return (
      <div className="inventory-table-card border rounded-xl p-8 text-center">
        <Package className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--pharma-gray-400)' }} />
        <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--pharma-gray-700)' }}>
          No products found
        </h3>
        <p style={{ color: 'var(--pharma-gray-500)' }}>
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="inventory-table-card border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="inventory-table-header">
            <tr>
              <th className="px-6 py-4 text-left">
                <div className="flex items-center gap-2">
                  Product
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => onSort('category')}
              >
                <div className="flex items-center gap-2">
                  Category
                  {getSortIcon('category')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => onSort('price')}
              >
                <div className="flex items-center gap-2">
                  Price
                  {getSortIcon('price')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => onSort('quantity')}
              >
                <div className="flex items-center gap-2">
                  Stock
                  {getSortIcon('quantity')}
                </div>
              </th>
              <th className="px-6 py-4 text-left">SKU</th>
              <th className="px-6 py-4 text-left">Expiry Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const stockStatus = getStockStatus(product);
              return (
                <tr 
                  key={product.id} 
                  className="inventory-table-row opacity-80 transition-opacity duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border" style={{ borderColor: 'var(--pharma-border)' }}>
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/src/assets/img/meds/pharma.jpg';
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: 'var(--pharma-text-dark)' }}>
                          {product.name}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--pharma-gray-500)' }}>
                          {product.manufacturer}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium inventory-category-badge">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold" style={{ color: 'var(--pharma-text-dark)' }}>
                      {formatPrice(product.price)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.class}`}>
                        {product.quantity <= product.lowStockThreshold && (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {product.quantity} units
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono" style={{ color: 'var(--pharma-gray-600)' }}>
                      {product.sku}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm" style={{ color: 'var(--pharma-gray-600)' }}>
                      {formatDate(product.expiryDate)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                    onClick={() => onEditProduct(product)}
                    className="inventory-edit-btn flex items-center space-x-1 px-4 py-2 text-xs font-medium rounded-lg transform hover:scale-105 transition-all duration-200"
                    >
                    <Edit3 className="h-3 w-3" />
                    Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
