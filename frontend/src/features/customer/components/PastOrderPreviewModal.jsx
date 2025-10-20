import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Store, Package, ArrowRight, Users, ChevronDown } from "lucide-react";
import { ScrollContainer } from "../../../components/UIs";
import OrdersService from "../../../services/api/OrdersService";
import FamilyMemberService from "../services/FamilyMemberService";
import { useNavigate } from "react-router-dom";

const PastOrderPreviewModal = ({ isOpen, onClose, order, hideAssignment = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);
  const [loyaltyRate, setLoyaltyRate] = useState(1.0);

  // Fetch loyalty rate
  useEffect(() => {
    const fetchLoyaltyRate = async () => {
      if (!isOpen || !order) return;
      
      // Check if this is a card payment order
      const isCardPayment = order?.paymentMethod === 'CREDIT_CARD' || order?.paymentMethod === 'DEBIT_CARD';
      if (!isCardPayment) return;
      
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        
        const response = await fetch('http://localhost:8080/api/v1/customer/loyalty', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setLoyaltyRate(data.pointsRate || 1.0);
        }
      } catch (err) {
        console.error('Error fetching loyalty rate:', err);
      }
    };
    
    fetchLoyaltyRate();
  }, [isOpen, order]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showFamilyDropdown, setShowFamilyDropdown] = useState(false);
  const [assigningMember, setAssigningMember] = useState(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);
  const [assignedMember, setAssignedMember] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!isOpen || !order) return;
      setError("");
      setAssignmentSuccess(false);
      
      // prefer raw order if present from caller
      if (order.raw) {
        setDetail(order.raw);
      } else {
        setLoading(true);
        try {
          const data = await OrdersService.getOrder(order.orderNumber);
          if (!cancelled) setDetail(data);
        } catch (e) {
          if (!cancelled) setError(e?.message || "Failed to load order");
        } finally {
          if (!cancelled) setLoading(false);
        }
      }
      
      // Load family members
      try {
        const members = await FamilyMemberService.getFamilyMembers();
        if (!cancelled) {
          setFamilyMembers(Array.isArray(members) ? members : []);
          
          // Check if order already has a family member assigned
          const familyMemberId = detail?.familyMemberId || order?.familyMemberId;
          if (familyMemberId && members) {
            const assigned = members.find(m => m.id === familyMemberId);
            if (assigned) {
              setAssignedMember(assigned);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load family members:", e);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [isOpen, order]);

  const handleAssignToFamilyMember = async (memberId, memberName) => {
    setShowFamilyDropdown(false);
    setAssigningMember(true);
    setError("");
    setAssignmentSuccess(false);
    
    try {
      // Get order code (this is what we're viewing)
      const orderCode = order?.orderNumber || detail?.orderCode;
      
      console.log("Assigning order:", orderCode, "to family member:", memberId, memberName);
      
      if (!orderCode) {
        throw new Error("Order code not found");
      }
      
      // Call the order assignment API endpoint
      const response = await fetch(
        `http://localhost:8080/api/v1/orders/${orderCode}/assign-family-member`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({ familyMemberId: memberId }),
        }
      );
      
      console.log("Assignment response status:", response.status);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.error || "Failed to assign order");
      }
      
      const result = await response.json();
      console.log("Assignment successful:", result);
      
      // Find and set the assigned member
      const member = familyMembers.find(m => m.id === memberId);
      if (member) {
        setAssignedMember(member);
      }
      
      setAssignmentSuccess(true);
      setTimeout(() => setAssignmentSuccess(false), 3000);
    } catch (e) {
      console.error("Assignment error:", e);
      setError(e.message || "Failed to assign order to family member");
    } finally {
      setAssigningMember(false);
    }
  };

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
            
            {/* Family Member Assignment Section */}
            {!hideAssignment && (
              <div className="px-6 pt-6 pb-2">
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-300" />
                      <span className="text-white font-medium">
                        {assignedMember ? "Assigned to Family Member" : "Assign to Family Member"}
                      </span>
                    </div>
                  
                  {assignedMember ? (
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600/30 border border-blue-400/50 px-4 py-2 rounded-lg">
                        <span className="text-white font-medium">
                          {assignedMember.name}
                        </span>
                        {assignedMember.relation && (
                          <span className="text-white/70 text-sm ml-2">
                            ({assignedMember.relation})
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setAssignedMember(null);
                          setAssignmentSuccess(false);
                        }}
                        className="text-blue-300 hover:text-blue-200 text-sm underline"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={() => setShowFamilyDropdown(!showFamilyDropdown)}
                        disabled={assigningMember}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all"
                      >
                        {assigningMember ? (
                          <span>Assigning...</span>
                        ) : (
                          <>
                            Select Member
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                showFamilyDropdown ? "rotate-180" : ""
                              }`}
                            />
                          </>
                        )}
                      </button>
                      
                      {showFamilyDropdown && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 mt-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-xl z-20 min-w-[200px] max-h-[300px] overflow-y-auto"
                        >
                          {familyMembers.length === 0 ? (
                            <div className="px-4 py-3 text-white/70 text-sm">
                              No family members found
                            </div>
                          ) : (
                            familyMembers.map((member) => (
                              <button
                                key={member.id}
                                onClick={() =>
                                  handleAssignToFamilyMember(member.id, member.name)
                                }
                                className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-white first:rounded-t-xl last:rounded-b-xl"
                              >
                                {member.name}
                                {member.relation && (
                                  <span className="text-white/60 text-xs ml-2">
                                    ({member.relation})
                                  </span>
                                )}
                              </button>
                            ))
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
                
                {assignmentSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 bg-green-500/20 border border-green-500/40 text-green-200 px-3 py-2 rounded-lg text-sm"
                  >
                    ✓ Order assigned successfully!
                  </motion.div>
                )}
              </div>
            </div>
            )}

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Error Display */}
              {error && !loading && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-3 py-2 rounded">
                  {error}
                </div>
              )}
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
              
              {/* Loyalty Points Display for Card Payments */}
              {(() => {
                const isCardPayment = order?.paymentMethod === 'CREDIT_CARD' || order?.paymentMethod === 'DEBIT_CARD';
                const orderTotal = detail?.totals?.total || order.total || 0;
                const pointsEarned = isCardPayment ? Math.floor(orderTotal * loyaltyRate) : 0;
                
                if (isCardPayment && pointsEarned > 0) {
                  return (
                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/30 rounded-lg">
                            <Package className="h-6 w-6 text-green-300" />
                          </div>
                          <div>
                            <p className="text-green-300 font-semibold text-lg">
                              Loyalty Points Earned
                            </p>
                            <p className="text-white/60 text-sm">
                              From this card payment order
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold text-3xl">
                            +{pointsEarned.toLocaleString()}
                          </p>
                          <p className="text-white/50 text-xs">points</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-white/60 text-xs">
                          💳 Earned at {loyaltyRate} point{loyaltyRate !== 1 ? 's' : ''} per {currency} 1 on card payments
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Pharmacy Orders */}
              <div className="space-y-4">
                <h3 className="text-white/90 font-semibold">
                  Pharmacy orders ({pharmacies.length})
                </h3>
                {loading && <div className="text-white/60">Loading...</div>}
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
