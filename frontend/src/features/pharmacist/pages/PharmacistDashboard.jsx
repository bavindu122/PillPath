import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import PharmaPageLayout from "../components/PharmaPageLayout";
import StatsCards from "../components/StatsCards";
import PrescriptionQueue from "../components/PrescriptionQueue";
import InventoryAlerts from "../components/InventoryAlerts";
import "./index-pharmacist.css";
import { prescriptionService } from "../services/prescriptionService";
import { getStockAlerts } from "../../../services/api/StockAlertsService";
import { usePharmacyAuth } from "../../../hooks/usePharmacyAuth";

const PharmacistDashboard = () => {
  const { user: pharmacyUser } = usePharmacyAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDashboardData();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // 1) Load pharmacist submission queue (includes imageUrl & submission IDs)
      let queue = [];
      try {
        queue = await prescriptionService.loadPrescriptions();
      } catch (e) {
        console.error("Failed to load prescription queue:", e);
        queue = [];
      }

      const isActive = (s = "") => {
        const status = String(s).toLowerCase();
        return (
          status.includes("pending_review") || status.includes("in_progress")
        );
      };
      const mapPriority = (s = "") => {
        const status = String(s).toLowerCase();
        if (status.includes("pending_review")) return "High Priority";
        if (status.includes("in_progress")) return "Medium Priority";
        return "Low Priority";
      };

      const mapped = (Array.isArray(queue) ? queue : [])
        .filter((p) => isActive(p.status))
        .map((p) => ({
          id: p.id,
          reviewId: p.reviewId || p.submissionId || p.id,
          patientName:
            p.patientName || p.customerName || p.code || "Prescription",
          medication: p.code || p.patientName || "",
          priority: mapPriority(p.status),
          date: p.date || "",
          time: p.time || "",
          avatar: "/api/placeholder/40/40",
          code: p.code,
          status: p.status,
          imageUrl: p.imageUrl,
        }))
        .slice(0, 4);

      setPrescriptions(mapped);

      // 2) Load inventory alerts for this pharmacy
      let alerts = [];
      try {
        const pharmacyId = pharmacyUser?.pharmacyId;
        if (pharmacyId) {
          const rawAlerts = await getStockAlerts(pharmacyId);
          alerts = (Array.isArray(rawAlerts) ? rawAlerts : []).map((a, idx) => {
            const stock = a.stock ?? a.remaining ?? a.quantity ?? a.inStock;
            let type = "low";
            if (typeof stock === "number") {
              if (stock <= 10) type = "critical";
              else if (stock <= 25) type = "low";
              else type = "medium";
            } else if (a.type) {
              type = String(a.type).toLowerCase();
            }
            const statusText =
              typeof stock === "number"
                ? stock <= 10
                  ? `Critical: ${stock} left`
                  : `${stock} remaining`
                : a.status || "Low stock";
            return {
              id: a.id || a.alertId || idx + 1,
              medication:
                a.medicineName || a.productName || a.name || "Unknown Item",
              status: statusText,
              type,
            };
          });
        }
      } catch (e) {
        console.error("Failed to load inventory alerts:", e);
        alerts = [];
      }
      setInventoryAlerts(alerts);
    } finally {
      setIsLoading(false);
    }
  };

  // Stats for header cards
  const today = new Date().toISOString().slice(0, 10);
  const pendingCount = prescriptions.filter((p) =>
    /high/i.test(p.priority)
  ).length;
  const todaysOrders = prescriptions.filter((p) =>
    String(p.date || "").startsWith(today)
  ).length;
  const lowStockCount = inventoryAlerts.filter(
    (a) => a.type === "critical" || a.type === "low"
  ).length;
  const statsData = [
    {
      title: "Pending Prescriptions",
      value: String(pendingCount),
      subtitle: "Queue requiring action",
      color: "blue",
    },
    {
      title: "Today's Orders",
      value: String(todaysOrders),
      subtitle: "Created today",
      color: "green",
    },
    {
      title: "Low Stock Alerts",
      value: String(lowStockCount),
      subtitle: "Requires attention",
      color: "orange",
    },
  ];

  if (isLoading) {
    return (
      <PharmaPageLayout
        title="Pharmacist Dashboard"
        subtitle="Monitor your pharmacy operations"
        isLoading={true}
        loadingMessage="Loading Dashboard..."
      />
    );
  }

  return (
    <PharmaPageLayout
      title="Pharmacist Dashboard"
      subtitle="Monitor your pharmacy operations"
      isLoading={false}
    >
      <div className="dashboard-fade-in-2 mb-4 sm:mb-6">
        <StatsCards stats={statsData} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2 dashboard-fade-in-3">
          <div
            className="backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border glass-hover"
            style={{
              backgroundColor: "var(--pharma-card-bg)",
              borderColor: "var(--pharma-border)",
            }}
          >
            <PrescriptionQueue
              prescriptions={prescriptions}
              onApprove={(id) => console.log("Approve:", id)}
              onReject={(id) => console.log("Reject:", id)}
              onClarify={(id) => console.log("Clarify:", id)}
            />
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6 dashboard-fade-in-4">
          <div
            className="backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border glass-hover"
            style={{
              backgroundColor: "var(--pharma-card-bg)",
              borderColor: "var(--pharma-border)",
            }}
          >
            <InventoryAlerts alerts={inventoryAlerts} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6">
        <button
          className="p-3 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 focus:outline-none"
          style={{
            backgroundColor: "var(--pharma-blue)",
            color: "var(--pharma-text-light)",
          }}
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
    </PharmaPageLayout>
  );
};

export default PharmacistDashboard;
