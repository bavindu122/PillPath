import React from 'react'
import ModalWrapper from '../popup/ModalWrapper'

const ActivePharmacy = ({ pharmacy, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Activate Pharmacy</h2>
        <p className="mb-2">Are you sure you want to activate <strong>{pharmacy.name}</strong>?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivePharmacy
