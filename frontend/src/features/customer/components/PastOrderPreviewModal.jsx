import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, User } from "lucide-react";

const PastOrderPreviewModal = ({ isOpen, onClose, order }) => {
  const [selectedMember, setSelectedMember] = useState("Select Family Member");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sample family members - you can replace this with actual data
  const familyMembers = [
    "John Doe",
    "Jane Doe", 
    "Michael Doe",
    "Sarah Doe",
    "Robert Doe"
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    setIsDropdownOpen(false);
  };

  if (!isOpen || !order) return null;

  // Sample medications for testing if none exist
  const sampleMedications = [
    { name: "Metformin 500mg", price: "15.99", description: "60 tablets - Take twice daily" },
    { name: "Lisinopril 10mg", price: "8.50", description: "30 tablets - Take once daily" },
    { name: "Atorvastatin 20mg", price: "22.75", description: "30 tablets - Take once daily" }
  ];

  // Use sample medications if order doesn't have medications
  const medications = order.medications && order.medications.length > 0 ? order.medications : sampleMedications;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <style>
          {`
            .past-order-modal-scroll::-webkit-scrollbar {
              width: 8px;
              background: transparent;
            }
            .past-order-modal-scroll::-webkit-scrollbar-thumb {
              background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
              border-radius: 8px;
            }
            .past-order-modal-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .past-order-modal-scroll {
              scrollbar-width: thin;
              scrollbar-color: #22c55e #0000;
            }
          `}
        </style>
        <motion.div
          className="bg-gradient-to-br from-blue-400/20 via-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto past-order-modal-scroll"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="text-center flex-1">
              <h2 className="text-2xl font-bold text-white">Prescription: {order.orderNumber}</h2>
              <p className="text-white/60 mt-1">Pharmacy: {order.pharmacy}</p>
            </div>
            <button
              className="text-white/60 hover:text-white transition-colors"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* Prescription Image */}
            <div className="mb-6 flex justify-center w-full">
              <img
                src={order.prescriptionImg || "/prescription.jpeg"}
                alt="Prescription"
                className="rounded-xl border border-white/30 shadow-lg max-h-100 object-contain bg-white/10"
                style={{ width: "auto", maxWidth: "100%" }}
              />
            </div>

            {/* Family Member Selector */}
            <div className="mb-6 flex justify-center w-full">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white transition-colors duration-200 min-w-[200px] justify-between"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{selectedMember}</span>
                  </div>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden z-10"
                    >
                      {familyMembers.map((member, index) => (
                        <button
                          key={index}
                          onClick={() => handleMemberSelect(member)}
                          className="w-full text-left px-4 py-2 text-white hover:bg-white/20 transition-colors duration-200 border-b border-white/10 last:border-b-0"
                        >
                          {member}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Order Preview from Pharmacy - styled to match screenshot */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 w-full mb-4">
              <h3 className="text-2xl font-semibold text-white mb-4">Order Preview</h3>
              <div>
                <hr className="mb-4 border-white/20" />
                <div className="font-semibold text-white/90 mb-1">Medications:</div>
                <ul className="mb-2">
                  {medications.map((med, idx) => (
                    <li key={idx} className="flex justify-between text-white/80 text-base py-1">
                      <span>{med.name}</span>
                      <span>${parseFloat(med.price).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Summary box below medications */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 w-full mb-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-white/80 text-base">
                  <span>Subtotal:</span>
                  <span>{order.subtotal ? `$${order.subtotal}` : `$${medications.reduce((sum, med) => sum + (parseFloat(med.price) || 0), 0).toFixed(2)}`}</span>
                </div>
                {order.insuranceCoverage && (
                  <div className="flex justify-between text-green-300 text-base">
                    <span>Insurance Coverage:</span>
                    <span>- ${order.insuranceCoverage}</span>
                  </div>
                )}
                {order.pharmacyDiscount && (
                  <div className="flex justify-between text-green-300 text-base">
                    <span>Pharmacy Discount:</span>
                    <span>- ${order.pharmacyDiscount}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-2">
                  <div className="flex justify-between text-white text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>{order.total ? `${order.total}` : `$${medications.reduce((sum, med) => sum + (parseFloat(med.price) || 0), 0).toFixed(2)}`}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PastOrderPreviewModal;
