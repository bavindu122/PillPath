import React, { useState } from 'react';
import { Camera, MapPin, Phone, Mail, Store, Edit } from 'lucide-react'; // Changed BuildingStore to Store


import { useEffect, useRef } from 'react';

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
    // Main container with a subtle gradient background and padding
    <div className="min-h-screen bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-light)] p-4 sm:p-6 lg:p-10 font-inter">

      {/* Page title */}
      {/* <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center drop-shadow-sm">
        Pharmacy Settings
      </h2> */}

      {/* Main content card */}
      <div className="bg-white/15 backdrop-blur-xl border border-white/20 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl max-w-4xl mx-auto transform transition-all duration-300 hover:scale-[1.005]  animate-fade-in-up">
        {/* <div class="delay-200 animate-fade-in-up bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-8 flex items-start gap-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"><div class="shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg false bg-gradient-to-br from-green-500 to-green-700 false false"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dollar-sign" aria-hidden="true"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></div><div><h3 class="text-xl font-bold text-white mb-3">Cost Effective</h3><p class="text-white/70">Compare prices across multiple pharmacies</p></div></div> */}
        {/* Header for the profile section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b pb-4 border-gray-200">
          <h3 className="text-2xl font-bold text-[var(--color-text-light)] mb-4 sm:mb-0">Pharmacy Profile</h3>
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
                <Store className="inline-block h-4 w-4 mr-2 text-[var(--color-text-dark)]" /> {/* Changed BuildingStore to Store */}
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
              <label htmlFor="address" className="block text-sm font-semibold text-[var(--color-text-dark)] mb-2">
                <MapPin className="inline-block h-4 w-4 mr-2 text-[var(--color-text-dark)]" />
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
              <label htmlFor="contactNumber" className="block text-sm font-semibold text-[var(--color-text-dark)] mb-2">
                <Phone className="inline-block h-4 w-4 mr-2 text-[var(--color-text-dark)]" />
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
              <label htmlFor="email" className="block text-sm font-semibold text-[var(--color-text-dark)] mb-2">
                <Mail className="inline-block h-4 w-4 mr-2 text-[var(--color-text-dark)]" />
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
            <label className="block text-sm font-semibold text-[var(--color-text-dark)] mb-2">
              <Camera className="inline-block h-4 w-4 mr-2 text-[var(--color-text-dark)]" />
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
                    className={`relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500 transition-colors duration-200 ${isEditing ? '' : 'opacity-50 cursor-not-allowed'}`}
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






