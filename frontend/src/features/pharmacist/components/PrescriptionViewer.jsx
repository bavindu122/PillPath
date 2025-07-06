import React, { useState } from 'react';
import { Download, ZoomIn, ZoomOut, RotateCw, AlertTriangle } from 'lucide-react';

const PrescriptionViewer = ({ prescription }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleDownload = () => {
    console.log('Downloading prescription');
  };

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              Prescription Review
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Patient: {prescription?.patientName || 'Loading...'} | Order #PX-{prescription?.id || '000'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
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
              onClick={handleDownload}
              className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm">Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionViewer;