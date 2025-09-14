import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import OrdersService from "../../../services/api/OrdersService";
import { ArrowLeft, Package, Store, Loader2 } from "lucide-react";

const statusColors = {
  PENDING: "text-yellow-300",
  PROCESSING: "text-blue-300",
  READY_FOR_PICKUP: "text-green-300",
  PARTIALLY_READY: "text-indigo-300",
  COMPLETED: "text-green-400",
  CANCELLED: "text-red-300",
};

export default function CustomerOrderDetail() {
  const { orderCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const preloaded = location.state?.order;
  // Support state and query params for deep-linking / refresh
  const search =
    typeof location.search === "string"
      ? new URLSearchParams(location.search)
      : null;
  const qpPharmacyId = search?.get("pharmacyId") || undefined;
  const qpLocked = search?.get("locked") || undefined;
  const filterPharmacyId = location.state?.filterPharmacyId ?? qpPharmacyId;
  const locked = Boolean(
    location.state?.locked ?? (qpLocked === "1" || qpLocked === "true")
  );
  const [order, setOrder] = React.useState(preloaded || null);
  const [loading, setLoading] = React.useState(!preloaded);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (preloaded) return; // already have it
    let cancelled = false;
    setLoading(true);
    setError("");
    OrdersService.getOrder(orderCode)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || "Failed to load order");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orderCode, preloaded]);

  const handleBack = () => navigate(-1);

  const totalCurrency = order?.totals?.currency || "LKR";
  const visiblePharmacies = React.useMemo(() => {
    const list = order?.pharmacyOrders || order?.pharmacies || [];
    if (!filterPharmacyId) return list;
    // Support string/number ids from backend
    return list.filter(
      (po) => String(po.pharmacyId) === String(filterPharmacyId)
    );
  }, [order, filterPharmacyId]);

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900" />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-white">Order #{orderCode}</h1>
          <div />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
        {error && !loading && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {order && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Summary */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Order Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80 text-sm">
                <div>
                  <div className="text-white/50">Prescription Code</div>
                  <div className="font-medium">
                    {order.prescriptionCode || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-white/50">Created</div>
                  <div className="font-medium">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-white/50">Payment</div>
                  <div className="font-medium">
                    {order.paymentMethod || order.payment?.method || "—"}
                  </div>
                </div>
              </div>
              {order.totals && !locked && (
                <div className="mt-6 flex flex-wrap gap-6 text-white/90">
                  <div>
                    <div className="text-white/50 text-xs">Subtotal</div>
                    <div className="font-semibold">
                      {totalCurrency}{" "}
                      {order.totals.subtotal?.toFixed?.(2) ??
                        order.totals.subtotal}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs">Discount</div>
                    <div className="font-semibold">
                      {totalCurrency}{" "}
                      {order.totals.discount?.toFixed?.(2) ??
                        order.totals.discount}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs">Tax</div>
                    <div className="font-semibold">
                      {totalCurrency}{" "}
                      {order.totals.tax?.toFixed?.(2) ?? order.totals.tax}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs">Shipping</div>
                    <div className="font-semibold">
                      {totalCurrency}{" "}
                      {order.totals.shipping?.toFixed?.(2) ??
                        order.totals.shipping}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs">Total</div>
                    <div className="font-bold text-lg">
                      {totalCurrency}{" "}
                      {order.totals.total?.toFixed?.(2) ?? order.totals.total}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pharmacy Orders */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">
                Pharmacy Orders
              </h2>
              {visiblePharmacies.map((po, idx) => {
                const status = po.status || po.orderStatus || "PENDING";
                return (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Store className="h-5 w-5 text-white/60" />
                        <div>
                          <div className="text-white font-medium">
                            {po.pharmacyName ||
                              `Pharmacy #${po.pharmacyId || po.id || idx + 1}`}
                          </div>
                          {po.pickupCode && (
                            <div className="text-xs text-white/50">
                              Pickup Code: {po.pickupCode}
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className={`text-sm font-semibold ${
                          statusColors[status] || "text-white/70"
                        }`}
                      >
                        {status.replace(/_/g, " ")}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {(po.items || []).map((it, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-2 border border-white/10"
                        >
                          <div>
                            <div className="text-white text-sm font-medium">
                              {it.medicineName || it.name || `Item ${i + 1}`}
                            </div>
                            <div className="text-white/50 text-xs">
                              Qty: {it.quantity || 1}
                            </div>
                          </div>
                          {!locked && (
                            <div className="text-white font-semibold text-sm">
                              {totalCurrency}{" "}
                              {(it.unitPrice ?? it.price ?? 0).toFixed
                                ? (it.unitPrice ?? it.price ?? 0).toFixed(2)
                                : it.unitPrice ?? it.price ?? 0}
                            </div>
                          )}
                        </div>
                      ))}
                      {(!po.items || po.items.length === 0) && (
                        <div className="text-white/50 text-sm italic">
                          No items
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {(!order.pharmacyOrders || order.pharmacyOrders.length === 0) && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center text-white/70">
                  <Package className="h-10 w-10 mb-2 text-white/40" />
                  <div>No pharmacy allocations yet.</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
