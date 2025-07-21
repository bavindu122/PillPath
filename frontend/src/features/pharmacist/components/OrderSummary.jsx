import React from 'react';
import { 
  RefreshCw, 
  Printer, 
  Download, 
  Package,
  DollarSign,
  Calendar,
  Clock,
  FileText,
  Pill
} from 'lucide-react';
import '../pages/index-pharmacist.css';

const OrderSummary = ({ orderData, onReorder, onPrint, onExportPDF }) => {
  if (!orderData) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 pharma-bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 pharma-bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 pharma-bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const calculateSubtotal = () => {
    return orderData.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
  };

  const tax = calculateSubtotal() * 0.08; // 8% tax
  const total = calculateSubtotal() + tax;

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span>Order Summary</span>
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Order: {orderData.orderNumber} | Total: ${total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Order Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Date Created</p>
              <p className="font-medium text-gray-800">{orderData.dateCreated}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Completed</p>
              <p className="font-medium text-gray-800">{orderData.dateCompleted}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="font-medium text-gray-800">{orderData.paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <h5 className="font-medium text-gray-700 flex items-center space-x-2">
            <Pill className="h-4 w-4 text-gray-500" />
            <span>Prescribed Items</span>
          </h5>
          
          <div className="space-y-3">
            {orderData.items?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Qty: {item.quantity} tablets {item.dosage && `• ${item.dosage}`}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">Status:</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.available ? 'Dispensed' : 'Not Available'}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-lg font-semibold text-gray-900">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        {orderData.notes && (
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-800">Pharmacist Notes</h5>
                <p className="text-sm text-blue-700 mt-1">{orderData.notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Total */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium text-gray-800">${calculateSubtotal().toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Tax (8%):</span>
            <span className="font-medium text-gray-800">${tax.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t border-gray-200">
            <span className="text-gray-800">Total Amount:</span>
            <span className="text-blue-600">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onPrint}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <Printer className="h-4 w-4" />
              <span>Print Order</span>
            </button>
            
            <button
              onClick={onExportPDF}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;