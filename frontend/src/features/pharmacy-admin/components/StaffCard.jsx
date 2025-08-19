import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

const StaffCard = ({ staff, onEdit, onDelete, loading }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Profile Section */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          {staff.profilePictureUrl ? (
            <img
              src={staff.profilePictureUrl}
              alt={`${staff.fullName}'s profile`}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl shadow">
              {staff.fullName.charAt(0)}
            </div>
          )}
          {/* Status Indicator */}
          <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white ${
            staff.isActive ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
        </div>
      </div>

      {/* Staff Information */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{staff.fullName}</h3>
        <p className="text-sm text-gray-500 mb-1">{staff.email}</p>
        {staff.phoneNumber && (
          <p className="text-sm text-gray-500 mb-1">{staff.phoneNumber}</p>
        )}
        {staff.specialization && (
          <p className="text-sm text-blue-600 font-medium">{staff.specialization}</p>
        )}
        {staff.licenseNumber && (
          <p className="text-xs text-gray-400">License: {staff.licenseNumber}</p>
        )}
        {staff.yearsOfExperience && (
          <p className="text-xs text-gray-400 mt-1">
            {staff.yearsOfExperience} years experience
          </p>
        )}
        {staff.shiftSchedule && (
          <p className="text-xs text-gray-400">{staff.shiftSchedule}</p>
        )}
      </div>

      {/* Employment Status */}
      <div className="text-center mb-4">
        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
          staff.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {staff.isActive ? 'Active' : 'Inactive'}
        </span>
        {staff.employmentStatus && (
          <span className={`ml-2 inline-block px-3 py-1 text-xs font-medium rounded-full ${
            staff.employmentStatus === 'ACTIVE' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {staff.employmentStatus}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-3">
        <button
          onClick={() => onEdit(staff)}
          className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"
          disabled={loading}
        >
          <div className="flex items-center">
            <Edit3 className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Edit</span>
          </div>
        </button>
        <button
          onClick={() => onDelete(staff.id)}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
          disabled={loading}
        >
          <div className="flex items-center">
            <Trash2 className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Delete</span>
          </div>
        </button>
      </div>

      {/* Additional Info */}
      {(staff.hireDate || staff.isVerified !== undefined) && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 space-y-1">
            {staff.hireDate && (
              <p>Hired: {new Date(staff.hireDate).toLocaleDateString()}</p>
            )}
            {staff.isVerified !== undefined && (
              <p className={staff.isVerified ? 'text-green-600' : 'text-orange-600'}>
                {staff.isVerified ? '✓ Verified' : '⏳ Pending Verification'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffCard;
