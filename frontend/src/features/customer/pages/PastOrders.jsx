import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Calendar,
  Package,
  Star,
  ChevronDown,
  Eye,
  Repeat,
  MoreVertical
} from "lucide-react";
import OrderCard from "../components/OrderCard";
import OrderPreviewModal from "../components/PastOrderPreviewModal";

const PastOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Orders");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sample past orders data based on the screenshot structure
  const pastOrders = [
    {
      id: "RX-250117-01",
      orderNumber: "RX-250117-01",
      total: "Rs. 127.50",
      date: "Dec 28, 2024",
      time: "10:30 AM",
      status: "Completed",
      notes: "Patient allergic to penicillin - verified safe alternative",
      pharmacy: "Central Pharmacy",
      itemCount: 3,
      prescriptionType: "Prescription",
      paymentMethod: "Cash",
      rating: 5,
      prescriptionImg: "/src/assets/img/prescription.jpeg"
    },
    {
      id: "RX-250117-02", 
      orderNumber: "RX-250117-02",
      total: "Rs.89.25",
      date: "Dec 25, 2024",
      time: "2:15 PM",
      status: "Completed",
      notes: "Regular customer - no allergies",
      pharmacy: "HealthPlus Pharmacy",
      itemCount: 2,
      prescriptionType: "OTC",
      paymentMethod: "Credit Card",
      rating: 4,
      prescriptionImg: "/src/assets/img/prescription.jpeg"
    },
    {
      id: "RX-250117-03",
      orderNumber: "RX-250117-03", 
      total: "Rs. 45.00",
      date: "Dec 22, 2024",
      time: "11:45 AM",
      status: "Completed",
      notes: "Insurance coverage applied",
      pharmacy: "Community Pharmacy",
      itemCount: 1,
      prescriptionType: "Prescription",
      paymentMethod: "Insurance",
      rating: 5,
      prescriptionImg: "/src/assets/img/prescription.jpeg"
    },
    {
      id: "RX-250117-04",
      orderNumber: "RX-250117-04",
      total: "Rs. 156.75",
      date: "Dec 20, 2024",
      time: "9:20 AM",
      status: "Completed",
      notes: "Chronic medication refill",
      pharmacy: "MediCare Pharmacy",
      itemCount: 4,
      prescriptionType: "Prescription", 
      paymentMethod: "Debit Card",
      rating: 5,
      prescriptionImg: "/src/assets/img/prescription.jpeg"
    },
    {
      id: "RX-250117-05",
      orderNumber: "RX-250117-05",
      total: "Rs. 32.80",
      date: "Dec 18, 2024", 
      time: "4:30 PM",
      status: "Completed",
      notes: "Vitamins and supplements",
      pharmacy: "Wellness Pharmacy",
      itemCount: 3,
      prescriptionType: "OTC",
      paymentMethod: "Cash",
      rating: 4,
      prescriptionImg: "/src/assets/img/prescription.jpeg"
    },
    {
      id: "RX-250117-06",
      orderNumber: "RX-250117-06",
      total: "Rs. 203.40",
      date: "Dec 15, 2024",
      time: "1:10 PM", 
      status: "Completed",
      notes: "Multiple prescriptions - diabetes management",
      pharmacy: "Family Pharmacy",
      itemCount: 5,
      prescriptionType: "Prescription",
      paymentMethod: "Credit Card",
      rating: 5,
      prescriptionImg: "/src/assets/img/prescription.jpeg"
    }
  ];

  const filterOptions = [
    "All Orders",
    "Prescription Orders", 
    "OTC Orders",
    "This Month",
    "Last 3 Months",
    "This Year"
  ];

  const filteredOrders = pastOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === "All Orders") return matchesSearch;
    if (selectedFilter === "Prescription Orders") return matchesSearch && order.prescriptionType === "Prescription";
    if (selectedFilter === "OTC Orders") return matchesSearch && order.prescriptionType === "OTC";
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen p-6 relative">
      {/* Header */}
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Past Orders</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">View and manage your order history</p>
          
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-sm">
              {filteredOrders.length} orders found
            </span>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 z-10" />
            <input
              type="text"
              placeholder="Search orders by family member name or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 min-w-[160px]"
            >
              <Filter size={18} />
              <span>{selectedFilter}</span>
              <ChevronDown size={16} className={`transform transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>

            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full mt-2 right-0 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-xl z-10 min-w-[180px]"
              >
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedFilter(option);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-white/10 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                      selectedFilter === option ? 'text-blue-300 bg-white/10' : 'text-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Orders List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <OrderCard 
              order={order} 
              onView={() => { setSelectedOrder(order); setShowModal(true); }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Package size={64} className="mx-auto text-white/30 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
          <p className="text-white/60">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* Order Preview Modal at page level */}
      <OrderPreviewModal isOpen={showModal} onClose={() => setShowModal(false)} order={selectedOrder} />
    </div>
  );
};

export default PastOrders;
