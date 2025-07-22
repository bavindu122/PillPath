import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  FileText,
  Calendar,
  User,
  CheckCircle,
  RotateCw,
  X
} from 'lucide-react';
import '../pages/index-pharmacist.css';

const CompletedOrderViewer = ({ orderData, onPrint, onExportPDF }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showModal, setShowModal] = useState(false);

  if (!orderData) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 pharma-bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 pharma-bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 pharma-bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    console.log('Downloading prescription image');
    // Implement download functionality
  };

  const handleViewFullSize = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Completed Order Review</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Order: {orderData.orderNumber} | Patient: {orderData.patientName}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                <span>{orderData.status}</span>
              </div>
            </div>
          </div>

          {/* Order Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Patient</p>
                <p className="font-medium text-gray-800">{orderData.patientName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Completed</p>
                <p className="font-medium text-gray-800">{orderData.dateCompleted}</p>
              </div>
            </div>
          </div>
          
          {/* Prescription Document Viewer */}
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
            <div className="relative">
              <div className="bg-white rounded border shadow-sm p-4">
                {/* Prescription Image */}
                <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <img 
                    src={orderData.prescriptionImageUrl || '/src/assets/img/placeholder.jpeg'} 
                    className="object-contain transition-all duration-300 ease-in-out"
                    style={{ 
                      maxHeight: isZoomed ? '600px' : '400px',
                      transform: `rotate(${rotation}deg) ${isZoomed ? 'scale(1.2)' : 'scale(1)'}`,
                      transformOrigin: 'center'
                    }}
                  />
                </div>
              </div>
            </div>
            
                        {/* Action buttons */}
            <div className="mt-4 flex justify-center space-x-3">
              <button
                onClick={handleRotate}
                className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <RotateCw className="h-4 w-4" />
                <span className="text-sm">Rotate</span>
              </button>
              <button
                onClick={handleZoom}
                className="flex items-center space-x-1 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                <span className="text-sm">{isZoomed ? 'Zoom Out' : 'Zoom In'}</span>
              </button>
              <button
                onClick={handleViewFullSize}
                className="flex items-center space-x-1 px-4 py-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors duration-200"
              >
                <ZoomIn className="h-4 w-4" />
                <span className="text-sm">Full Size</span>
              </button>
              <button
                onClick={onExportPDF ? onExportPDF : undefined}
                className={`flex items-center space-x-1 px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200 ${!onExportPDF ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!onExportPDF}
                title={!onExportPDF ? "Export PDF is not available" : undefined}
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">Export PDF</span>
              </button>
              <button
                onClick={onPrint}
                className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Printer className="h-4 w-4" />
                <span className="text-sm">Print Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Size Modal - Using Portal to render at document body level */}
      {showModal && createPortal(
  <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] mx-4 overflow-hidden">
      {/* Modal Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Prescription Document</h3>
        <button
          onClick={handleCloseModal}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      {/* Modal Content */}
      <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
        <div className="flex items-center justify-center">
          <img 
            src="/src/assets/img/prescription.jpeg" 
            alt="Zoomed Prescription"
            className="w-full h-auto max-w-none"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center'
            }}
          />
        </div>
      </div>
    </div>
  </div>,
  document.body
)}
    </>
  );
};

export default CompletedOrderViewer;
