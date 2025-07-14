import { useState } from "react";
import { assets } from "../../../assets/assets";

/**
 * Custom hook to manage medical records data and operations
 * @returns {object} Object containing medical records state and operations
 */
export const useMedicalRecords = () => {
  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 1,
      profileImage: assets.profile_pic,
      profileName: "Senuja Udugampola",
      conditionName: "Diabetes",
      lastUpdated: "March 15, 2024"
    },
    {
      id: 2,
      profileImage: assets.profile_pic,
      profileName: "Senuja Udugampola",
      conditionName: "Fever",
      lastUpdated: "March 12, 2024"
    },
    {
      id: 3,
      profileImage: assets.profile_pic,
      profileName: "Senuja Udugampola",
      conditionName: "Hypertension",
      lastUpdated: "March 10, 2024"
    },
    {
      id: 4,
      profileImage: assets.profile_pic,
      profileName: "Senuja Udugampola",
      conditionName: "Migraine",
      lastUpdated: "March 8, 2024"
    },
    {
      id: 5,
      profileImage: assets.profile_pic,
      profileName: "Senuja Udugampola",
      conditionName: "Asthma",
      lastUpdated: "March 5, 2024"
    },
    {
      id: 6,
      profileImage: assets.profile_pic,
      profileName: "Senuja Udugampola",
      conditionName: "Allergies",
      lastUpdated: "March 3, 2024"
    }
  ]);

  const deleteRecord = (recordId) => {
    setMedicalRecords(prevRecords => 
      prevRecords.filter(record => record.id !== recordId)
    );
  };

  const addRecord = (newRecord) => {
    const newId = Math.max(...medicalRecords.map(r => r.id)) + 1;
    setMedicalRecords(prevRecords => [
      ...prevRecords,
      { ...newRecord, id: newId }
    ]);
  };

  const updateRecord = (recordId, updatedData) => {
    setMedicalRecords(prevRecords =>
      prevRecords.map(record =>
        record.id === recordId ? { ...record, ...updatedData } : record
      )
    );
  };

  return {
    medicalRecords,
    deleteRecord,
    addRecord,
    updateRecord,
    setMedicalRecords
  };
};
