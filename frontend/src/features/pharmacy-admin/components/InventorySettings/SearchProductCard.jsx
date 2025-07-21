import React from 'react';

const SearchProductCard = ({ product, onAddToStore }) => {
  // Default placeholder image in case the product image is missing
  const placeholderImage = 'https://via.placeholder.com/80x80?text=No+Image';

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
      {/* Product Image + Info */}
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
          <img
            src={product.imageUrl || placeholderImage}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {e.target.onerror = null; e.target.src = placeholderImage;}}
          />
        </div>
        
        {/* Product Details */}
        <div>
          <div className="font-semibold text-gray-800">{product.name}</div>
          <div className="text-sm text-gray-500 mb-1">{product.description}</div>
          <div className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</div>
        </div>
      </div>
      
      {/* Add to Store Button */}
      <button
        onClick={() => onAddToStore(product.id)}
        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
      >
        Add to Store
      </button>
    </div>
  );
};

export default SearchProductCard;
