import React, { useState } from 'react';
import { CreditCard, DollarSign, Calendar, Lock, Shield } from 'lucide-react';

const PaymentForm = ({ processPayment, isProcessing, balance }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    amount: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  
  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      value = value.substring(0, 19); // Limit to 16 digits + 3 spaces
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      value = value.substring(0, 5); // MM/YY format
    }
    
    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }
    
    // Format amount with proper decimal places
    if (name === 'amount') {
      value = value.replace(/[^\d.]/g, '');
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts[1];
      }
      if (parts[1] && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].substring(0, 2);
      }
    }
    
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!paymentDetails.amount.trim()) {
      errors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(paymentDetails.amount);
      if (isNaN(amount) || amount <= 0) {
        errors.amount = 'Please enter a valid amount';
      } else if (balance && amount > balance) {
        errors.amount = 'Insufficient funds in wallet';
      }
    }
    
    if (!paymentDetails.cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    } else if (paymentDetails.cardNumber.replace(/\s/g, '').length < 16) {
      errors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!paymentDetails.expiryDate.trim()) {
      errors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) {
      errors.expiryDate = 'Please enter MM/YY format';
    }
    
    if (!paymentDetails.cvv.trim()) {
      errors.cvv = 'CVV is required';
    } else if (paymentDetails.cvv.length < 3) {
      errors.cvv = 'CVV must be 3-4 digits';
    }
    
    if (!paymentDetails.cardholderName.trim()) {
      errors.cardholderName = 'Cardholder name is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm() && processPayment) {
      processPayment(paymentDetails);
    }
  };
  
  const getCardType = (number) => {
    const num = number.replace(/\s/g, '');
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5') || num.startsWith('2')) return 'mastercard';
    if (num.startsWith('3')) return 'amex';
    return 'generic';
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Secure Payment</h2>
            <p className="text-blue-100 mt-1">Complete your payment securely</p>
          </div>
          <div className="flex items-center text-blue-100">
            <Shield className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">256-bit SSL</span>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Amount</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount to Pay
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="amount"
                value={paymentDetails.amount}
                onChange={handleChange}
                className={`block w-full pl-10 pr-4 py-3 border ${
                  validationErrors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg font-semibold`}
                placeholder="0.00"
              />
            </div>
            {validationErrors.amount && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                {validationErrors.amount}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">Available balance: ${balance?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        {/* Credit Card Details */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Card Information</h3>
          
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 mb-6 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 opacity-10">
              <CreditCard className="h-16 w-16" />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-300">Card Number</p>
                  <p className="text-xl font-mono tracking-wider">
                    {paymentDetails.cardNumber || '•••• •••• •••• ••••'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-300">Expires</p>
                  <p className="font-mono">{paymentDetails.expiryDate || 'MM/YY'}</p>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-300">Cardholder Name</p>
                  <p className="font-medium">{paymentDetails.cardholderName || 'CARDHOLDER NAME'}</p>
                </div>
                <div className="text-2xl font-bold">
                  {getCardType(paymentDetails.cardNumber) === 'visa' && 'VISA'}
                  {getCardType(paymentDetails.cardNumber) === 'mastercard' && 'MC'}
                  {getCardType(paymentDetails.cardNumber) === 'amex' && 'AMEX'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentDetails.cardNumber}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-4 py-3 border ${
                    validationErrors.cardNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-lg tracking-wide`}
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              {validationErrors.cardNumber && (
                <p className="mt-2 text-sm text-red-600">{validationErrors.cardNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardholderName"
                value={paymentDetails.cardholderName}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border ${
                  validationErrors.cardholderName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="John Doe"
              />
              {validationErrors.cardholderName && (
                <p className="mt-2 text-sm text-red-600">{validationErrors.cardholderName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentDetails.expiryDate}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-4 py-3 border ${
                      validationErrors.expiryDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono`}
                    placeholder="MM/YY"
                  />
                </div>
                {validationErrors.expiryDate && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.expiryDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentDetails.cvv}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-4 py-3 border ${
                      validationErrors.cvv ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono`}
                    placeholder="123"
                  />
                </div>
                {validationErrors.cvv && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.cvv}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center text-sm text-gray-600 mb-4 sm:mb-0">
              <Lock className="h-4 w-4 mr-2 text-green-500" />
              Your payment information is secure and encrypted
            </div>
            
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white transition-all transform ${
                isProcessing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Complete Payment ${paymentDetails.amount || '0.00'}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo wrapper to show the component in action
const PaymentFormDemo = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const balance = 1500.00;

  const handleProcessPayment = (paymentDetails) => {
    setIsProcessing(true);
    console.log('Processing payment:', paymentDetails);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      alert('Payment processed successfully!');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <PaymentForm 
        processPayment={handleProcessPayment}
        isProcessing={isProcessing}
        balance={balance}
      />
    </div>
  );
};

export default PaymentFormDemo;









































// import React, { useState } from 'react';
// import { CreditCard, Send, DollarSign, FileText, User } from 'lucide-react';

// const PaymentForm = ({ processPayment, isProcessing, balance }) => {
//   const [paymentDetails, setPaymentDetails] = useState({
//     recipient: '',
//     amount: '',
//     method: 'bank_transfer',
//     category: 'Supplier Payment',
//     reference: '',
//     description: ''
//   });
  
//   const [validationErrors, setValidationErrors] = useState({});
  
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPaymentDetails(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear validation error when field is edited
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({
//         ...prev,
//         [name]: null
//       }));
//     }
//   };
  
//   const validateForm = () => {
//     const errors = {};
    
//     if (!paymentDetails.recipient.trim()) {
//       errors.recipient = 'Recipient is required';
//     }
    
//     if (!paymentDetails.amount.trim()) {
//       errors.amount = 'Amount is required';
//     } else {
//       const amount = parseFloat(paymentDetails.amount);
//       if (isNaN(amount) || amount <= 0) {
//         errors.amount = 'Please enter a valid amount';
//       } else if (amount > balance) {
//         errors.amount = 'Insufficient funds in wallet';
//       }
//     }
    
//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };
  
//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (validateForm()) {
//       processPayment(paymentDetails);
//     }
//   };
  
//   return (
//     <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">Make a Payment</h3>
      
//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Recipient
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <User className="h-4 w-4 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 name="recipient"
//                 value={paymentDetails.recipient}
//                 onChange={handleChange}
//                 className={`block w-full pl-10 pr-3 py-2 border ${
//                   validationErrors.recipient ? 'border-red-300' : 'border-gray-300'
//                 } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
//                 placeholder="Recipient name or company"
//               />
//             </div>
//             {validationErrors.recipient && (
//               <p className="mt-1 text-sm text-red-600">{validationErrors.recipient}</p>
//             )}
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Amount
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <DollarSign className="h-4 w-4 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 name="amount"
//                 value={paymentDetails.amount}
//                 onChange={handleChange}
//                 className={`block w-full pl-10 pr-3 py-2 border ${
//                   validationErrors.amount ? 'border-red-300' : 'border-gray-300'
//                 } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
//                 placeholder="0.00"
//               />
//             </div>
//             {validationErrors.amount && (
//               <p className="mt-1 text-sm text-red-600">{validationErrors.amount}</p>
//             )}
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Payment Method
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <CreditCard className="h-4 w-4 text-gray-400" />
//               </div>
//               <select
//                 name="method"
//                 value={paymentDetails.method}
//                 onChange={handleChange}
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="bank_transfer">Bank Transfer</option>
//                 <option value="credit_card">Credit Card</option>
//                 <option value="ach">ACH</option>
//                 <option value="wire">Wire Transfer</option>
//               </select>
//             </div>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Payment Category
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FileText className="h-4 w-4 text-gray-400" />
//               </div>
//               <select
//                 name="category"
//                 value={paymentDetails.category}
//                 onChange={handleChange}
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="Supplier Payment">Supplier Payment</option>
//                 <option value="Utility Bill">Utility Bill</option>
//                 <option value="Rent">Rent</option>
//                 <option value="Insurance">Insurance</option>
//                 <option value="Taxes">Taxes</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Reference (Optional)
//             </label>
//             <input
//               type="text"
//               name="reference"
//               value={paymentDetails.reference}
//               onChange={handleChange}
//               className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Invoice number or reference"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Description (Optional)
//             </label>
//             <input
//               type="text"
//               name="description"
//               value={paymentDetails.description}
//               onChange={handleChange}
//               className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Payment description"
//             />
//           </div>
//         </div>
        
//         <div className="mt-6 flex justify-end">
//           <button
//             type="submit"
//             disabled={isProcessing}
//             className={`flex items-center px-4 py-2 ${
//               isProcessing 
//                 ? 'bg-indigo-400 cursor-not-allowed' 
//                 : 'bg-indigo-600 hover:bg-indigo-700'
//             } text-white font-medium rounded-lg transition-colors duration-200`}
//           >
//             {isProcessing ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <Send className="h-4 w-4 mr-2" />
//                 Send Payment
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PaymentForm;