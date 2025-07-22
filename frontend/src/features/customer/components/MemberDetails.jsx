import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User,
  Phone,
  Mail,
  Heart,
  Shield,
  AlertCircle,
  Zap,
  Upload,
  Download,
  Pill,
  FileText,
  Activity,
  Edit,
  Crown,
  Trash2
} from "lucide-react";
import EditProfileModal from "../components/EditProfileModal";


const MemberDetails = ({ selectedProfile, isOpen, onClose, onDeleteMember }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (onDeleteMember && selectedProfile) {
      onDeleteMember(selectedProfile.id);
      setShowDeleteConfirmation(false);
      onClose();
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleMainModalClick = (e) => {
    // Don't close main modal if edit modal is open
    if (!isEditModalOpen) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!isOpen || !selectedProfile) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleMainModalClick}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.4, type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gradient-to-br from-slate-800/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl max-w-6xl w-full max-h-[95vh] border border-white/20 shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header with Profile Hero Section */}
          <div className="relative bg-gradient-to-r from-blue-600/30 to-purple-600/30 p-8 border-b border-white/10 flex-shrink-0 rounded-t-3xl">
            <div className="absolute top-4 right-4 flex gap-2">
             
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="bg-white/10 hover:bg-red-500/50 backdrop-blur-md p-2 rounded-full transition-colors"
              >
                <span className="text-white text-xl font-bold">×</span>
              </motion.button>
            </div>

            <div className="flex items-start gap-6">
              <div className="relative">
                <img
                  src={selectedProfile.profilePicture}
                  alt={selectedProfile.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white/30 shadow-lg"
                />
                {selectedProfile.relation === "Me" && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-2">
                    <Crown size={16} className="text-white" />
                  </div>
                )}
                
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-white">{selectedProfile.name}</h2>
                  {selectedProfile.relation === "Me" && (
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Primary Account
                    </span>
                  )}
                </div>
                <p className="text-white/80 text-lg mb-4">{selectedProfile.relation} • {selectedProfile.age} years old</p>
                
                {/* Quick Stats Row */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{selectedProfile.activePrescriptions}</div>
                    <div className="text-xs text-white/60">Active Rx</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{selectedProfile.totalPrescriptions}</div>
                    <div className="text-xs text-white/60">Total Rx</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-8 py-4 border-b border-white/10 flex-shrink-0">
            <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
              {[
                { id: "overview", label: "Overview", icon: <User size={16} /> },
                { id: "active-prescriptions", label: "Active Prescriptions", icon: <Pill size={16} /> },
                { id: "all-prescriptions", label: "All Prescriptions", icon: <FileText size={16} /> },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab.icon}
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Contact & Basic Info */}
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Phone className="mr-3 text-blue-400" size={20} />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center">
                          <Mail size={16} className="mr-3 text-white/60" />
                          <span className="text-white/80">Email</span>
                        </div>
                        <span className="text-white font-medium">{selectedProfile.email}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center">
                          <Phone size={16} className="mr-3 text-white/60" />
                          <span className="text-white/80">Phone</span>
                        </div>
                        <span className="text-white font-medium">{selectedProfile.phone}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center">
                          <Heart size={16} className="mr-3 text-white/60" />
                          <span className="text-white/80">Blood Type</span>
                        </div>
                        <span className="text-white font-medium">{selectedProfile.bloodType}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Overview */}
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <AlertCircle className="mr-3 text-yellow-400" size={20} />
                      Health Alerts
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-red-300 font-medium">Allergies</span>
                          <span className="text-xs text-red-400">{selectedProfile.allergies.length} items</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedProfile.allergies.map((allergy, index) => (
                            <span key={index} className="bg-red-500/20 text-red-300 px-2 py-1 rounded-full text-xs">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-orange-300 font-medium">Medical Conditions</span>
                          <span className="text-xs text-orange-400">{selectedProfile.medicalConditions.length} items</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedProfile.medicalConditions.map((condition, index) => (
                            <span key={index} className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs">
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "active-prescriptions" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-white">Prescriptions uploaded</h3>
                </div>

                <div className="grid gap-4">
                  {selectedProfile.currentMedications.length > 0 ? (
                    selectedProfile.currentMedications.map((prescription, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-semibold text-white">{prescription.name}</h4>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            prescription.refillsRemaining > 0 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {prescription.refillsRemaining > 0 ? 'Active' : 'Refill Needed'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-white/60">Pharmacy</span>
                            <p className="text-white font-medium">{prescription.pharmacy || "ABC Pharmacy"}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Last Order</span>
                            <p className="text-white font-medium">{formatDate(prescription.lastRefill)}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Pill size={48} className="mx-auto text-white/40 mb-4" />
                      <p className="text-white/60 text-lg">No active prescriptions</p>
                      <p className="text-white/40 text-sm">Upload a prescription to get started</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "all-prescriptions" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-white">All Prescriptions</h3>
                </div>

                <div className="grid gap-4">
                  {selectedProfile.allPrescriptions ? (
                    selectedProfile.allPrescriptions.map((prescription, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-semibold text-white">{prescription.name}</h4>
                          </div>
                          <div className="flex gap-2">
                            {prescription.isActive && (
                              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-white/60">Pharmacy</span>
                            <p className="text-white font-medium">{prescription.pharmacy || "ABC Pharmacy"}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Last Order</span>
                            <p className="text-white font-medium">{formatDate(prescription.lastRefill)}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Status</span>
                            <p className={`font-medium ${
                              prescription.isActive ? 'text-green-400' : 'text-gray-400'
                            }`}>
                              {prescription.isActive ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                          <div>
                            <span className="text-white/60">Prescribed Date</span>
                            <p className="text-white font-medium">{formatDate(prescription.prescribedDate || prescription.lastRefill)}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : selectedProfile.currentMedications ? (
                    // Combine current medications with some sample inactive prescriptions
                    [
                      ...selectedProfile.currentMedications.map(med => ({ ...med, isActive: true })),
                      // Sample inactive prescriptions
                      {
                        name: "RX-250719-40",
                        pharmacy: "HealthPlus Pharmacy",
                        lastRefill: "2024-06-15",
                        prescribedDate: "2024-05-01",
                        isActive: false,
                        refillsRemaining: 0
                      },
                      {
                        name: "RX-250719-41",
                        pharmacy: "CareRx Pharmacy",
                        lastRefill: "2024-05-20",
                        prescribedDate: "2024-04-10",
                        isActive: false,
                        refillsRemaining: 0
                      },
                      {
                        name: "RX-250719-42",
                        pharmacy: "WellCare Pharmacy",
                        lastRefill: "2024-07-01",
                        prescribedDate: "2024-06-15",
                        isActive: false,
                        refillsRemaining: 1
                      }
                    ].map((prescription, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-semibold text-white">{prescription.name}</h4>
                          </div>
                          <div className="flex gap-2">
                            {prescription.isActive && (
                              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-white/60">Pharmacy</span>
                            <p className="text-white font-medium">{prescription.pharmacy || "ABC Pharmacy"}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Last Order</span>
                            <p className="text-white font-medium">{formatDate(prescription.lastRefill)}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Status</span>
                            <p className={`font-medium ${
                              prescription.isActive ? 'text-green-400' : 'text-gray-400'
                            }`}>
                              {prescription.isActive ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Pill size={48} className="mx-auto text-white/40 mb-4" />
                      <p className="text-white/60 text-lg">No prescriptions found</p>
                      <p className="text-white/40 text-sm">Upload a prescription to get started</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
          </div>

          {/* Modal Footer */}
          <div className="px-8 py-6 border-t border-white/10 bg-white/5 flex-shrink-0 rounded-b-3xl">
            {!showDeleteConfirmation ? (
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                >
                  <Upload size={18} />
                  Upload New Prescription
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                >
                  <Edit size={18} />
                  Edit Profile
                </motion.button>
                {selectedProfile?.relation !== "Me" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteClick}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    Delete
                  </motion.button>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="bg-red-500/20 p-3 rounded-full">
                      <Trash2 size={24} className="text-red-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Delete Family Member</h3>
                  <p className="text-white/70 text-sm">
                    Are you sure you want to delete <span className="font-medium text-white">{selectedProfile?.name}</span>? 
                    This action cannot be undone and will remove all their prescription history.
                  </p>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelDelete}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all duration-300 border border-white/20"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmDelete}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    Delete Permanently
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Edit Profile Modal - Outside main modal */}
      {isEditModalOpen && (
        <EditProfileModal 
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          selectedProfile={selectedProfile}
        />
      )}
    </AnimatePresence>
  );
};

export default MemberDetails;
