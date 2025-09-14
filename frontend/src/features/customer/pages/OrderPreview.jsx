import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  addItems,
  getItemsByPrescription,
  setItemsForPrescriptionAndPharmacy,
} from "../services/CartService";
import { ArrowLeft, Calendar, Clock, CreditCard, FileText } from "lucide-react";
import { motion } from "framer-motion";
// Payment handled on unified Checkout page
import OrderFromAnotherPharmacyModal from "../components/OrderFromAnotherPharmacyModal";
import PrescriptionActivityService from "../../../services/api/PrescriptionActivityService";

const OrderPreview = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const routeCode = params.code || params.prescriptionId; // support both
  const statePharmacyId = location.state?.pharmacyId;
  const statePharmacyName = location.state?.pharmacyName;
  const queryPharmacyId = query.get("pharmacyId");
  const prescriptionCode = routeCode;
  const pharmacyId =
    statePharmacyId ?? (queryPharmacyId ? Number(queryPharmacyId) : undefined);
  const [pharmacyName, setPharmacyName] = React.useState(
    statePharmacyName || ""
  );

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [uploadedAt, setUploadedAt] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [medications, setMedications] = React.useState([]);
  const [totals, setTotals] = React.useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    currency: "LKR",
  });
  const [unavailableMedications, setUnavailableMedications] = React.useState(
    []
  );

  // Payment modal removed; navigate to Checkout instead
  const [
    showOrderFromAnotherPharmacyModal,
    setShowOrderFromAnotherPharmacyModal,
  ] = React.useState(false);
  const [isAccepted, setIsAccepted] = React.useState(false);

  const selectionsKey = React.useMemo(() => {
    return pharmacyId
      ? `order-preview:${prescriptionCode}:${pharmacyId}:selections`
      : `order-preview:${prescriptionCode}:selections`;
  }, [prescriptionCode, pharmacyId]);

  // Load from backend
  React.useEffect(() => {
    if (!prescriptionCode || !pharmacyId) {
      setError("Missing prescription code or pharmacyId");
      setLoading(false);
      return;
    }
    let abort = new AbortController();
    setLoading(true);
    setError("");
    PrescriptionActivityService.getOrderPreview(
      { code: prescriptionCode, pharmacyId },
      { signal: abort.signal }
    )
      .then((data) => {
        setUploadedAt(data.uploadedAt || "");
        setImageUrl(data.imageUrl || "");
        setPharmacyName(statePharmacyName || data.pharmacyName || "");
        setTotals(
          data.totals || {
            subtotal: 0,
            discount: 0,
            tax: 0,
            shipping: 0,
            total: 0,
            currency: "LKR",
          }
        );
        const initialUnavailable = Array.isArray(data.unavailableItems)
          ? data.unavailableItems
          : [];

        const savedSelections = localStorage.getItem(selectionsKey);
        const selectionMap = savedSelections ? JSON.parse(savedSelections) : {};

        const mappedRaw = (data.items || []).map((it) => ({
          id: it.id,
          name: it.medicineName || it.name || "",
          price: Number(it.unitPrice ?? it.price ?? 0),
          quantity: Number(it.quantity ?? 1),
          available: it.available === true,
          notes: it.notes || "",
          strength: it.dosage || it.strength || "",
          selected: Boolean(selectionMap[it.id] ?? false),
        }));

        // Filter out items that are not actually available or have zero/negative price
        const filtered = mappedRaw.filter((m) => m.available && m.price > 0);
        const removed = mappedRaw.filter((m) => !(m.available && m.price > 0));

        // Merge removed names into unavailable list (avoid duplicates)
        const unavailableMerged = Array.from(
          new Set([
            ...initialUnavailable,
            ...removed.map((r) => r.name).filter(Boolean),
          ])
        );
        setUnavailableMedications(unavailableMerged);
        setMedications(filtered);

        const savedAcceptedState = localStorage.getItem(
          `order-preview:${prescriptionCode}:${pharmacyId}:accepted`
        );
        if (savedAcceptedState) setIsAccepted(JSON.parse(savedAcceptedState));
        else setIsAccepted(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError")
          setError(e.message || "Failed to load order preview");
      })
      .finally(() => setLoading(false));

    return () => abort.abort();
  }, [prescriptionCode, pharmacyId, selectionsKey, statePharmacyName]);

  const totalPrice = medications.reduce(
    (sum, med) => sum + (med.selected ? Number(med.price || 0) : 0),
    0
  );
  const hasSelectedMedications = medications.some((med) => med.selected);

  const handleMedicationToggle = (id) => {
    setMedications((prev) => {
      const updated = prev.map((med) =>
        med.id === id ? { ...med, selected: !med.selected } : med
      );

      // Persist selection map locally
      const selections = {};
      updated.forEach((med) => {
        selections[med.id] = med.selected;
      });
      localStorage.setItem(selectionsKey, JSON.stringify(selections));

      // Sync aggregated cart for this prescription + pharmacy: keep only selected
      const selectedForThisPharmacy = updated
        .filter((m) => m.selected)
        .map((m) => ({
          id: m.id,
          name: m.name,
          price: m.price,
          quantity: m.quantity || 1,
          selected: true,
        }));
      setItemsForPrescriptionAndPharmacy(
        prescriptionCode,
        pharmacyName || "",
        selectedForThisPharmacy,
        pharmacyId
      );

      return updated;
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleProceedToPayment = () => {
    // Ensure the cart mirrors current selections for this pharmacy before navigating
    const selectedForThisPharmacy = medications
      .filter((m) => m.selected)
      .map((m) => ({
        id: m.id,
        name: m.name,
        price: m.price,
        quantity: m.quantity || 1,
        selected: true,
      }));
    setItemsForPrescriptionAndPharmacy(
      prescriptionCode,
      pharmacyName || "",
      selectedForThisPharmacy,
      pharmacyId
    );
    navigate(`/customer/checkout/${prescriptionCode}`);
  };

  // No-op: modal removed

  // Confirmation handled on Checkout page
  const handleAcceptOrder = () => {
    if (hasSelectedMedications) {
      setIsAccepted(true);
      localStorage.setItem(
        `order-preview:${prescriptionCode}:${pharmacyId}:accepted`,
        JSON.stringify(true)
      );
      console.log(
        "Order accepted with selected medications:",
        medications.filter((med) => med.selected)
      );
    }
  };

  const handleOrderFromAnotherPharmacy = () => {
    setShowOrderFromAnotherPharmacyModal(true);
  };

  const handleCloseOrderFromAnotherPharmacyModal = () => {
    setShowOrderFromAnotherPharmacyModal(false);
  };

  const handleOrderPlaced = (selectedPharmacy, medications) => {
    console.log(
      "Order placed at:",
      selectedPharmacy.name,
      "for medications:",
      medications
    );
    // Add your order placement logic here
  };

  const formattedDate = uploadedAt ? new Date(uploadedAt) : null;
  const dateStr = formattedDate ? formattedDate.toLocaleDateString() : "—";
  const timeStr = formattedDate
    ? formattedDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
  // Use backend-provided unavailable items

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded border border-white/20">
          Loading order preview…
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-500/20 text-red-100 px-4 py-2 rounded border border-red-500/30">
          {error}
        </div>
      )}
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900"></div>
      <div className="absolute top-20 left-[10%] w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float-slow"></div>
      <div className="absolute top-32 right-20 w-80 h-80 bg-indigo-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Ongoing Activities</span>
          </button>

          <h1 className="text-4xl font-bold text-white mb-2 text-center">
            Order Preview
          </h1>
          <p className="text-white/70 text-lg text-center">
            Review your prescription order details
          </p>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
        >
          <div className="p-6">
            {/* Order Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Prescription Order #{prescriptionCode}
              </h2>
              <div className="space-y-2">
                <div className="flex items-center text-white/70">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Uploaded: {dateStr}</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Time: {timeStr}</span>
                </div>
                <div className="flex items-center text-white/70">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Pharmacy: {pharmacyName || "—"}</span>
                </div>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex gap-6 items-stretch">
              {/* Left Column */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Available Items
                </h3>
                <div className="space-y-3 ">
                  {medications.map((medication) => (
                    <div
                      key={medication.id}
                      className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border-2 shadow-lg shadow-green-200/20 relative"
                      style={{
                        borderColor: "#22c55e",
                        borderImage: "none",
                      }}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <label className="relative flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            id={`medication-${medication.id}`}
                            checked={medication.selected}
                            onChange={() =>
                              handleMedicationToggle(medication.id)
                            }
                            className="peer appearance-none w-6 h-6 rounded-lg border-2 border-white/30 bg-white/10 transition-all duration-200 focus:ring-2 focus:ring-green-400 focus:outline-none"
                          />
                          <span className="absolute left-0 top-0 w-6 h-6 flex items-center justify-center pointer-events-none">
                            <svg
                              className={`transition-opacity duration-200 ${
                                medication.selected
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6 13L11 18L18 8"
                                stroke="#1cdf50ff"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </label>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">
                            {medication.name}
                          </h4>
                          <p className="text-white/60 text-sm">
                            {medication.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-semibold text-lg ${
                            medication.selected ? "text-white" : "text-white/50"
                          }`}
                        >
                          Rs. {medication.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Price */}
                <div className="border-t border-white/10 pt-4 mt-6">
                  <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <span className="text-xl font-bold text-white">
                      Total Price
                    </span>
                    <span className="text-2xl font-bold text-white">
                      Rs. {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Add to unified checkout */}
                <div className="pt-4 flex justify-between">
                  <div className="text-white/70 self-center">
                    In checkout for this prescription:{" "}
                    {getItemsByPrescription(prescriptionCode).length} item(s)
                  </div>
                  <button
                    onClick={handleProceedToPayment}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Add to Checkout</span>
                  </button>
                </div>
              </div>

              {/* Right Column - Prescription Image */}
              <div className="flex-shrink-0 mt-[-133px]">
                {" "}
                {/* Adjust this value as needed */}
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={handleAcceptOrder}
                    disabled={!hasSelectedMedications}
                    className={`py-3 px-5 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                      hasSelectedMedications
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                        : "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                    } ${
                      isAccepted
                        ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        : ""
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>
                      {isAccepted ? "Order preview Accepted" : "Accept Preview"}
                    </span>
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Uploaded Prescription
                </h3>
                <div className="w-100 h-120 bg-white/5 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center overflow-hidden">
                  <img
                    src={imageUrl || "/prescription-placeholder.svg"}
                    alt="Prescription"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/prescription-placeholder.svg";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Unavailable Items - Full Width */}
            <div className="pt-8 border-t border-white/10 mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Unavailable Items
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unavailableMedications.map((medication, index) => (
                  <div
                    key={index}
                    className="p-4 bg-red-500/10 backdrop-blur-sm rounded-lg border border-red-500/20"
                  >
                    <h4 className="text-red-300 font-medium">{medication}</h4>
                    <p className="text-red-200/60 text-sm mt-1">
                      Currently out of stock
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  onClick={handleOrderFromAnotherPharmacy}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <FileText className="h-5 w-5" />
                  <span>Order from Another Pharmacy</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment moved to unified /customer/checkout */}

        {/* Order from Another Pharmacy Modal */}
        <OrderFromAnotherPharmacyModal
          isOpen={showOrderFromAnotherPharmacyModal}
          onClose={handleCloseOrderFromAnotherPharmacyModal}
          prescriptionId={prescriptionCode}
          unavailableMedications={unavailableMedications}
          onOrderPlaced={handleOrderPlaced}
        />
      </div>
    </div>
  );
};

export default OrderPreview;
