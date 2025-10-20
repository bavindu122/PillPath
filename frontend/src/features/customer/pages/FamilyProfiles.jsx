import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Plus, 
  Calendar, 
  Search
} from "lucide-react";
import { assets } from "../../../assets/assets";
import { useAuth } from "../../../hooks/useAuth";
import FamilyMemberService from "../services/FamilyMemberService";
import MemberDetails from "../components/MemberDetails";
import AddMember from "../components/AddMember";

const FamilyProfiles = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [familyMembersList, setFamilyMembersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch family members from backend
  const fetchFamilyMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
  const backendMembers = await FamilyMemberService.getFamilyMembers();
      const userProfile = createUserProfile();
      
      // Transform backend data to match frontend format
      const transformedMembers = Array.isArray(backendMembers) ? backendMembers.map(member => {
        // Helper function to ensure we have arrays
        const ensureArray = (value) => {
          // If it's already an array, return it
          if (Array.isArray(value)) {
            return value;
          }
          // If it's a string, try to parse it as JSON
          if (typeof value === 'string') {
            try {
              const parsed = JSON.parse(value);
              return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
              return [];
            }
          }
          // Otherwise return empty array
          return [];
        };

        return {
          id: member.id,
          name: member.name,
          relation: member.relation,
          age: member.age,
          profilePicture: member.profilePicture || assets.profile_pic,
          email: member.email || "Not provided",
          phone: member.phone || "Not provided",
          lastPrescriptionDate: member.lastPrescriptionDate || "Not available",
          activePrescriptions: member.activePrescriptions || 0,
          totalPrescriptions: member.totalPrescriptions || 0,
          allergies: ensureArray(member.allergies),
          bloodType: member.bloodType || "Unknown",
          medicalConditions: ensureArray(member.medicalConditions),
          currentMedications: ensureArray(member.currentMedications)
        };
      }) : [];
      
      // Combine user profile with backend family members
      const allMembers = userProfile ? [userProfile, ...transformedMembers] : transformedMembers;
      setFamilyMembersList(allMembers);
      
    } catch (error) {
      console.error('Failed to fetch family members:', error);
      setError(`Failed to load family members: ${error.message}`);
      
      // Fallback to just user profile if backend fails
      const userProfile = createUserProfile();
      setFamilyMembersList(userProfile ? [userProfile] : []);
    } finally {
      setLoading(false);
    }
  };

  // Create the logged-in user's profile data
  const createUserProfile = () => {
    if (!user || !isAuthenticated) {
      return null;
    }

    return {
      id: 0,
      name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || "Unknown User",
      relation: "Me",
      age: user.age || calculateAgeFromDOB(user.dateOfBirth) || 25, // Default age if not available
      profilePicture: user.profilePicture || assets.profile_pic,
      email: user.email || "Not provided",
      phone: user.phoneNumber || user.phone || "Not provided",
      lastPrescriptionDate: user.lastPrescriptionDate || "2025-07-19", // Default or from user data
      activePrescriptions: user.activePrescriptions || 0,
      totalPrescriptions: user.totalPrescriptions || 0,
      allergies: user.allergies || ["None known"],
      bloodType: user.bloodType || "Unknown",
      medicalConditions: user.medicalConditions || [],
      currentMedications: user.currentMedications || []
    };
  };

  // Helper function to calculate age from date of birth
  const calculateAgeFromDOB = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Load family members when component mounts or user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchFamilyMembers();
    }
  }, [isAuthenticated, user]);

  const handleAddMember = async (memberToAdd) => {
    try {
      setLoading(true);
      
      // Note: The AddMember component already calls the API to create the member
      // We just need to refresh the list to show the newly added member
      await fetchFamilyMembers();
      
    } catch (error) {
      console.error('Failed to refresh family members:', error);
      setError('Failed to refresh family members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      // Don't allow deleting the user's own profile (id = 0)
      if (memberId === 0) {
        setError("Cannot delete your own profile.");
        return;
      }

      setLoading(true);
      
      // Delete from backend
      await FamilyMemberService.deleteFamilyMember(memberId);
      
      // Refresh the family members list
      await fetchFamilyMembers();
      setSelectedProfile(null);
      
    } catch (error) {
      console.error('Failed to delete family member:', error);
      setError('Failed to delete family member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter family members based on search term
  const filteredMembers = familyMembersList.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.relation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProfileClick = (member) => {
    setSelectedProfile(member);
  };

  const closeModal = () => {
    setSelectedProfile(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Show loading or login prompt if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Please log in to view family profiles</h2>
          <p className="text-white/70">You need to be logged in to manage your family's medication profiles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-[10%] w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float-slow"></div>
      <div className="absolute top-32 right-20 w-80 h-80 bg-indigo-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Family Profiles 
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Manage medication profiles and health information for your entire family in one secure place
            </p>
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl mb-6"
            >
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-2 text-red-300 hover:text-white"
              >
                ×
              </button>
            </motion.div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-500/20 border border-blue-500/40 text-blue-200 px-4 py-3 rounded-xl mb-6 text-center"
            >
              Loading family members...
            </motion.div>
          )}

          {/* Search and Add Member Section */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
              <input
                type="text"
                placeholder="Search family members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg"
            >
              <Plus size={20} />
              Add Family Member
            </motion.button>
          </div>
        </div>

        {/* Family Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`${
                member.relation === "Me" 
                  ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-400/40 shadow-blue-500/20" 
                  : "bg-white/15 border-white/20"
              } backdrop-blur-xl rounded-2xl p-6 border shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group relative`}
              onClick={() => handleProfileClick(member)}
            >
              {/* Main User Badge */}
              {member.relation === "Me" && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                  You
                </div>
              )}
              {/* Profile Picture */}
              <div className="relative mb-4">
                <img
                  src={member.profilePicture}
                  alt={member.name}
                  className={`w-20 h-20 rounded-full object-cover mx-auto border-4 ${
                    member.relation === "Me" 
                      ? "border-blue-400/60 shadow-lg shadow-blue-500/30" 
                      : "border-white/30"
                  } group-hover:border-blue-400/50 transition-all duration-300`}
                />
                <div className={`absolute -bottom-2 -right-2 ${
                  member.relation === "Me" 
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500" 
                    : "bg-gradient-to-r from-blue-500 to-purple-500"
                }`}>
                  
                </div>
              </div>

              {/* Basic Info */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                  {member.name}
                </h3>
                <p className="text-white/70 text-sm mb-2">{member.relation} • Age {member.age}</p>
                <div className="flex items-center justify-center text-white/60 text-sm">
                  <Calendar size={14} className="mr-1" />
                  Last Rx: {formatDate(member.lastPrescriptionDate)}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">{member.activePrescriptions}</div>
                  <div className="text-xs text-white/70">Active Rx</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">{member.totalPrescriptions}</div>
                  <div className="text-xs text-white/70">Total Rx</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users size={48} className="mx-auto text-white/40 mb-4" />
            <p className="text-white/60 text-lg">No family members found</p>
            <p className="text-white/40 text-sm">Try adjusting your search terms</p>
          </motion.div>
        )}
      </div>

      {/* Add Member Modal */}
      <AddMember 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddMember={handleAddMember}
      />

      {/* Member Details Modal */}
      <MemberDetails 
        selectedProfile={selectedProfile} 
        isOpen={!!selectedProfile} 
        onClose={closeModal}
        onDeleteMember={handleDeleteMember}
      />
    </div>
  );
};

export default FamilyProfiles;
