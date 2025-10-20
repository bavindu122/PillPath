import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Settings, 
  User,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import PharmaPageLayout from '../components/PharmaPageLayout';
import StatsCards from '../components/StatsCards';
import PrescriptionQueue from '../components/PrescriptionQueue';
import InventoryAlerts from '../components/InventoryAlerts';
import PatientMessages from '../components/PatientMessages';
import Header from '../components/Header';
import { prescriptionService } from '../services/prescriptionService';
import './index-pharmacist.css';

const PharmacistDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setTimeout(() => {
      loadDashboardData();
      setFadeIn(true);
    }, 300);
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load prescriptions from the API
      const prescriptionData = await prescriptionService.loadPrescriptions();
      
      // Limit to first 5 prescriptions for dashboard display
      setPrescriptions(prescriptionData.slice(0, 5));

      // TODO: Replace with actual API calls when available
      setInventoryAlerts([
        { id: 1, medication: "Aspirin 325mg", status: "Only 12 left", type: "low" },
        { id: 2, medication: "Ibuprofen 200mg", status: "25 remaining", type: "medium" },
        { id: 3, medication: "Acetaminophen", status: "Critical: 8 left", type: "critical" }
      ]);

      setMessages([
        { id: 1, name: "Sanath Ranathunga", message: "Question about dosage...", unread: true },
        { id: 2, name: "Amal Perera", message: "Prescription ready?", unread: false }
      ]);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
      setPrescriptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await prescriptionService.updateStatus(id, 'IN_PROGRESS');
      // Reload data to reflect changes
      loadDashboardData();
    } catch (err) {
      console.error('Error approving prescription:', err);
      alert(err.message || 'Failed to approve prescription');
    }
  };

  const handleReject = async (id) => {
    try {
      await prescriptionService.updateStatus(id, 'REJECTED');
      // Reload data to reflect changes
      loadDashboardData();
    } catch (err) {
      console.error('Error rejecting prescription:', err);
      alert(err.message || 'Failed to reject prescription');
    }
  };

  const handleClarify = async (id) => {
    try {
      await prescriptionService.updateStatus(id, 'CLARIFICATION_NEEDED');
      // Reload data to reflect changes
      loadDashboardData();
    } catch (err) {
      console.error('Error requesting clarification:', err);
      alert(err.message || 'Failed to request clarification');
    }
  };

  const statsData = [
    { title: "Pending Prescriptions", value: prescriptions.length.toString(), subtitle: "In queue", color: "blue" },
    { title: "Today's Orders", value: "87", subtitle: "+12% from last week", color: "green" },
    { title: "Low Stock Alerts", value: inventoryAlerts.length.toString(), subtitle: "Requires attention", color: "orange" },
    { title: "Patient Messages", value: messages.filter(m => m.unread).length.toString(), subtitle: `${messages.length} total`, color: "purple" }
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
            {error ? (
              <div className="p-6 text-center">
                <p className="text-red-600 mb-2">Failed to load prescriptions</p>
                <p className="text-sm text-gray-600 mb-4">{error}</p>
                <button
                  onClick={loadDashboardData}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : prescriptions.length === 0 && !isLoading ? (
              <div className="p-6 text-center">
                <p className="text-gray-600">No prescriptions in queue</p>
              </div>
            ) : (
              <PrescriptionQueue 
                prescriptions={prescriptions}
                onApprove={handleApprove}
                onReject={handleReject}
                onClarify={handleClarify}
              />
            )}
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
    </PharmaPageLayout>
  );
};

export default PharmacistDashboard;