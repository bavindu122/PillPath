import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Camera,
  Check,
  ChevronRight,
  MapPin,
  Clock,
  PlusCircle,
  Search,
  Navigation,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Star from "./Star";

const PrescriptionUploadModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [uploadMethod, setUploadMethod] = useState(null);
  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFindPharmacy = () => {
    // Pass prescription data and modal state to FindPharmacy page
    const prescriptionData = {
      image: prescriptionImage,
      note: note,
      uploadMethod: uploadMethod
    };
    
    // Store prescription data in sessionStorage for retrieval
    sessionStorage.setItem('prescriptionData', JSON.stringify(prescriptionData));
    
    // Navigate to FindPharmacy with special parameter indicating it's from prescription upload
    navigate("/find-pharmacy?from=prescription-upload");
    handleClose();
  };

  // Example pharmacy data - would be fetched from API in real application
  const nearbyPharmacies = [
    {
      id: 1,
      name: "HealthFirst Pharmacy",
      address: "123 Medical Lane, Colombo",
      distance: "0.8",
      rating: 4.8,
      deliveryTime: "30-45",
    },
    {
      id: 2,
      name: "MediCare Plus",
      address: "45 Wellness Road, Colombo",
      distance: "1.2",
      rating: 4.7,
      deliveryTime: "20-30",
    },
    {
      id: 3,
      name: "Family Care Pharmacy",
      address: "78 Health Street, Colombo",
      distance: "1.5",
      rating: 4.5,
      deliveryTime: "40-55",
    },
    {
      id: 4,
      name: "City Health Pharmacy",
      address: "120 Main Street, Colombo",
      distance: "2.2",
      rating: 4.3,
      deliveryTime: "35-50",
    },
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
      mediaStream.getTracks().forEach((track) => track.stop());
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
      alert("Please upload a prescription and select a pharmacy.");
      return;
    }
    
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Prescription sent successfully to " + selectedPharmacy.name);
      navigate("/customer/activities");
      handleClose();
    }, 1500);
  };

  // Close modal when clicking outside
  const modalContentRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target)
      ) {
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
          <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 p-5 flex justify-between items-center sticky top-0 z-30">
            <h3 className="text-xl font-bold text-white">
              Upload Prescription
            </h3>
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
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Upload size={18} />
                </div>
                <div
                  className={`text-sm font-medium ml-2 ${
                    step >= 1 ? "text-primary" : "text-gray-500"
                  } hidden sm:block`}
                >
                  Upload
                </div>
              </div>
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  step > 1 ? "bg-primary" : "bg-gray-200"
                }`}
              ></div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Check size={18} />
                </div>
                <div
                  className={`text-sm font-medium ml-2 ${
                    step >= 2 ? "text-primary" : "text-gray-500"
                  } hidden sm:block`}
                >
                  Preview
                </div>
              </div>
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  step > 2 ? "bg-primary" : "bg-gray-200"
                }`}
              ></div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 3
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <MapPin size={18} />
                </div>
                <div
                  className={`text-sm font-medium ml-2 ${
                    step >= 3 ? "text-primary" : "text-gray-500"
                  } hidden sm:block`}
                >
                  Pharmacy
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div
            className="flex-1 overflow-y-auto scrollbar-hide"
            style={{ maxHeight: "calc(90vh - 130px)" }}
          >
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
                        uploadMethod === "device"
                          ? "border-primary bg-white/70 shadow-lg"
                          : "border-white/50 bg-white/40 backdrop-blur-sm hover:border-primary/40 hover:bg-white/50"
                      }`}
                      onClick={() => {
                        setUploadMethod("device");
                        fileInputRef.current.click();
                      }}
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Upload size={28} className="text-primary" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">
                        Upload from Device
                      </h4>
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
                        uploadMethod === "camera"
                          ? "border-primary bg-white/70 shadow-lg"
                          : "border-white/50 bg-white/40 backdrop-blur-sm hover:border-primary/40 hover:bg-white/50"
                      }`}
                      onClick={() => {
                        setUploadMethod("camera");
                        initializeCamera();
                      }}
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Camera size={28} className="text-primary" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">
                        Take a Photo
                      </h4>
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
                  <div className="text-center">
                    <p className="text-gray-700 mb-4">
                      Select a pharmacy to send your prescription to
                    </p>
                    <div className="flex items-center justify-center mb-4">
                      {/* Find Pharmacy Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleFindPharmacy}
                        className="w-full sm:w-auto mb-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                      >
                        <Navigation size={18} />
                        <span className="font-medium">
                          Find Pharmacy Near You
                        </span>
                        <Search size={16} />
                      </motion.button>
                    </div>
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <div className="h-px bg-gray-300 flex-1"></div>
                      <span className="text-sm text-gray-500 px-3">
                        Or choose from recent & nearby
                      </span>
                      <div className="h-px bg-gray-300 flex-1"></div>
                    </div>
                  </div>

                  {/* Recent & Nearby Pharmacies Section */}
                  <div className="space-y-4">
                    {/* Section Header */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <MapPin size={18} className="text-blue-500" />
                        Recent & Nearby Pharmacies
                      </h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {nearbyPharmacies.length} available
                      </span>
                    </div>

                    {/* Pharmacy List */}
                    <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
                      {nearbyPharmacies.map((pharmacy, index) => (
                        <motion.div
                          key={pharmacy.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.01 }}
                          className={`border rounded-xl p-4 transition-all cursor-pointer ${
                            selectedPharmacy?.id === pharmacy.id
                              ? "border-primary/50 bg-white/90 shadow-lg ring-2 ring-primary/20"
                              : "border-white/50 bg-white/40 hover:border-primary/30 hover:bg-white/60 backdrop-blur-sm"
                          }`}
                          onClick={() => setSelectedPharmacy(pharmacy)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-lg text-gray-800">
                                  {pharmacy.name}
                                </h4>
                                {pharmacy.distance <= 1 && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    Nearby
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                {pharmacy.address}
                              </p>

                              {/* Pharmacy Info Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="flex items-center text-sm bg-white/50 rounded-lg px-2 py-1">
                                  <MapPin
                                    size={14}
                                    className="text-blue-500 mr-2"
                                  />
                                  <span className="text-gray-700">
                                    {pharmacy.distance} km
                                  </span>
                                </div>
                                <div className="flex items-center text-sm bg-white/50 rounded-lg px-2 py-1">
                                  <Clock
                                    size={14}
                                    className="text-orange-500 mr-2"
                                  />
                                  <span className="text-gray-700">
                                    {pharmacy.deliveryTime} mins
                                  </span>
                                </div>
                                <div className="flex items-center text-sm bg-white/50 rounded-lg px-2 py-1">
                                  <Star
                                    size={14}
                                    className="text-yellow-500 mr-2 fill-yellow-500"
                                  />
                                  <span className="text-gray-700">
                                    {pharmacy.rating}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Selection Indicator */}
                            <div className="flex-shrink-0 ml-4">
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  selectedPharmacy?.id === pharmacy.id
                                    ? "border-primary bg-primary text-white shadow-lg"
                                    : "border-gray-300 hover:border-primary/50"
                                }`}
                              >
                                {selectedPharmacy?.id === pharmacy.id && (
                                  <Check size={14} />
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* View More Option */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      onClick={handleFindPharmacy}
                      className="w-full border border-dashed border-gray-300 rounded-xl p-4 hover:border-primary/40 hover:bg-white/60 flex items-center justify-center gap-2 cursor-pointer bg-white/30 backdrop-blur-sm transition-all"
                    >
                      <Search size={18} className="text-gray-500" />
                      <span className="text-gray-600 font-medium">
                        View More Pharmacies
                      </span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </motion.button>
                  </div>

                  {/* Selected Pharmacy Summary */}
                  {selectedPharmacy && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-primary/10 to-blue-50 border border-primary/20 rounded-xl p-4"
                    >
                      <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Check size={16} className="text-primary" />
                        Selected Pharmacy
                      </h5>
                      <div className="text-sm text-gray-700">
                        <div className="font-medium">
                          {selectedPharmacy.name}
                        </div>
                        <div className="text-gray-600">
                          {selectedPharmacy.address}
                        </div>
                        <div className="flex gap-4 mt-1 text-xs">
                          <span>📍 {selectedPharmacy.distance} km away</span>
                          <span>
                            ⏱️ {selectedPharmacy.deliveryTime} min delivery
                          </span>
                          <span>⭐ {selectedPharmacy.rating} rating</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Additional Notes */}
                  {selectedPharmacy && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/50"
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes (optional)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add any special instructions for the pharmacist..."
                        className="w-full border border-gray-200 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary bg-white/90 transition-all"
                        rows={3}
                      />
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setStep(2)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-white/70 transition-all bg-white/50 backdrop-blur-sm order-2 sm:order-1"
                    >
                      Back to Preview
                    </motion.button>
                    <motion.button
                      whileHover={
                        !isLoading && selectedPharmacy ? { scale: 1.03 } : {}
                      }
                      whileTap={
                        !isLoading && selectedPharmacy ? { scale: 0.97 } : {}
                      }
                      onClick={handleSubmit}
                      disabled={!selectedPharmacy || isLoading}
                      className={`px-6 py-3 bg-gradient-to-r from-primary to-primary-hover text-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2 order-1 sm:order-2 ${
                        !selectedPharmacy || isLoading
                          ? "opacity-50 cursor-not-allowed"
                          : ""
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
