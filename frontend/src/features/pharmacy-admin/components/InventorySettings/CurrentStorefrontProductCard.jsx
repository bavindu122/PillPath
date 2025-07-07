import React, { useState } from 'react';

const getStockStatusColor = (status) => {
  switch (status) {
    case 'In Stock':
      return 'text-green-600 bg-green-100';
    case 'Low Stock':
      return 'text-yellow-600 bg-yellow-100';
    case 'Out of Stock':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const CurrentStorefrontProductCard = ({ product, onRemoveFromStore, onUpdateStock }) => {
  const [stock, setStock] = useState(product.stock);

  const handleStockChange = (e) => {
    const newStock = parseInt(e.target.value, 10);
    setStock(newStock);
    if (!isNaN(newStock)) {
      onUpdateStock(product.id, newStock);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 last:border-b-0">
      <div className="flex items-center flex-grow"> {/* Added flex items-center */}
        {product.imageUrl && ( // Conditionally render image if available
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-md mr-4"
          />
        )}
        <div>
          <div className="font-semibold text-gray-800">{product.name}</div>
          <div className="text-sm text-gray-500">{product.description}</div>
          <div className="text-lg font-bold text-gray-700">${product.price.toFixed(2)}</div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <label htmlFor={`stock-${product.id}`} className="sr-only">
          Stock for {product.name}
        </label>
        <input
          type="number"
          id={`stock-${product.id}`}
          value={stock}
          onChange={handleStockChange}
          min="0"
          className="w-20 p-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStockStatusColor(product.status)}`}>
          {product.status}
        </span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => alert('Edit functionality not implemented')} // Placeholder for edit
          className="p-2 text-gray-500 hover:text-blue-600"
          aria-label="Edit product"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
        <button
          onClick={() => onRemoveFromStore(product.id)}
          className="p-2 text-red-500 hover:text-red-600"
          aria-label="Remove from store"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CurrentStorefrontProductCard;








// import React, { useState } from 'react';

// const getStockStatusColor = (status) => {
//   switch (status) {
//     case 'In Stock':
//       return 'text-green-600 bg-green-100';
//     case 'Low Stock':
//       return 'text-yellow-600 bg-yellow-100';
//     case 'Out of Stock':
//       return 'text-red-600 bg-red-100';
//     default:
//       return 'text-gray-600 bg-gray-100';
//   }
// };

// const CurrentStorefrontProductCard = ({ product, onRemoveFromStore, onUpdateStock }) => {
//   const [stock, setStock] = useState(product.stock);

//   const handleStockChange = (e) => {
//     const newStock = parseInt(e.target.value, 10);
//     setStock(newStock);
//     if (!isNaN(newStock)) {
//       onUpdateStock(product.id, newStock);
//     }
//   };

//   return (
//     <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 last:border-b-0">
//       <div className="flex-grow">
//         <div className="font-semibold text-gray-800">{product.name}</div>
//         <div className="text-sm text-gray-500">{product.description}</div>
//         <div className="text-lg font-bold text-gray-700">${product.price.toFixed(2)}</div>
//         <div className="flex items-center mt-2">
//           <label htmlFor={`stock-${product.id}`} className="text-sm text-gray-600 mr-2">Stock:</label>
//           <input
//             id={`stock-${product.id}`}
//             type="number"
//             value={stock}
//             onChange={handleStockChange}
//             min="0"
//             className="w-20 p-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
//           />
//           <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStockStatusColor(product.status)}`}>
//             {product.status}
//           </span>
//         </div>
//       </div>
//       <div className="flex space-x-2">
//         <button
//           onClick={() => alert('Edit functionality not implemented')} // Placeholder for edit
//           className="p-2 text-gray-500 hover:text-blue-600"
//           aria-label="Edit product"
//         >
//           <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
//           </svg>
//         </button>
//         <button
//           onClick={() => onRemoveFromStore(product.id)}
//           className="p-2 text-red-500 hover:text-red-700"
//           aria-label="Remove product"
//         >
//           <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CurrentStorefrontProductCard;