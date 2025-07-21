import React from 'react';
import { FileText, UserCheck,User,ChevronRight,ChevronLeft,Store } from 'lucide-react';
import { useState } from 'react';

const ViewPharmacy = ({ pharmacy, onClose ,onAcceptRegistration ,onRejectRegistration}) => {
  if (!pharmacy) return null;

  const [currentPage, setCurrentPage] = useState(0);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleRejectConfirm = () => {
    onRejectRegistration(pharmacy, rejectReason);
    setRejectReason('');
    setShowRejectPopup(false);
  };

  const pages= [
    { title: 'Pharmacy Details', icon: Store },
    { title: 'Pharmacist Details', icon: UserCheck },
    { title: 'License and Documents', icon: FileText },
    
  ];

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPharmacyDetails = () => (
    <div className="space-y-2 text-gray-700 text-sm">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
          {pharmacy.image ? (
                    <img 
                      src={pharmacy.image} 
                      alt={pharmacy.name}
                      className="w-16 h-16 rounded-full object-cover shadow-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shadow-md ${pharmacy.image ? 'hidden' : 'flex'}`}
                  >
                    <Store className="text-gray-500" />
                  </div>
        </div>
        <div>
          <h3 className="font-semibold text-lg">{pharmacy.name }</h3>
          <p className="text-gray-500">{pharmacy.status} Pharmacy</p>
        </div>
      </div>
          <p><strong>Name:</strong> {pharmacy.name}</p>
          {pharmacy.tradingName && (
            <p><strong>Trading Name:</strong> {pharmacy.tradingName}</p>
          )}
          <p><strong>Email:</strong> {pharmacy.email}</p>
          <p><strong>Phone:</strong> {pharmacy.phone}</p>
          <p><strong>Location:</strong> {pharmacy.location}</p>
          
          
          <p><strong>Owner:</strong> {pharmacy.owner}</p>
          {pharmacy.websiteLink && (
            <p>
              <strong>Website:</strong> 
              <a href={pharmacy.websiteLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                {pharmacy.websiteLink}
              </a>
            </p>
          )}
          <p><strong>Join Date:</strong> {pharmacy.joinDate}</p>
          <p><strong>Status:</strong> {pharmacy.status}</p>
          <p><strong>Orders:</strong> {pharmacy.orders}</p>
          <p><strong>Rating:</strong> {pharmacy.rating}</p>
          {pharmacy.status === 'Suspended' && (
            <p><strong className="text-red-600">Suspend Reason:</strong> {pharmacy.suspendReason}</p>
          )}
          {pharmacy.status === 'Rejected' && (
            <p><strong className="text-red-600">Reject Reason:</strong> {pharmacy.rejectReason}</p>
          )}
          

          
        </div>
      
  );

  const renderPharmacistDetails = () => (
    <div className="space-y-2 text-gray-700 text-sm">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
          <UserCheck className="w-8 h-8 text-gray-500" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{pharmacy.pharmacist }</h3>
          <p className="text-gray-500">Licensed Pharmacist</p>
        </div>
      </div>
      
      <p><strong>Full Name:</strong> {pharmacy.pharmacist}</p>
      <p><strong>SLMC Registration Number:</strong> {pharmacy.pharmacistLicense }</p>
      <p><strong>Phone:</strong> {pharmacy.pharmacistContact }</p>
      {pharmacy.secondaryPharmacist && (
        <p><strong>Secondary Pharmacist:</strong> {pharmacy.secondaryPharmacist}</p>
      )}


    </div>
  );

  const renderLicenseAndDocuments = () => (
    <div className="space-y-2 text-gray-700 text-sm">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
          <FileText className="w-8 h-8 text-gray-500" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">License and Documents</h3>
          
        </div>
      </div>
      
      <p><strong>NMRA License:</strong> {pharmacy.license}</p>
      <p><strong>Issue Date:</strong> {pharmacy.issueDate }</p>
      <p><strong>Expiry Date:</strong> {pharmacy.licenseExpiry }</p>
      <p><strong>Business Registration Number:</strong> {pharmacy.businessRegistration}</p>
      {pharmacy.secondaryPharmacist && (
        <p><strong>Secondary Pharmacist:</strong> {pharmacy.secondaryPharmacist}</p>
      )}

      <p className="flex items-center text-gray-600">
            <FileText className="mr-2 h-4 w-4" /> Attached Documents:
      </p>

      <ul className="list-disc pl-6 text-blue-600">
            <li><a href="#" target="_blank" rel="noreferrer">Business License.pdf</a></li>
            <li><a href="#" target="_blank" rel="noreferrer">Pharmacist Certificate.jpg</a></li>
            <li><a href="#" target="_blank" rel="noreferrer">Business License.pdf</a></li>
      </ul>
    </div>

  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 0:
        return renderPharmacyDetails();
      case 1:
        return renderPharmacistDetails();
      case 2:
        return renderLicenseAndDocuments();
      default:
        return renderPharmacyDetails();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        {/* Header with page indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {React.createElement(pages[currentPage].icon, { className: "w-5 h-5 mr-2 text-gray-600" })}
            <h2 className="text-xl font-bold text-gray-800">{pages[currentPage].title}</h2>
          </div>
          <div className="flex space-x-1">
            {pages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentPage ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {renderCurrentPage()}
        </div>

        {/* Navigation and Action Buttons */}
        <div className="mt-6 flex justify-between items-center">
          {/* Navigation Arrows */}
          <div className="flex space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`flex items-center px-1 py-1 rounded-md text-sm ${
                currentPage === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              
            </button>
            
            <button
              onClick={nextPage}
              disabled={currentPage === pages.length - 1}
              className={`flex items-center px-1 py-1 rounded-md text-sm ${
                currentPage === pages.length - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
           
              {pharmacy.status === 'Pending' && currentPage === 0 && (
              <>
                <button onClick={() => onAcceptRegistration(pharmacy)} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Accept</button>
                <button onClick={() => setShowRejectPopup(true)} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Reject</button>
              </>
            )}
           
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>

        {/* Reject Reason Popup */}
        {showRejectPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Reject Pharmacy Registration</h2>
              <textarea
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button onClick={handleRejectConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Confirm Reject</button>
                <button onClick={() => setShowRejectPopup(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ViewPharmacy;
