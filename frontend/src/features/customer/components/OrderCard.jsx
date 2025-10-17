import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Star,
  Eye,
  Repeat,
  CreditCard,
  DollarSign,
  MapPin,
} from "lucide-react";

const OrderCard = ({ order, onView }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getPaymentMethodIcon = (method = "") => {
    switch (method.toLowerCase()) {
      case "cash":
        return <DollarSign size={14} />;
      case "credit card":
      case "debit card":
        return <CreditCard size={14} />;
      default:
        return <CreditCard size={14} />;
    }
  };

  const renderStars = (rating = 0) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={`${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
        }`}
      />
    ));
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="glass-card rounded-2xl border border-white/30 shadow-2xl hover:shadow-3xl overflow-hidden transition-all duration-300"
      style={{
        background:
          "linear-gradient(135deg, rgba(185,147,255,0.18) 0%, rgba(91,78,219,0.16) 100%)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
        border: "1.5px solid rgba(255,255,255,0.18)",
      }}
    >
      <div className="p-6">
        <div className="flex items-stretch gap-4">
          {/* Left: Stacked content */}
          <div className="flex-1 space-y-4">
            {/* Top: Order Code */}
            <div>
              <h3 className="text-white font-semibold text-lg">{order.orderNumber}</h3>
              <div className="mt-1 flex gap-1">{renderStars(order.rating)}</div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{order.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{order.time}</span>
              </div>
            </div>

            {/* Pharmacy & Payment */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin size={14} />
                <span className="truncate">{order.pharmacy}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                {getPaymentMethodIcon(order.paymentMethod)}
                <span>{order.paymentMethod}</span>
              </div>
              {order.itemCount != null ? (
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-sm">Items:</span>
                  <div className="bg-white/20 rounded-full h-7 w-7 flex items-center justify-center text-white text-sm font-medium ml-2">
                    {order.itemCount}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-sm">Pharmacies:</span>
                  <div className="bg-white/20 rounded-full h-7 w-7 flex items-center justify-center text-white text-sm font-medium ml-2">
                    {order.pharmacyCount || 0}
                  </div>
                </div>
              )}
            </div>

            {/* Total & Actions */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <div>
                <div className="text-white font-bold text-xl">{order.total}</div>
                <div className="text-white/60 text-xs">Total Amount</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onView}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Eye size={14} />
                  View
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Repeat size={14} />
                  Reorder
                </button>
              </div>
            </div>
          </div>

          {/* Right: Prescription image */}
          <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 overflow-hidden rounded-xl border border-white/20 bg-white/10">
            <img
              src={order.prescriptionImg || "/src/assets/img/prescription.jpeg"}
              alt="Prescription"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
