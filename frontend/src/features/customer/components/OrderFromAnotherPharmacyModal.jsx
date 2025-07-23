import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Star, ChevronRight, PlusCircle, Check, Upload, FileText } from 'lucide-react';
import { ModalScrollContainer } from '../../../components/UIs/ScrollContainer';

const OrderFromAnotherPharmacyModal = ({ 
  isOpen, 
  onClose, 
  prescriptionId, 
  unavailableMedications = [],
  onOrderPlaced 
}) => {
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const modalContentRef = useRef(null);

  // Sample pharmacy data - would be fetched from API in real application
  const nearbyPharmacies = [
    { 
      id: 1, 
      name: "HealthFirst Pharmacy", 
      address: "123 Medical Lane, Colombo", 
      distance: "0.8", 
      rating: 4.8, 
      deliveryTime: "30-45" 
    },
    { 
      id: 2, 
      name: "MediCare Plus", 
      address: "45 Wellness Road, Colombo", 
      distance: "1.2", 
      rating: 4.7, 
      deliveryTime: "20-30" 
    },
    { 
      id: 3, 
      name: "Family Care Pharmacy", 
      address: "78 Health Street, Colombo", 
      distance: "1.5", 
      rating: 4.5, 
      deliveryTime: "40-55" 
    },
    { 
      id: 4, 
      name: "City Health Pharmacy", 
      address: "120 Main Street, Colombo", 
      distance: "2.2", 
      rating: 4.3, 
      deliveryTime: "35-50" 
    }
  ];

  const handleSubmit = async () => {
    if (!selectedPharmacy) {
      alert("Please select a pharmacy");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(`Order request sent to ${selectedPharmacy.name} for unavailable medications`);
      if (onOrderPlaced) {
        onOrderPlaced(selectedPharmacy, unavailableMedications);
      }
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setSelectedPharmacy(null);
    setNote('');
    onClose();
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden"
          ref={modalContentRef}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-hover p-5 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Order from Another Pharmacy</h3>
            <button 
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-white/80 border-b border-white/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  <Upload size={18} />
                </div>
                <div className="text-sm font-medium ml-2 text-primary">Upload</div>
              </div>
              <div className="flex-1 h-0.5 mx-2 bg-primary"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check size={18} />
                </div>
                <div className="text-sm font-medium ml-2 text-primary">Preview</div>
              </div>
              <div className="flex-1 h-0.5 mx-2 bg-primary"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <div className="text-sm font-medium ml-2 text-primary">Pharmacy</div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <ModalScrollContainer className="flex-1">
            <div className="space-y-6">
              <p className="text-center text-gray-700">
                Select a pharmacy to send your prescription to
              </p>

              {/* Unavailable Medications List */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3">Unavailable Medications:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {unavailableMedications.map((medication, index) => (
                    <div key={index} className="flex items-center space-x-2 text-red-700">
                      <FileText size={16} />
                      <span>{medication}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pharmacy Selection */}
              <div className="space-y-4">
                {nearbyPharmacies.map((pharmacy) => (
                  <motion.div 
                    key={pharmacy.id}
                    whileHover={{ scale: 1.01 }}
                    className={`border rounded-xl p-4 transition-all cursor-pointer ${
                      selectedPharmacy?.id === pharmacy.id 
                        ? 'border-primary/50 bg-white/70 shadow-md' 
                        : 'border-white/50 bg-white/40 hover:border-primary/30 hover:bg-white/50 backdrop-blur-sm'
                    }`}
                    onClick={() => setSelectedPharmacy(pharmacy)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-lg">{pharmacy.name}</h4>
                        <p className="text-sm text-gray-500">{pharmacy.address}</p>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <div className="flex items-center text-sm">
                            <MapPin size={14} className="text-secondary mr-1" />
                            <span>{pharmacy.distance} km</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock size={14} className="text-primary mr-1" />
                            <span>{pharmacy.deliveryTime} mins</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Star size={14} className="text-yellow-500 mr-1 fill-yellow-500" />
                            <span>{pharmacy.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedPharmacy?.id === pharmacy.id
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-300'
                        }`}>
                          {selectedPharmacy?.id === pharmacy.id && (
                            <Check size={14} />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="border border-dashed border-gray-300 rounded-xl p-4 hover:border-primary/30 hover:bg-white/50 flex items-center justify-center gap-2 cursor-pointer bg-white/30 backdrop-blur-sm"
                >
                  <PlusCircle size={18} className="text-gray-400" />
                  <span className="text-gray-500">Add Another Pharmacy</span>
                </motion.div>
              </div>

              {/* Additional Notes */}
              {selectedPharmacy && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/50"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add any special instructions for the pharmacist..."
                    className="w-full border border-gray-200 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary bg-white/80"
                    rows={3}
                  />
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-white/70 transition-all bg-white/50 backdrop-blur-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={!isLoading && selectedPharmacy ? { scale: 1.03 } : {}}
                  whileTap={!isLoading && selectedPharmacy ? { scale: 0.97 } : {}}
                  onClick={handleSubmit}
                  disabled={!selectedPharmacy || isLoading}
                  className={`px-6 py-3 bg-gradient-to-r from-primary to-primary-hover text-white rounded-lg shadow-md hover:shadow-lg flex items-center gap-2 ${
                    !selectedPharmacy || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <span>Sending...</span>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : (
                    <>
                      <span>Send Order Request</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </ModalScrollContainer>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OrderFromAnotherPharmacyModal;
