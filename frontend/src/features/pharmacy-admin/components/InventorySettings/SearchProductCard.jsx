import React from 'react';

const SearchProductCard = ({ product, onAddToStore }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 last:border-b-0">
      <div>
        <div className="font-semibold text-gray-800">{product.name}</div>
        <div className="text-sm text-gray-500">{product.description}</div>
        <div className="text-lg font-bold text-gray-700">${product.price.toFixed(2)}</div>
      </div>
      <button
        onClick={() => onAddToStore(product.id)}
        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add to Store
      </button>
    </div>
  );
};

export default SearchProductCard;