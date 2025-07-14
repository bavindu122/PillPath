import { useState } from "react";
import { assets } from "../../../assets/assets";

/**
 * Custom hook to get medical record details by ID
 * @param {string|number} recordId - The ID of the medical record
 * @returns {object} Object containing record detail and operations
 */
export const useMedicalRecordDetail = (recordId) => {
  const [showReminderModal, setShowReminderModal] = useState(false);

  // Mock data - in real app, this would come from API based on recordId
  const [recordDetail] = useState(() => {
    const records = {
      1: {
        id: recordId,
        profileImage: assets.profile_pic,
        profileName: "Senuja Udugampola",
        conditionName: "Diabetes",
        lastUpdated: "March 15, 2024",
        prescriptionImage: assets.panadol,
        doctorName: "Dr. Smith Johnson",
        dateIssued: "March 10, 2024",
        notes: "Regular monitoring required. Check blood sugar levels twice daily.",
        medications: ["Metformin 500mg", "Insulin Glargine", "Glucose Test Strips"]
      },
      2: {
        id: recordId,
        profileImage: assets.profile_pic,
        profileName: "Senuja Udugampola",
        conditionName: "Fever",
        lastUpdated: "March 12, 2024",
        prescriptionImage: assets.paracetamol,
        doctorName: "Dr. Sarah Wilson",
        dateIssued: "March 8, 2024",
        notes: "Take medication with food. Rest and stay hydrated.",
        medications: ["Paracetamol 500mg", "Ibuprofen 400mg"]
      },
      3: {
        id: recordId,
        profileImage: assets.profile_pic,
        profileName: "Senuja Udugampola",
        conditionName: "Hypertension",
        lastUpdated: "March 10, 2024",
        prescriptionImage: assets.ibuprofen,
        doctorName: "Dr. Michael Brown",
        dateIssued: "March 6, 2024",
        notes: "Monitor blood pressure daily. Reduce salt intake.",
        medications: ["Lisinopril 10mg", "Amlodipine 5mg"]
      }
    };
    
    return records[recordId] || records[1]; // Default to first record if ID not found
  });

  const openReminderModal = () => setShowReminderModal(true);
  const closeReminderModal = () => setShowReminderModal(false);

  const setReminder = () => {
    // Implementation for setting reminder
    console.log("Set reminder for:", recordDetail.conditionName);
    closeReminderModal();
  };

  const editRecord = () => {
    // Implementation for editing record
    console.log("Edit record:", recordDetail.conditionName);
  };

  const deleteRecord = () => {
    // Implementation for deleting record
    if (window.confirm("Are you sure you want to delete this medical record?")) {
      console.log("Delete record:", recordDetail.conditionName);
      return true; // Indicate successful deletion
    }
    return false;
  };

  return {
    recordDetail,
    showReminderModal,
    openReminderModal,
    closeReminderModal,
    setReminder,
    editRecord,
    deleteRecord
  };
};
