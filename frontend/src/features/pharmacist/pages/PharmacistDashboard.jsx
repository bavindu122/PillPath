import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Settings, 
  User,
  Calendar,
  Filter,
  Plus,
  Search
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatsCards from '../components/StatsCards';
import PrescriptionQueue from '../components/PrescriptionQueue';
import InventoryAlerts from '../components/InventoryAlerts';
import PatientMessages from '../components/PatientMessages';
import Header from '../components/Header';

const PharmacistDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  
  useEffect(() => {
    setTimeout(() => {
      loadDashboardData();
      setFadeIn(true);
    }, 300);
  }, []);

  const loadDashboardData = () => {
    // Mock prescription queue data
    setPrescriptions([
      {
        id: 1,
        patientName: "John Smith",
        medication: "Amoxicillin 500mg - 30 tablets",
        priority: "High Priority",
        date: "2025-07-04",
        time: "10:30 AM",
        avatar: "/api/placeholder/40/40"
      },
      {
        id: 2,
        patientName: "Maria Garcia",
        medication: "Metformin 850mg - 60 tablets",
        priority: "Medium Priority",
        date: "2025-07-04",
        time: "11:15 AM",
        avatar: "/api/placeholder/40/40"
      },
      {
        id: 3,
        patientName: "Robert Davis",
        medication: "Lisinopril 10mg - 30 tablets",
        priority: "Low Priority",
        date: "2025-07-04",
        time: "2:45 PM",
        avatar: "/api/placeholder/40/40"
      },
      {
        id: 4,
        patientName: "Linda Thompson",
        medication: "Atorvastatin 20mg - 90 tablets",
        priority: "Medium Priority",
        date: "2025-07-04",
        time: "3:20 PM",
        avatar: "/api/placeholder/40/40"
      },
      {
        id: 5,
        patientName: "Sarah Johnson",
        medication: "Omeprazole 40mg - 14 capsules",
        priority: "High Priority",
        time: "4:10 PM",
        date: "2025-07-04",
        avatar: "/api/placeholder/40/40",
      }
    ]);

    // Mock inventory alerts
    setInventoryAlerts([
      { id: 1, medication: "Aspirin 325mg", status: "Only 12 left", type: "low" },
      { id: 2, medication: "Ibuprofen 200mg", status: "25 remaining", type: "medium" },
      { id: 3, medication: "Acetaminophen", status: "Critical: 8 left", type: "critical" }
    ]);

    // Mock messages
    setMessages([
      { id: 1, name: "Emma Wilson", message: "Question about dosage...", unread: true },
      { id: 2, name: "Michael Chen", message: "Prescription ready?", unread: false }
    ]);

    setIsLoading(false);
  };

  const statsData = [
    { title: "Pending Prescriptions", value: "24", subtitle: "14 from yesterday", color: "blue" },
    { title: "Today's Orders", value: "87", subtitle: "+12% from last week", color: "green" },
    { title: "Low Stock Alerts", value: "7", subtitle: "Requires attention", color: "orange" },
    { title: "Patient Messages", value: "15", subtitle: "3 unread", color: "purple" }
  ];

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
            <p className="text-gray-600 font-medium animate-pulse">Loading Dashboard...</p>
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
          {/* Stats Cards */}
          <div className="dashboard-fade-in-2 mb-6">
            <StatsCards stats={statsData} />
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Prescription Queue */}
            <div className="lg:col-span-2 dashboard-fade-in-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover">
                <PrescriptionQueue 
                  prescriptions={prescriptions}
                  onApprove={(id) => console.log('Approve:', id)}
                  onReject={(id) => console.log('Reject:', id)}
                  onClarify={(id) => console.log('Clarify:', id)}
                />
              </div>
            </div>
            
            {/* Right sidebar */}
            <div className="space-y-6 dashboard-fade-in-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover">
                <InventoryAlerts alerts={inventoryAlerts} />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover">
                <PatientMessages messages={messages} />
              </div>
            </div>
          </div>
        </main>

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6">
          <button className="group bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-200 fab-pulse">
            <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;