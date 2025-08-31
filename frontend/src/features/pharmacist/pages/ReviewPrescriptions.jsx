import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PharmaPageLayout from "../components/PharmaPageLayout";
import PrescriptionViewer from "../components/PrescriptionViewer";
import MedicineSearch from "../components/MedicineSearch";
import OrderPreview from "../components/OrderPreview";
import ChatWidget from "../components/ChatWidget";
import "./index-pharmacist.css";
import { prescriptionService } from "../services/prescriptionService";

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
        // coerce ID to number if numeric
        const idForApi = /^\d+$/.test(String(prescriptionId))
          ? Number(prescriptionId)
          : prescriptionId;
        const data = await prescriptionService.getPharmacyPrescription(
          idForApi
        );
        if (!active) return;
        // Map minimal fields for header compatibility
        setPrescription({
          id: data.id,
          code: data.code,
          customerName: data.customerName,
          patientName: data.customerName, // reuse existing UI fields
          status: data.status,
          imageUrl: data.imageUrl,
          dateUploaded: data.createdAt,
          items: data.items || [],
        });
        setOrderItems([]); // start empty for new review
        setChatMessages([]);
      } catch (e) {
        console.error("Failed to load prescription", e);
        if (fallback && active) {
          // Use fallback from queue item so the viewer still renders
          setPrescription({
            id: fallback.id,
            code: fallback.code,
            customerName: fallback.customerName,
            patientName: fallback.customerName,
            status: fallback.status,
            imageUrl: fallback.imageUrl,
            dateUploaded: "",
            items: [],
          });
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [prescriptionId]);

  const handleAddMedicine = (medicine) => {
    // This will be called by OrderPreview when the modal form is submitted
    setOrderItems((prev) => [...prev, medicine]);
  };

  const handleAddMedicineFromSearch = (medicine) => {
    // This receives the complete medicine object from the modal
    setOrderItems((prev) => [...prev, medicine]);
  };

  const handleRemoveMedicine = (itemId) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    setOrderItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
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
