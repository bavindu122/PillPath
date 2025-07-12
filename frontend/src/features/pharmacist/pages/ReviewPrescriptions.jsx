import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PharmaPageLayout from '../components/PharmaPageLayout';
import PrescriptionViewer from '../components/PrescriptionViewer';
import MedicineSearch from '../components/MedicineSearch';
import OrderPreview from '../components/OrderPreview';
import ChatWidget from '../components/ChatWidget';

const ReviewPrescriptions = () => {
  const navigate = useNavigate();
  const { prescriptionId } = useParams();
  const [prescription, setPrescription] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      loadPrescriptionData();
    }, 300);
  }, [prescriptionId]);

  const loadPrescriptionData = () => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setPrescription({
        id: prescriptionId || 1,
        patientName: "Mr. McCrae",
        doctorName: "B.J. Wilks (Chemist)",
        dateUploaded: "17.12.25",
        status: "pending_review",
        imageUrl: "/api/placeholder/600/800", // Replace with actual prescription image
        prescriptionText: `Historical Prescription from 1925`
      });

      // Update order items to reflect historical medications with modern equivalents
      setOrderItems([
        {
          id: 1,
          name: "Salicylic Acid",
          dosage: "150mg",
          genericName: "Modern equivalent of Ac. Salicyl",
          quantity: 30,
          price: 15.99,
          available: true,
          historicalNote: "Equivalent to gr 120 Ac. Salicyl from prescription"
        },
        {
          id: 2,
          name: "Topical Pain Relief Cream",
          genericName: "Modern equivalent of Collod Flexile",
          quantity: 1,
          price: 24.50,
          available: true,
          historicalNote: "Modern substitute for historical Collod Flexile"
        }
      ]);

      setChatMessages([
        {
          id: 1,
          sender: "patient",
          message: "I found this old prescription from 1925 in my grandfather's belongings. Can you help identify what these medications were used for?",
          timestamp: "10:30 AM",
          avatar: "/api/placeholder/32/32"
        },
        {
          id: 2,
          sender: "pharmacist",
          message: "This is a fascinating historical prescription! I can see medications like Salicylic Acid and Cannabis Tincture that were commonly used in the 1920s. Let me research modern equivalents for you.",
          timestamp: "10:32 AM",
          isSystem: true
        },
        {
          id: 3,
          sender: "patient",
          message: "That would be amazing! I'm particularly curious about what conditions these might have been treating.",
          timestamp: "10:35 AM"
        },
        {
          id: 4,
          sender: "pharmacist",
          message: "Based on the formulation, this appears to be for pain relief and possibly respiratory issues. Salicylic Acid is an early form of aspirin, and the cherry syrup was likely used as a cough suppressant base.",
          timestamp: "10:37 AM",
          isSystem: true
        }
      ]);

      setIsLoading(false);
    }, 1000);
  };

  const handleAddMedicine = (medicine) => {
    // This will be called by OrderPreview when the modal form is submitted
    setOrderItems(prev => [...prev, medicine]);
  };

  const handleAddMedicineFromSearch = (medicine) => {
    // This receives the complete medicine object from the modal
    setOrderItems(prev => [...prev, medicine]);
  };

  const handleRemoveMedicine = (itemId) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    setOrderItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleSendMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      sender: "pharmacist",
      message: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: true
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const handleSendOrder = () => {
    console.log('Sending order:', orderItems);
    // Navigate back to dashboard or show success message
    navigate('/pharmacist/dashboard');
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', orderItems);
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
      subtitle={prescription ? `Patient: ${prescription.patientName}` : "Loading prescription details..."}
      isLoading={isLoading}
      loadingMessage="Loading prescription..."
      showBackButton={true}
      onBack={() => navigate('/pharmacist/queue')}
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