import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, ZoomIn } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PrescriptionViewer from '../components/PrescriptionViewer';
import MedicineSearch from '../components/MedicineSearch';
import OrderPreview from '../components/OrderPreview';
import ChatWidget from '../components/ChatWidget';
import Header from '../components/Header';

const ReviewPrescriptions = () => {
  const navigate = useNavigate();
  const { prescriptionId } = useParams();
  const [prescription, setPrescription] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      loadPrescriptionData();
      setFadeIn(true);
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
        imageUrl: "/src/assets/img/prescription.jpeg",
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
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', orderItems);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Sidebar during loading */}
        <div className="sidebar-slide-in">
          <Sidebar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full loading-dot-1"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full loading-dot-2"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full loading-dot-3"></div>
              </div>
            </div>
            <p className="text-gray-600 font-medium animate-pulse">Loading prescription...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Sidebar with active state management */}
      <div className="sidebar-slide-in">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="dashboard-fade-in-1 flex-shrink-0">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Back button */}
          <div className="flex items-center mb-6 animate-fade-in-up">
            <button
              onClick={() => navigate('/pharmacist/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-300 hover:bg-white/60 hover:shadow-md px-4 py-2 rounded-lg group"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Prescription Review */}
            <div className="lg:col-span-2 space-y-6">
              <div className="dashboard-fade-in-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover">
                  <PrescriptionViewer prescription={prescription} />
                </div>
              </div>
              
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

            {/* Right Column - Chat and Medicine Search */}
            <div className="lg:col-span-1 space-y-6">
              <div className="dashboard-fade-in-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover">
                  <ChatWidget 
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    patientName={prescription?.patientName}
                  />
                </div>
              </div>
              
              <div className="dashboard-fade-in-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover">
                  <MedicineSearch onAddMedicine={handleAddMedicineFromSearch} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReviewPrescriptions;