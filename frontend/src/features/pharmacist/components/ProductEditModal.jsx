import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign } from 'lucide-react';
import '../pages/index-pharmacist.css';

const ProductEditModal = ({ product, isUpdating, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    price: '',
    quantity: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        price: product.price.toString(),
        quantity: product.quantity.toString()
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const updatedProduct = {
      ...product,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity)
    };
    
    await onSave(updatedProduct);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 transition-opacity"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      />
      
      {/* Modal panel */}
      <div 
        className="relative w-full max-w-lg product-edit-modal rounded-lg shadow-xl"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--pharma-border)' }}>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--pharma-text-dark)' }}>
            Edit Product
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" style={{ color: 'var(--pharma-gray-500)' }} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Product Info */}
          <div className="flex items-start space-x-4 mb-6">
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
              <h3 className="font-semibold text-lg" style={{ color: 'var(--pharma-text-dark)' }}>
                {product.name}
              </h3>
              <p className="text-sm" style={{ color: 'var(--pharma-gray-600)' }}>
                SKU: {product.sku}
              </p>
              <p className="text-sm" style={{ color: 'var(--pharma-gray-600)' }}>
                Category: {product.category}
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium inventory-stock-good">
                  Current: {product.quantity} units
                </span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Price Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--pharma-text-dark)' }}>
                Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-base font-semibold text-gray-400">Rs.</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`w-full product-edit-input pl-10 py-3 ${errors.price ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--pharma-gray-500)' }}>
                Current price: Rs.{product.price.toFixed(2)}
              </p>
              {errors.price && (
                <p className="text-xs mt-1 text-red-500">{errors.price}</p>
              )}
            </div>

            {/* Quantity Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--pharma-text-dark)' }}>
                Quantity
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className="h-4 w-4" style={{ color: 'var(--pharma-gray-400)' }} />
                </div>
                <input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  className={`w-full product-edit-input pl-10 py-3 ${errors.quantity ? 'border-red-500' : ''}`}
                  placeholder="0"
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span style={{ color: 'var(--pharma-gray-500)' }}>
                  Current quantity: {product.quantity} units
                </span>
                <span style={{ color: 'var(--pharma-gray-500)' }}>
                  Low stock threshold: {product.lowStockThreshold} units
                </span>
              </div>
              {errors.quantity && (
                <p className="text-xs mt-1 text-red-500">{errors.quantity}</p>
              )}
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t" style={{ borderColor: 'var(--pharma-border)' }}>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border transition-colors"
            style={{ 
              borderColor: 'var(--pharma-border)', 
              color: 'var(--pharma-gray-600)',
              backgroundColor: 'white'
            }}
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isUpdating || Object.keys(errors).length > 0}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            style={{ backgroundColor: 'var(--pharma-blue)' }}
          >
            {isUpdating ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Package className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEditModal;