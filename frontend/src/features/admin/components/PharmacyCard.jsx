import React from 'react';
import { Mail, Phone, MapPin, Eye, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import SuspendPharmacy from './pharmacyPopup/SuspendPharmacy';
import ActivePharmacy from './pharmacyPopup/ActivePharmacy';
import ViewPharmacy from './pharmacyPopup/ViewPharmacy';


const PharmacyCard = ({ pharmacy, onSuspend, onActivate,onAcceptRegistration, onRejectRegistration }) => {

    const [suspendPopup, setSuspendPopup] = useState(null);
    const [suspendReason, setSuspendReason] = useState('');
    const [activatePopup, setActivatePopup] = useState(null);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);

    const handleSuspendConfirm = () => {
        onSuspend(suspendPopup, suspendReason);
        setSuspendPopup(null);
        setSuspendReason('');
    };

    const handleActivateConfirm = () => {
        onActivate(activatePopup);
        setActivatePopup(null);
    };


  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
      case 'Suspended':
        return <div className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Suspended</div>;
      case 'Pending':
        return <div className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</div>;
      default:
        return <div className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</div>;
    }
  };

  const getRatingStars = (rating) => {
    if (rating === 0) return <span className="text-gray-400">Not rated</span>;
    return (
      <div className="flex items-center">
        <span className="text-yellow-400">★</span>
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    );
  };

  return (
    <div className="hover:shadow-lg transition-shadow rounded-2xl border-gray-300 border p-6 bg-white">
      <div className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg">{pharmacy.name}</div>
            <p className="text-sm text-gray-500 mt-1">{pharmacy.license}</p>
          </div>
          {getStatusBadge(pharmacy.status)}
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            {pharmacy.email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            {pharmacy.phone}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {pharmacy.location}
          </div>
          
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-300">
          <div>
            <p className="text-sm font-medium">{pharmacy.orders} orders</p>
            {getRatingStars(pharmacy.rating)}
          </div>
          <div className="flex space-x-2">
            <button
                      onClick={() => setSelectedPharmacy(pharmacy)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {pharmacy.status === 'Suspended' ? (
                      <button
                        className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-100 transition-colors"
                        title="Activate Pharmacy"
                        onClick={() => setActivatePopup(pharmacy)}
                      >
                        <UserPlus size={18} />
                      </button>
                    ) : pharmacy.status === 'Active' ? (
                      <button
                        onClick={() => setSuspendPopup(pharmacy)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                        title="Suspend Pharmacy"
                      >
                        <Trash2 size={18} />
                      </button>
                    ):null}

          </div>

          
        </div>
      </div>

      {selectedPharmacy && (
        <ViewPharmacy pharmacy={selectedPharmacy} 
        onClose={() => setSelectedPharmacy(null)} 
        onAcceptRegistration={(pharmacy) => {
            onAcceptRegistration(pharmacy);
            setSelectedPharmacy(null);  // ← This closes the popup
        }}
        onRejectRegistration={(pharmacy, reason) => {
            onRejectRegistration(pharmacy, reason);
            setSelectedPharmacy(null);  // ← This closes the popup
        }}
    />
)}

      {suspendPopup && (
            <SuspendPharmacy
                pharmacy={suspendPopup}
                reason={suspendReason}
                setReason={setSuspendReason}
                onCancel={() => setSuspendPopup(null)}
                onConfirm={handleSuspendConfirm}
            />
            )}

        {activatePopup && (
            <ActivePharmacy
                pharmacy={activatePopup}
                onCancel={() => setActivatePopup(null)}
                onConfirm={handleActivateConfirm}
            />
            )}

    </div>
  );
};

export default PharmacyCard;
