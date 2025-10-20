import React, { useEffect, useMemo, useState } from "react";
import {
  Pill,
  MapPin,
  Building2,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import PrescriptionActivityService from "../../../../services/api/PrescriptionActivityService";
import { useNavigate } from "react-router-dom";
import { CUSTOMER_ROUTES } from "../../../../constants/routes";

const CurrentPrescriptionsCard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await PrescriptionActivityService.getActivities(0, 5);
        if (!mounted) return;
        const items = Array.isArray(res?.items)
          ? res.items
          : Array.isArray(res)
          ? res
          : [];
        setActivities(items);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load prescriptions");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const mapStatusToBadge = (status) => {
    const s = String(status || "").toUpperCase();
    if (["READY", "READY_TO_PICKUP", "COMPLETED"].some((x) => s.includes(x))) {
      return {
        cls: "bg-green-500/20 text-green-300",
        label: status || "Ready",
      };
    }
    if (["PACK", "PREPAR"].some((x) => s.includes(x))) {
      return {
        cls: "bg-blue-500/20 text-blue-300",
        label: status || "Preparing",
      };
    }
    if (["REVIEW", "QUOTE", "RECEIVED"].some((x) => s.includes(x))) {
      return {
        cls: "bg-yellow-500/20 text-yellow-300",
        label: status || "Reviewing",
      };
    }
    if (["CANCEL", "REJECT"].some((x) => s.includes(x))) {
      return {
        cls: "bg-red-500/20 text-red-300",
        label: status || "Cancelled",
      };
    }
    return { cls: "bg-white/20 text-white/80", label: status || "Pending" };
  };

  const prescriptions = useMemo(() => {
    // Map the activities feed into compact cards
    return activities.slice(0, 3).map((a, idx) => {
      const code =
        a?.code ||
        a?.prescriptionCode ||
        a?.prescription?.code ||
        a?.id ||
        `RX-${idx}`;
      // Prefer a primary pharmacy field; else fallback to first pharmacy entry
      const p =
        a?.primaryPharmacy ||
        a?.pharmacy ||
        (Array.isArray(a?.pharmacies) ? a.pharmacies[0] : null);
      const pharmacyName = p?.name || p?.pharmacyName || a?.pharmacyName || "—";
      const distance = p?.distanceKm ?? a?.distanceKm ?? p?.distance ?? null;
      const totals = a?.totals || a?.quoteTotals || {};
      const amount =
        totals?.grandTotal ?? totals?.total ?? totals?.subtotal ?? null;
      const status = a?.status || p?.status || "Pending";
      // Map to a small palette for the left dot (fixed classes to satisfy Tailwind)
      const colorClass = ["READY", "COMPLETED"].includes(
        String(status).toUpperCase()
      )
        ? "bg-green-400"
        : ["PACK", "PREPAR"].some((x) =>
            String(status).toUpperCase().includes(x)
          )
        ? "bg-blue-400"
        : ["CANCEL", "REJECT"].some((x) =>
            String(status).toUpperCase().includes(x)
          )
        ? "bg-red-400"
        : "bg-yellow-400";
      return {
        id: String(code),
        name: String(code),
        pharmacy: pharmacyName,
        distance: distance != null ? Number(distance).toFixed(1) : null,
        price: amount != null ? Number(amount) : null,
        status,
        colorClass,
      };
    });
  }, [activities]);

  const activeCount = useMemo(() => {
    const terminal = ["COMPLETED", "CANCELLED", "REJECTED"];
    return activities.filter(
      (a) => !terminal.includes(String(a?.status || "").toUpperCase())
    ).length;
  }, [activities]);

  const navigate = useNavigate();

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600/20 p-2 rounded-lg">
            <Pill size={18} className="text-blue-200" />
          </span>
          <h3 className="text-white font-semibold">Current Prescriptions</h3>
        </div>
        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
          {activeCount} Active
        </span>
      </div>

      <div className="space-y-3 mb-3">
        {loading && (
          <div className="text-white/70 text-sm">Loading prescriptions…</div>
        )}
        {!loading && error && (
          <div className="text-red-300 text-sm">{error}</div>
        )}
        {!loading && !error && prescriptions.length === 0 && (
          <div className="text-white/70 text-sm">No active prescriptions</div>
        )}
        {!loading &&
          !error &&
          prescriptions.map((prescription) => (
            <motion.div
              key={prescription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${prescription.colorClass}`}
                    ></div>
                    <h4 className="text-white font-medium">
                      {prescription.name}
                    </h4>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="flex items-center text-white/60 text-xs">
                      <Building2 size={12} className="mr-1" />
                      {prescription.pharmacy}
                    </div>
                    {prescription.distance && (
                      <div className="flex items-center text-white/60 text-xs">
                        <MapPin size={12} className="mr-1" />
                        {prescription.distance} km
                      </div>
                    )}
                    {prescription.price != null && (
                      <div className="flex items-center text-white/60 text-xs">
                        <DollarSign size={12} className="mr-1" />
                        Rs. {prescription.price}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  {(() => {
                    const badge = mapStatusToBadge(prescription.status);
                    return (
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      <button
        onClick={() => navigate(CUSTOMER_ROUTES.ACTIVITIES)}
        className="w-full py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-white/80 hover:text-white text-sm flex items-center justify-center"
      >
        View All Prescriptions <ChevronRight size={14} className="ml-1" />
      </button>
    </div>
  );
};

export default CurrentPrescriptionsCard;
