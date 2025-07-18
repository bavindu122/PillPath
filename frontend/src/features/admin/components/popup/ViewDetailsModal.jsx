import React from 'react';
import { User } from 'lucide-react';
import ModalWrapper from './ModalWrapper';

const ViewDetailsModal = ({ user, onClose }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <h3 className="text-2xl font-bold text-blue-800 mb-4">Customer Details</h3>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Left: User Details */}
        <div className="space-y-2 text-gray-700 flex-1">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Status:</strong> {user.status}</p>
          <p><strong>Joined:</strong> {user.joinDate}</p>
          <p><strong>Last Login:</strong> {user.lastLogin}</p>
          <p><strong>Prescriptions:</strong> {user.prescriptions}</p>
          <p><strong>Orders:</strong> {user.orders}</p>
          {user.status === 'Loyalty' && (
            <p><strong>Loyalty Points:</strong> {user.loyaltyPoints}</p>
          )}
          {user.status === 'Suspended' && (
            <p><strong className="text-red-600">Suspend Reason:</strong> {user.suspendReason}</p>
          )}
        </div>

        {/* Right: Profile Picture */}
        <div className="w-25 h-25 rounded-full overflow-hidden shadow border border-gray-300">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <User size={34} className="text-gray-500" />
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ViewDetailsModal;
