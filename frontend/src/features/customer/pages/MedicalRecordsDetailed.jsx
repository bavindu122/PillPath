import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Edit, Trash2, Calendar } from "lucide-react";
import Navbar from "../../../components/Layout/Navbar";
import { assets } from "../../../assets/assets";
import CustomerSidebar from "../components/CustomerSidebar";

const MedicalRecordsDetailed = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();
  
  // Mock data - in real app, this would come from API based on recordId
  const [recordDetail, setRecordDetail] = useState(() => {
    // Simulate different records based on recordId
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

  const [showReminderModal, setShowReminderModal] = useState(false);

  const handleSetReminder = () => {
    setShowReminderModal(true);
    // In real app, this would open a reminder setting modal
    console.log("Set reminder for:", recordDetail.conditionName);
  };

  const handleEdit = () => {
    // In real app, this would navigate to edit page or open edit modal
    console.log("Edit record:", recordDetail.conditionName);
  };

  const handleDelete = () => {
    // In real app, this would show confirmation dialog
    if (window.confirm("Are you sure you want to delete this medical record?")) {
      console.log("Delete record:", recordDetail.conditionName);
      navigate("/customer/medical-records");
    }
  };

  const handleBack = () => {
    navigate("/customer/medical-records");
  };

  return (
    <section className="min-h-screen flex relative overflow-hidden">
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <div className="max-w-4xl mx-auto p-6 -mt-[72px] md:-mt-[80px] pt-[72px] md:pt-[80px]">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white hover:text-gray-200 mb-6 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Medical Records</span>
          </button>

          {/* Header */}
          <div className="mb-8 flex items-center font-poppins space-x-4">
            <img
              src={recordDetail.profileImage}
              alt={recordDetail.profileName}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
            />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {recordDetail.conditionName}
              </h1>
              <p className="text-white/80">
                Patient: {recordDetail.profileName}
              </p>
              <p className="text-white/60 text-sm">
                Last updated: {recordDetail.lastUpdated}
              </p>
            </div>
          </div>

          {/* Main Glass Card */}
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 overflow-hidden">
            {/* Glass Card Header */}
            <div className="bg-gradient-to-r from-secondary/90 to-primary-hover/90 backdrop-blur-md p-6 border-b border-white/10">
              <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-white/20 to-transparent"></div>
              <h2 className="text-2xl font-bold text-white relative z-10">
                Medical Record Details
              </h2>
            </div>

            {/* Glass Card Content */}
            <div className="p-6 space-y-8">
              {/* Prescription Image Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar size={20} />
                  Prescription Image
                </h3>
                <div className="flex justify-center mb-4">
                  <div className="relative group">
                    <img
                      src={recordDetail.prescriptionImage}
                      alt="Prescription"
                      className="max-w-full h-auto max-h-96 rounded-lg shadow-lg border border-white/20 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
                  <div>
                    <p className="font-medium">Doctor:</p>
                    <p className="text-white">{recordDetail.doctorName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Date Issued:</p>
                    <p className="text-white">{recordDetail.dateIssued}</p>
                  </div>
                </div>
              </div>

              {/* Medications Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Prescribed Medications</h3>
                <ul className="space-y-2">
                  {recordDetail.medications.map((medication, index) => (
                    <li key={index} className="text-white/80 flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {medication}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notes Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Notes</h3>
                <p className="text-white/80 leading-relaxed">{recordDetail.notes}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center pt-6">
                <button
                  onClick={handleSetReminder}
                  className="flex items-center gap-2 bg-blue-500/80 hover:bg-blue-600/90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-blue-400/30 hover:scale-105 shadow-lg"
                >
                  <Bell size={20} />
                  Set a Reminder
                </button>
                
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-green-500/80 hover:bg-green-600/90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-green-400/30 hover:scale-105 shadow-lg"
                >
                  <Edit size={20} />
                  Edit
                </button>
                
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-500/80 hover:bg-red-600/90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-red-400/30 hover:scale-105 shadow-lg"
                >
                  <Trash2 size={20} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reminder Modal (placeholder) */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Set Reminder</h3>
            <p className="text-white/80 mb-6">
              Reminder functionality will be implemented here.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowReminderModal(false)}
                className="px-4 py-2 bg-gray-500/80 text-white rounded-lg hover:bg-gray-600/90 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowReminderModal(false);
                  // Implement reminder logic here
                }}
                className="px-4 py-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600/90 transition-colors"
              >
                Set Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MedicalRecordsDetailed;
