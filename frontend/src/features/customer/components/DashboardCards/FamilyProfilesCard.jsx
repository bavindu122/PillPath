import React from "react";
import { Users, Plus, PlusCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const FamilyProfilesCard = () => {
  const familyMembers = [
    {
      id: 1,
      name: "Sanu Munasinghe",
      relation: "Spouse",
      activePrescriptions: 2,
      initial: "M",
      color: "bg-gradient-to-br from-pink-400 to-purple-500",
      image: null // Use null if no image, otherwise provide the image path
    },
    {
      id: 2,
      name: "Bavindu Shamen",
      relation: "Son",
      activePrescriptions: 1,
      initial: "A",
      color: "bg-gradient-to-br from-blue-400 to-indigo-500",
      image: null
    }
  ];

  return (
    <div>
     

      <div className="space-y-3 mb-3">
        {familyMembers.map((member) => (
          <motion.div 
            key={member.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/15 transition-all duration-300 flex items-center gap-3"
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
            >
              <ChevronRight size={16} />
            </motion.button>
          </motion.div>
        ))}

        <motion.button 
          whileHover={{ scale: 1.03 }}
          className="w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-white/80 hover:text-white text-sm flex items-center justify-center gap-1"
        >
          <PlusCircle size={14} />
          Add Family Member
        </motion.button>
      </div>
    </div>
  );
};

export default FamilyProfilesCard;