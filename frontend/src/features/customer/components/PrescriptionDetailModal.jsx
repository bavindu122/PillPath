import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  Pill,
  Store,
  User,
  Loader2
} from "lucide-react";
import { getAuthHeaders } from "../../../utils/tokenUtils";

const PrescriptionDetailModal = ({ prescriptionId, isOpen, onClose }) => {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptionDetails = async () => {
      if (!prescriptionId || !isOpen) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/prescriptions/my/${prescriptionId}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch prescription: ${response.status}`);
        }

        const data = await response.json();
        setPrescription(data);
      } catch (err) {
        console.error("Error fetching prescription details:", err);
        setError(err.message || "Failed to load prescription details");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptionDetails();
  }, [prescriptionId, isOpen]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "IN_PROGRESS":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      case "PENDING_REVIEW":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "REJECTED":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Prescription Details
                </h2>
                {prescription && (
                  <p className="text-white/60 text-sm">{prescription.code}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6">
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}

            {error && !loading && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {prescription && !loading && (
              <div className="space-y-6">
                {/* Status and Basic Info */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Status & Information
                    </h3>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                        prescription.status
                      )}`}
                    >
                      {prescription.status?.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Store className="w-5 h-5 text-blue-400 mt-1" />
                      <div>
                        <p className="text-white/60 text-sm">Pharmacy (Prescription)</p>
                        <p className="text-white font-medium">
                          {prescription.pharmacyName || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-blue-400 mt-1" />
                      <div>
                        <p className="text-white/60 text-sm">Created</p>
                        <p className="text-white font-medium">
                          {formatDate(prescription.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-blue-400 mt-1" />
                      <div>
                        <p className="text-white/60 text-sm">Delivery</p>
                        <p className="text-white font-medium capitalize">
                          {prescription.deliveryPreference?.toLowerCase() ||
                            "N/A"}
                        </p>
                      </div>
                    </div>

                    {prescription.totalPrice && (
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-blue-400 mt-1" />
                        <div>
                          <p className="text-white/60 text-sm">Prescription Total</p>
                          <p className="text-white font-medium text-lg">
                            LKR {prescription.totalPrice}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {prescription.note && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-white/60 text-sm mb-1">Note</p>
                      <p className="text-white">{prescription.note}</p>
                    </div>
                  )}
                </div>

                {/* Order Information - if order exists */}
                {prescription.orderCode && (
                  <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-400/30">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">
                        Order Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-green-400 mt-1" />
                        <div>
                          <p className="text-white/60 text-sm">Order Code</p>
                          <p className="text-white font-medium">
                            {prescription.orderCode}
                          </p>
                        </div>
                      </div>

                      {prescription.orderTotals && (
                        <div className="flex items-start gap-3">
                          <DollarSign className="w-5 h-5 text-green-400 mt-1" />
                          <div>
                            <p className="text-white/60 text-sm">Order Total</p>
                            <p className="text-green-400 font-bold text-lg">
                              LKR {prescription.orderTotals.total}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {prescription.orderTotals && (
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-white/60 text-sm mb-2">Price Breakdown</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/80">Subtotal:</span>
                            <span className="text-white">LKR {prescription.orderTotals.subtotal}</span>
                          </div>
                          {prescription.orderTotals.discount > 0 && (
                            <div className="flex justify-between">
                              <span className="text-white/80">Discount:</span>
                              <span className="text-green-400">-LKR {prescription.orderTotals.discount}</span>
                            </div>
                          )}
                          {prescription.orderTotals.tax > 0 && (
                            <div className="flex justify-between">
                              <span className="text-white/80">Tax:</span>
                              <span className="text-white">LKR {prescription.orderTotals.tax}</span>
                            </div>
                          )}
                          {prescription.orderTotals.shipping > 0 && (
                            <div className="flex justify-between">
                              <span className="text-white/80">Shipping:</span>
                              <span className="text-white">LKR {prescription.orderTotals.shipping}</span>
                            </div>
                          )}
                          <div className="flex justify-between pt-2 border-t border-white/10 font-semibold">
                            <span className="text-white">Total:</span>
                            <span className="text-green-400">LKR {prescription.orderTotals.total}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Pharmacy Orders - Actual Fulfilled Items */}
                {prescription.pharmacyOrders && prescription.pharmacyOrders.length > 0 && (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                      <Store className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">
                        Fulfilled By Pharmacies
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {prescription.pharmacyOrders.map((pharmacyOrder, index) => (
                        <div
                          key={index}
                          className="bg-white/5 rounded-lg p-4 border border-white/10"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-white font-semibold text-lg">
                                {pharmacyOrder.pharmacyName}
                              </p>
                              <p className={`text-sm mt-1 px-2 py-1 rounded-full inline-block ${
                                pharmacyOrder.status === 'HANDED_OVER' ? 'bg-green-500/20 text-green-300' :
                                pharmacyOrder.status === 'READY_FOR_PICKUP' ? 'bg-blue-500/20 text-blue-300' :
                                pharmacyOrder.status === 'PREPARING' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-gray-500/20 text-gray-300'
                              }`}>
                                {pharmacyOrder.status?.replace(/_/g, ' ')}
                              </p>
                            </div>
                            {pharmacyOrder.totals && (
                              <div className="text-right">
                                <p className="text-white/60 text-sm">Pharmacy Total</p>
                                <p className="text-white font-bold text-lg">
                                  LKR {pharmacyOrder.totals.total}
                                </p>
                              </div>
                            )}
                          </div>

                          {pharmacyOrder.pickupCode && (
                            <div className="mb-3 p-2 bg-blue-500/10 rounded border border-blue-400/30">
                              <p className="text-white/60 text-xs">Pickup Code</p>
                              <p className="text-blue-300 font-mono font-bold">
                                {pharmacyOrder.pickupCode}
                              </p>
                            </div>
                          )}

                          {pharmacyOrder.items && pharmacyOrder.items.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-white/60 text-sm font-medium">Ordered Medications:</p>
                              {pharmacyOrder.items.map((item, itemIndex) => (
                                <div
                                  key={itemIndex}
                                  className="bg-white/5 rounded p-3 border border-white/10"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <p className="text-white font-medium">
                                        {item.medicineName}
                                      </p>
                                      {item.genericName && (
                                        <p className="text-white/60 text-sm">
                                          {item.genericName}
                                        </p>
                                      )}
                                    </div>
                                    {item.totalPrice && (
                                      <p className="text-white font-semibold">
                                        LKR {item.totalPrice}
                                      </p>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-3 gap-2 text-sm">
                                    {item.dosage && (
                                      <div>
                                        <p className="text-white/60">Dosage</p>
                                        <p className="text-white">{item.dosage}</p>
                                      </div>
                                    )}
                                    {item.quantity && (
                                      <div>
                                        <p className="text-white/60">Quantity</p>
                                        <p className="text-white">{item.quantity}</p>
                                      </div>
                                    )}
                                    {item.unitPrice && (
                                      <div>
                                        <p className="text-white/60">Unit Price</p>
                                        <p className="text-white">LKR {item.unitPrice}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Delivery Address */}
                {prescription.deliveryAddress && (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-400 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          Delivery Address
                        </h3>
                        <p className="text-white/80">
                          {prescription.deliveryAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Prescription Items */}
                {prescription.items && prescription.items.length > 0 && (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                      <Pill className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">
                        Prescription Items
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {prescription.items.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white/5 rounded-lg p-4 border border-white/10"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-white font-medium">
                                {item.medicineName}
                              </p>
                              {item.genericName && (
                                <p className="text-white/60 text-sm">
                                  {item.genericName}
                                </p>
                              )}
                            </div>
                            {item.totalPrice && (
                              <p className="text-white font-semibold">
                                LKR {item.totalPrice}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            {item.dosage && (
                              <div>
                                <p className="text-white/60">Dosage</p>
                                <p className="text-white">{item.dosage}</p>
                              </div>
                            )}
                            {item.quantity && (
                              <div>
                                <p className="text-white/60">Quantity</p>
                                <p className="text-white">{item.quantity}</p>
                              </div>
                            )}
                            {item.unitPrice && (
                              <div>
                                <p className="text-white/60">Unit Price</p>
                                <p className="text-white">LKR {item.unitPrice}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-white/60">Available</p>
                              <p
                                className={
                                  item.available
                                    ? "text-green-400"
                                    : "text-red-400"
                                }
                              >
                                {item.available ? "Yes" : "No"}
                              </p>
                            </div>
                          </div>

                          {item.notes && (
                            <div className="mt-2 pt-2 border-t border-white/10">
                              <p className="text-white/60 text-xs">Notes</p>
                              <p className="text-white/80 text-sm">
                                {item.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prescription Image */}
                {prescription.imageUrl && (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Prescription Image
                    </h3>
                    <div className="relative rounded-lg overflow-hidden border border-white/20">
                      <img
                        src={prescription.imageUrl}
                        alt="Prescription"
                        className="w-full h-auto max-h-96 object-contain bg-black/20"
                      />
                    </div>
                    <button
                      onClick={() => window.open(prescription.imageUrl, "_blank")}
                      className="mt-4 w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText size={18} />
                      Open Full Size Image
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PrescriptionDetailModal;
