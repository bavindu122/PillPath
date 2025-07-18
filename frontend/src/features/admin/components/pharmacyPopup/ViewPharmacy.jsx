import React from 'react';
import { FileText } from 'lucide-react';

const ViewPharmacy = ({ pharmacy, onClose ,onAcceptRegistration }) => {
  if (!pharmacy) return null;

  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Pharmacy Details</h2> 
        <div className="space-y-2 text-gray-700 text-sm">
          <p><strong>Name:</strong> {pharmacy.name}</p>
          <p><strong>Email:</strong> {pharmacy.email}</p>
          <p><strong>Phone:</strong> {pharmacy.phone}</p>
          <p><strong>Location:</strong> {pharmacy.location}</p>
          <p><strong>License:</strong> {pharmacy.license}</p>
          <p><strong>Join Date:</strong> {pharmacy.joinDate}</p>
          <p><strong>Status:</strong> {pharmacy.status}</p>
          <p><strong>Orders:</strong> {pharmacy.orders}</p>
          <p><strong>Rating:</strong> {pharmacy.rating}</p>
          {pharmacy.status === 'Suspended' && (
            <p><strong className="text-red-600">Suspend Reason:</strong> {pharmacy.suspendReason}</p>
          )}
          <p className="flex items-center text-gray-600">
            <FileText className="mr-2 h-4 w-4" /> Attached Documents:
          </p>

          <ul className="list-disc pl-6 text-blue-600">
            <li><a href="#" target="_blank" rel="noreferrer">Business License.pdf</a></li>
            <li><a href="#" target="_blank" rel="noreferrer">Pharmacist Certificate.jpg</a></li>
          </ul>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          {pharmacy.status === 'Pending' && (
            <button 
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            onClick={() => onAcceptRegistration(pharmacy)} >
              Accept Registration
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPharmacy;
