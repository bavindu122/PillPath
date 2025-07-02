import React, { useState } from 'react';
import { Camera, MapPin, Phone, Mail, Store, Edit } from 'lucide-react'; // Changed BuildingStore to Store

export default function PharmacySettings() {
  const [pharmacyName, setPharmacyName] = useState('PharmaCare Pharmacy');
  const [address, setAddress] = useState('123 Main Street, Anytown, USA 12345');
  const [contactNumber, setContactNumber] = useState('+1 (555) 123-4567');
  const [email, setEmail] = useState('info@pharmacare.com');
  const [pharmacyImages, setPharmacyImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setPharmacyImages(prevImages => [...prevImages, ...newImages]);
  };

  const handleSave = () => {
    // In a real application, you would send this data to a backend
    console.log('Saving pharmacy details:', { pharmacyName, address, contactNumber, email, pharmacyImages });
    setIsEditing(false);
  };

  return (
    // Main container with a subtle gradient background and padding
    <div className="min-h-screen bg-[var(--color-bg-light)] p-4 sm:p-6 lg:p-10 font-inter">

      {/* Page title */}
      {/* <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center drop-shadow-sm">
        Pharmacy Settings
      </h2> */}

      {/* Main content card */}
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl max-w-4xl mx-auto transform transition-all duration-300 hover:scale-[1.005]">
        {/* Header for the profile section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b pb-4 border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Pharmacy Profile</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Edit className="h-5 w-5 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Grid layout for form fields and image upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column: Pharmacy details */}
          <div className="space-y-6">
            {/* Pharmacy Name */}
            <div>
              <label htmlFor="pharmacyName" className="block text-sm font-semibold text-gray-700 mb-2">
                <Store className="inline-block h-4 w-4 mr-2 text-blue-500" /> {/* Changed BuildingStore to Store */}
                Pharmacy Name
              </label>
              <input
                type="text"
                id="pharmacyName"
                value={pharmacyName}
                onChange={(e) => setPharmacyName(e.target.value)}
                disabled={!isEditing}
                className={`w-full px-5 py-3 border rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  isEditing ? 'border-gray-300 bg-white shadow-sm' : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                }`}
              />
            </div>
            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="inline-block h-4 w-4 mr-2 text-blue-500" />
                Address
              </label>
              <div className="relative">
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows="3"
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-5 py-3 border rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    isEditing ? 'border-gray-300 bg-white shadow-sm' : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                  }`}
                ></textarea>
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            {/* Contact Number */}
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                <Phone className="inline-block h-4 w-4 mr-2 text-blue-500" />
                Contact Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-5 py-3 border rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    isEditing ? 'border-gray-300 bg-white shadow-sm' : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                  }`}
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="inline-block h-4 w-4 mr-2 text-blue-500" />
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-5 py-3 border rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    isEditing ? 'border-gray-300 bg-white shadow-sm' : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                  }`}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Right column: Pharmacy Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Camera className="inline-block h-4 w-4 mr-2 text-blue-500" />
              Pharmacy Images
            </label>
            <div className="mt-2 flex justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="text-center">
                {pharmacyImages.length === 0 && (
                  <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                )}
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className={`relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500 transition-colors duration-200 ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleImageUpload}
                      multiple
                      accept="image/*"
                      disabled={!isEditing}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  {pharmacyImages.map((image, index) => (
                    <img key={index} src={image} alt={`Pharmacy ${index + 1}`} className="h-28 w-28 object-cover rounded-lg shadow-md border border-gray-200" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Changes button, only visible when editing */}
        {isEditing && (
          <div className="mt-10 flex justify-end">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}






// // PharmacySettings.jsx
// import React, { useState } from 'react';
// import { Camera, MapPin, Phone, Mail, BuildingStore, Edit } from 'lucide-react'; // Added icons

// export default function PharmacySettings() {
//   const [pharmacyName, setPharmacyName] = useState('PharmaCare Pharmacy');
//   const [address, setAddress] = useState('123 Main Street, Anytown, USA 12345');
//   const [contactNumber, setContactNumber] = useState('+1 (555) 123-4567');
//   const [email, setEmail] = useState('info@pharmacare.com');
//   const [pharmacyImages, setPharmacyImages] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);

//   const handleImageUpload = (event) => {
//     const files = Array.from(event.target.files);
//     const newImages = files.map(file => URL.createObjectURL(file));
//     setPharmacyImages(prevImages => [...prevImages, ...newImages]);
//   };

//   const handleSave = () => {
//     // In a real application, you would send this data to a backend
//     console.log('Saving pharmacy details:', { pharmacyName, address, contactNumber, email, pharmacyImages });
//     setIsEditing(false);
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <h2 className="text-3xl font-bold text-gray-800 mb-8">Pharmacy Settings</h2>

//       <div className="bg-white p-8 rounded-lg shadow-xl mb-8">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-semibold text-gray-800">Pharmacy Profile</h3>
//           <button
//             onClick={() => setIsEditing(!isEditing)}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md"
//           >
//             <Edit className="h-5 w-5 mr-2" />
//             {isEditing ? 'Cancel' : 'Edit Profile'}
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="pharmacyName" className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Name</label>
//               <input
//                 type="text"
//                 id="pharmacyName"
//                 value={pharmacyName}
//                 onChange={(e) => setPharmacyName(e.target.value)}
//                 disabled={!isEditing}
//                 className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'}`}
//               />
//             </div>
//             <div>
//               <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//               <div className="relative">
//                 <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <textarea
//                   id="address"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   rows="3"
//                   disabled={!isEditing}
//                   className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'}`}
//                 ></textarea>
//               </div>
//             </div>
//             <div>
//               <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   id="contactNumber"
//                   value={contactNumber}
//                   onChange={(e) => setContactNumber(e.target.value)}
//                   disabled={!isEditing}
//                   className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'}`}
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   disabled={!isEditing}
//                   className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'}`}
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Images</label>
//             <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10">
//               <div className="text-center">
//                 {pharmacyImages.length === 0 && (
//                   <Camera className="mx-auto h-12 w-12 text-gray-400" />
//                 )}
//                 <div className="mt-4 flex text-sm leading-6 text-gray-600">
//                   <label
//                     htmlFor="file-upload"
//                     className={`relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500 ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   >
//                     <span>Upload a file</span>
//                     <input
//                       id="file-upload"
//                       name="file-upload"
//                       type="file"
//                       className="sr-only"
//                       onChange={handleImageUpload}
//                       multiple
//                       accept="image/*"
//                       disabled={!isEditing}
//                     />
//                   </label>
//                   <p className="pl-1">or drag and drop</p>
//                 </div>
//                 <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
//                 <div className="mt-4 flex flex-wrap gap-2 justify-center">
//                   {pharmacyImages.map((image, index) => (
//                     <img key={index} src={image} alt={`Pharmacy ${index + 1}`} className="h-24 w-24 object-cover rounded-lg shadow-sm" />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {isEditing && (
//           <div className="mt-8 flex justify-end">
//             <button
//               onClick={handleSave}
//               className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 shadow-md"
//             >
//               Save Changes
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }