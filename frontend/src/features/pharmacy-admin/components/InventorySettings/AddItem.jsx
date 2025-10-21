import React, { useState } from "react";

const AddItem = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [dosage, setDosage] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [packSize, setPackSize] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Pain Relief",
    "Cold & Flu",
    "Digestive Health",
    "Vitamins",
    "Allergy Relief",
    "Skin Care",
    "Eye Care",
    "First Aid",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !price ||
      !stock ||
      !description ||
      !category ||
      !dosage ||
      !manufacturer ||
      !packSize
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      alert("Price must be a positive number.");
      return;
    }

    if (isNaN(stock) || parseInt(stock, 10) < 0) {
      alert("Stock must be a non-negative integer.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newItem = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        image: image,
        category: category,
        dosage: dosage.trim(),
        manufacturer: manufacturer.trim(),
        packSize: packSize.trim(),
      };

      console.log("Submitting product:", {
        name: newItem.name,
        price: newItem.price,
        stock: newItem.stock,
        category: newItem.category,
        dosage: newItem.dosage,
        manufacturer: newItem.manufacturer,
        packSize: newItem.packSize,
        hasImage: !!newItem.image,
      });

      await onSave(newItem);

      // Reset form
      setName("");
      setPrice("");
      setStock("");
      setDescription("");
      setImage(null);
      setCategory("");
      setDosage("");
      setManufacturer("");
      setPackSize("");
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validImageTypes.includes(file.type)) {
        alert("Please upload a valid image file (jpg, png, gif, webp).");
        return;
      }

      setImage(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (validImageTypes.includes(file.type)) {
        if (file.size > 5 * 1024 * 1024) {
          alert("File size must be less than 5MB");
          return;
        }
        setImage(file);
      } else {
        alert("Please upload a valid image file (jpg, png, gif, webp).");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Add New Product
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form
          id="add-item-form"
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Price (Rs.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                  disabled={isSubmitting}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Stock Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                  required
                  disabled={isSubmitting}
                  placeholder="0"
                />
              </div>

              <div>
                <label
                  htmlFor="dosage"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Dosage <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="dosage"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="e.g., 500mg, 10ml"
                />
              </div>

              <div>
                <label
                  htmlFor="manufacturer"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Manufacturer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="manufacturer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter manufacturer name"
                />
              </div>

              <div>
                <label
                  htmlFor="packSize"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Pack Size <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="packSize"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={packSize}
                  onChange={(e) => setPackSize(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="e.g., 10 tablets, 100ml"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  required
                  disabled={isSubmitting}
                  placeholder="Enter product description"
                ></textarea>
              </div>
            </div>

            <div className="md:col-span-1">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Product Image
              </label>
              <div
                className="flex flex-col items-center justify-center w-full h-48 md:h-56 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() =>
                  !isSubmitting &&
                  document.getElementById("image-upload").click()
                }
              >
                {image ? (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <img
                      src={URL.createObjectURL(image)}
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}

                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Spacer to ensure content not hidden behind sticky footer */}
          <div className="h-2" />
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t sticky bottom-0 bg-white z-10 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-item-form"
            disabled={isSubmitting}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && (
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        </div>
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
//   const [category, setCategory] = useState('');
//   const [dosage, setDosage] = useState('');
//   const [manufacturer, setManufacturer] = useState('');
//   const [packSize, setPackSize] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const categories = [
//     'Pain Relief',
//     'Cold & Flu',
//     'Digestive Health',
//     'Vitamins',
//     'Allergy Relief',
//     'Skin Care',
//     'Eye Care',
//     'First Aid'
//   ];

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!name || !price || !stock || !description) {
//       alert('Please fill in all required fields (Name, Price, Stock, Description).');
//       return;
//     }

//     if (isNaN(price) || parseFloat(price) <= 0) {
//       alert('Price must be a positive number.');
//       return;
//     }

//     if (isNaN(stock) || parseInt(stock, 10) < 0) {
//       alert('Stock must be a non-negative integer.');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const newItem = {
//         name: name.trim(),
//         description: description.trim(),
//         price: parseFloat(price),
//         stock: parseInt(stock, 10),
//         image: image,
//         category: category || null,
//         dosage: dosage.trim() || null,
//         manufacturer: manufacturer.trim() || null,
//         packSize: packSize.trim() || null
//       };

//       console.log('Submitting product:', {
//         name: newItem.name,
//         price: newItem.price,
//         stock: newItem.stock,
//         category: newItem.category,
//         dosage: newItem.dosage,
//         manufacturer: newItem.manufacturer,
//         packSize: newItem.packSize,
//         hasImage: !!newItem.image
//       });

//       await onSave(newItem);

//       // Reset form
//       setName('');
//       setPrice('');
//       setStock('');
//       setDescription('');
//       setImage(null);
//       setCategory('');
//       setDosage('');
//       setManufacturer('');
//       setPackSize('');
//       onClose();

//     } catch (error) {
//       console.error('Error saving product:', error);
//       alert('Failed to save product. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];

//       if (file.size > 5 * 1024 * 1024) {
//         alert('File size must be less than 5MB');
//         return;
//       }

//       const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//       if (!validImageTypes.includes(file.type)) {
//         alert('Please upload a valid image file (jpg, png, gif, webp).');
//         return;
//       }

//       setImage(file);
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
//         if (file.size > 5 * 1024 * 1024) {
//           alert('File size must be less than 5MB');
//           return;
//         }
//         setImage(file);
//       } else {
//         alert('Please upload a valid image file (jpg, png, gif, webp).');
//       }
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex bg-black/30 justify-center items-center z-50 overflow-y-auto">
//       <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mx-4 my-8">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={isSubmitting}
//             className="text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
//             aria-label="Close"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="md:col-span-1 space-y-4">
//             <div>
//               <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
//                 Product Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 disabled={isSubmitting}
//                 placeholder="Enter product name"
//               />
//             </div>

//             <div>
//               <label htmlFor="category" className="block text-gray-700 text-sm font-medium mb-2">
//                 Category
//               </label>
//               <select
//                 id="category"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 disabled={isSubmitting}
//               >
//                 <option value="">Select a category</option>
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label htmlFor="price" className="block text-gray-700 text-sm font-medium mb-2">
//                 Price (Rs.) <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 id="price"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 step="0.01"
//                 min="0"
//                 required
//                 disabled={isSubmitting}
//                 placeholder="0.00"
//               />
//             </div>

//             <div>
//               <label htmlFor="stock" className="block text-gray-700 text-sm font-medium mb-2">
//                 Stock Amount <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 id="stock"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={stock}
//                 onChange={(e) => setStock(e.target.value)}
//                 min="0"
//                 required
//                 disabled={isSubmitting}
//                 placeholder="0"
//               />
//             </div>

//             <div>
//               <label htmlFor="dosage" className="block text-gray-700 text-sm font-medium mb-2">
//                 Dosage
//               </label>
//               <input
//                 type="text"
//                 id="dosage"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={dosage}
//                 onChange={(e) => setDosage(e.target.value)}
//                 disabled={isSubmitting}
//                 placeholder="e.g., 500mg, 10ml"
//               />
//             </div>

//             <div>
//               <label htmlFor="manufacturer" className="block text-gray-700 text-sm font-medium mb-2">
//                 Manufacturer
//               </label>
//               <input
//                 type="text"
//                 id="manufacturer"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={manufacturer}
//                 onChange={(e) => setManufacturer(e.target.value)}
//                 disabled={isSubmitting}
//                 placeholder="Enter manufacturer name"
//               />
//             </div>

//             <div>
//               <label htmlFor="packSize" className="block text-gray-700 text-sm font-medium mb-2">
//                 Pack Size
//               </label>
//               <input
//                 type="text"
//                 id="packSize"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={packSize}
//                 onChange={(e) => setPackSize(e.target.value)}
//                 disabled={isSubmitting}
//                 placeholder="e.g., 10 tablets, 100ml"
//               />
//             </div>

//             <div>
//               <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
//                 Description <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 id="description"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 rows="4"
//                 required
//                 disabled={isSubmitting}
//                 placeholder="Enter product description"
//               ></textarea>
//             </div>
//           </div>

//           <div className="md:col-span-1">
//             <label className="block text-gray-700 text-sm font-medium mb-2">
//               Product Image
//             </label>
//             <div
//               className="flex flex-col items-center justify-center w-full h-full min-h-[300px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
//               onDragOver={handleDragOver}
//               onDrop={handleDrop}
//               onClick={() => !isSubmitting && document.getElementById('image-upload').click()}
//             >
//               {image ? (
//                 <div className="w-full h-full flex items-center justify-center p-2">
//                   <img
//                     src={URL.createObjectURL(image)}
//                     alt="Product Preview"
//                     className="max-w-full max-h-full object-contain rounded-lg"
//                   />
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center py-5">
//                   <svg
//                     className="w-10 h-10 mb-3 text-gray-400"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                     />
//                   </svg>
//                   <p className="mb-2 text-sm text-gray-500">
//                     <span className="font-semibold">Click to upload</span> or drag and drop
//                   </p>
//                   <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
//                 </div>
//               )}

//               <input
//                 id="image-upload"
//                 type="file"
//                 className="hidden"
//                 onChange={handleImageChange}
//                 accept="image/png, image/jpeg, image/gif, image/webp"
//                 disabled={isSubmitting}
//               />
//             </div>
//           </div>

//           <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isSubmitting}
//               className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
//             >
//               {isSubmitting && (
//                 <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               )}
//               {isSubmitting ? 'Saving...' : 'Save Product'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddItem;

// import React, { useState } from 'react';

// const AddItem = ({ isOpen, onClose, onSave }) => {
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [stock, setStock] = useState('');
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!name || !price || !stock || !description) {
//       alert('Please fill in all required fields (Name, Price, Stock, Description).');
//       return;
//     }

//     if (isNaN(price) || parseFloat(price) <= 0) {
//       alert('Price must be a positive number.');
//       return;
//     }

//     if (isNaN(stock) || parseInt(stock, 10) < 0) {
//       alert('Stock must be a non-negative integer.');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const newItem = {
//         name: name.trim(),
//         description: description.trim(),
//         price: parseFloat(price),
//         stock: parseInt(stock, 10),
//         image: image // Pass the File object directly, not base64
//       };

//       console.log('Submitting product:', {
//         name: newItem.name,
//         price: newItem.price,
//         stock: newItem.stock,
//         hasImage: !!newItem.image
//       });

//       // Call the onSave function which should handle the API call
//       await onSave(newItem);

//       // Reset form
//       setName('');
//       setPrice('');
//       setStock('');
//       setDescription('');
//       setImage(null);
//       onClose();

//     } catch (error) {
//       console.error('Error saving product:', error);
//       alert('Failed to save product. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];

//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         alert('File size must be less than 5MB');
//         return;
//       }

//       // Validate file type
//       const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//       if (!validImageTypes.includes(file.type)) {
//         alert('Please upload a valid image file (jpg, png, gif, webp).');
//         return;
//       }

//       setImage(file);
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
//         if (file.size > 5 * 1024 * 1024) {
//           alert('File size must be less than 5MB');
//           return;
//         }
//         setImage(file);
//       } else {
//         alert('Please upload a valid image file (jpg, png, gif, webp).');
//       }
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex bg-black/30 justify-center items-center z-50">
//       <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={isSubmitting}
//             className="text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
//             aria-label="Close"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="md:col-span-1 space-y-4">
//             <div>
//               <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
//                 Product Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 disabled={isSubmitting}
//                 placeholder="Enter product name"
//               />
//             </div>

//             <div>
//               <label htmlFor="price" className="block text-gray-700 text-sm font-medium mb-2">
//                 Price (Rs.) <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 id="price"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 step="0.01"
//                 min="0"
//                 required
//                 disabled={isSubmitting}
//                 placeholder="0.00"
//               />
//             </div>

//             <div>
//               <label htmlFor="stock" className="block text-gray-700 text-sm font-medium mb-2">
//                 Stock Amount <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 id="stock"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={stock}
//                 onChange={(e) => setStock(e.target.value)}
//                 min="0"
//                 required
//                 disabled={isSubmitting}
//                 placeholder="0"
//               />
//             </div>

//             <div>
//               <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
//                 Description <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 id="description"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 rows="4"
//                 required
//                 disabled={isSubmitting}
//                 placeholder="Enter product description"
//               ></textarea>
//             </div>
//           </div>

//           <div className="md:col-span-1">
//             <label className="block text-gray-700 text-sm font-medium mb-2">
//               Product Image
//             </label>
//             <div
//               className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
//               onDragOver={handleDragOver}
//               onDrop={handleDrop}
//               onClick={() => !isSubmitting && document.getElementById('image-upload').click()}
//             >
//               {image ? (
//                 <div className="w-full h-full flex items-center justify-center p-2">
//                   <img
//                     src={URL.createObjectURL(image)}
//                     alt="Product Preview"
//                     className="max-w-full max-h-full object-contain rounded-lg"
//                   />
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center py-5">
//                   <svg
//                     className="w-10 h-10 mb-3 text-gray-400"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                     />
//                   </svg>
//                   <p className="mb-2 text-sm text-gray-500">
//                     <span className="font-semibold">Click to upload</span> or drag and drop
//                   </p>
//                   <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
//                 </div>
//               )}

//               <input
//                 id="image-upload"
//                 type="file"
//                 className="hidden"
//                 onChange={handleImageChange}
//                 accept="image/png, image/jpeg, image/gif, image/webp"
//                 disabled={isSubmitting}
//               />
//             </div>
//           </div>

//           <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isSubmitting}
//               className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
//             >
//               {isSubmitting && (
//                 <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               )}
//               {isSubmitting ? 'Saving...' : 'Save Product'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddItem;
