import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  Trash2,
  Package
} from "lucide-react";
import EditProfileModal from "../components/EditProfileModal";
import PrescriptionDetailModal from "./PrescriptionDetailModal";
import { ModalScrollContainer } from "../../../components/UIs";


const MemberDetails = ({ selectedProfile, isOpen, onClose, onDeleteMember, onMemberUpdate }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState(null);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
  const [isPrescriptionDetailOpen, setIsPrescriptionDetailOpen] = useState(false);

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSuccess = (updatedMember) => {
    setIsEditModalOpen(false);
    // Notify parent component to refresh data
    if (onMemberUpdate) {
      onMemberUpdate(updatedMember);
    }
  };

  const handlePrescriptionClick = (prescription, event) => {
    // Prevent opening modal if clicking on action buttons
    if (event.target.closest('.prescription-action-button')) {
      return;
    }
    
    console.log("Prescription clicked:", prescription);
    console.log("Prescription ID:", prescription.id);
    
    // Open prescription detail modal with prescription ID
    if (prescription.id) {
      console.log("Opening prescription detail modal with ID:", prescription.id);
      setSelectedPrescriptionId(prescription.id);
      setIsPrescriptionDetailOpen(true);
    } else {
      console.log("No prescription ID found");
      alert("Unable to load prescription details.");
    }
  };

  const handleViewOrder = (prescription, event) => {
    event.stopPropagation();
    if (prescription.orderCode) {
      onClose();
      navigate(`/customer/orders/${prescription.orderCode}`);
    }
  };

  const handleClosePrescriptionDetail = () => {
    setIsPrescriptionDetailOpen(false);
    setSelectedPrescriptionId(null);
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

  // Fetch prescriptions for the family member
  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!selectedProfile || !isOpen || activeTab !== "all-prescriptions") {
        return;
      }

      setLoadingPrescriptions(true);
      setPrescriptionError(null);

      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("Not authenticated");
        }

        const url = `http://localhost:8080/api/v1/prescriptions/family-member/${selectedProfile.id}`;
        
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch prescriptions: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched prescriptions for family member:", data);
        setPrescriptions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setPrescriptionError(error.message);
        setPrescriptions([]);
      } finally {
        setLoadingPrescriptions(false);
      }
    };

    fetchPrescriptions();
  }, [selectedProfile, isOpen, activeTab]);

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
      {isOpen && selectedProfile && (
        <motion.div
          key="member-details-backdrop"
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
                
                { id: "all-prescriptions", label: "Prescriptions", icon: <FileText size={16} /> },
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
          <ModalScrollContainer maxHeight="calc(95vh - 300px)">
            <div className="space-y-6">
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
                  <h3 className="text-2xl font-bold text-white">Active Prescriptions</h3>
                  <span className="text-white/60 text-sm">
                    {loadingPrescriptions ? "Loading..." : `${prescriptions.filter(p => p.status === 'IN_PROGRESS' || p.status === 'PENDING_REVIEW').length} active prescription(s)`}
                  </span>
                </div>

                {prescriptionError && (
                  <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl">
                    {prescriptionError}
                  </div>
                )}

                <div className="grid gap-4">
                  {loadingPrescriptions ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-white/60">Loading prescriptions...</p>
                    </div>
                  ) : prescriptions.filter(p => p.status === 'IN_PROGRESS' || p.status === 'PENDING_REVIEW').length > 0 ? (
                    prescriptions.filter(p => p.status === 'IN_PROGRESS' || p.status === 'PENDING_REVIEW').map((prescription, index) => (
                      <motion.div
                        key={prescription.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={(e) => handlePrescriptionClick(prescription, e)}
                        className="bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer hover:border-blue-400/50"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-semibold text-white">
                              {prescription.code || `Prescription #${prescription.id}`}
                            </h4>
                            {prescription.note && (
                              <p className="text-white/60 text-sm mt-1">{prescription.note}</p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            prescription.status === 'IN_PROGRESS'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {prescription.status?.replace(/_/g, ' ') || 'Unknown'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-white/60">Pharmacy</span>
                            <p className="text-white font-medium">{prescription.pharmacyName || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Uploaded</span>
                            <p className="text-white font-medium">{prescription.createdAt ? formatDate(prescription.createdAt) : "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Total Price</span>
                            <p className="text-white font-medium">
                              {prescription.totalPrice ? `LKR ${prescription.totalPrice}` : "Pending"}
                            </p>
                          </div>
                          <div>
                            <span className="text-white/60">Delivery</span>
                            <p className="text-white font-medium capitalize">
                              {prescription.deliveryPreference?.toLowerCase() || "N/A"}
                            </p>
                          </div>
                        </div>

                        {prescription.imageUrl && (
                          <div className="mt-4">
                            <button
                              onClick={() => window.open(prescription.imageUrl, '_blank')}
                              className="text-blue-300 hover:text-blue-200 text-sm flex items-center gap-2"
                            >
                              <FileText size={16} />
                              View Prescription Image
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Pill size={48} className="mx-auto text-white/40 mb-4" />
                      <p className="text-white/60 text-lg">No active prescriptions</p>
                      <p className="text-white/40 text-sm">All prescriptions are completed or none assigned yet</p>
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
                  <span className="text-white/60 text-sm">
                    {loadingPrescriptions ? "Loading..." : `${prescriptions.length} prescription(s)`}
                  </span>
                </div>

                {prescriptionError && (
                  <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl">
                    {prescriptionError}
                  </div>
                )}

                <div className="grid gap-4">
                  {loadingPrescriptions ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-white/60">Loading prescriptions...</p>
                    </div>
                  ) : prescriptions.length > 0 ? (
                    prescriptions.map((prescription, index) => (
                      <motion.div
                        key={prescription.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={(e) => handlePrescriptionClick(prescription, e)}
                        className="bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer hover:border-blue-400/50"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-semibold text-white">
                              {prescription.code || `Prescription #${prescription.id}`}
                            </h4>
                            {prescription.note && (
                              <p className="text-white/60 text-sm mt-1">{prescription.note}</p>
                            )}
                            <p className="text-white/40 text-xs mt-1">Click to view prescription details</p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              prescription.status === 'COMPLETED' 
                                ? 'bg-green-500/20 text-green-400'
                                : prescription.status === 'IN_PROGRESS'
                                ? 'bg-blue-500/20 text-blue-400'
                                : prescription.status === 'PENDING_REVIEW'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {prescription.status?.replace(/_/g, ' ') || 'Unknown'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-white/60">Pharmacy</span>
                            <p className="text-white font-medium">{prescription.pharmacyName || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Uploaded</span>
                            <p className="text-white font-medium">{prescription.createdAt ? formatDate(prescription.createdAt) : "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-white/60">Total Price</span>
                            <p className="text-white font-medium">
                              {prescription.totalPrice ? `LKR ${prescription.totalPrice}` : "Pending"}
                            </p>
                          </div>
                          <div>
                            <span className="text-white/60">Delivery</span>
                            <p className="text-white font-medium capitalize">
                              {prescription.deliveryPreference?.toLowerCase() || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-3 flex-wrap">
                          {prescription.imageUrl && (
                            <button
                              onClick={(e) => { e.stopPropagation(); window.open(prescription.imageUrl, '_blank'); }}
                              className="prescription-action-button text-blue-300 hover:text-blue-200 text-sm flex items-center gap-2"
                            >
                              <FileText size={16} />
                              View Image
                            </button>
                          )}
                          {prescription.orderCode && (
                            <button
                              onClick={(e) => handleViewOrder(prescription, e)}
                              className="prescription-action-button bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                            >
                              <Package size={16} />
                              View Order
                            </button>
                          )}
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
          </ModalScrollContainer>

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
      )}

      {/* Edit Profile Modal - Outside main modal */}
      {isEditModalOpen && (
        <EditProfileModal 
          key="edit-profile-modal"
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          selectedProfile={selectedProfile}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Prescription Detail Modal */}
      {isPrescriptionDetailOpen && (
        <PrescriptionDetailModal
          key="prescription-detail-modal"
          prescriptionId={selectedPrescriptionId}
          isOpen={isPrescriptionDetailOpen}
          onClose={handleClosePrescriptionDetail}
        />
      )}
    </AnimatePresence>
  );
};

export default MemberDetails;
