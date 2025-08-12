// Mock data service for prescriptions
export const prescriptionService = {
  async loadPrescriptions() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 1,
        patientName: "RX-250714-02",
        priority: "High Priority",
        time: "10:30 AM",
        date: "2025-07-04",
        status: "pending_review",
        avatar: "/api/placeholder/40/40",
        estimatedTime: "15 mins",
        prescribedBy: "Dr. Wilson"
      },
      {
        id: 2,
        patientName: " RX-250714-02",
        priority: "Medium Priority",
        time: "11:15 AM",
        date: "2025-07-04",
        status: "in_progress",
        avatar: "/api/placeholder/40/40",
        estimatedTime: "25 mins",
        prescribedBy: "Dr. Smith"
      },
      {
        id: 3,
        patientName: "RX-250714-02",
        priority: "Low Priority",
        time: "2:45 PM",
        date: "2025-07-04",
        status: "pending_review",
        avatar: "/api/placeholder/40/40",
        estimatedTime: "10 mins",
        prescribedBy: "Dr. Johnson"
      },
      {
        id: 4,
        patientName: "RX-250714-02",
        priority: "Medium Priority",
        time: "3:20 PM",
        date: "2025-07-04",
        status: "clarification_needed",
        avatar: "/api/placeholder/40/40",
        estimatedTime: "20 mins",
        prescribedBy: "Dr. Brown"
      },
      {
        id: 5,
        patientName: "RX-250714-02",
        priority: "High Priority",
        time: "4:10 PM",
        date: "2025-07-04",
        status: "pending_review",
        avatar: "/api/placeholder/40/40",
        estimatedTime: "12 mins",
        prescribedBy: "Dr. Davis"
      },
      {
        id: 6,
        patientName: "Order RX-250714-02",
        priority: "Low Priority",
        time: "4:45 PM",
        date: "2025-07-04",
        status: "ready_for_pickup",
        avatar: "/api/placeholder/40/40",
        estimatedTime: "Completed",
        prescribedBy: "Dr. Wilson"
      }
    ];
  },

  // Filter configurations for prescriptions
  getFilterConfig() {
    return {
      defaultSort: 'time',
      searchFields: ['patientName', 'prescribedBy'],
      customFilters: {
        priority: (item, value) => item.priority.toLowerCase() === value.toLowerCase(),
        status: (item, value) => item.status === value
      },
      sortFunctions: {
        time: (a, b) => new Date(`2025-07-04 ${a.time}`) - new Date(`2025-07-04 ${b.time}`),
        priority: (a, b) => {
          const priorityOrder = { 'High Priority': 3, 'Medium Priority': 2, 'Low Priority': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        },
        patient: (a, b) => a.patientName.localeCompare(b.patientName)
      }
    };
  }
};
