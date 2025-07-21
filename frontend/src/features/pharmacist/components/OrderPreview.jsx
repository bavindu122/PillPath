import React, { useState } from 'react';
import { Trash2, Send, Save, X, Plus, Minus } from 'lucide-react';
import '../pages/index-pharmacist.css';

const OrderPreview = ({ items, onRemoveItem, onUpdateQuantity, onSendOrder, onSaveDraft, onAddMedicine }) => {
  const [notes, setNotes] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalDosage, setModalDosage] = useState('');
  const [modalPrice, setModalPrice] = useState(0);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  const handleAddMedicine = (medicine) => {
    setSelectedMedicine(medicine);
    setModalQuantity(1);
    setModalDosage('250mg');
    setModalPrice(medicine.price || 10.00);
    setShowAddModal(true);
  };

  const handleModalAddMedicine = () => {
    if (selectedMedicine) {
      const newItem = {
        id: Date.now(),
        name: selectedMedicine.name,
        genericName: selectedMedicine.genericName,
        quantity: modalQuantity,
        dosage: modalDosage,
        price: modalPrice,
        available: true
      };
      
      // Call parent's add medicine function
      if (onAddMedicine) {
        onAddMedicine(newItem);
      }
      
      setShowAddModal(false);
      setSelectedMedicine(null);
    }
  };

  const handleModalCancel = () => {
    setShowAddModal(false);
    setSelectedMedicine(null);
    setModalQuantity(1);
    setModalDosage('');
    setModalPrice(0);
  };

  const adjustQuantity = (change) => {
    const newQuantity = modalQuantity + change;
    if (newQuantity > 0) {
      setModalQuantity(newQuantity);
    }
  };

  const calculateModalTotal = () => {
    return (modalPrice * modalQuantity).toFixed(2);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Order Preview</h3>
          </div>
          
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
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} tablets {item.dosage && `• ${item.dosage}`}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">Availability :</span>
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

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add Medicine</h3>
                <button
                  onClick={handleModalCancel}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Medicine Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medicine Name
                  </label>
                  <input
                    type="text"
                    value={selectedMedicine?.name || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                {/* Dosage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dosage
                  </label>
                  <select
                    value={modalDosage}
                    onChange={(e) => setModalDosage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="250mg">250mg</option>
                    <option value="500mg">500mg</option>
                    <option value="750mg">750mg</option>
                    <option value="1000mg">1000mg</option>
                    <option value="100mg">100mg</option>
                    <option value="200mg">200mg</option>
                  </select>
                </div>

                {/* Unit Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price ($)
                  </label>
                  <input
                    type="number"
                    value={modalPrice}
                    onChange={(e) => setModalPrice(parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => adjustQuantity(-1)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={modalQuantity}
                      onChange={(e) => setModalQuantity(parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <button
                      onClick={() => adjustQuantity(1)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Price:</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${calculateModalTotal()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleModalCancel}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalAddMedicine}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderPreview;