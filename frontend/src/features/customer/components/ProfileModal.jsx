 import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { assets } from "../../../assets/assets";

const profiles = [
  {
    name: "Senuja Udugampola",
    title: "Parent",
    image: assets.profile_pic,
  },
  {
    name: "Tanuri Mandini",
    title: "Child", 
    image: assets.profile_pic,
  },
];

export default function ProfileModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const handleProfileSelect = (profile) => {
    onClose(); // Close the modal
    navigate("/medical-records"); // Navigate to customer profile page
  };

  const handleViewMedicalRecords = (profile) => {
    onClose(); // Close the modal
    navigate("/medical-records"); // Navigate to medical records page
  };

  const handleAddMember = () => {
    // Handle adding new family member
    console.log("Add new family member");
    // You can implement the add member functionality here
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-[90%] max-w-xl text-center relative">
        <h2 className="text-xl font-semibold mb-1">Select Profile</h2>
        <p className="text-gray-500 text-sm mb-6">Choose which profile you'd like to use</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profiles.map((profile, index) => (
            <div key={index} className="space-y-3">
              <div
                className="border rounded-lg p-4 flex flex-col items-center hover:shadow-md transition cursor-pointer hover:bg-gray-50"
                onClick={() => handleProfileSelect(profile)}
              >
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full mb-3"
                />
                <h3 className="font-semibold">{profile.name}</h3>
                <p className="text-gray-500 text-sm">{profile.title}</p>
              </div>
            </div>
          ))}
          
          {/* Add New Member Button */}
          <div
            className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:shadow-md transition cursor-pointer hover:bg-gray-50 hover:border-gray-400"
            onClick={handleAddMember}
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Plus className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="font-semibold text-gray-600">Add Member</h3>
            <p className="text-gray-400 text-sm">Add family member</p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
