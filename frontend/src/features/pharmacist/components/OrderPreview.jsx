import React, { useState } from "react";
import { Info } from "lucide-react";
import { Trash2, Send, Save, CreditCard } from "lucide-react";
import "../pages/index-pharmacist.css";

const OrderPreview = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onSendOrder,
  onSaveDraft,
  isUpdating = false,
}) => {
  const [notes, setNotes] = useState("");
  const [cardPaymentEnabled, setCardPaymentEnabled] = useState(false);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  // Add/modify items via MedicineSearch on the left; this component focuses on preview and actions.

  return (
    <>
      <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Order Preview
              </h3>
              <div className="relative group">
                <Info className="h-4 w-4 text-emerald-600/80" />
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 rounded-md bg-gray-900 text-white text-xs px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-20">
                  Review all added items. You can remove items or adjust
                  quantities before sending the preview to the customer.
                </div>
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No medicines added to order yet
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div
                  key={item.id ?? `${item.name}-${idx}`}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {item.name || "Medicine"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Qty: {Number(item.quantity) || 0}{" "}
                      {item.dosage && `• ${item.dosage}`}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">
                        Availability :
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.available === true
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.available === true ? "Available" : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">
                      Rs.
                      {(
                        Number(item.price || 0) * Number(item.quantity || 0)
                      ).toFixed(2)}
                    </span>
                    <button
                      onClick={() => item.id != null && onRemoveItem(item.id)}
                      disabled={item.id == null}
                      className={`p-2 rounded transition-colors duration-200 ${
                        item.id == null
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-600 hover:text-red-800 hover:bg-red-50"
                      }`}
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
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
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

          {/* Payment Settings Toggle */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <CreditCard className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <h5 className="font-medium text-yellow-800">
                    Card Payment Settings
                  </h5>
                  <p className="text-sm text-yellow-700">
                    {cardPaymentEnabled
                      ? "Card payments are restricted for customers"
                      : "Card payments are enabled for customers"}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => setCardPaymentEnabled(!cardPaymentEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2 ${
                    cardPaymentEnabled ? "bg-red-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                      cardPaymentEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {cardPaymentEnabled ? "Disabled" : "Enabled"}
                </span>
              </div>
            </div>
          </div>

          {/* Total and Actions */}
          {items.length > 0 && (
            <>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    Rs.{calculateTotal().toFixed(2)}
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

        {/* Updating overlay */}
        {isUpdating && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Add medicine handled by MedicineSearch component to avoid duplication */}
    </>
  );
};

export default OrderPreview;
