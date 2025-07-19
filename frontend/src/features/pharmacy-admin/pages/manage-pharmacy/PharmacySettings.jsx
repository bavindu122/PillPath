import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, Phone, Mail, Store, Edit, Sparkles, Shield, Award } from 'lucide-react';

export default function PharmacySettings() {
  const [pharmacyName, setPharmacyName] = useState('PharmaCare Pharmacy');
  const [address, setAddress] = useState('123 Main Street, Anytown, USA 12345');
  const [contactNumber, setContactNumber] = useState('+1 (555) 123-4567');
  const [email, setEmail] = useState('info@pharmacare.com');
  const [pharmacyImages, setPharmacyImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Track created object URLs for cleanup
  const objectUrlsRef = useRef([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.push(url);
      return url;
    });
    setPharmacyImages(prevImages => [...prevImages, ...newImages]);
  };

  useEffect(() => {
    // Cleanup function to revoke object URLs on unmount
    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  const handleSave = () => {
    // In a real application, you would send this data to a backend
    console.log('Saving pharmacy details:', { pharmacyName, address, contactNumber, email, pharmacyImages });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-md">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Pharmacy Profile
          </h1>
          <p className="text-gray-600">Manage your pharmacy information and showcase your services</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 relative">
          {/* Content */}
          <div>
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Verified Pharmacy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Premium Member</span>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <Edit className="h-5 w-5 mr-2" />
                  <span className="font-medium">
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </span>
                </div>
              </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                {/* Pharmacy Name */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Store className="h-5 w-5 text-blue-600 mr-2" />
                    Pharmacy Name
                  </label>
                  <div>
                    <input
                      type="text"
                      value={pharmacyName}
                      onChange={(e) => setPharmacyName(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-lg text-gray-800 ${
                        isEditing 
                          ? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    Address
                  </label>
                  <div>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows="4"
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-lg text-gray-800 resize-none ${
                        isEditing 
                          ? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-5 w-5 text-blue-600 mr-2" />
                    Contact Number
                  </label>
                  <div>
                    <input
                      type="text"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-lg text-gray-800 ${
                        isEditing 
                          ? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-5 w-5 text-blue-600 mr-2" />
                    Email Address
                  </label>
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border rounded-lg text-gray-800 ${
                        isEditing 
                          ? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div className="space-y-4">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Camera className="h-5 w-5 text-blue-600 mr-2" />
                  Pharmacy Images
                </div>

                {/* Upload Area */}
                <div>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    isEditing 
                      ? 'border-blue-300 bg-blue-50 hover:border-blue-400' 
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}>
                    {pharmacyImages.length === 0 ? (
                      <div className="py-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Camera className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Pharmacy Images</h3>
                        <p className="text-gray-500 mb-4">Showcase your pharmacy with photos</p>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Pharmacy Gallery</h3>
                      </div>
                    )}

                    <label className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors duration-200 ${
                      isEditing ? '' : 'opacity-50 cursor-not-allowed'
                    }`}>
                      <Camera className="h-5 w-5 mr-2" />
                      <span className="font-medium">
                        {pharmacyImages.length === 0 ? 'Choose Photos' : 'Add More Photos'}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        multiple
                        accept="image/*"
                        disabled={!isEditing}
                      />
                    </label>
                    
                    <p className="text-sm text-gray-500 mt-2">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </div>
                </div>

                {/* Image Gallery */}
                {pharmacyImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {pharmacyImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Pharmacy ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg shadow-sm border border-gray-200"
                        />
                        {isEditing && (
                          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                            <Camera className="h-4 w-4 text-gray-600" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    <span className="font-medium">Save Changes</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

















// import React, { useState, useEffect, useRef } from 'react';
// import { Camera, MapPin, Phone, Mail, Store, Edit, Sparkles, Shield, Award } from 'lucide-react';

// export default function PharmacySettings() {
//   const [pharmacyName, setPharmacyName] = useState('PharmaCare Pharmacy');
//   const [address, setAddress] = useState('123 Main Street, Anytown, USA 12345');
//   const [contactNumber, setContactNumber] = useState('+1 (555) 123-4567');
//   const [email, setEmail] = useState('info@pharmacare.com');
//   const [pharmacyImages, setPharmacyImages] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);

//   // Track created object URLs for cleanup
//   const objectUrlsRef = useRef([]);

//   const handleImageUpload = (event) => {
//     const files = Array.from(event.target.files);
//     const newImages = files.map(file => {
//       const url = URL.createObjectURL(file);
//       objectUrlsRef.current.push(url);
//       return url;
//     });
//     setPharmacyImages(prevImages => [...prevImages, ...newImages]);
//   };

//   useEffect(() => {
//     // Cleanup function to revoke object URLs on unmount
//     return () => {
//       objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
//       objectUrlsRef.current = [];
//     };
//   }, []);

//   const handleSave = () => {
//     // In a real application, you would send this data to a backend
//     console.log('Saving pharmacy details:', { pharmacyName, address, contactNumber, email, pharmacyImages });
//     setIsEditing(false);
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//         {/* Floating Elements */}
//         <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
//         <div className="absolute top-32 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
//         <div className="absolute bottom-20 left-32 w-40 h-40 bg-indigo-200 rounded-full opacity-25 animate-pulse"></div>
//         <div className="absolute bottom-40 right-10 w-28 h-28 bg-blue-300 rounded-full opacity-20 animate-bounce"></div>
        
//         {/* Gradient Orbs */}
//         <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-10 blur-3xl animate-pulse"></div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 p-4 sm:p-6 lg:p-10">
//         {/* Header Section */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
//             <Store className="h-8 w-8 text-white" />
//           </div>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
//             Pharmacy Profile
//           </h1>
//           <p className="text-gray-600 text-lg">Manage your pharmacy information and showcase your services</p>
//         </div>

//         {/* Main Card with Glassmorphism */}
//         <div className="max-w-6xl mx-auto">
//           <div className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-12 relative overflow-hidden">
//             {/* Card Background Pattern */}
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30"></div>
//             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
//             <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-indigo-400/10 to-blue-400/10 rounded-full blur-2xl"></div>
            
//             {/* Content */}
//             <div className="relative z-10">
//               {/* Header Actions */}
//               <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
//                 <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//                   <div className="flex items-center space-x-2">
//                     <Shield className="h-6 w-6 text-blue-600" />
//                     <span className="text-sm font-medium text-gray-600">Verified Pharmacy</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Award className="h-6 w-6 text-purple-600" />
//                     <span className="text-sm font-medium text-gray-600">Premium Member</span>
//                   </div>
//                 </div>
                
//                 <button
//                   onClick={() => setIsEditing(!isEditing)}
//                   className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   <div className="relative flex items-center">
//                     <Edit className="h-5 w-5 mr-3" />
//                     <span className="font-semibold">
//                       {isEditing ? 'Cancel Edit' : 'Edit Profile'}
//                     </span>
//                     <Sparkles className="h-4 w-4 ml-2 opacity-70" />
//                   </div>
//                 </button>
//               </div>

//               {/* Main Content Grid */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//                 {/* Left Column - Form Fields */}
//                 <div className="space-y-8">
//                   {/* Pharmacy Name */}
//                   <div className="group">
//                     <label className="flex items-center text-sm font-bold text-gray-700 mb-4">
//                       <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
//                         <Store className="h-5 w-5 text-white" />
//                       </div>
//                       Pharmacy Name
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         value={pharmacyName}
//                         onChange={(e) => setPharmacyName(e.target.value)}
//                         disabled={!isEditing}
//                         className={`w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-2 rounded-2xl text-gray-800 font-medium transition-all duration-300 ${
//                           isEditing 
//                             ? 'border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 shadow-lg' 
//                             : 'border-gray-200 cursor-not-allowed opacity-75'
//                         }`}
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl pointer-events-none"></div>
//                     </div>
//                   </div>

//                   {/* Address */}
//                   <div className="group">
//                     <label className="flex items-center text-sm font-bold text-gray-700 mb-4">
//                       <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
//                         <MapPin className="h-5 w-5 text-white" />
//                       </div>
//                       Address
//                     </label>
//                     <div className="relative">
//                       <textarea
//                         value={address}
//                         onChange={(e) => setAddress(e.target.value)}
//                         rows="4"
//                         disabled={!isEditing}
//                         className={`w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-2 rounded-2xl text-gray-800 font-medium transition-all duration-300 resize-none ${
//                           isEditing 
//                             ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-200 shadow-lg' 
//                             : 'border-gray-200 cursor-not-allowed opacity-75'
//                         }`}
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-2xl pointer-events-none"></div>
//                     </div>
//                   </div>

//                   {/* Contact Number */}
//                   <div className="group">
//                     <label className="flex items-center text-sm font-bold text-gray-700 mb-4">
//                       <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
//                         <Phone className="h-5 w-5 text-white" />
//                       </div>
//                       Contact Number
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         value={contactNumber}
//                         onChange={(e) => setContactNumber(e.target.value)}
//                         disabled={!isEditing}
//                         className={`w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-2 rounded-2xl text-gray-800 font-medium transition-all duration-300 ${
//                           isEditing 
//                             ? 'border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 shadow-lg' 
//                             : 'border-gray-200 cursor-not-allowed opacity-75'
//                         }`}
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl pointer-events-none"></div>
//                     </div>
//                   </div>

//                   {/* Email */}
//                   <div className="group">
//                     <label className="flex items-center text-sm font-bold text-gray-700 mb-4">
//                       <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
//                         <Mail className="h-5 w-5 text-white" />
//                       </div>
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         disabled={!isEditing}
//                         className={`w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-2 rounded-2xl text-gray-800 font-medium transition-all duration-300 ${
//                           isEditing 
//                             ? 'border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 shadow-lg' 
//                             : 'border-gray-200 cursor-not-allowed opacity-75'
//                         }`}
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 rounded-2xl pointer-events-none"></div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Column - Image Upload */}
//                 <div className="space-y-6">
//                   <div className="flex items-center text-sm font-bold text-gray-700 mb-6">
//                     <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
//                       <Camera className="h-5 w-5 text-white" />
//                     </div>
//                     Pharmacy Images
//                   </div>

//                   {/* Upload Area */}
//                   <div className="relative">
//                     <div className={`relative border-3 border-dashed rounded-3xl p-8 text-center transition-all duration-300 ${
//                       isEditing 
//                         ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100' 
//                         : 'border-gray-200 bg-gray-50 opacity-75'
//                     }`}>
//                       <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
                      
//                       <div className="relative z-10">
//                         {pharmacyImages.length === 0 ? (
//                           <div className="py-8">
//                             <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
//                               <Camera className="h-10 w-10 text-white" />
//                             </div>
//                             <h3 className="text-xl font-bold text-gray-700 mb-2">Upload Pharmacy Images</h3>
//                             <p className="text-gray-500 mb-6">Showcase your pharmacy with beautiful photos</p>
//                           </div>
//                         ) : (
//                           <div className="mb-6">
//                             <h3 className="text-lg font-bold text-gray-700 mb-4">Your Pharmacy Gallery</h3>
//                           </div>
//                         )}

//                         <label className={`inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer ${
//                           isEditing ? '' : 'opacity-50 cursor-not-allowed'
//                         }`}>
//                           <Camera className="h-5 w-5 mr-3" />
//                           <span className="font-semibold">
//                             {pharmacyImages.length === 0 ? 'Choose Photos' : 'Add More Photos'}
//                           </span>
//                           <input
//                             type="file"
//                             className="hidden"
//                             onChange={handleImageUpload}
//                             multiple
//                             accept="image/*"
//                             disabled={!isEditing}
//                           />
//                         </label>
                        
//                         <p className="text-sm text-gray-500 mt-4">
//                           PNG, JPG, GIF up to 10MB each
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Image Gallery */}
//                   {pharmacyImages.length > 0 && (
//                     <div className="grid grid-cols-2 gap-4">
//                       {pharmacyImages.map((image, index) => (
//                         <div key={index} className="relative group">
//                           <img 
//                             src={image} 
//                             alt={`Pharmacy ${index + 1}`} 
//                             className="w-full h-32 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
//                           />
//                           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                           <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                             <Camera className="h-4 w-4 text-gray-600" />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Save Button */}
//               {isEditing && (
//                 <div className="mt-16 text-center">
//                   <button
//                     onClick={handleSave}
//                     className="group relative px-12 py-5 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                     <div className="relative flex items-center">
//                       <Sparkles className="h-6 w-6 mr-3" />
//                       <span className="text-xl font-bold">Save Changes</span>
//                       <div className="ml-3 w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     </div>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







































