import React, { useEffect, useState } from "react";
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
  MoreVertical,
} from "lucide-react";
import OrderCard from "../components/OrderCard";
import OrderPreviewModal from "../components/PastOrderPreviewModal";
import OrdersService from "../../../services/api/OrdersService";
import { orderService as OtcOrderService } from "../../../services/api/OtcOrderService";
import { otcService as OtcService } from "../../../services/api/OtcService";
import { useAuth } from "../../../hooks/useAuth";

const PastOrders = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Orders");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [pastOrders, setPastOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingOrders(true);
        // Fetch prescription orders (existing endpoint)
        const data = await OrdersService.listMyOrders(false);

        // In parallel, try to fetch OTC orders for the logged-in user (if available)
        let otcOrders = [];
        try {
          if (user?.id) {
            otcOrders = (await OtcOrderService.getCustomerOrders(user.id)) || [];
          }
        } catch (e) {
          // Non-fatal: OTC endpoint may not exist in some environments
          console.warn("Failed to fetch OTC orders:", e?.message || e);
          otcOrders = [];
        }

        if (!mounted) return;

        // Helper: format date/time
        const fmt = (iso) => {
          const d = iso ? new Date(iso) : null;
          const date = d
            ? d.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—";
          const time = d
            ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "—";
          return { date, time };
        };

        // Group: one card per prescription customer order (ORD), aggregate pharmacy orders
        const rxCards = (data || []).map((co) => {
          const created = co.createdAt ? new Date(co.createdAt) : null;
          const date = created
            ? created.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—";
          const time = created
            ? created.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—";
          const currency = co.totals?.currency || co.currency || "LKR";
          const pharmacies = Array.isArray(co.pharmacyOrders)
            ? co.pharmacyOrders
            : [];
          const firstPharmacyName = pharmacies[0]?.pharmacyName;
          const pharmacyLabel =
            pharmacies.length > 1
              ? `${
                  firstPharmacyName ||
                  `Pharmacy #${pharmacies[0]?.pharmacyId || 1}`
                } +${pharmacies.length - 1} more`
              : firstPharmacyName ||
                (pharmacies[0]
                  ? `Pharmacy #${pharmacies[0]?.pharmacyId}`
                  : "—");

          return {
            id: co.orderCode,
            orderNumber: co.orderCode,
            total: `${currency} ${Number(co.totals?.total ?? 0).toFixed(2)}`,
            date,
            time,
            status: (co.status || "").replace(/_/g, " "),
            notes: co.customerNote || "",
            pharmacy: pharmacyLabel,
            pharmacyCount: pharmacies.length,
            // itemCount left undefined (can be computed in detail if needed)
            prescriptionType: "Prescription",
            paymentMethod: (co.payment?.method || "-").replace(/_/g, " "),
            rating: undefined,
            prescriptionImg:
              pharmacies[0]?.prescriptionImageUrl ||
              "/src/assets/img/prescription.jpeg",
            // pass through for modal usage
            raw: co,
          };
        });

        // Build OTC cards (best-effort, robust to varying backend shapes)
        // We will attempt to set an OTC product image for the thumbnail.
        const productImageCache = new Map();
        const resolveProductImage = async (item) => {
          const byUrl =
            item?.productImageUrl || item?.imageUrl || item?.product?.imageUrl;
          if (byUrl) return byUrl;
          const pid = item?.otcProductId || item?.productId || item?.id;
          if (!pid) return null;
          if (productImageCache.has(pid)) return productImageCache.get(pid);
          try {
            const product = await OtcService.getProductById(pid);
            const url = product?.imageUrl || product?.image || null;
            productImageCache.set(pid, url);
            return url;
          } catch (e) {
            console.warn("Failed to resolve OTC product image for", pid, e);
            productImageCache.set(pid, null);
            return null;
          }
        };

        // Map OTC orders to the same card shape
        const otcCardsPromises = (otcOrders || []).map(async (oo) => {
          const items = Array.isArray(oo.items) ? oo.items : [];
          const firstItem = items[0] || {};
          const createdAt = oo.createdAt || oo.dateCreated || oo.created || null;
          const { date, time } = fmt(createdAt);
          const currency =
            oo.totals?.currency || oo.currency || oo.totalCurrency || "LKR";
          const totalVal =
            oo.totals?.total ?? oo.total ?? oo.totalAmount ?? oo.amount ?? 0;
          const paymentMethod =
            (oo.payment?.method || oo.paymentMethod || "-").replace(
              /_/g,
              " "
            );

          // Figure out store/pharmacy label
          const pharmacyName =
            oo.pharmacyName ||
            oo.storeName ||
            firstItem.pharmacyName ||
            (oo.pharmacyId ? `Pharmacy #${oo.pharmacyId}` : "—");

          // Resolve a representative product image for the OTC order
          const img = (await resolveProductImage(firstItem)) ||
            "/src/assets/img/prescription.jpeg";

          return {
            id: oo.orderCode || oo.id || oo.orderId || `OTC-${Date.now()}`,
            orderNumber: oo.orderCode || oo.code || oo.id || oo.orderId || "OTC",
            total: `${currency} ${Number(totalVal ?? 0).toFixed(2)}`,
            date,
            time,
            status: (oo.status || "").replace(/_/g, " "),
            notes: oo.notes || oo.customerNote || "",
            pharmacy: pharmacyName,
            pharmacyCount: 1,
            itemCount: items.length || 1,
            prescriptionType: "OTC",
            paymentMethod,
            rating: undefined,
            prescriptionImg: img,
            raw: oo,
          };
        });

        const otcCards = await Promise.all(otcCardsPromises);

        // Combine and sort by date/time descending if possible
        const combined = [...rxCards, ...otcCards].sort((a, b) => {
          const aTime = new Date(`${a.date} ${a.time}`).getTime() || 0;
          const bTime = new Date(`${b.date} ${b.time}`).getTime() || 0;
          return bTime - aTime;
        });

        setPastOrders(combined);
      } catch (e) {
        setLoadError(e.message || "Failed to load orders");
        setPastOrders([]);
      } finally {
        if (mounted) setLoadingOrders(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const filterOptions = [
    "All Orders",
    "Prescription Orders",
    "OTC Orders",
    "This Month",
    "Last 3 Months",
    "This Year",
  ];

  const filteredOrders = pastOrders.filter((order) => {
    const matchesSearch = order.orderNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (selectedFilter === "All Orders") return matchesSearch;
    if (selectedFilter === "Prescription Orders")
      return matchesSearch && order.prescriptionType === "Prescription";
    if (selectedFilter === "OTC Orders")
      return matchesSearch && order.prescriptionType === "OTC";

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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Past Orders
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            View and manage your order history
          </p>

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
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 z-10"
            />
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
              <ChevronDown
                size={16}
                className={`transform transition-transform ${
                  filterOpen ? "rotate-180" : ""
                }`}
              />
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
                      selectedFilter === option
                        ? "text-blue-300 bg-white/10"
                        : "text-white"
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
              onView={() => {
                setSelectedOrder(order);
                setShowModal(true);
              }}
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
          <h3 className="text-xl font-semibold text-white mb-2">
            No orders found
          </h3>
          <p className="text-white/60">
            Try adjusting your search or filter criteria
          </p>
        </motion.div>
      )}

      {/* Order Preview Modal at page level */}
      <OrderPreviewModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default PastOrders;
