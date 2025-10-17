import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Store, Package, ArrowRight } from "lucide-react";
import { ScrollContainer } from "../../../components/UIs";
import OrdersService from "../../../services/api/OrdersService";
import { useNavigate } from "react-router-dom";

const PastOrderPreviewModal = ({ isOpen, onClose, order }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!isOpen || !order) return;
      setError("");
      // prefer raw order if present from caller
      if (order.raw) {
        setDetail(order.raw);
        return;
      }
      setLoading(true);
      try {
        const data = await OrdersService.getOrder(order.orderNumber);
        if (!cancelled) setDetail(data);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load order");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const currency = detail?.totals?.currency || order.currency || "LKR";
  const pharmacies = Array.isArray(detail?.pharmacyOrders)
    ? detail.pharmacyOrders
    : [];
  const createdAt = detail?.createdAt || order.createdAt;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ScrollContainer
          className="bg-gradient-to-br from-blue-400/20 via-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-xl border border-white/20 max-w-4xl w-full"
          maxHeight="90vh"
          scrollbarTheme="green"
          scrollbarWidth="8px"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white">
                  Order: {order.orderNumber}
                </h2>
                <p className="text-white/60 mt-1">
                  {createdAt ? new Date(createdAt).toLocaleString() : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    navigate(`/customer/orders/${order.orderNumber}`)
                  }
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  Open full details <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  className="text-white/60 hover:text-white transition-colors"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Prescription Image */}
              <div className="flex justify-center w-full">
                <img
                  src={
                    detail?.pharmacyOrders?.[0]?.prescriptionImageUrl ||
                    order.prescriptionImg ||
                    "/src/assets/img/prescription.jpeg"
                  }
                  alt="Prescription"
                  className="rounded-xl border border-white/30 shadow-lg max-h-100 object-contain bg-white/10"
                  style={{ width: "auto", maxWidth: "100%" }}
                />
              </div>
              {/* Summary */}
              {detail && detail.totals && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex flex-wrap gap-6 text-white/90">
                    <div>
                      <div className="text-white/50 text-xs">Subtotal</div>
                      <div className="font-semibold">
                        {currency}{" "}
                        {detail.totals.subtotal?.toFixed?.(2) ??
                          detail.totals.subtotal}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50 text-xs">Total</div>
                      <div className="font-bold">
                        {currency}{" "}
                        {detail.totals.total?.toFixed?.(2) ??
                          detail.totals.total}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pharmacy Orders */}
              <div className="space-y-4">
                <h3 className="text-white/90 font-semibold">
                  Pharmacy orders ({pharmacies.length})
                </h3>
                {loading && <div className="text-white/60">Loading...</div>}
                {error && !loading && (
                  <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-3 py-2 rounded">
                    {error}
                  </div>
                )}
                {!loading && pharmacies.length === 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-3 text-white/70">
                    <Package className="h-5 w-5" /> No pharmacy allocations
                  </div>
                )}
                {pharmacies.map((po, idx) => {
                  const status = (
                    po.status ||
                    po.orderStatus ||
                    "PENDING"
                  ).replace(/_/g, " ");
                  const items =
                    po.items || po.orderItems || po.previewItems || [];
                  return (
                    <div
                      key={idx}
                      className="bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-white/60" />
                          <div className="text-white font-medium">
                            {po.pharmacyName || `Pharmacy #${po.pharmacyId}`}
                          </div>
                        </div>
                        <div className="text-white/70 text-sm">{status}</div>
                      </div>
                      {items.length > 0 && (
                        <div className="space-y-1 mb-3">
                          {items.map((it, i) => (
                            <div
                              key={i}
                              className="flex justify-between text-white/80 text-sm"
                            >
                              <span>
                                {it.medicineName || it.name || `Item ${i + 1}`}{" "}
                                {it.dosage ? `- ${it.dosage}` : ""}
                              </span>
                              <span>
                                {currency}{" "}
                                {(it.unitPrice ?? it.price ?? 0).toFixed
                                  ? (it.unitPrice ?? it.price ?? 0).toFixed(2)
                                  : it.unitPrice ?? it.price ?? 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-white/80 text-sm">
                          Total: {currency}{" "}
                          {po.totals?.total?.toFixed?.(2) ??
                            po.totals?.total ??
                            "-"}
                        </div>
                        <button
                          onClick={() =>
                            navigate(
                              `/customer/orders/${order.orderNumber}?pharmacyId=${po.pharmacyId}&pharmacyOrderCode=${po.orderCode}`
                            )
                          }
                          className="text-blue-300 hover:text-blue-200 text-sm flex items-center gap-1"
                        >
                          View details <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </ScrollContainer>
      </motion.div>
    </AnimatePresence>
  );
};

export default PastOrderPreviewModal;
