import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Plus, 
  Calendar, 
  Search
} from "lucide-react";
import { assets } from "../../../assets/assets";
import MemberDetails from "../components/MemberDetails";
import AddMember from "../components/AddMember";

// Sample family member data - moved outside component to avoid reference issues
const initialFamilyMembers = [
  {
    id: 0,
    name: "Senuja Udugampola",
    relation: "Me",
    age: 42,
    profilePicture: assets.profile_pic,
    email: "senuja@email.com",
    phone: "+94 703034515",
    lastPrescriptionDate: "2025-07-19",
    activePrescriptions: 3,
    totalPrescriptions: 47,
    allergies: ["None known"],
    bloodType: "O+",
    medicalConditions: ["High Blood Pressure"],
    currentMedications: [
      { 
        name: "RX-250719-34", 
        frequency: "Once daily", 
        lastRefill: "2025-07-18",
        prescriptionId: "RX-250719-34",
        prescribedBy: "Dr. Jennifer Smith",
        quantity: "30 tablets"
      },
      { 
        name: "RX-250719-35", 
        frequency: "Once daily", 
        lastRefill: "2025-07-15",
        prescriptionId: "RX-250719-35",
        prescribedBy: "Dr. Jennifer Smith",
        quantity: "60 capsules"
      },
      { 
        name: "RX-250719-36", 
        frequency: "Twice daily", 
        lastRefill: "2025-07-17",
        prescriptionId: "RX-250719-36",
        prescribedBy: "Dr. Jennifer Smith",
        quantity: "120 softgels"
      }
    ]
  },
  {
    id: 1,
    name: "Sanuthma Munasinghe",
    relation: "Spouse",
    age: 45,
    profilePicture: assets.profile_pic,
    email: "sanuthma@email.com",
    phone: "+94 792674517",
    lastPrescriptionDate: "2025-07-15",
    activePrescriptions: 2,
    totalPrescriptions: 24,
    allergies: ["Penicillin", "Peanuts"],
    bloodType: "A+",
    medicalConditions: ["Hypertension", "Diabetes Type 2"],
    currentMedications: [
      { 
        name: "RX-250710-05", 
        frequency: "Twice daily", 
        lastRefill: "2025-07-10",
        prescriptionId: "RX-250710-05",
        prescribedBy: "Dr. Sarah Johnson",
        quantity: "60 tablets"
      },
      { 
        name: "RX-250712-01", 
        frequency: "Once daily", 
        lastRefill: "2025-07-12",
        prescriptionId: "RX-250712-01",
        prescribedBy: "Dr. Sarah Johnson",
        quantity: "30 tablets"
      }
    ]
  },
  {
    id: 2,
    name: "Bavindu Shamen",
    relation: "Son",
    age: 16,
    profilePicture: assets.profile_pic,
    email: "bavindu@email.com",
    phone: "+94 795725816",
    lastPrescriptionDate: "2025-07-10",
    activePrescriptions: 1,
    totalPrescriptions: 8,
    allergies: ["Shellfish"],
    bloodType: "O+",
    medicalConditions: ["Asthma"],
    currentMedications: [
      { 
        name: "RX-250524-36", 
        frequency: "As needed", 
        lastRefill: "2025-07-05",
        prescriptionId: "RX-250524-36",
        prescribedBy: "Dr. Michael Chen",
        quantity: "1 inhaler"
      }
    ]
  },
  {
    id: 3,
    name: "Nirmi Kawmada",
    relation: "Daughter",
    age: 12,
    profilePicture: assets.profile_pic,
    email: "nirmia@email.com",
    phone: "+94 703034515",
    lastPrescriptionDate: "2025-06-28",
    activePrescriptions: 0,
    totalPrescriptions: 3,
    allergies: ["None known"],
    bloodType: "A+",
    medicalConditions: ["None"],
    currentMedications: []
  },
  {
    id: 4,
    name: "Tanuri Mandini",
    relation: "Mother",
    age: 72,
    profilePicture: assets.profile_pic,
    email: "tanuri@email.com",
    phone: "+94 703034515",
    lastPrescriptionDate: "2025-07-18",
    activePrescriptions: 4,
    totalPrescriptions: 156,
    allergies: ["Sulfa drugs", "Latex"],
    bloodType: "B+",
    medicalConditions: ["Heart Disease", "Arthritis", "High Cholesterol"],
    currentMedications: [
      { 
        name: "RX-250715-25", 
        frequency: "Once daily", 
        lastRefill: "2025-07-15",
        prescriptionId: "RX-250715-25",
        prescribedBy: "Dr. David Thompson",
        quantity: "30 tablets"
      },
      { 
        name: "RX-250716-25", 
        frequency: "Twice daily", 
        lastRefill: "2025-07-16",
        prescriptionId: "RX-250716-25",
        prescribedBy: "Dr. David Thompson",
        quantity: "60 tablets"
      },
      { 
        name: "RX-250710-25", 
        frequency: "As needed", 
        lastRefill: "2025-07-10",
        prescriptionId: "RX-250710-25",
        prescribedBy: "Dr. David Thompson",
        quantity: "30 tablets"
      },
      { 
        name: "RX-250714-01", 
        frequency: "Once daily", 
        lastRefill: "2025-07-14",
        prescriptionId: "RX-250714-01",
        prescribedBy: "Dr. David Thompson",
        quantity: "90 tablets"
      }
    ]
  }
];

const FamilyProfiles = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [familyMembersList, setFamilyMembersList] = useState(initialFamilyMembers);

  const handleAddMember = (memberToAdd) => {
    // Add ID to the new member
    const newMember = {
      ...memberToAdd,
      id: familyMembersList.length
    };
    
    // Add to family members list
    setFamilyMembersList(prev => [...prev, newMember]);
  };

  const handleDeleteMember = (memberId) => {
    setFamilyMembersList(prev => prev.filter(member => member.id !== memberId));
    setSelectedProfile(null);
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
