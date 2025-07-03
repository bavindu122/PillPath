import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Camera, Check, ChevronRight, MapPin, Clock, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Star from "./Star";

const PrescriptionUploadModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Upload Options, 2: Preview, 3: Pharmacy Selection
  const [uploadMethod, setUploadMethod] = useState(null); // "device" or "camera"
  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Example pharmacy data - would be fetched from API in real application
  const nearbyPharmacies = [
    { id: 1, name: "HealthFirst Pharmacy", address: "123 Medical Lane, Colombo", distance: "0.8", rating: 4.8, deliveryTime: "30-45" },
    { id: 2, name: "MediCare Plus", address: "45 Wellness Road, Colombo", distance: "1.2", rating: 4.7, deliveryTime: "20-30" },
    { id: 3, name: "Family Care Pharmacy", address: "78 Health Street, Colombo", distance: "1.5", rating: 4.5, deliveryTime: "40-55" },
    { id: 4, name: "City Health Pharmacy", address: "120 Main Street, Colombo", distance: "2.2", rating: 4.3, deliveryTime: "35-50" },
  ];

  // Rest of state management and handlers remain the same...
  // Handle file upload, camera functions, close modal, etc.

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPrescriptionImage(event.target.result);
        setStep(2); // Move to preview step
      };
      reader.readAsDataURL(file);
    }
  };

  // Initialize camera
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please check permissions or use file upload instead.");
      setUploadMethod("device");
    }
  };

  // Capture image from camera
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageDataUrl = canvas.toDataURL("image/png");
      setPrescriptionImage(imageDataUrl);
      stopCamera();
      setStep(2); // Move to preview step
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setCameraActive(false);
  };

  // Handle close and cleanup
  const handleClose = () => {
    stopCamera();
    setStep(1);
    setUploadMethod(null);
    setPrescriptionImage(null);
    setSelectedPharmacy(null);
    setNote("");
    onClose();
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!prescriptionImage || !selectedPharmacy) {
      alert("Please complete all required fields");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Prescription sent successfully to " + selectedPharmacy.name);
      handleClose();
    }, 1500);
  };

  // Close modal when clicking outside
  const modalContentRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-0">
      {/* Enhanced backdrop with blur */}
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm"></div>
      
      {/* Decorative elements for glassmorphic effect */}
      <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-3xl animate-float-gentle"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-3xl animate-float-delay"></div>
      <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse-slow"></div>
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden"
          ref={modalContentRef}
        >
          {/* Header - Kept outside scrollable area */}
          <div className="bg-gradient-to-r from-primary to-primary-hover p-5 flex justify-between items-center sticky top-0 z-30">
            <h3 className="text-xl font-bold text-white">Upload Prescription</h3>
            <button 
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Steps - Kept outside scrollable area */}
          <div className="px-6 pt-4 pb-2 bg-white/90 sticky top-16 z-20 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <Upload size={18} />
                </div>
                <div className={`text-sm font-medium ml-2 ${
                  step >= 1 ? 'text-primary' : 'text-gray-500'
                } hidden sm:block`}>Upload</div>
              </div>
              <div className={`flex-1 h-0.5 mx-2 ${
                step > 1 ? 'bg-primary' : 'bg-gray-200'
              }`}></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <Check size={18} />
                </div>
                <div className={`text-sm font-medium ml-2 ${
                  step >= 2 ? 'text-primary' : 'text-gray-500'
                } hidden sm:block`}>Preview</div>
              </div>
              <div className={`flex-1 h-0.5 mx-2 ${
                step > 2 ? 'bg-primary' : 'bg-gray-200'
              }`}></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <MapPin size={18} />
                </div>
                <div className={`text-sm font-medium ml-2 ${
                  step >= 3 ? 'text-primary' : 'text-gray-500'
                } hidden sm:block`}>Pharmacy</div>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto scrollbar-hide" style={{maxHeight: "calc(90vh - 130px)"}}>
            <div className="p-4 sm:p-6">
              {/* Step 1: Upload Options */}
              {step === 1 && (
                <div className="space-y-6">
                  <p className="text-center text-gray-700">
                    Please select how you'd like to upload your prescription
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 sm:p-8 border-2 rounded-xl flex flex-col items-center transition-all ${
                        uploadMethod === 'device' 
                          ? 'border-primary bg-white/70 shadow-lg' 
                          : 'border-white/50 bg-white/40 backdrop-blur-sm hover:border-primary/40 hover:bg-white/50'
                      }`}
                      onClick={() => {
                        setUploadMethod('device');
                        fileInputRef.current.click();
                      }}
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Upload size={28} className="text-primary" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">Upload from Device</h4>
                      <p className="text-sm text-gray-500 text-center">
                        Select a photo or scan from your device
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </motion.button>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 sm:p-8 border-2 rounded-xl flex flex-col items-center transition-all ${
                        uploadMethod === 'camera' 
                          ? 'border-primary bg-white/70 shadow-lg' 
                          : 'border-white/50 bg-white/40 backdrop-blur-sm hover:border-primary/40 hover:bg-white/50'
                      }`}
                      onClick={() => {
                        setUploadMethod('camera');
                        initializeCamera();
                      }}
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Camera size={28} className="text-primary" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">Take a Photo</h4>
                      <p className="text-sm text-gray-500 text-center">
                        Use your device's camera to capture your prescription
                      </p>
                    </motion.button>
                  </div>

                  {/* Camera View */}
                  {cameraActive && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 border-2 border-primary/50 rounded-lg p-2 relative bg-black/10 backdrop-blur-sm"
                    >
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        className="w-full rounded-lg" 
                        style={{ maxHeight: "400px" }}
                      />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={captureImage}
                          className="bg-primary hover:bg-primary-hover text-white p-3 rounded-full shadow-lg transition-colors"
                        >
                          <Camera size={24} />
                        </motion.button>
                      </div>
                      <canvas ref={canvasRef} className="hidden" />
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 2: Preview */}
              {step === 2 && (
                <div className="space-y-6">
                  <p className="text-center text-gray-700">
                    Please review your prescription
                  </p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white/50 backdrop-blur-sm">
                    {prescriptionImage && (
                      <div className="relative">
                        <img 
                          src={prescriptionImage} 
                          alt="Prescription" 
                          className="max-h-[400px] mx-auto rounded-lg shadow-md object-contain" 
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setStep(1);
                              setPrescriptionImage(null);
                            }}
                            className="bg-white/90 hover:bg-white p-2 rounded-full shadow text-gray-700 hover:text-red-500 transition-colors"
                          >
                            <X size={18} />
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setStep(1);
                        setPrescriptionImage(null);
                      }}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-white/70 transition-all bg-white/50 backdrop-blur-sm"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setStep(3)}
                      className="px-6 py-3 bg-gradient-to-r from-primary to-primary-hover text-white rounded-lg shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <span>Continue</span>
                      <ChevronRight size={16} />
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Step 3: Pharmacy Selection */}
              {step === 3 && (
                <div className="space-y-6">
                  <p className="text-center text-gray-700">
                    Select a pharmacy to send your prescription to
                  </p>

                  <div className="space-y-4">
                    {nearbyPharmacies.map((pharmacy) => (
                      <motion.div 
                        key={pharmacy.id}
                        whileHover={{ scale: 1.01 }}
                        className={`border rounded-xl p-4 transition-all cursor-pointer ${
                          selectedPharmacy?.id === pharmacy.id 
                            ? 'border-primary/50 bg-white/70 shadow-md' 
                            : 'border-white/50 bg-white/40 hover:border-primary/30 hover:bg-white/50 backdrop-blur-sm'
                        }`}
                        onClick={() => setSelectedPharmacy(pharmacy)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-lg">{pharmacy.name}</h4>
                            <p className="text-sm text-gray-500">{pharmacy.address}</p>
                            <div className="flex flex-wrap gap-4 mt-2">
                              <div className="flex items-center text-sm">
                                <MapPin size={14} className="text-secondary mr-1" />
                                <span>{pharmacy.distance} km</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock size={14} className="text-primary mr-1" />
                                <span>{pharmacy.deliveryTime} mins</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Star size={14} className="text-yellow-500 mr-1 fill-yellow-500" />
                                <span>{pharmacy.rating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedPharmacy?.id === pharmacy.id
                                ? 'border-primary bg-primary text-white'
                                : 'border-gray-300'
                            }`}>
                              {selectedPharmacy?.id === pharmacy.id && (
                                <Check size={14} />
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="border border-dashed border-gray-300 rounded-xl p-4 hover:border-primary/30 hover:bg-white/50 flex items-center justify-center gap-2 cursor-pointer bg-white/30 backdrop-blur-sm"
                    >
                      <PlusCircle size={18} className="text-gray-400" />
                      <span className="text-gray-500">Add Another Pharmacy</span>
                    </motion.div>
                  </div>

                  {selectedPharmacy && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/50"
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes (optional)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add any special instructions for the pharmacist..."
                        className="w-full border border-gray-200 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary bg-white/80"
                        rows={3}
                      />
                    </motion.div>
                  )}

                  <div className="flex justify-between pt-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setStep(2)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-white/70 transition-all bg-white/50 backdrop-blur-sm"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={!isLoading && selectedPharmacy ? { scale: 1.03 } : {}}
                      whileTap={!isLoading && selectedPharmacy ? { scale: 0.97 } : {}}
                      onClick={handleSubmit}
                      disabled={!selectedPharmacy || isLoading}
                      className={`px-6 py-3 bg-gradient-to-r from-primary to-primary-hover text-white rounded-lg shadow-md hover:shadow-lg flex items-center gap-2 ${
                        !selectedPharmacy || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <span>Sending...</span>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </>
                      ) : (
                        <>
                          <span>Send Prescription</span>
                          <ChevronRight size={16} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PrescriptionUploadModal;