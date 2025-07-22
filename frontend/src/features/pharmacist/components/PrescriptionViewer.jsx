import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, ZoomIn, ZoomOut, RotateCw, AlertTriangle, X } from 'lucide-react';
import '../pages/index-pharmacist.css';

const PrescriptionViewer = ({ prescription }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleDownload = () => {
    console.log('Downloading prescription');
  };

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleViewFullSize = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="pharma-bg-card rounded-xl shadow-lg border pharma-border overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold pharma-text-dark flex items-center">
                Prescription Review
              </h2>
              <p className="text-sm pharma-text-gray-600 mt-1">
                Patient: {prescription?.patientName || 'Loading...'} | Order #PX-{prescription?.id || '000'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium pharma-text-warning" style={{ backgroundColor: 'rgba(255, 167, 38, 0.1)' }}>
                <AlertTriangle className="h-4 w-4" />
                <span>Pending Review</span>
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
                    src="/src/assets/img/prescription.jpeg" 
                    alt="Historical Prescription Document from 1925"
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
                onClick={handleDownload}
                className="flex items-center space-x-1 px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">Download</span>
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

export default PrescriptionViewer;