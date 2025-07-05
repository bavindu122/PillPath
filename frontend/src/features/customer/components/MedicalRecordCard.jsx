import React from "react";
import { Trash2 } from "lucide-react";

const MedicalRecordCard = ({ 
  id,
  conditionName, 
  lastUpdated, 
  onDelete,
  onClick 
}) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent card click when delete button is clicked
    onDelete();
  };

  return (
    <div 
      className="bg-white/50 rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all w-[1000px] duration-200 cursor-pointer hover:bg-white/60 hover:scale-[1.02]"
      onClick={() => onClick(id)}
    >
      <div className="flex items-center justify-center">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {conditionName}
          </h3>
          <p className="text-sm font-poppins text-gray-700">
            Last updated: {lastUpdated}
          </p>
        </div>
        
        <button
          onClick={handleDeleteClick}
          className="text-red-400 hover:text-red-600 transition-colors duration-200 p-2 hover:bg-red-50 rounded-full"
          title="Delete record"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default MedicalRecordCard;
