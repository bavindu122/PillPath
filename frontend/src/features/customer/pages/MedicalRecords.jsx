import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Layout/Navbar";
import { assets } from "../../../assets/assets";
import MedicalRecordCard from "../components/MedicalRecordCard";
import CustomerSidebar from "../components/CustomerSidebar";


const MedicalRecords = () => {
  const navigate = useNavigate();
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

  const handleDeleteRecord = (recordId) => {
    setMedicalRecords(prevRecords => 
      prevRecords.filter(record => record.id !== recordId)
    );
  };

  const handleCardClick = (recordId) => {
    navigate(`/customer/medical-records/${recordId}`);
  };

  const handleAddRecord = () => {
    // This would typically open a modal or navigate to an add record form
    console.log("Add new medical record");
  };

  return (
    <section className="min-h-screen flex bg-gradient-to-br from-primary via-primary-hover to-accent relative overflow-hidden">
     
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 -mt-[72px] md:-mt-[80px] pt-[72px] md:pt-[80px]">
          {/* Header */}
          <div className="mb-8 flex items-center font-poppins space-x-4">
            <img
              src={assets.profile_pic}
              alt="Senuja Udugampola"
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Senuja Udugampola
              </h1>
              <p className="text-white">
                Manage your prescription history
              </p>
            </div>
          </div>
          {/* Medical Records */}
          <div className="space-y-4">
            {medicalRecords.map((record) => (
              <MedicalRecordCard
                key={record.id}
                id={record.id}
                conditionName={record.conditionName}
                lastUpdated={record.lastUpdated}
                onDelete={() => handleDeleteRecord(record.id)}
                onClick={handleCardClick}
              />
            ))}
          </div>
          {/* Add New Record Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleAddRecord}
              className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              title="Add new medical record"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
  
};

export default MedicalRecords;
