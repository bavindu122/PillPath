import React from "react";
import { motion } from "framer-motion";
import { X, DollarSign, Percent, CreditCard } from "lucide-react";

const PaymentModal = ({
  isOpen,
  onClose,
  prescriptionId,
  pharmacyName,
  medications,
  discountPercentage = 10,
  onConfirmPayment
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('');

  const totalPrice = medications.reduce((sum, med) => sum + (med.selected ? med.price : 0), 0);
  const discountAmount = totalPrice * (discountPercentage / 100);
  const finalTotal = totalPrice - discountAmount;

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

    const [showNoMedWarning, setShowNoMedWarning] = React.useState(false);

  const handleConfirmPayment = () => {
    if (totalPrice === 0) {
      setShowNoMedWarning(true);
      return;
    }
    if (selectedPaymentMethod) {
      onConfirmPayment(selectedPaymentMethod, finalTotal);
      setSelectedPaymentMethod('');
      setShowNoMedWarning(false);
    }
  };

  const handleClose = () => {
    setSelectedPaymentMethod('');
    setShowNoMedWarning(false);
    onClose();
  };
  

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Payment Details</h2>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Prescription Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Order Information</h3>
            <div className="space-y-2 text-white/70">
              <div className="flex justify-between">
                <span>Prescription ID:</span>
                <span className="text-white">{prescriptionId}</span>
              </div>
              <div className="flex justify-between">
                <span>Pharmacy:</span>
                <span className="text-white">{pharmacyName}</span>
              </div>
            </div>
          </div>

          {/* Bill Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Bill Details</h3>
            <div className="space-y-3">
              {medications.filter(med => med.selected).map((medication) => (
                <div key={medication.id} className="flex justify-between items-center p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <span className="text-white">{medication.name}</span>
                  <span className="text-white font-medium">${medication.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="mb-6">
            <div className="space-y-2 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="flex justify-between text-white/70">
                <span>Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-300">
                <span className="flex items-center">
                  <Percent className="h-4 w-4 mr-1" />
                  Discount ({discountPercentage}%):
                </span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-white/10 pt-2">
                <div className="flex justify-between text-white text-lg font-bold">
                  <span>Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Payment Method</h3>
            <div className="space-y-3">
              <div
                onClick={() => handlePaymentMethodSelect('cash')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPaymentMethod === 'cash'
                    ? 'bg-blue-500/20 border-blue-400/50 text-blue-300'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-medium">Cash Payment</span>
                </div>
              </div>
              <div
                onClick={() => handlePaymentMethodSelect('card')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPaymentMethod === 'card'
                    ? 'bg-blue-500/20 border-blue-400/50 text-blue-300'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">Card Payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 border border-white/20"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPayment}
              disabled={!selectedPaymentMethod}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                selectedPaymentMethod
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                  : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
              }`}
            >
              Confirm Order
            </button>
            {showNoMedWarning && totalPrice === 0 && (
  <div style={{ color: 'red', marginTop: 8 }}>
    Please select at least one medication to proceed with payment.
  </div>
)}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;
