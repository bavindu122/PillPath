import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const PastOrderPreviewModal = ({ isOpen, onClose, order }) => {
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <style>
          {`
            .past-order-modal-scroll::-webkit-scrollbar {
              width: 8px;
              background: transparent;
            }
            .past-order-modal-scroll::-webkit-scrollbar-thumb {
              background: linear-gradient(90deg, #2258c5ff 0%, #2f79d4ff 100%);
              border-radius: 8px;
            }
            .past-order-modal-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .past-order-modal-scroll {
              scrollbar-width: thin;
              scrollbar-color: #4987e4ff #0000;
            }
          `}
        </style>
        <motion.div
          className="bg-gradient-to-br from-slate-900/80 via-blue-900/80 to-indigo-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/30 w-full max-w-4xl mx-4 p-6 relative flex flex-col items-center max-h-[80vh] overflow-y-auto past-order-modal-scroll"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 rounded-full p-2 shadow"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Prescription Name */}
          <h2 className="text-2xl font-bold text-white mb-2">Prescription: {order.orderNumber}</h2>
          <p className="text-white/60 mb-4">Pharmacy: {order.pharmacy}</p>

          {/* Prescription Image */}
          <div className="mb-6 flex justify-center w-full">
            <img
              src={order.prescriptionImg || "/prescription.jpeg"}
              alt="Prescription"
              className="rounded-xl border border-white/30 shadow-lg max-h-56 object-contain bg-white/10"
              style={{ width: "auto", maxWidth: "100%" }}
            />
          </div>

          {/* Order Preview from Pharmacy - styled to match screenshot */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 w-full mb-4">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Order Preview</h3>
            <div>
              <hr className="mb-4 border-gray-200" />
              <div className="font-semibold text-gray-800 mb-1">Medications:</div>
              <ul className="mb-2">
                {medications.map((med, idx) => (
                  <li key={idx} className="flex justify-between text-gray-700 text-base py-1">
                    <span>{med.name}</span>
                    <span>${parseFloat(med.price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Summary box below medications */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 w-full mb-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-gray-700 text-base">
                <span>Subtotal:</span>
                <span>{order.subtotal ? `$${order.subtotal}` : `$${medications.reduce((sum, med) => sum + (parseFloat(med.price) || 0), 0).toFixed(2)}`}</span>
              </div>
              {order.insuranceCoverage && (
                <div className="flex justify-between text-green-700 text-base">
                  <span>Insurance Coverage:</span>
                  <span>- ${order.insuranceCoverage}</span>
                </div>
              )}
              {order.pharmacyDiscount && (
                <div className="flex justify-between text-green-700 text-base">
                  <span>Pharmacy Discount:</span>
                  <span>- ${order.pharmacyDiscount}</span>
                </div>
              )}
              <hr className="my-2 border-gray-300" />
              <div className="flex justify-between text-blue-900 font-bold text-2xl">
                <span>Total Amount:</span>
                <span>{order.total ? `${order.total}` : `${medications.reduce((sum, med) => sum + (parseFloat(med.price) || 0), 0).toFixed(2)}`}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PastOrderPreviewModal;
