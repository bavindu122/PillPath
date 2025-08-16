import React, { useState } from "react";
import { addFamilyMember } from '../services/AddFamilyMemberService';
import { motion, AnimatePresence } from "framer-motion";
import { 
  X,
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Plus
} from "lucide-react";
import { assets } from "../../../assets/assets";
// import { addFamilyMember } from '../../services/api/CustomerService'; // adjust path as needed

const AddMember = ({ isOpen, onClose, onAddMember }) => {
  // Form state for adding new member
  const [newMember, setNewMember] = useState({
    name: "",
    relation: "",
    age: "",
    email: "",
    phone: "",
    profilePicture: assets.profile_pic,
    allergies: [""],
    bloodType: "",
    medicalConditions: [""],
    currentMedications: []
  });

  // Form handlers
  const handleInputChange = (field, value) => {
    setNewMember(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setNewMember(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setNewMember(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeArrayField = (field, index) => {
    setNewMember(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setNewMember({
      name: "",
      relation: "",
      age: "",
      email: "",
      phone: "",
      profilePicture: assets.profile_pic,
      allergies: [""],
      bloodType: "",
      medicalConditions: [""],
      currentMedications: []
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmitNewMember = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!newMember.name || !newMember.relation || !newMember.age) {
      alert("Please fill in all required fields (Name, Relation, Age)");
      return;
    }
    // Prepare member data for API
    const memberData = {
      ...newMember,
      age: parseInt(newMember.age),
      allergies: newMember.allergies.filter(a => a.trim() !== ""),
      medicalConditions: newMember.medicalConditions.filter(c => c.trim() !== ""),
      currentMedications: newMember.currentMedications || [],
      lastPrescriptionDate: new Date().toISOString().split('T')[0],
      activePrescriptions: 0,
      totalPrescriptions: 0
    };
    console.log('Submitting member data:', memberData);
    try {
      const result = await addFamilyMember(memberData);
      console.log('Member added successfully:', result);
      if (onAddMember) onAddMember(result);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to add family member:', error);
      alert(`Failed to add family member: ${error.message}`);
    }
  };
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto add-member-scroll"
          onClick={(e) => e.stopPropagation()}
        >
          <style>
            {`
              .add-member-scroll::-webkit-scrollbar {
                width: 8px;
                background: transparent;
              }
              .add-member-scroll::-webkit-scrollbar-thumb {
                background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
                border-radius: 8px;
              }
              .add-member-scroll::-webkit-scrollbar-track {
                background: transparent;
              }
              .add-member-scroll {
                scrollbar-width: thin;
                scrollbar-color: #22c55e #0000;
              }
            `}
          </style>
          
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <User className="h-6 w-6" />
              Add Family Member
            </h2>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Modal Content */}
          <form onSubmit={handleSubmitNewMember} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              
              {/* Profile Picture Section */}
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={newMember.profilePicture}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/50"
                />
                <button
                  type="button"
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  <Camera className="h-4 w-4" />
                  Change Photo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-white/80 text-sm mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:border-blue-400 focus:outline-none"
                    required
                  />
                </div>

                {/* Relation */}
                <div>
                  <label className="block text-white/80 text-sm mb-2">Relation *</label>
                  <select
                    value={newMember.relation}
                    onChange={(e) => handleInputChange('relation', e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                    required
                  >
                    <option value="" className="bg-gray-800">Select relation</option>
                    <option value="Spouse" className="bg-gray-800">Spouse</option>
                    <option value="Son" className="bg-gray-800">Son</option>
                    <option value="Daughter" className="bg-gray-800">Daughter</option>
                    <option value="Mother" className="bg-gray-800">Mother</option>
                    <option value="Father" className="bg-gray-800">Father</option>
                    <option value="Brother" className="bg-gray-800">Brother</option>
                    <option value="Sister" className="bg-gray-800">Sister</option>
                    <option value="Grandfather" className="bg-gray-800">Grandfather</option>
                    <option value="Grandmother" className="bg-gray-800">Grandmother</option>
                    <option value="Other" className="bg-gray-800">Other</option>
                  </select>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-white/80 text-sm mb-2">Age *</label>
                  <input
                    type="number"
                    value={newMember.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Enter age"
                    min="0"
                    max="120"
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:border-blue-400 focus:outline-none"
                    required
                  />
                </div>

                {/* Blood Type */}
                <div>
                  <label className="block text-white/80 text-sm mb-2">Blood Type</label>
                  <select
                    value={newMember.bloodType}
                    onChange={(e) => handleInputChange('bloodType', e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="" className="bg-gray-800">Select blood type</option>
                    <option value="A+" className="bg-gray-800">A+</option>
                    <option value="A-" className="bg-gray-800">A-</option>
                    <option value="B+" className="bg-gray-800">B+</option>
                    <option value="B-" className="bg-gray-800">B-</option>
                    <option value="AB+" className="bg-gray-800">AB+</option>
                    <option value="AB-" className="bg-gray-800">AB-</option>
                    <option value="O+" className="bg-gray-800">O+</option>
                    <option value="O-" className="bg-gray-800">O-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-white/80 text-sm mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80" size={16} />
                    <input
                      type="email"
                      value={newMember.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-white/80 text-sm mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80" size={16} />
                    <input
                      type="tel"
                      value={newMember.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Medical Information</h3>
              
              {/* Allergies */}
              <div>
                <label className="block text-white/80 text-sm mb-2">Allergies</label>
                {newMember.allergies.map((allergy, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={allergy}
                      onChange={(e) => handleArrayInputChange('allergies', index, e.target.value)}
                      placeholder="Enter allergy (e.g., Penicillin, Peanuts)"
                      className="flex-1 bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:border-blue-400 focus:outline-none"
                    />
                    {newMember.allergies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('allergies', index)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg transition-all"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('allergies')}
                  className="text-blue-300 hover:text-blue-200 text-sm flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add another allergy
                </button>
              </div>

              {/* Medical Conditions */}
              <div>
                <label className="block text-white/80 text-sm mb-2">Medical Conditions</label>
                {newMember.medicalConditions.map((condition, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={condition}
                      onChange={(e) => handleArrayInputChange('medicalConditions', index, e.target.value)}
                      placeholder="Enter medical condition (e.g., Diabetes, Hypertension)"
                      className="flex-1 bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:border-blue-400 focus:outline-none"
                    />
                    {newMember.medicalConditions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('medicalConditions', index)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg transition-all"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('medicalConditions')}
                  className="text-blue-300 hover:text-blue-200 text-sm flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add another condition
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 border border-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Add Member
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddMember;
