import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PharmaPageLayout from "../components/PharmaPageLayout";
import PrescriptionViewer from "../components/PrescriptionViewer";
import MedicineSearch from "../components/MedicineSearch";
import OrderPreview from "../components/OrderPreview";
import ChatWidget from "../components/ChatWidget";
import "./index-pharmacist.css";
import { prescriptionService } from "../services/prescriptionService";
import { submissionItemsService } from "../services/submissionItemsService";

const ReviewPrescriptions = () => {
  const navigate = useNavigate();
  const { prescriptionId } = useParams();
  const location = useLocation();
  const fallback = location.state?.fallback;
  const [prescription, setPrescription] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      try {
        // Determine submissionId from route or fallback; do not call submissions detail endpoint
        const idForApi = /^\d+$/.test(String(prescriptionId))
          ? Number(prescriptionId)
          : prescriptionId;
        const submissionId =
          (typeof idForApi === "number" ? idForApi : undefined) ||
          fallback?.submissionId ||
          fallback?.id;

        // Compose minimal prescription from fallback; if none, use a stub
        if (active) {
          setPrescription({
            id: submissionId || idForApi,
            submissionId: submissionId || idForApi,
            code: fallback?.code || `SUB-${submissionId || idForApi}`,
            customerName: fallback?.customerName || "Customer",
            patientName: fallback?.customerName || "Customer",
            status: fallback?.status || "IN_PROGRESS",
            imageUrl: fallback?.imageUrl || "",
            dateUploaded: "",
            items: [],
          });
        }

        // Load submission items directly; don't claim on load
        if (submissionId) {
          try {
            const itemsResp = await submissionItemsService.list(submissionId);
            const raw = Array.isArray(itemsResp?.items)
              ? itemsResp.items
              : itemsResp;
            const mapped = raw.map((it, idx) => {
              const id = it.id ?? it.itemId ?? it.submissionItemId;
              const qty = it.quantity ?? it.qty ?? it.count ?? 1;
              const price = it.unitPrice ?? it.price ?? 0;
              return {
                id,
                name: it.medicineName ?? it.name ?? it.title ?? `Item-${idx}`,
                genericName: it.genericName ?? it.generic ?? "",
                quantity: Number(qty),
                dosage: it.dosage ?? it.strength ?? "",
                price: Number(price),
                available: (it.available ?? true) === true,
                notes: it.notes ?? "",
              };
            });
            if (active) setOrderItems(mapped);
          } catch (e2) {
            console.warn("Failed to load submission items", e2);
            if (active) setOrderItems([]);
          }
        }
        if (active) setChatMessages([]);
      } catch (e) {
        console.error("Failed to load prescription", e);
        // In case of unexpected errors, keep minimal UI; items may remain empty
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [prescriptionId]);

  const handleAddMedicine = async (medicine) => {
    try {
      const submissionId = prescription?.submissionId || prescription?.id;
      if (!submissionId) return;
      // If current status is pending review, claim before first add
      const status = String(prescription?.status || "").toLowerCase();
      if (status === "pending_review" || status === "pending") {
        try {
          await submissionItemsService.claim(submissionId);
          // reflect status change locally
          setPrescription((prev) =>
            prev ? { ...prev, status: "IN_PROGRESS" } : prev
          );
        } catch (_) {
          // ignore claim errors; proceed to add
        }
      }
      const payload = {
        medicineName: medicine.name,
        genericName: medicine.genericName,
        dosage: medicine.dosage || "250mg",
        quantity: medicine.quantity || 1,
        unitPrice: medicine.price || 0,
        available: medicine.available !== false,
        notes: medicine.notes || "",
        // optional linking to master set/variant if backend supports it
        medicineSetId: medicine.medicineSetId || medicine.setId || medicine.id,
      };
      await submissionItemsService.add(submissionId, payload);
      // Refresh list to get authoritative server IDs and values
      try {
        const itemsResp = await submissionItemsService.list(submissionId);
        const raw = Array.isArray(itemsResp?.items)
          ? itemsResp.items
          : itemsResp;
        const mapped = raw.map((it, idx) => {
          const id = it.id ?? it.itemId ?? it.submissionItemId;
          const qty = it.quantity ?? it.qty ?? it.count ?? 1;
          const price = it.unitPrice ?? it.price ?? 0;
          return {
            id,
            name: it.medicineName ?? it.name ?? it.title ?? `Item-${idx}`,
            genericName: it.genericName ?? it.generic ?? "",
            quantity: Number(qty),
            dosage: it.dosage ?? it.strength ?? "",
            price: Number(price),
            available: (it.available ?? true) === true,
            notes: it.notes ?? "",
          };
        });
        setOrderItems(mapped);
      } catch (e) {
        // Fallback: append a best-effort item if list fails
        setOrderItems((prev) => [
          ...prev,
          {
            id: undefined,
            name: payload.medicineName,
            genericName: payload.genericName,
            quantity: Number(payload.quantity || 1),
            dosage: payload.dosage || "",
            price: Number(payload.unitPrice || 0),
            available: payload.available !== false,
            notes: payload.notes || "",
          },
        ]);
      }
    } catch (e) {
      console.error("Add medicine failed", e);
    }
  };

  const handleAddMedicineFromSearch = async (medicine) => {
    // Use the same backend add as OrderPreview flow
    await handleAddMedicine(medicine);
  };

  const handleRemoveMedicine = async (itemId) => {
    try {
      const submissionId = prescription?.submissionId || prescription?.id;
      if (!submissionId) return;
      if (!itemId && itemId !== 0) {
        console.warn("Skip remove: itemId is undefined");
        return;
      }
      await submissionItemsService.remove(submissionId, itemId);
      setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (e) {
      console.error("Remove item failed", e);
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      const submissionId = prescription?.submissionId || prescription?.id;
      if (!submissionId) return;
      const updated = await submissionItemsService.update(
        submissionId,
        itemId,
        { quantity }
      );
      setOrderItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: updated.quantity ?? quantity }
            : item
        )
      );
    } catch (e) {
      console.error("Update quantity failed", e);
    }
  };

  const handleSendMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      sender: "pharmacist",
      message: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSystem: true,
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  const handleSendOrder = () => {
    console.log("Sending order:", orderItems);
    // Navigate back to dashboard or show success message
    navigate("/pharmacist/dashboard");
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", orderItems);
  };

  const headerActions = prescription && (
    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-full shadow-sm">
      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>
      <p className="text-sm font-semibold text-green-700">
        Reviewing: {prescription.patientName}
      </p>
    </div>
  );

  return (
    <PharmaPageLayout
      title="Review Prescription"
      subtitle={
        prescription
          ? `Patient: ${prescription.patientName}`
          : "Loading prescription details..."
      }
      isLoading={isLoading}
      loadingMessage="Loading prescription..."
      showBackButton={true}
      onBack={() => navigate("/pharmacist/queue")}
      headerActions={headerActions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Prescription Review - Full width on mobile, 2 cols on large screens */}
        <div className="lg:col-span-2 xl:col-span-2 space-y-4 sm:space-y-6">
          <div className="dashboard-fade-in-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover">
              <PrescriptionViewer prescription={prescription} />
            </div>
          </div>
        </div>

        {/* Chat Widget - Full width on mobile, 1 col on large screens */}
        <div className="lg:col-span-2 xl:col-span-1 space-y-4 sm:space-y-6">
          <div className="dashboard-fade-in-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover">
              <ChatWidget
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                patientName={prescription?.patientName}
              />
            </div>
          </div>
        </div>

        {/* Medicine Search - Full width on mobile */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-4 sm:space-y-6">
          <div className="dashboard-fade-in-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover">
              <MedicineSearch onAddMedicine={handleAddMedicineFromSearch} />
            </div>
          </div>
        </div>

        {/* Order Preview - Full width on mobile, 2 cols on large screens */}
        <div className="lg:col-span-1 xl:col-span-2 space-y-4 sm:space-y-6">
          <div className="dashboard-fade-in-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover">
              <OrderPreview
                items={orderItems}
                onRemoveItem={handleRemoveMedicine}
                onUpdateQuantity={handleUpdateQuantity}
                onSendOrder={handleSendOrder}
                onSaveDraft={handleSaveDraft}
                onAddMedicine={handleAddMedicine}
              />
            </div>
          </div>
        </div>
      </div>
    </PharmaPageLayout>
  );
};

export default ReviewPrescriptions;
