import React from "react";
import { Trash2 } from "lucide-react";

const MedicalRecordCard = ({ 
  conditionName, 
  lastUpdated, 
  onDelete 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {conditionName}
          </h3>
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated}
          </p>
        </div>
        
        <button
          onClick={onDelete}
          className="text-red-400 hover:text-red-600 transition-colors duration-200 p-2 hover:bg-red-50 rounded-full"
          title="Delete record"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default MedicalRecordCard;
