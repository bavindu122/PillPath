import React from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getItemsByPrescription,
  clearPrescription,
} from "../services/CartService";
import OrdersService from "../../../services/api/OrdersService";
import { DollarSign, CreditCard as CreditIcon, Lock } from "lucide-react";

// Unified checkout page — single payment across selected pharmacies
const Checkout = () => {
  const location = useLocation();
  const { prescriptionId } = useParams();
  const navigate = useNavigate();
  const state = location.state || {};
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState("");
  const [cardDetails, setCardDetails] = React.useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [placing, setPlacing] = React.useState(false);
  const [error, setError] = React.useState("");

  const allItems =
    Array.isArray(state.items) && state.items.length > 0
      ? state.items.filter((it) => it.prescriptionId === prescriptionId)
      : getItemsByPrescription(prescriptionId);
  // Only keep explicitly selected items (from cart with selected flag) if any carry selected flag
  const hasSelectionFlags = allItems.some(
    (it) => typeof it.selected !== "undefined"
  );
  const items = hasSelectionFlags
    ? allItems.filter((it) => it.selected)
    : allItems;
  const subtotal = items.reduce(
    (sum, it) => sum + it.price * (it.quantity || 1),
    0
  );
  // Totals are shown as derived from items only; no fake discounts
  const total = subtotal;

  const handlePaymentMethodSelect = (method) =>
    setSelectedPaymentMethod(method);
  const handleCardInputChange = (field, value) =>
    setCardDetails((p) => ({ ...p, [field]: value }));

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4)
      parts.push(match.substring(i, i + 4));
    return parts.length ? parts.join(" ") : v;
  };
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    return v.length >= 2 ? v.substring(0, 2) + "/" + v.substring(2, 4) : v;
  };

  const handleConfirmPayment = async () => {
    if (items.length === 0) {
      alert("No items selected to pay.");
      return;
    }
    if (selectedPaymentMethod === "card") {
      const { cardNumber, expiryDate, cvv, cardholderName } = cardDetails;
      if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        alert("Please fill in all card details");
        return;
      }
      if (cardNumber.replace(/\s/g, "").length < 16) {
        alert("Please enter a valid card number");
        return;
      }
      if (cvv.length < 3) {
        alert("Please enter a valid CVV");
        return;
      }
    }
    setError("");
    setPlacing(true);
    try {
      // Group items by pharmacyId (fallback to pharmacyName hash if missing)
      const groups = {};
      for (const it of items) {
        const key =
          it.pharmacyId != null
            ? String(it.pharmacyId)
            : `name:${it.pharmacyName || "unknown"}`;
        if (!groups[key])
          groups[key] = { pharmacyId: it.pharmacyId, items: [] };
        groups[key].items.push({
          submissionId: it.id, // backend now expects submissionId
          quantity: it.quantity || 1,
        });
      }
      const pharmacies = Object.values(groups).filter(
        (g) => g.items.length > 0
      );
      // Basic validation: require a pharmacyId for each group to satisfy backend; if missing warn user
      const missingPharmacyId = pharmacies.some((p) => p.pharmacyId == null);
      if (missingPharmacyId) {
        console.warn(
          "Some cart items lack pharmacyId; order payload may be rejected."
        );
      }
      const dto = {
        prescriptionCode: prescriptionId,
        paymentMethod:
          selectedPaymentMethod === "card" ? "CREDIT_CARD" : "CASH",
        pharmacies: pharmacies.map((p) => ({
          pharmacyId: p.pharmacyId,
          items: p.items,
        })),
      };
      const response = await OrdersService.createOrder(dto);
      // Expect response.orderCode or similar; attempt to extract robustly
      const orderCode =
        response.orderCode || response.code || response.id || null;
      // Trigger pay endpoint as per design
      if (orderCode) {
        if (selectedPaymentMethod === "cash") {
          // Cash: call pay immediately at checkout
          try {
            await OrdersService.pay(orderCode, { paymentMethod: "CASH" });
          } catch (err) {
            console.warn("Cash pay call failed:", err);
            const msg =
              err?.response?.data?.message ||
              err?.message ||
              "Cash payment failed. Your order may have been created but was not paid. Please try again or check your Orders page.";
            setError(msg);
            setPlacing(false);
            return; // Stop flow on payment failure
          }
        } else if (selectedPaymentMethod === "card") {
          // Card: simulate gateway success for now; in real flow, move this call to gateway success callback
          const masked = (cardDetails.cardNumber || "").replace(/\s+/g, "");
          const last4 = masked.slice(-4);
          try {
            await OrdersService.pay(orderCode, {
              paymentMethod: "CREDIT_CARD",
              gatewayReference: `demo_${Date.now()}`,
              cardLast4: last4,
            });
          } catch (err) {
            console.warn("Card pay call failed:", err);
            const msg =
              err?.response?.data?.message ||
              err?.message ||
              "Card payment failed. Your order may have been created but was not paid. Please try again or use a different method.";
            setError(msg);
            setPlacing(false);
            return; // Stop flow on payment failure
          }
        }
        // Clear cart for this prescription then navigate to order detail
        clearPrescription(prescriptionId);
        navigate(`/customer/orders/${orderCode}`, {
          state: { justPlaced: true, order: response },
          replace: true,
        });
      } else {
        navigate(-1);
      }
    } catch (e) {
      console.error("Failed to place order", e);
      setError(e.message || "Failed to place order");
    } finally {
      setPlacing(false);
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Checkout
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Review your selections across pharmacies and complete a single
            payment.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Items</h3>
          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-500/40 text-red-200 px-3 py-2 rounded">
              {error}
            </div>
          )}
          {items.length === 0 ? (
            <p className="text-white/70">
              No items to pay. Go back and select items.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div>
                    <div className="text-white font-medium">{it.name}</div>
                    {it.pharmacyName && (
                      <div className="text-white/60 text-xs">
                        {it.pharmacyName}
                      </div>
                    )}
                  </div>
                  <div className="text-white font-semibold">
                    Rs. {(it.price * (it.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary + Payment */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Summary</h3>
          <div className="space-y-2 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 mb-6">
            <div className="flex justify-between text-white/70">
              <span>Subtotal:</span>
              <span>Rs. {subtotal.toFixed(2)}</span>
            </div>
            <div className="border-t border-white/10 pt-2">
              <div className="flex justify-between text-white text-lg font-bold">
                <span>Total:</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-white mb-3">
            Payment Method
          </h3>
          <div className="space-y-3 mb-6">
            <div
              onClick={() => handlePaymentMethodSelect("cash")}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedPaymentMethod === "cash"
                  ? "bg-blue-500/20 border-blue-400/50 text-blue-300"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
            >
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5" />
                <span className="font-medium">Cash Payment</span>
              </div>
            </div>
            <div
              onClick={() => handlePaymentMethodSelect("card")}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedPaymentMethod === "card"
                  ? "bg-blue-500/20 border-blue-400/50 text-blue-300"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
            >
              <div className="flex items-center space-x-3">
                <CreditIcon className="h-5 w-5" />
                <span className="font-medium">Card Payment</span>
              </div>
            </div>

            {selectedPaymentMethod === "card" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 space-y-4"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Lock className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">
                    Secure Payment
                  </span>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={(e) =>
                      handleCardInputChange(
                        "cardNumber",
                        formatCardNumber(e.target.value)
                      )
                    }
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardDetails.expiryDate}
                      onChange={(e) =>
                        handleCardInputChange(
                          "expiryDate",
                          formatExpiryDate(e.target.value)
                        )
                      }
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cvv}
                      onChange={(e) =>
                        handleCardInputChange(
                          "cvv",
                          e.target.value.replace(/\D/g, "").substring(0, 3)
                        )
                      }
                      placeholder="123"
                      maxLength={3}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardholderName}
                    onChange={(e) =>
                      handleCardInputChange("cardholderName", e.target.value)
                    }
                    placeholder="John Doe"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 border border-white/20"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPayment}
              disabled={!selectedPaymentMethod || placing}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                selectedPaymentMethod && !placing
                  ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  : "bg-gray-500/20 text-gray-400 cursor-not-allowed"
              }`}
            >
              {placing ? "Placing..." : "Confirm Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
