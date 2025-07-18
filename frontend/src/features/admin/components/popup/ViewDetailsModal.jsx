import React from 'react';
import ModalWrapper from './ModalWrapper';

const ViewDetailsModal = ({ user, onClose }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <h3 className="text-2xl font-bold text-blue-800 mb-4">Customer Details</h3>
      <div className="space-y-2 text-gray-700">
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
                <p><strong className='text-red-600'>Suspend Reason:</strong> {user.suspendReason}</p>
              )}
      </div>
    </ModalWrapper>
  );
};

export default ViewDetailsModal;