import React from "react";
import { Package,Ship,  Store, Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const RecentOrdersCard = () => {
  const orders = [
    {
      id: "RX-250718-19",
      pharmacy: "Central Pharmacy",
      status: "Out for Delivery",
      eta: "2 hours",
      date: "July 10, 2025",
      items: 3
    },
    {
      id: "RX-250719-20",
      pharmacy: "HealthCare Pharmacy",
      status: "Ready",
      eta: "Ready for pickup",
      date: "July 8, 2025",
      items: 2
    }
  ];

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-purple-600/20 p-2 rounded-lg">
            <Package size={18} className="text-purple-200" />
          </span>
          <h3 className="text-white font-semibold">Recent Orders</h3>
        </div>
        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
          {orders.length} Active
        </span>
      </div>

      <div className="space-y-3 mb-3">
        {orders.map((order) => (
          <motion.div 
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <h4 className="text-white font-medium">{order.id}</h4>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    order.status === "Out for Delivery" 
                      ? "bg-blue-500/20 text-blue-300" 
                      : "bg-green-500/20 text-green-300"
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center text-white/60 text-xs">
                    <Store size={12} className="mr-1 text-purple-300" />
                    {order.pharmacy}
                  </div>
                  <div className="flex items-center text-white/60 text-xs">
                    {order.status === "Out for Delivery" ? (
                      <>
                        <Ship size={12} className="mr-1 text-blue-300" />
                        Estimated delivery: {order.eta}
                      </>
                    ) : (
                      <>
                        <Package size={12} className="mr-1 text-green-300" />
                        {order.eta}
                      </>
                    )}
                  </div>
                  <div className="flex items-center text-white/60 text-xs">
                    <Calendar size={12} className="mr-1" />
                    {order.date}
                  </div>
                </div>
              </div>
              <div className="bg-white/20 rounded-full h-8 w-8 flex items-center justify-center text-white text-xs">
                {order.items}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-white/80 hover:text-white text-sm flex items-center justify-center">
        View Order History <ChevronRight size={14} className="ml-1" />
      </button>
    </div>
  );
};

export default RecentOrdersCard;