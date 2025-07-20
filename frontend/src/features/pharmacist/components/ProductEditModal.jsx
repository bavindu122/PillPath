import React, { useState } from 'react';
import { X, DollarSign, Package, Save, AlertCircle } from 'lucide-react';
import '../pages/index-pharmacist.css';

const ProductEditModal = ({ product, isUpdating, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    price: product.price,
    quantity: product.quantity
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.quantity || formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }
    
    if (formData.price > 1000) {
      newErrors.price = 'Price seems too high. Please verify.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSave(product.id, {
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      });
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const stockStatus = product.quantity <= product.lowStockThreshold ? 'low' : 'good';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 transition-opacity"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      />

      {/* Modal panel */}
      <div 
        className="relative w-full max-w-lg product-edit-modal rounded-lg shadow-xl"
        style={{ backgroundColor: 'var(--pharma-card-bg)' }}
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--pharma-border)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium" style={{ color: 'var(--pharma-text-dark)' }}>
                Edit Product
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-2 hover:opacity-70 transition-opacity"
                style={{ color: 'var(--pharma-gray-400)' }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--pharma-border)' }}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden border" style={{ borderColor: 'var(--pharma-border)' }}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/src/assets/img/meds/pharma.jpg';
                  }}
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium" style={{ color: 'var(--pharma-text-dark)' }}>
                  {product.name}
                </h4>
                <p className="text-sm" style={{ color: 'var(--pharma-gray-500)' }}>
                  SKU: {product.sku}
                </p>
                <p className="text-sm" style={{ color: 'var(--pharma-gray-500)' }}>
                  Category: {product.category}
                </p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    stockStatus === 'low' ? 'inventory-stock-low' : 'inventory-stock-good'
                  }`}>
                    {stockStatus === 'low' && <AlertCircle className="h-3 w-3 mr-1" />}
                    Current: {product.quantity} units
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="px-6 py-6 space-y-6">
            {/* Price Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--pharma-text-dark)' }}>
                Price
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--pharma-gray-400)' }} />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                    errors.price ? 'product-edit-input-error' : 'product-edit-input'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm" style={{ color: 'var(--pharma-red)' }}>
                  {errors.price}
                </p>
              )}
              <p className="mt-1 text-xs" style={{ color: 'var(--pharma-gray-500)' }}>
                Current price: {formatPrice(product.price)}
              </p>
            </div>

            {/* Quantity Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--pharma-text-dark)' }}>
                Quantity
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--pharma-gray-400)' }} />
                <input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                    errors.quantity ? 'product-edit-input-error' : 'product-edit-input'
                  }`}
                  placeholder="0"
                />
              </div>
              {errors.quantity && (
                <p className="mt-1 text-sm" style={{ color: 'var(--pharma-red)' }}>
                  {errors.quantity}
                </p>
              )}
              <div className="mt-1 flex justify-between text-xs" style={{ color: 'var(--pharma-gray-500)' }}>
                <span>Current quantity: {product.quantity} units</span>
                <span>Low stock threshold: {product.lowStockThreshold} units</span>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--pharma-red-50)' }}>
                <p className="text-sm" style={{ color: 'var(--pharma-red-800)' }}>
                  {errors.submit}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: 'var(--pharma-border)', backgroundColor: 'var(--pharma-gray-50)' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
              style={{ backgroundColor: 'var(--pharma-gray-200)', color: 'var(--pharma-gray-700)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--pharma-blue)', color: 'var(--pharma-text-light)' }}
            >
              {isUpdating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
