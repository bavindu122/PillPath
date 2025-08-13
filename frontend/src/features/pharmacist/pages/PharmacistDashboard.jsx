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
import PharmaPageLayout from '../components/PharmaPageLayout';
import StatsCards from '../components/StatsCards';
import PrescriptionQueue from '../components/PrescriptionQueue';
import InventoryAlerts from '../components/InventoryAlerts';
import PatientMessages from '../components/PatientMessages';
import Header from '../components/Header';
import './index-pharmacist.css';

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
    setPrescriptions([
      {
        id: 1,
        patientName: "RX-250714-02",
        medication: "Amoxicillin 500mg - 30 tablets",
        priority: "High Priority",
        date: "2025-07-04",
        time: "10:30 AM",
        avatar: "/api/placeholder/40/40"
      },
      {
        id: 2,
        patientName: "RX-250714-02",
        medication: "Metformin 850mg - 60 tablets",
        priority: "Medium Priority",
        date: "2025-07-04",
        time: "11:15 AM",
        avatar: "/api/placeholder/40/40"
      },
      {
        id: 3,
        patientName: "RX-250714-03",
        medication: "Lisinopril 10mg - 30 tablets",
        priority: "Low Priority",
        date: "2025-07-04",
        time: "2:45 PM",
        avatar: "/api/placeholder/40/40"
      },
      {
        id: 4,
        patientName: "RX-250714-04",
        medication: "Atorvastatin 20mg - 90 tablets",
        priority: "Medium Priority",
        date: "2025-07-04",
        time: "3:20 PM",
        avatar: "/api/placeholder/40/40"
      },
      {
        id: 5,
        patientName: "RX-250714-05",
        medication: "Omeprazole 40mg - 14 capsules",
        priority: "High Priority",
        time: "4:10 PM",
        date: "2025-07-04",
        avatar: "/api/placeholder/40/40",
      }
    ]);

    setInventoryAlerts([
      { id: 1, medication: "Aspirin 325mg", status: "Only 12 left", type: "low" },
      { id: 2, medication: "Ibuprofen 200mg", status: "25 remaining", type: "medium" },
      { id: 3, medication: "Acetaminophen", status: "Critical: 8 left", type: "critical" }
    ]);

    setMessages([
      { id: 1, name: "Sanath Ranathunga", message: "Question about dosage...", unread: true },
      { id: 2, name: "Amal Perera", message: "Prescription ready?", unread: false }
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
              backgroundColor: 'var(--pharma-card-bg)',
              borderColor: 'var(--pharma-border)'
            }}
          >
            <PrescriptionQueue 
              prescriptions={prescriptions}
              onApprove={(id) => console.log('Approve:', id)}
              onReject={(id) => console.log('Reject:', id)}
              onClarify={(id) => console.log('Clarify:', id)}
            />
          </div>
        </div>
        
        <div className="space-y-4 sm:space-y-6 dashboard-fade-in-4">
          <div className="backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border glass-hover" style={{ backgroundColor: 'var(--pharma-card-bg)', borderColor: 'var(--pharma-border)' }}>
            <InventoryAlerts alerts={inventoryAlerts} />
          </div>
          <div className="backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border glass-hover" style={{ backgroundColor: 'var(--pharma-card-bg)', borderColor: 'var(--pharma-border)' }}>
            <PatientMessages messages={messages} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6">
        <button
          className="p-3 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 focus:outline-none"
          style={{
            backgroundColor: 'var(--pharma-blue)',
            color: 'var(--pharma-text-light)'
          }}
        >
          <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
    </PharmaPageLayout>
  );
};

export default PharmacistDashboard;