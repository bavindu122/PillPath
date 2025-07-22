import { useState } from "react";

/**
 * Custom hook to manage multiple modal states for customer profile
 * @returns {object} Object containing modal states and their toggles
 */
export const useCustomerModals = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const openProfileModal = () => setShowProfileModal(true);
  const closeProfileModal = () => setShowProfileModal(false);
  
  const openEditProfileModal = () => setShowEditProfileModal(true);
  const closeEditProfileModal = () => setShowEditProfileModal(false);
  
  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  return {
    // Modal states
    showProfileModal,
    showEditProfileModal,
    isUploadModalOpen,
    
    // Modal controls
    openProfileModal,
    closeProfileModal,
    openEditProfileModal,
    closeEditProfileModal,
    openUploadModal,
    closeUploadModal,
    
    // Direct setters (for backward compatibility)
    setShowProfileModal,
    setShowEditProfileModal,
    setIsUploadModalOpen
  };
};
