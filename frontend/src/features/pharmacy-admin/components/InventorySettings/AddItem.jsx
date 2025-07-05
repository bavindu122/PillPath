import React, { useState } from 'react';

const AddItem = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !stock || !description) {
      alert('Please fill in all required fields (Name, Price, Stock, Description).');
      return;
    }

    const newItem = {
      id: Date.now(),
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      status: parseInt(stock, 10) > 10 ? 'In Stock' : (parseInt(stock, 10) > 0 ? 'Low Stock' : 'Out of Stock'),
      imageUrl: image ? URL.createObjectURL(image) : null,
    };
    onSave(newItem);
    setName('');
    setPrice('');
    setStock('');
    setDescription('');
    setImage(null);
    onClose();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Allow dropping files
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex bg-primary/20 backdrop-blur-sm justify-center items-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-2xl mx-auto" >
        {/* //style={{ background: 'linear-gradient(to bottom right, #e0f2f7, #c1d9e7)' }} */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Product</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Cancel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div>
              <label htmlFor="name" className="block text-white text-sm font-semibold mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-white text-sm font-semibold mb-2">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-white text-sm font-semibold mb-2">
                Stock Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="stock"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-white text-sm font-semibold mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4" // Adjusted rows for better fit in the new layout
                required
              ></textarea>
            </div>
          </div>

          <div className="md:col-span-1">
            <label htmlFor="image-upload" className="block text-white text-sm font-semibold mb-2">
              Product Image
            </label>
            <div
              className="flex flex-col items-center justify-center w-full h-72 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 p-4"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('image-upload').click()}
            >
              {!image ? (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L7 9m3-3 3 3"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <img src={URL.createObjectURL(image)} alt="Product Preview" className="max-w-full max-h-full object-contain rounded-lg shadow-md" />
                </div>
              )}
              <input id="image-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg, image/gif" />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-white text-blue-600 border border-blue-600 font-bold py-2 px-6 rounded-full hover:bg-blue-50 focus:outline-none focus:shadow-outline transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-200"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;





// import React, { useState } from 'react';

// const AddItem = ({ isOpen, onClose, onSave }) => {
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [stock, setStock] = useState('');
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState(null);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!name || !price || !stock || !description) {
//       alert('Please fill in all required fields (Name, Price, Stock, Description).');
//       return;
//     }

//     const newItem = {
//       id: Date.now(),
//       name,
//       description,
//       price: parseFloat(price),
//       stock: parseInt(stock, 10),
//       status: parseInt(stock, 10) > 10 ? 'In Stock' : (parseInt(stock, 10) > 0 ? 'Low Stock' : 'Out of Stock'),
//       imageUrl: image ? URL.createObjectURL(image) : null,
//     };
//     onSave(newItem);
//     setName('');
//     setPrice('');
//     setStock('');
//     setDescription('');
//     setImage(null);
//     onClose();
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-auto">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
//               Product Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="name"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
//               Price ($) <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="number"
//               id="price"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               step="0.01"
//               min="0"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-2">
//               Stock Amount <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="number"
//               id="stock"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={stock}
//               onChange={(e) => setStock(e.target.value)}
//               min="0"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
//               Description <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               id="description"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows="3"
//               required
//             ></textarea>
//           </div>

//           <div className="mb-6">
//             <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
//               Product Image
//             </label>
//             <div className="flex justify-center items-center w-full">
//               <label
//                 htmlFor="dropzone-file"
//                 className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
//               >
//                 {!image ? (
//                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                     <svg
//                       className="w-8 h-8 mb-4 text-gray-500"
//                       aria-hidden="true"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 20 16"
//                     >
//                       <path
//                         stroke="currentColor"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L7 9m3-3 3 3"
//                       />
//                     </svg>
//                     <p className="mb-2 text-sm text-gray-500">
//                       <span className="font-semibold">Click to upload</span> or drag and drop
//                     </p>
//                     <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 800x400px)</p>
//                   </div>
//                 ) : (
//                   <div className="p-2">
//                     <img src={URL.createObjectURL(image)} alt="Product Preview" className="max-h-40 object-contain mx-auto rounded-lg shadow-md" />
//                   </div>
//                 )}
//                 <input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
//               </label>
//             </div>
//           </div>

//           <div className="flex justify-end space-x-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               Save Product
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddItem;



























