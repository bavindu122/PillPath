import React, { useState } from "react";
import OrderPreviewModal from "./PastOrderPreviewModal";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Star,
  Eye,
  Repeat,
  MoreVertical,
  User,
  Mail,
  Package,
  CreditCard,
  DollarSign,
  MapPin,
  FileText
} from "lucide-react";

const OrderCard = ({ order, onView }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getPaymentMethodIcon = (method) => {
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={`${
          index < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-400"
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
        background: 'linear-gradient(135deg, rgba(185,147,255,0.18) 0%, rgba(91,78,219,0.16) 100%)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        border: '1.5px solid rgba(255,255,255,0.18)',
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between gap-6">
          {/* Left Section - Order Info */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#5B4EDB]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="#B993FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="#B993FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="#B993FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#B993FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-white font-semibold text-lg">
                {order.orderNumber}
              </h3>
              <div className="flex items-center gap-2">
                
                <div className="flex gap-1">
                  {renderStars(order.rating)}
                </div>
              </div>
            </div>
          </div>

          {/* Center Section - Order Details */}
          <div className="flex-1 space-y-3">
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
          </div>

          {/* Center-Right Section - Pharmacy & Payment */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <MapPin size={14} />
              <span className="truncate">{order.pharmacy}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              {getPaymentMethodIcon(order.paymentMethod)}
              <span>{order.paymentMethod}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">Items:</span>
              <div className="bg-white/20 rounded-full h-7 w-7 flex items-center justify-center text-white text-sm font-medium ml-2">
                {order.itemCount}
              </div>
            </div>
          </div>

          {/* Right Section - Total & Actions */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white font-bold text-xl">{order.total}</div>
              <div className="text-white/60 text-xs">Total Amount</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onView}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Eye size={14} />
                View
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Repeat size={14} />
                Reorder
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <MoreVertical size={18} className="text-white/60" />
              </button>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 top-full mt-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-xl z-20 min-w-[160px]"
                >
                  <button className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-white text-sm flex items-center gap-2 rounded-t-xl">
                    <Eye size={14} />
                    View Details
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-white text-sm flex items-center gap-2 rounded-b-xl">
                    <Repeat size={14} />
                    Reorder
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default OrderCard;
