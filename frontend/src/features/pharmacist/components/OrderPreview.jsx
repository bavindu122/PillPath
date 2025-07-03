import React, { useState } from 'react';
import { Trash2, Send, Save } from 'lucide-react';

const OrderPreview = ({ items, onRemoveItem, onUpdateQuantity, onSendOrder, onSaveDraft }) => {
  const [notes, setNotes] = useState('');

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Preview</h3>
        
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No medicines added to order yet
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">Qty: {item.quantity} tablets</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">Price:</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.available ? 'Available' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional Notes */}
        <div className="mt-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            id="notes"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes for the customer"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        {/* Total and Actions */}
        {items.length > 0 && (
          <>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                onClick={onSendOrder}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Send className="h-5 w-5" />
                <span>Send Order Preview</span>
              </button>
              
              <button
                onClick={onSaveDraft}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Save className="h-5 w-5" />
                <span>Save Draft</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderPreview;