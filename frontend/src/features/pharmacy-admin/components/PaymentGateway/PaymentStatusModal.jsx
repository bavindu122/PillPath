import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const PaymentStatusModal = ({ status, onClose }) => {
  if (!status) return null;
  
  let icon, title, message, buttonText, buttonColor;
  
  switch (status) {
    case 'success':
      icon = <CheckCircle className="h-16 w-16 text-green-500 mb-4" />;
      title = "Payment Successful";
      message = "Your payment has been processed successfully.";
      buttonText = "Done";
      buttonColor = "bg-green-600 hover:bg-green-700";
      break;
    case 'failed':
      icon = <XCircle className="h-16 w-16 text-red-500 mb-4" />;
      title = "Payment Failed";
      message = "There was an issue processing your payment. Please try again.";
      buttonText = "Try Again";
      buttonColor = "bg-red-600 hover:bg-red-700";
      break;
    case 'pending':
      icon = <Clock className="h-16 w-16 text-yellow-500 mb-4 animate-pulse" />;
      title = "Processing Payment";
      message = "Please wait while we process your payment...";
      buttonText = null;
      buttonColor = null;
      break;
    default:
      return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 text-center">
        {icon}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {buttonText && (
          <button
            onClick={onClose}
            className={`px-4 py-2 ${buttonColor} text-white font-medium rounded-lg transition-colors duration-200`}
          >
            {buttonText}
          </button>
        )}
        
        {!buttonText && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatusModal;