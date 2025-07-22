import React, { useState, useRef } from 'react';

// Product images (you should replace these with actual image paths from your assets)
const productImages = {
  'Paracetamol 500mg': '/src/assets/img/meds/Panadol.jpg',
  'Multivitamin Tablets': '/src/assets/img/meds/allergy_relief.jpg',
  'Antibiotic - Amoxicillin': '/src/assets/img/meds/cough_syrup.jpg',
  'Vitamin D3 Supplements': '/src/assets/img/meds/Vitamin_c.jpg',
  'Aspirin 100mg': '/src/assets/img/meds/Ibuprofen.jpg',
  'Insulin': '/src/assets/img/meds/Antacid.jpg',
  // Default image for products without specific images
  'default': '/src/assets/img/meds/paracetamol.webp'
};

// Sample data for demonstration
const sampleProducts = [
  {
    id: 'P001',
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    sales: 125000,
    units: 2500,
    growth: 12.5
  },
  {
    id: 'P002',
    name: 'Multivitamin Tablets',
    category: 'Supplements',
    sales: 98000,
    units: 1800,
    growth: 8.3
  },
  {
    id: 'P003',
    name: 'Antibiotic - Amoxicillin',
    category: 'Antibiotics',
    sales: 156000,
    units: 1200,
    growth: -2.1
  },
  {
    id: 'P004',
    name: 'Vitamin D3 Supplements',
    category: 'Vitamins',
    sales: 87000,
    units: 2100,
    growth: 15.7
  },
  {
    id: 'P005',
    name: 'Aspirin 100mg',
    category: 'Pain Relief',
    sales: 67000,
    units: 1650,
    growth: 5.2
  }
];

// Get image for a product, fallback to default if not found
const getProductImage = (productName) => {
  return productImages[productName] || productImages.default;
};

const TopProductsTable = ({ products = sampleProducts }) => {
  const [sortField, setSortField] = useState('sales');
  const [sortDirection, setSortDirection] = useState('desc');
  const scrollContainerRef = useRef(null);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  // Handle horizontal scrolling with arrows
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      if (direction === 'left') {
        scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Render sort buttons for product cards
  const renderSortButtons = () => (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <span className="text-sm font-medium text-gray-600">Sort by:</span>
      {['sales', 'units', 'growth'].map(field => (
        <button
          key={field}
          onClick={() => handleSort(field)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 ${
            sortField === field
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md'
          }`}
        >
          {field === 'sales' ? 'Revenue' : field === 'units' ? 'Units Sold' : 'Growth'}
          {sortField === field && (
            <span className="ml-2 inline-block transition-transform duration-200">
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Top Selling Products</h3>
          <p className="text-gray-500">Performance overview of your best products</p>
        </div>
      </div>

      {renderSortButtons()}

      <div className="relative group">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          {sortedProducts.map((product, index) => (
            <div
              key={product.id}
              className="flex-none w-[300px] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 snap-start"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-44 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img
                  src={getProductImage(product.name)}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = productImages.default;
                  }}
                />
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                    product.growth >= 0 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {product.growth >= 0 ? '+' : ''}{product.growth}%
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 pb-4 px-4">
                  <h4 className="text-white font-bold text-lg truncate drop-shadow-lg">{product.name}</h4>
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-200">
                    {product.category}
                  </div>
                  <div className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                    ID: {product.id}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Revenue</p>
                    <p className="text-lg font-bold text-gray-900">Rs.{product.sales.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Units Sold</p>
                    <p className="text-lg font-bold text-gray-900">{product.units.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Sales Performance</span>
                    <span className={`text-sm font-semibold ${
                      product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.growth >= 0 ? '📈 Increasing' : '📉 Decreasing'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        product.growth >= 0 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'
                      }`}
                      style={{ 
                        width: `${Math.min(Math.abs(product.growth) * 3, 100)}%`,
                        boxShadow: `0 0 10px ${product.growth >= 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Navigation Arrows */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 transform hover:scale-110 opacity-0 group-hover:opacity-100 z-10"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 transform hover:scale-110 opacity-0 group-hover:opacity-100 z-10"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {sortedProducts.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 bg-gray-300 rounded-full transition-all duration-300"
          />
        ))}
      </div>
    </div>
  );
};

export default TopProductsTable;


























// import React, { useState, useRef } from 'react';

// // Product images (you should replace these with actual image paths from your assets)
// const productImages = {
//   'Paracetamol 500mg': '/src/assets/img/meds/Panadol.jpg',
//   'Multivitamin Tablets': '/src/assets/img/meds/allergy_relief.jpg',
//   'Antibiotic - Amoxicillin': '/src/assets/img/meds/cough_syrup.jpg',
//   'Vitamin D3 Supplements': '/src/assets/img/meds/Vitamin_c.jpg',
//   'Aspirin 100mg': '/src/assets/img/meds/Ibuprofen.jpg',
//   'Insulin': '/src/assets/img/meds/Antacid.jpg',
//   // Default image for products without specific images
//   'default': '/src/assets/img/meds/paracetamol.webp'
// };

// // Get image for a product, fallback to default if not found
// const getProductImage = (productName) => {
//   return productImages[productName] || productImages.default;
// };

// const TopProductsTable = ({ products }) => {
//   const [sortField, setSortField] = useState('sales');
//   const [sortDirection, setSortDirection] = useState('desc');
//   const scrollContainerRef = useRef(null); // Ref for the scrollable container

//   const handleSort = (field) => {
//     if (field === sortField) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('desc');
//     }
//   };

//   const sortedProducts = [...products].sort((a, b) => {
//     if (sortDirection === 'asc') {
//       return a[sortField] > b[sortField] ? 1 : -1;
//     } else {
//       return a[sortField] < b[sortField] ? 1 : -1;
//     }
//   });

//   // Handle horizontal scrolling with arrows
//   const scroll = (direction) => {
//     if (scrollContainerRef.current) {
//       // Adjust scrollAmount based on your card width and gap for smooth navigation
//       const scrollAmount = 320; // Example: card width (280px) + gap (16px, assuming tailwind `gap-4`) + some buffer
//       if (direction === 'left') {
//         scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
//       } else {
//         scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//       }
//     }
//   };

//   // Render sort buttons for product cards
//   const renderSortButtons = () => (
//     <div className="flex flex-wrap items-center gap-2 mb-4">
//       <span className="text-sm text-gray-500">Sort by:</span>
//       {['sales', 'units', 'growth'].map(field => (
//         <button
//           key={field}
//           onClick={() => handleSort(field)}
//           className={`px-3 py-1 text-sm rounded-full transition-colors ${
//             sortField === field
//               ? 'bg-blue-600 text-white'
//               : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//           }`}
//         >
//           {field === 'sales' ? 'Revenue' : field === 'units' ? 'Units Sold' : 'Growth'}
//           {sortField === field && (
//             <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
//           )}
//         </button>
//       ))}
//     </div>
//   );

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-lg font-semibold text-gray-800">Top Selling Products</h3>
//         {renderSortButtons()}
//       </div>

//       <div className="relative"> {/* Added relative positioning for arrows */}
//         <div
//           ref={scrollContainerRef}
//           className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar" // Flex container for horizontal scroll, hide-scrollbar for custom scrollbar hiding
//         >
//           {sortedProducts.map((product) => (
//             <div
//               key={product.id}
//               className="flex-none w-[280px] border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow" // Ensures cards don't shrink and maintains a fixed width
//             >
//               <div className="relative h-36 bg-gray-100"> {/* Reduced image height for smaller cards */}
//                 <img
//                   src={getProductImage(product.name)}
//                   alt={product.name}
//                   className="h-full w-full object-cover"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = productImages.default; // Fallback to default image on error
//                   }}
//                 />
//                 <div className="absolute top-2 right-2">
//                   <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
//                     product.growth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                     {product.growth >= 0 ? '+' : ''}{product.growth}%
//                   </span>
//                 </div>
//                 <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-2 px-3">
//                   <h4 className="text-white font-semibold text-base truncate">{product.name}</h4> {/* Smaller font for product name */}
//                 </div>
//               </div>

//               <div className="p-3"> {/* Reduced padding for card content */}
//                 <div className="flex justify-between items-center mb-1">
//                   <div className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
//                     {product.category}
//                   </div>
//                   <div className="text-xs text-gray-500">ID: {product.id}</div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3 mt-3">
//                   <div>
//                     <p className="text-xs text-gray-500">Revenue</p>
//                     <p className="text-base font-bold text-gray-900">${product.sales.toLocaleString()}</p> {/* Smaller font for revenue */}
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Units Sold</p>
//                     <p className="text-base font-bold text-gray-900">{product.units.toLocaleString()}</p> {/* Smaller font for units sold */}
//                   </div>
//                 </div>

//                 <div className="mt-3">
//                   <div className="flex justify-between items-center mb-0.5">
//                     <span className="text-xs text-gray-500">Sales Performance</span>
//                     <span className="text-xs font-medium text-gray-700">{product.growth >= 0 ? 'Increasing' : 'Decreasing'}</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-1"> {/* Reduced height for progress bar */}
//                     <div
//                       className={`h-1 rounded-full ${product.growth >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
//                       style={{ width: `${Math.min(Math.abs(product.growth) * 3, 100)}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Navigation Arrows */}
//         <button
//           onClick={() => scroll('left')}
//           className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
//         >
//           &#8592; {/* Left arrow icon */}
//         </button>
//         <button
//           onClick={() => scroll('right')}
//           className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
//         >
//           &#8594; {/* Right arrow icon */}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TopProductsTable;











































// import React, { useState } from 'react';

// const TopProductsTable = ({ products }) => {
//   const [sortField, setSortField] = useState('sales');
//   const [sortDirection, setSortDirection] = useState('desc');

//   const handleSort = (field) => {
//     if (field === sortField) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('desc');
//     }
//   };

//   const sortedProducts = [...products].sort((a, b) => {
//     if (sortDirection === 'asc') {
//       return a[sortField] > b[sortField] ? 1 : -1;
//     } else {
//       return a[sortField] < b[sortField] ? 1 : -1;
//     }
//   });

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//       <div className="p-6 border-b border-gray-200">
//         <h3 className="text-lg font-semibold text-gray-800">Top Selling Products</h3>
//       </div>
      
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th 
//                 scope="col" 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//               >
//                 Product
//               </th>
//               <th 
//                 scope="col" 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort('category')}
//               >
//                 Category
//                 {sortField === 'category' && (
//                   <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
//                 )}
//               </th>
//               <th 
//                 scope="col" 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort('sales')}
//               >
//                 Sales
//                 {sortField === 'sales' && (
//                   <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
//                 )}
//               </th>
//               <th 
//                 scope="col" 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort('units')}
//               >
//                 Units Sold
//                 {sortField === 'units' && (
//                   <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
//                 )}
//               </th>
//               <th 
//                 scope="col" 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                 onClick={() => handleSort('growth')}
//               >
//                 Growth
//                 {sortField === 'growth' && (
//                   <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
//                 )}
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {sortedProducts.map((product) => (
//               <tr key={product.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="font-medium text-gray-900">{product.name}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-500">{product.category}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">${product.sales.toLocaleString()}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{product.units.toLocaleString()}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                     product.growth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                     {product.growth >= 0 ? '+' : ''}{product.growth}%
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TopProductsTable;