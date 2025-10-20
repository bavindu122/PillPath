import React, { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Clock,
  Phone,
  Star,
  Navigation,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import PharmacyService from "../../../../services/api/PharmacyService";
import { useNavigate } from "react-router-dom";

const NearbyPharmaciesCard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pharmaciesRaw, setPharmaciesRaw] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // Try geolocation; if denied, fall back to default radius without coords
        const getPosition = () =>
          new Promise((resolve) => {
            if (!navigator.geolocation) return resolve(null);
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(pos.coords),
              () => resolve(null),
              { enableHighAccuracy: true, timeout: 5000 }
            );
          });

        const coords = await getPosition();
        const res = await PharmacyService.getPharmaciesForCustomers(
          coords
            ? {
                latitude: coords.latitude,
                longitude: coords.longitude,
                radius: 10,
              }
            : { radius: 10 }
        );
        if (!mounted) return;
        const items = Array.isArray(res?.items)
          ? res.items
          : Array.isArray(res)
          ? res
          : [];
        setPharmaciesRaw(items);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load nearby pharmacies");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const pharmacies = useMemo(() => {
    return pharmaciesRaw.slice(0, 3).map((p) => ({
      id: p.id || p.pharmacyId || p.code,
      name: p.name || p.pharmacyName || "—",
      distance: p.distanceKm ?? p.distance ?? null,
      hours: p.hours || p.operatingHoursSummary || p.openingHours || "Open",
      status: p.isOpen === false ? "Closed" : "Available",
      rating: p.rating ?? p.averageRating ?? null,
      hasDelivery: Boolean(p.deliveryAvailable ?? p.hasDelivery),
    }));
  }, [pharmaciesRaw]);

  const navigate = useNavigate();

  return (
    <div>
      <div className="space-y-3 mb-3">
        {loading && (
          <div className="text-white/70 text-sm">
            Loading nearby pharmacies…
          </div>
        )}
        {!loading && error && (
          <div className="text-red-300 text-sm">{error}</div>
        )}
        {!loading && !error && pharmacies.length === 0 && (
          <div className="text-white/70 text-sm">No nearby pharmacies</div>
        )}
        {!loading &&
          !error &&
          pharmacies.map((pharmacy) => (
            <motion.div
              key={pharmacy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h4 className="text-white font-medium">{pharmacy.name}</h4>
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-300">
                      {pharmacy.status}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-white/60 text-xs">
                      <Navigation size={12} className="mr-1 text-blue-300" />
                      {pharmacy.distance != null
                        ? `${Number(pharmacy.distance).toFixed(1)} km away`
                        : "Distance unavailable"}
                    </div>
                    <div className="flex items-center text-white/60 text-xs">
                      <Clock size={12} className="mr-1 text-green-300" />
                      {pharmacy.hours}
                    </div>
                    <div className="flex items-center text-white/60 text-xs">
                      <Star size={12} className="mr-1 text-yellow-300" />
                      {pharmacy.rating != null
                        ? `${Number(pharmacy.rating).toFixed(1)} Rating`
                        : "No ratings"}
                    </div>
                  </div>
                </div>
                <div>
                  {pharmacy.hasDelivery && (
                    <div className="bg-white/20 rounded-full px-2 py-1 text-white text-xs">
                      Delivers
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        onClick={() => navigate("/find-pharmacy?from=dashboard")}
        className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-colors rounded-xl text-white text-sm flex items-center justify-center gap-1 shadow-lg"
      >
        <MapPin size={14} />
        Find More Pharmacies
      </motion.button>
    </div>
  );
};

export default NearbyPharmaciesCard;
