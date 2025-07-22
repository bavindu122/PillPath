import React from "react";
import { motion } from "framer-motion";
import { X, DollarSign, Percent, CreditCard, Lock } from "lucide-react";

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
  const [showNoMedWarning, setShowNoMedWarning] = React.useState(false);
  const [cardDetails, setCardDetails] = React.useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const totalPrice = medications.reduce((sum, med) => sum + (med.selected ? med.price : 0), 0);
  const discountAmount = totalPrice * (discountPercentage / 100);
  const finalTotal = totalPrice - discountAmount;

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleCardInputChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleConfirmPayment = () => {
    if (totalPrice === 0) {
      setShowNoMedWarning(true);
      return;
    }
    
    if (selectedPaymentMethod === 'card') {
      // Validate card details
      const { cardNumber, expiryDate, cvv, cardholderName } = cardDetails;
      if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        alert('Please fill in all card details');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length < 16) {
        alert('Please enter a valid card number');
        return;
      }
      if (cvv.length < 3) {
        alert('Please enter a valid CVV');
        return;
      }
    }
    
    if (selectedPaymentMethod) {
      onConfirmPayment(selectedPaymentMethod, finalTotal, selectedPaymentMethod === 'card' ? cardDetails : null);
      setSelectedPaymentMethod('');
      setShowNoMedWarning(false);
      setCardDetails({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
      });
    }
  };

  const handleClose = () => {
    setSelectedPaymentMethod('');
    setShowNoMedWarning(false);
    setCardDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    });
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
      <style>
        {`
          .payment-modal-scroll::-webkit-scrollbar {
            width: 8px;
            background: transparent;
          }
          .payment-modal-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
            border-radius: 8px;
          }
          .payment-modal-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .payment-modal-scroll {
            scrollbar-width: thin;
            scrollbar-color: #22c55e #0000;
          }
        `}
      </style>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 max-w-md w-full max-h-[90vh] overflow-y-auto payment-modal-scroll"
        onClick={(e) => e.stopPropagation()}
      >{/* Inject custom scrollbar styles scoped to PaymentModal */}
      
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

              {/* Card Payment Simulator */}
              {selectedPaymentMethod === 'card' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 space-y-4"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <Lock className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Secure Payment</span>
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) => handleCardInputChange('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Expiry Date */}
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Expiry Date</label>
                      <input
                        type="text"
                        value={cardDetails.expiryDate}
                        onChange={(e) => handleCardInputChange('expiryDate', formatExpiryDate(e.target.value))}
                        placeholder="MM/YY"
                        maxLength="5"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                      />
                    </div>

                    {/* CVV */}
                    <div>
                      <label className="block text-white/70 text-sm mb-2">CVV</label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 3))}
                        placeholder="123"
                        maxLength="3"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardDetails.cardholderName}
                      onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </motion.div>
              )}
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
