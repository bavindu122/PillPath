import { useState, useEffect } from 'react';

export const useDashboardData = () => {
  const [data, setData] = useState({
    stats: [],
    prescriptions: [],
    inventoryAlerts: [],
    messages: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true }));
      
      // Replace with actual API calls
      const [statsResponse, prescriptionsResponse, inventoryResponse, messagesResponse] = await Promise.all([
        fetchStats(),
        fetchPrescriptions(),
        fetchInventoryAlerts(),
        fetchMessages()
      ]);

      setData({
        stats: statsResponse,
        prescriptions: prescriptionsResponse,
        inventoryAlerts: inventoryResponse,
        messages: messagesResponse,
        loading: false,
        error: null
      });
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  // Mock API functions - replace with actual API calls
  const fetchStats = () => {
    return Promise.resolve([
      { title: "Pending Prescriptions", value: "24", subtitle: "14 from yesterday", color: "blue" },
      { title: "Today's Orders", value: "87", subtitle: "+12% from last week", color: "green" },
      { title: "Low Stock Alerts", value: "7", subtitle: "Requires attention", color: "orange" },
      { title: "Patient Messages", value: "15", subtitle: "3 unread", color: "purple" }
    ]);
  };

  const fetchPrescriptions = () => {
    return Promise.resolve([
      {
        id: 1,
        patientName: "John Smith",
        medication: "Amoxicillin 500mg - 30 tablets",
        priority: "High Priority",
        prescribedBy: "Dr. Wilson",
        time: "10:30 AM"
      }
    ]);
  };

  const fetchInventoryAlerts = () => {
    return Promise.resolve([
      { id: 1, medication: "Aspirin 325mg", status: "Only 12 left", type: "low" }
    ]);
  };

  const fetchMessages = () => {
    return Promise.resolve([
      { id: 1, name: "Emma Wilson", message: "Question about dosage...", unread: true }
    ]);
  };

  return {
    ...data,
    refetch: fetchDashboardData
  };
};