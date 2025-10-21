import React, { useState, useEffect } from "react";
import { Users, Plus, PlusCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CUSTOMER_ROUTES } from "../../../../constants/routes";
import { useAuth } from "../../../../hooks/useAuth";
import FamilyMemberService from "../../services/FamilyMemberService";

const FamilyProfilesCard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch family members from backend
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const backendMembers = await FamilyMemberService.getFamilyMembers();
        
        // Transform backend data to match card format
        const transformedMembers = Array.isArray(backendMembers) ? backendMembers.map(member => ({
          id: member.id,
          name: member.name,
          relation: member.relation,
          activePrescriptions: member.activePrescriptions || 0,
          initial: member.name ? member.name.charAt(0).toUpperCase() : "?",
          color: getColorForRelation(member.relation),
          image: member.profilePicture || null
        })) : [];
        
        setFamilyMembers(transformedMembers);
        
      } catch (error) {
        console.error('Failed to fetch family members:', error);
        setError('Failed to load family members');
        setFamilyMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, [isAuthenticated, user]);

  // Helper function to assign colors based on relation
  const getColorForRelation = (relation) => {
    const colors = {
      'Spouse': 'bg-gradient-to-br from-pink-400 to-purple-500',
      'Son': 'bg-gradient-to-br from-blue-400 to-indigo-500',
      'Daughter': 'bg-gradient-to-br from-purple-400 to-pink-500',
      'Father': 'bg-gradient-to-br from-slate-400 to-gray-600',
      'Mother': 'bg-gradient-to-br from-rose-400 to-pink-500',
      'Brother': 'bg-gradient-to-br from-cyan-400 to-blue-500',
      'Sister': 'bg-gradient-to-br from-fuchsia-400 to-purple-500',
      'Grandfather': 'bg-gradient-to-br from-amber-400 to-orange-500',
      'Grandmother': 'bg-gradient-to-br from-yellow-400 to-amber-500',
    };
    return colors[relation] || 'bg-gradient-to-br from-blue-400 to-indigo-500';
  };

  const handleAddMember = () => {
    navigate(CUSTOMER_ROUTES.FAMILY_PROFILES);
  };

  const handleMemberClick = () => {
    navigate(CUSTOMER_ROUTES.FAMILY_PROFILES);
  };

  return (
    <div>
      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-white/60 text-xs mt-2">Loading family members...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 mb-3">
          <p className="text-red-200 text-xs">{error}</p>
        </div>
      )}

      {/* Family Members List */}
      {!loading && !error && (
        <div className="space-y-3 mb-3">
          {familyMembers.length > 0 ? (
            familyMembers.map((member) => (
              <motion.div 
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/15 transition-all duration-300 flex items-center gap-3 cursor-pointer"
                onClick={handleMemberClick}
              >
                {member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                  />
                ) : (
                  <div className={`w-10 h-10 ${member.color} rounded-full flex items-center justify-center text-white font-medium shadow-lg`}>
                    {member.initial}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="text-white font-medium">{member.name}</h4>
                    <span className="ml-2 text-white/60 text-xs">• {member.relation}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-white/60 text-xs">
                      {member.activePrescriptions} active prescription{member.activePrescriptions !== 1 && 's'}
                    </span>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  className="text-white/60 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMemberClick();
                  }}
                >
                  <ChevronRight size={16} />
                </motion.button>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-6">
              <Users size={32} className="mx-auto text-white/40 mb-2" />
              <p className="text-white/60 text-sm">No family members yet</p>
              <p className="text-white/40 text-xs mt-1">Add your first family member</p>
            </div>
          )}

          <motion.button 
            whileHover={{ scale: 1.03 }}
            onClick={(e) => {
              // Prevent the parent card click handler from firing
              e.stopPropagation();
              handleAddMember();
            }}
            className="w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-white/80 hover:text-white text-sm flex items-center justify-center gap-1"
          >
            <PlusCircle size={14} />
            Add Family Member
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default FamilyProfilesCard;