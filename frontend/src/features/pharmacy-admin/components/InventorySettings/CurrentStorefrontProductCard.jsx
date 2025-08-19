import React, { useState } from 'react';

const getStockStatusColor = (status) => {
  switch (status) {
    case 'In Stock':
      return 'text-green-600 bg-green-100 border border-green-200';
    case 'Low Stock':
      return 'text-amber-600 bg-amber-50 border border-amber-200';
    case 'Out of Stock':
      return 'text-red-600 bg-red-50 border border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border border-gray-200';
  }
};

const CurrentStorefrontProductCard = ({ product, onRemoveFromStore, onUpdateProduct }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    imageUrl: product.imageUrl
  });
  const [newImage, setNewImage] = useState(null);

  const placeholderImage = 'https://via.placeholder.com/80x80?text=No+Image';

  const handleEditClick = () => {
    setEditingProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl
    });
    setNewImage(null);
    setShowEditModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (validImageTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload a valid image file (jpg, png, gif, webp).');
      }
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!editingProduct.name || !editingProduct.description || !editingProduct.price || editingProduct.stock === '') {
      alert('Please fill in all required fields.');
      return;
    }

    if (isNaN(editingProduct.price) || parseFloat(editingProduct.price) <= 0) {
      alert('Price must be a positive number.');
      return;
    }

    if (isNaN(editingProduct.stock) || parseInt(editingProduct.stock) < 0) {
      alert('Stock must be a non-negative integer.');
      return;
    }

    // Calculate new status based on stock
    let newStatus = '';
    const stockNum = parseInt(editingProduct.stock);
    if (stockNum === 0) {
      newStatus = 'Out of Stock';
    } else if (stockNum <= 10) {
      newStatus = 'Low Stock';
    } else {
      newStatus = 'In Stock';
    }

    const updatedProduct = {
      ...product,
      name: editingProduct.name,
      description: editingProduct.description,
      price: parseFloat(editingProduct.price),
      stock: stockNum,
      status: newStatus,
      imageUrl: newImage || editingProduct.imageUrl
    };

    onUpdateProduct(updatedProduct);
    setShowEditModal(false);
  };

  const currentDisplayImage = newImage || editingProduct.imageUrl;

  return (
    <>
      <div 
        className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="w-24 h-24 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
          <img
            src={product.imageUrl || placeholderImage}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {e.target.onerror = null; e.target.src = placeholderImage;}}
          />
        </div>

        {/* Product Details */}
        <div className="flex-grow">
          <h3 className="text-lg font-medium text-gray-800 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-blue-600">Rs.{product.price.toFixed(2)}</span>
            {/* Displaying stock status */}
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStockStatusColor(product.status)}`}>
              {product.status}
            </span>
            {/* Displaying stock quantity */}
            <span className="text-sm text-gray-600">Stock: {product.stock}</span>
          </div>
        </div>

        {/* Stock Display and Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-3 sm:mt-0">
          {/* Action Buttons */}
          <div className="flex space-x-1">
            <button
              onClick={handleEditClick}
              className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              aria-label="Edit product"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button
              onClick={() => onRemoveFromStore(product.id)}
              className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
              aria-label="Remove from store"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex bg-black/30 justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1 space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-gray-700 text-sm font-medium mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-price" className="block text-gray-700 text-sm font-medium mb-2">
                    Price (Rs.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="edit-price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-stock" className="block text-gray-700 text-sm font-medium mb-2">
                    Stock Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="edit-stock"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-description" className="block text-gray-700 text-sm font-medium mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="edit-description"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    rows="4"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-1">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Product Image
                </label>
                <div
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('edit-image-upload').click()}
                >
                  {currentDisplayImage ? (
                    <div className="w-full h-full flex items-center justify-center p-2">
                      <img 
                        src={currentDisplayImage} 
                        alt="Product Preview" 
                        className="max-w-full max-h-full object-contain rounded-lg" 
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-5">
                      <svg
                        className="w-10 h-10 mb-3 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}

                  <input 
                    id="edit-image-upload" 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                    accept="image/png, image/jpeg, image/gif, image/webp" 
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CurrentStorefrontProductCard;














































// import React, { useState } from 'react';

// const getStockStatusColor = (status) => {
//   switch (status) {
//     case 'In Stock':
//       return 'text-green-600 bg-green-100 border border-green-200';
//     case 'Low Stock':
//       return 'text-amber-600 bg-amber-50 border border-amber-200';
//     case 'Out of Stock':
//       return 'text-red-600 bg-red-50 border border-red-200';
//     default:
//       return 'text-gray-600 bg-gray-50 border border-gray-200';
//   }
// };

// const CurrentStorefrontProductCard = ({ product, onRemoveFromStore, onUpdateProduct }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState({
//     name: product.name,
//     description: product.description,
//     price: product.price,
//     stock: product.stock,
//     imageUrl: product.imageUrl
//   });
//   const [newImage, setNewImage] = useState(null);

//   const placeholderImage = 'https://via.placeholder.com/80x80?text=No+Image';

//   const handleEditClick = () => {
//     setEditingProduct({
//       name: product.name,
//       description: product.description,
//       price: product.price,
//       stock: product.stock,
//       imageUrl: product.imageUrl
//     });
//     setNewImage(null);
//     setShowEditModal(true);
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setNewImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const file = e.dataTransfer.files[0];
//       const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//       if (validImageTypes.includes(file.type)) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setNewImage(reader.result);
//         };
//         reader.readAsDataURL(file);
//       } else {
//         alert('Please upload a valid image file (jpg, png, gif, webp).');
//       }
//     }
//   };

//   const handleSaveEdit = (e) => {
//     e.preventDefault();
    
//     // Validate inputs
//     if (!editingProduct.name || !editingProduct.description || !editingProduct.price || editingProduct.stock === '') {
//       alert('Please fill in all required fields.');
//       return;
//     }

//     if (isNaN(editingProduct.price) || parseFloat(editingProduct.price) <= 0) {
//       alert('Price must be a positive number.');
//       return;
//     }

//     if (isNaN(editingProduct.stock) || parseInt(editingProduct.stock) < 0) {
//       alert('Stock must be a non-negative integer.');
//       return;
//     }

//     // Calculate new status based on stock
//     let newStatus = '';
//     const stockNum = parseInt(editingProduct.stock);
//     if (stockNum === 0) {
//       newStatus = 'Out of Stock';
//     } else if (stockNum <= 10) {
//       newStatus = 'Low Stock';
//     } else {
//       newStatus = 'In Stock';
//     }

//     const updatedProduct = {
//       ...product,
//       name: editingProduct.name,
//       description: editingProduct.description,
//       price: parseFloat(editingProduct.price),
//       stock: stockNum,
//       status: newStatus,
//       imageUrl: newImage || editingProduct.imageUrl
//     };

//     onUpdateProduct(updatedProduct);
//     setShowEditModal(false);
//   };

//   const currentDisplayImage = newImage || editingProduct.imageUrl;

//   return (
//     <>
//       <div 
//         className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-4"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* Product Image */}
//         <div className="w-24 h-24 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
//           <img
//             src={product.imageUrl || placeholderImage}
//             alt={product.name}
//             className="w-full h-full object-cover"
//             onError={(e) => {e.target.onerror = null; e.target.src = placeholderImage;}}
//           />
//         </div>

//         {/* Product Details */}
//         <div className="flex-grow">
//           <h3 className="text-lg font-medium text-gray-800 mb-1">{product.name}</h3>
//           <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
//           <div className="flex flex-wrap items-center gap-3">
//             <span className="font-bold text-blue-600">Rs.{product.price.toFixed(2)}</span>
//             <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStockStatusColor(product.status)}`}>
//               {product.status}
//             </span>
//           </div>
//         </div>

//         {/* Stock Display and Actions */}
//         <div className="flex flex-col sm:flex-row items-center gap-4 mt-3 sm:mt-0">
//           {/* Stock Quantity Display */}
//           <div className="flex items-center">
//             <span className="text-sm text-gray-600 mr-2">Qty:</span>
//             <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 font-medium">
//               {product.stock}
//             </span>
//           </div>
          
//           {/* Action Buttons */}
//           <div className="flex space-x-1">
//             <button
//               onClick={handleEditClick}
//               className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
//               aria-label="Edit product"
//             >
//               <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
//               </svg>
//             </button>
//             <button
//               onClick={() => onRemoveFromStore(product.id)}
//               className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
//               aria-label="Remove from store"
//             >
//               <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Edit Product Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 flex bg-black/30 justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
//               <button
//                 type="button"
//                 onClick={() => setShowEditModal(false)}
//                 className="text-gray-400 hover:text-gray-600 focus:outline-none"
//                 aria-label="Close"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
            
//             <form onSubmit={handleSaveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="md:col-span-1 space-y-4">
//                 <div>
//                   <label htmlFor="edit-name" className="block text-gray-700 text-sm font-medium mb-2">
//                     Product Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="edit-name"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     value={editingProduct.name}
//                     onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="edit-price" className="block text-gray-700 text-sm font-medium mb-2">
//                     Price (Rs.) <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     id="edit-price"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     value={editingProduct.price}
//                     onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
//                     step="0.01"
//                     min="0"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="edit-stock" className="block text-gray-700 text-sm font-medium mb-2">
//                     Stock Amount <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     id="edit-stock"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     value={editingProduct.stock}
//                     onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
//                     min="0"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="edit-description" className="block text-gray-700 text-sm font-medium mb-2">
//                     Description <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     id="edit-description"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
//                     value={editingProduct.description}
//                     onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
//                     rows="4"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="md:col-span-1">
//                 <label className="block text-gray-700 text-sm font-medium mb-2">
//                   Product Image
//                 </label>
//                 <div
//                   className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
//                   onDragOver={handleDragOver}
//                   onDrop={handleDrop}
//                   onClick={() => document.getElementById('edit-image-upload').click()}
//                 >
//                   {currentDisplayImage ? (
//                     <div className="w-full h-full flex items-center justify-center p-2">
//                       <img 
//                         src={currentDisplayImage} 
//                         alt="Product Preview" 
//                         className="max-w-full max-h-full object-contain rounded-lg" 
//                       />
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center py-5">
//                       <svg
//                         className="w-10 h-10 mb-3 text-gray-400"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                         />
//                       </svg>
//                       <p className="mb-2 text-sm text-gray-500">
//                         <span className="font-semibold">Click to upload</span> or drag and drop
//                       </p>
//                       <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                     </div>
//                   )}

//                   <input 
//                     id="edit-image-upload" 
//                     type="file" 
//                     className="hidden" 
//                     onChange={handleImageUpload} 
//                     accept="image/png, image/jpeg, image/gif, image/webp" 
//                   />
//                 </div>
//               </div>

//               <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowEditModal(false)}
//                   className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CurrentStorefrontProductCard;































// import React, { useState } from 'react';

// const getStockStatusColor = (status) => {
//   switch (status) {
//     case 'In Stock':
//       return 'text-green-600 bg-green-100 border border-green-200';
//     case 'Low Stock':
//       return 'text-amber-600 bg-amber-50 border border-amber-200';
//     case 'Out of Stock':
//       return 'text-red-600 bg-red-50 border border-red-200';
//     default:
//       return 'text-gray-600 bg-gray-50 border border-gray-200';
//   }
// };

// const CurrentStorefrontProductCard = ({ product, onRemoveFromStore }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const placeholderImage = 'https://via.placeholder.com/80x80?text=No+Image';

//   return (
//     <div 
//       className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-4"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Product Image */}
//       <div className="w-24 h-24 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
//         <img
//           src={product.imageUrl || placeholderImage}
//           alt={product.name}
//           className="w-full h-full object-cover"
//           onError={(e) => {e.target.onerror = null; e.target.src = placeholderImage;}}
//         />
//       </div>

//       {/* Product Details */}
//       <div className="flex-grow">
//         <h3 className="text-lg font-medium text-gray-800 mb-1">{product.name}</h3>
//         <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
//         <div className="flex flex-wrap items-center gap-3">
//           <span className="font-bold text-blue-600">${product.price.toFixed(2)}</span>
//           <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStockStatusColor(product.status)}`}>
//             {product.status}
//           </span>
//         </div>
//       </div>

//       {/* Stock Display and Actions */}
//       <div className="flex flex-col sm:flex-row items-center gap-4 mt-3 sm:mt-0">
//         {/* Stock Quantity Display */}
//         <div className="flex items-center">
//           <span className="text-sm text-gray-600 mr-2">Qty:</span>
//           <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 font-medium">
//             {product.stock}
//           </span>
//         </div>
        
//         {/* Action Buttons */}
//         <div className="flex space-x-1">
//           <button
//             onClick={() => alert('Edit functionality not implemented')}
//             className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
//             aria-label="Edit product"
//           >
//             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
//             </svg>
//           </button>
//           <button
//             onClick={() => onRemoveFromStore(product.id)}
//             className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
//             aria-label="Remove from store"
//           >
//             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CurrentStorefrontProductCard;
