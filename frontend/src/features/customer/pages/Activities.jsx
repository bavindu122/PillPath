import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  User,
  Truck,
  AlertCircle,
  Calendar,
  Pill,
  CreditCard,
} from "lucide-react";
// Payment is handled in unified Checkout page now
import { getItemsByPrescription } from "../services/CartService";
import PrescriptionActivityService from "../../../services/api/PrescriptionActivityService";

const Activities = () => {
  const navigate = useNavigate();
  // Aggregated payment moved to /customer/checkout

  const handleViewOrderPreview = (prescriptionId, pharmacyId, pharmacyName) => {
    // Navigate to order preview including pharmacyId in both query and state for robustness
    const query = new URLSearchParams({ pharmacyId: String(pharmacyId) });
    navigate(`/customer/order-preview/${prescriptionId}?${query.toString()}`, {
      state: { pharmacyId, pharmacyName },
      replace: false,
    });
  };

  // No local payment modal state anymore

  // Payment is confirmed on the Checkout page

  // Activities state and data loading
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [prescriptions, setPrescriptions] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await PrescriptionActivityService.getActivities(0, 20);
        if (!mounted) return;
        const normalized = (data.items || []).map((item) => ({
          id: item.code,
          uploadedDate: item.uploadedAt,
          prescriptionImage: item.imageUrl,
          prescriptionStatus: item.prescriptionStatus,
          pharmacies: (item.pharmacies || []).map((p) => {
            const canView = !!p.actions?.canViewOrderPreview;
            // Only allow payment label when backend marks this slice as accepted
            const canPay =
              !!p.actions?.canProceedToPayment && p.accepted === true;
            let statusLabel = "Pending Review";
            let statusType = "pending";
            const st = (p.status || "").toUpperCase();
            if (st.includes("PREPARING") || st.includes("READY")) {
              statusLabel = st.includes("PREPARING")
                ? "Preparing order"
                : "Ready for pickup";
              statusType = "delivery";
            } else if (canPay) {
              statusLabel = "Proceed to payment";
              statusType = "payment";
            } else if (canView) {
              statusLabel = "View Order Preview";
              statusType = "delivery";
            } else {
              switch (st) {
                case "IN_PROGRESS":
                  statusLabel = "In Progress";
                  statusType = "pending";
                  break;
                case "CLARIFICATION_NEEDED":
                  statusLabel = "Needs Clarification";
                  statusType = "pending";
                  break;
                case "READY_FOR_PICKUP":
                  statusLabel = "Ready for pickup";
                  statusType = "delivery";
                  break;
                case "REJECTED":
                  statusLabel = "Rejected";
                  statusType = "pending";
                  break;
                case "COMPLETED":
                  statusLabel = "Completed";
                  statusType = "delivery";
                  break;
                case "CANCELLED":
                  statusLabel = "Cancelled";
                  statusType = "pending";
                  break;
                default:
                  statusLabel = "Pending Review";
                  statusType = "pending";
              }
            }

            return {
              pharmacyId: p.pharmacyId,
              name: p.pharmacyName,
              address: p.address,
              orderCode: p.orderCode || item.orderCode || undefined,
              orderStatus: p.orderStatus || null,
              status: statusLabel,
              statusType,
              medications: p.medications || undefined,
              totals: p.totals || undefined,
            };
          }),
        }));
        setPrescriptions(normalized);
      } catch (e) {
        setError(e.message || "Failed to load activities");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const calculateTotalPrice = (medications) => {
    if (!Array.isArray(medications)) return 0;
    return medications.reduce(
      (sum, m) =>
        sum + (typeof m.price === "number" ? m.price : Number(m.price) || 0),
      0
    );
  };

  const getStatusIcon = (statusType) => {
    switch (statusType) {
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "delivery":
        return <Truck className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusColor = (statusType) => {
    switch (statusType) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-300/30";
      case "delivery":
        return "bg-orange-500/20 text-orange-300 border-orange-300/30";
      case "payment":
        return "bg-green-500/20 text-green-300 border-green-300/30";
    }
  };

  return (
    <div className="min-h-screen p-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ongoing Activities
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Track your prescription orders and delivery status
          </p>
        </div>
      </motion.div>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500/30 text-red-200">
          {error}
        </div>
      )}
      {loading && <div className="text-white/80">Loading activities…</div>}
      <div className="space-y-8">
        {prescriptions.map((prescription, index) => (
          <motion.div
            key={prescription.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
          >
            {/* Prescription Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center border border-white/30">
                    <Pill className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {prescription.id}
                    </h2>
                    <div className="flex items-center text-white/60 text-sm mt-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Uploaded: {prescription.uploadedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Prescription Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-32 bg-white/10 rounded-lg border border-white/20 overflow-hidden">
                    <img
                      src={prescription.prescriptionImage}
                      alt="Prescription"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Per-prescription checkout entry */}
                <div className="flex-shrink-0">
                  {String(prescription.prescriptionStatus || "")
                    .toUpperCase()
                    .includes("ORDER_PLACED") ? (
                    <span className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium border bg-green-500/20 text-green-300 border-green-300/30">
                      Order placed
                    </span>
                  ) : getItemsByPrescription(prescription.id).length > 0 ? (
                    <button
                      onClick={() =>
                        navigate(`/customer/checkout/${prescription.id}`)
                      }
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Checkout ({getItemsByPrescription(prescription.id).length}
                      )
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Pharmacy Cards */}
            <div className="p-6">
              <div className="space-y-4">
                {prescription.pharmacies.map((pharmacy, pharmacyIndex) => (
                  <motion.div
                    key={`${prescription.id}-${pharmacyIndex}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1 + pharmacyIndex * 0.05,
                    }}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 p-4"
                  >
                    <div className="flex items-center justify-between relative">
                      <div className="flex items-center space-x-4">
                        {/* Pharmacy Icon */}
                        <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center border border-white/20">
                          <User className="h-5 w-5 text-white" />
                        </div>

                        {/* Pharmacy Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {pharmacy.name}
                          </h3>

                          <div className="flex items-center text-white/60">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="text-sm">{pharmacy.address}</span>
                          </div>
                        </div>
                      </div>

                      {/* Total Price Display - Absolutely centered */}
                      {pharmacy.status === "View Order Preview" &&
                        pharmacy.medications && (
                          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="text-center">
                              <div className="text-white/60 text-xs mb-1">
                                Total:
                              </div>
                              <div className="text-secondary-green font-bold text-lg whitespace-nowrap">
                                Rs.{" "}
                                {calculateTotalPrice(
                                  pharmacy.medications
                                ).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Status Badge */}
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            pharmacy.statusType
                          )} ${
                            pharmacy.status === "View Order Preview" ||
                            ((String(pharmacy.status || "")
                              .toUpperCase()
                              .includes("PREPARING") ||
                              String(pharmacy.status || "")
                                .toUpperCase()
                                .includes("READY")) &&
                              pharmacy.orderCode)
                              ? "cursor-pointer hover:opacity-80 transition-opacity"
                              : ""
                          }`}
                          onClick={() => {
                            const hasOrder = pharmacy.orderStatus != null;
                            if (hasOrder && pharmacy.orderCode) {
                              const q = new URLSearchParams({
                                pharmacyId: String(pharmacy.pharmacyId),
                                locked: "1",
                              });
                              navigate(
                                `/customer/orders/${
                                  pharmacy.orderCode
                                }?${q.toString()}`,
                                {
                                  state: {
                                    filterPharmacyId: pharmacy.pharmacyId,
                                    locked: true,
                                  },
                                }
                              );
                            } else if (!hasOrder) {
                              handleViewOrderPreview(
                                prescription.id,
                                pharmacy.pharmacyId,
                                pharmacy.name
                              );
                            }
                          }}
                        >
                          {getStatusIcon(pharmacy.statusType)}
                          <span className="ml-1">{pharmacy.status}</span>
                        </span>

                        {/* Action Arrow */}
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="text-white/60 hover:text-white transition-colors cursor-pointer"
                          onClick={() => {
                            const hasOrder = pharmacy.orderStatus != null;
                            if (hasOrder && pharmacy.orderCode) {
                              const q = new URLSearchParams({
                                pharmacyId: String(pharmacy.pharmacyId),
                                locked: "1",
                              });
                              navigate(
                                `/customer/orders/${
                                  pharmacy.orderCode
                                }?${q.toString()}`,
                                {
                                  state: {
                                    filterPharmacyId: pharmacy.pharmacyId,
                                    locked: true,
                                  },
                                }
                              );
                            } else if (!hasOrder) {
                              handleViewOrderPreview(
                                prescription.id,
                                pharmacy.pharmacyId,
                                pharmacy.name
                              );
                            }
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payment moved to unified /customer/checkout */}
    </div>
  );
};

export default Activities;
