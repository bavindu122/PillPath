import React, { useEffect, useMemo, useState } from "react";
import { Package, Ship, Store, Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import OrdersService from "../../../../services/api/OrdersService";
import { useNavigate } from "react-router-dom";
import { CUSTOMER_ROUTES } from "../../../../constants/routes";

const RecentOrdersCard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ordersRaw, setOrdersRaw] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await OrdersService.listMyOrders(false);
        if (!mounted) return;
        const items = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data)
          ? data
          : [];
        setOrdersRaw(items);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load orders");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const orders = useMemo(() => {
    return ordersRaw.slice(0, 3).map((co) => {
      const created = co.createdAt ? new Date(co.createdAt) : null;
      const date = created
        ? created.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "—";
      const currency = co.totals?.currency || co.currency || "LKR";
      const amount =
        co.totals?.grandTotal ?? co.totals?.total ?? co.amount ?? null;
      const pharmacies = Array.isArray(co.pharmacyOrders)
        ? co.pharmacyOrders
        : [];
      const firstPharmacyName =
        pharmacies[0]?.pharmacyName || pharmacies[0]?.name;
      const pharmacyLabel =
        pharmacies.length > 1
          ? `${firstPharmacyName || "Multiple"} +${pharmacies.length - 1}`
          : firstPharmacyName || co.pharmacyName || "—";
      const itemsCount = pharmacies.reduce(
        (acc, p) => acc + (Array.isArray(p.items) ? p.items.length : 0),
        0
      );
      return {
        id: co.code || co.orderCode || String(co.id || "—"),
        pharmacy: pharmacyLabel,
        eta: amount != null ? `${currency} ${Number(amount)}` : "—",
        date,
        items: itemsCount || co.itemsCount || 0,
        status: co.status,
      };
    });
  }, [ordersRaw]);

  const navigate = useNavigate();

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-purple-600/20 p-2 rounded-lg">
            <Package size={18} className="text-purple-200" />
          </span>
          <h3 className="text-white font-semibold">Recent Orders</h3>
        </div>
      </div>

      <div className="space-y-3 mb-3">
        {loading && (
          <div className="text-white/70 text-sm">Loading orders…</div>
        )}
        {!loading && error && (
          <div className="text-red-300 text-sm">{error}</div>
        )}
        {!loading && !error && orders.length === 0 && (
          <div className="text-white/70 text-sm">No recent orders</div>
        )}
        {!loading &&
          !error &&
          orders.map((order) => (
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
                          {order.eta}
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

      <button
        onClick={() => navigate(CUSTOMER_ROUTES.ORDERS)}
        className="w-full py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-white/80 hover:text-white text-sm flex items-center justify-center"
      >
        View Order History <ChevronRight size={14} className="ml-1" />
      </button>
    </div>
  );
};

export default RecentOrdersCard;
