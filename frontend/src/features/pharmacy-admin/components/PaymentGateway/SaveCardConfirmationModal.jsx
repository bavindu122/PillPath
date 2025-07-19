import React from 'react';
import { X, CreditCard, ShieldCheck } from 'lucide-react';

const SaveCardConfirmationModal = ({ isOpen, onClose, onConfirm, cardDetails }) => {
  if (!isOpen) return null;
  
  const last4 = cardDetails?.cardNumber?.replace(/\s/g, '')?.slice(-4) || '****';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Save Your Card</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Would you like to save this card for future payments? This will make checkout faster next time.
          </p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 flex items-start">
            <ShieldCheck className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Your card will be stored securely</p>
              <p className="text-xs text-blue-600 mt-1">
                We use industry-standard encryption to protect your information. Only the last 4 digits of your card number will be visible.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Card ending in</p>
              <p className="text-base font-medium text-gray-900">{last4}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cardholder</p>
              <p className="text-base font-medium text-gray-900">{cardDetails?.cardholderName || 'Card Holder'}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            Don't Save
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Save Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveCardConfirmationModal;