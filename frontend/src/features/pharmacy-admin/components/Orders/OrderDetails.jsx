import React from 'react';
import { 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  DollarSign, 
  Package,
  FileText,
  Printer
} from 'lucide-react';

const OrderDetails = ({ order }) => {
  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get order type badge - Match with useOrderData
  const getOrderTypeInfo = (type) => {
    switch (type) {
      case 'prescription':
        return { color: 'bg-blue-100 text-blue-800', label: 'Prescription' };
      case 'otc':
        return { color: 'bg-green-100 text-green-800', label: 'OTC Items' };
      case 'mixed':
        return { color: 'bg-purple-100 text-purple-800', label: 'Mixed Order' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: 'Unknown' };
    }
  };
  
  const orderTypeInfo = getOrderTypeInfo(order.orderType);
  
  // Get payment method icon - Match with useOrderData
  const PaymentIcon = order.paymentMethod === 'Credit Card' ? CreditCard : DollarSign;

  const handlePrintOrder = () => {
    window.print();
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order {order.id}</h2>
            <div className="flex items-center mt-2">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-600">{formatDate(order.orderDate)}</span>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${orderTypeInfo.color} mr-3`}>
              {orderTypeInfo.label}
            </span>
            
            <button
              onClick={handlePrintOrder}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-base font-medium text-gray-900">{order.customer.name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-base text-gray-900">{order.customer.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-base text-gray-900">{order.customer.phone}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <PaymentIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="text-base font-medium text-gray-900">{order.paymentMethod}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Package className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Items</p>
                  <p className="text-base text-gray-900">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Processed By</p>
                  <p className="text-base text-gray-900">{order.pharmacist}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <tr key={`${item.id}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.category === 'prescription' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.category === 'prescription' ? 'Prescription' : 'OTC'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">Rs.{item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">Rs.{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col items-end">
          <div className="w-full md:w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal:</span>
              <span className="text-gray-900 font-medium">Rs.{order.subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax (7%):</span>
              <span className="text-gray-900 font-medium">Rs.{order.tax.toFixed(2)}</span>
            </div>
            
            <div className="pt-3 border-t border-gray-200 flex justify-between">
              <span className="text-lg text-gray-900 font-bold">Total:</span>
              <span className="text-lg text-gray-900 font-bold">Rs.{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;





































// import React from 'react';
// import { 
//   Calendar, 
//   User, 
//   Mail, 
//   Phone, 
//   CreditCard, 
//   DollarSign, 
//   Package,
//   FileText,
//   Printer
// } from 'lucide-react';

// const OrderDetails = ({ order }) => {
//   // Format date
//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };
  
//   // Get order type badge
//   const getOrderTypeInfo = (type) => {
//     switch (type) {
//       case 'prescription':
//         return { color: 'bg-blue-100 text-blue-800', label: 'Prescription' };
//       case 'otc':
//         return { color: 'bg-green-100 text-green-800', label: 'OTC Items' };
//       default:
//         return { color: 'bg-purple-100 text-purple-800', label: 'Mixed Order' };
//     }
//   };
  
//   const orderTypeInfo = getOrderTypeInfo(order.orderType);
  
//   // Get payment method icon
//   const PaymentIcon = order.paymentMethod === 'Credit Card' ? CreditCard : DollarSign;

//   const handlePrintOrder = () => {
//     window.print();
//   };
  
//   return (
//     <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Order {order.id}</h2>
//             <div className="flex items-center mt-2">
//               <Calendar className="h-4 w-4 text-gray-500 mr-2" />
//               <span className="text-gray-600">{formatDate(order.orderDate)}</span>
//             </div>
//           </div>
          
//           <div className="mt-4 sm:mt-0 flex items-center">
//             <span className={`px-3 py-1 rounded-full text-sm font-medium ${orderTypeInfo.color} mr-3`}>
//               {orderTypeInfo.label}
//             </span>
            
//             <button
//               onClick={handlePrintOrder}
//               className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
//             >
//               <Printer className="h-4 w-4" />
//               <span>Print</span>
//             </button>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//           <div className="border border-gray-200 rounded-lg p-4">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            
//             <div className="space-y-3">
//               <div className="flex items-start">
//                 <User className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
//                 <div>
//                   <p className="text-sm text-gray-500">Name</p>
//                   <p className="text-base font-medium text-gray-900">{order.customer.name}</p>
//                 </div>
//               </div>
              
//               <div className="flex items-start">
//                 <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
//                 <div>
//                   <p className="text-sm text-gray-500">Email</p>
//                   <p className="text-base text-gray-900">{order.customer.email}</p>
//                 </div>
//               </div>
              
//               <div className="flex items-start">
//                 <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
//                 <div>
//                   <p className="text-sm text-gray-500">Phone</p>
//                   <p className="text-base text-gray-900">{order.customer.phone}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="border border-gray-200 rounded-lg p-4">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
            
//             <div className="space-y-3">
//               <div className="flex items-start">
//                 <PaymentIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
//                 <div>
//                   <p className="text-sm text-gray-500">Payment Method</p>
//                   <p className="text-base font-medium text-gray-900">{order.paymentMethod}</p>
//                 </div>
//               </div>
              
//               <div className="flex items-start">
//                 <Package className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
//                 <div>
//                   <p className="text-sm text-gray-500">Items</p>
//                   <p className="text-base text-gray-900">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
//                 </div>
//               </div>
              
//               <div className="flex items-start">
//                 <FileText className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
//                 <div>
//                   <p className="text-sm text-gray-500">Processed By</p>
//                   <p className="text-base text-gray-900">{order.pharmacist}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="p-6 border-b border-gray-200">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
        
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
//                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {order.items.map((item, index) => (
//                 <tr key={`${item.id}-${index}`} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       item.category === 'prescription' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
//                     }`}>
//                       {item.category === 'prescription' ? 'Prescription' : 'OTC'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">${item.price.toFixed(2)}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.quantity}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">${item.total.toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
      
//       <div className="p-6">
//         <div className="flex flex-col items-end">
//           <div className="w-full md:w-64 space-y-3">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Subtotal:</span>
//               <span className="text-gray-900 font-medium">${order.subtotal.toFixed(2)}</span>
//             </div>
            
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Tax (7%):</span>
//               <span className="text-gray-900 font-medium">${order.tax.toFixed(2)}</span>
//             </div>
            
//             <div className="pt-3 border-t border-gray-200 flex justify-between">
//               <span className="text-lg text-gray-900 font-bold">Total:</span>
//               <span className="text-lg text-gray-900 font-bold">${order.total.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;