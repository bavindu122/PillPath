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
import { ScrollContainer } from "../../components/UIs";
import { useAuth } from "../../hooks/useAuth";
import PrescriptionService from "../../services/api/PrescriptionService";
import PharmacyService from "../../services/api/PharmacyService";

const PrescriptionUploadModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [uploadMethod, setUploadMethod] = useState(null);
  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [selectedPharmacies, setSelectedPharmacies] = useState([]);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuth();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
  const [pharmLoading, setPharmLoading] = useState(false);
  const [pharmError, setPharmError] = useState(null);

  const handleFindPharmacy = () => {
    // Pass prescription data and modal state to FindPharmacy page
    const prescriptionData = {
      image: prescriptionImage,
      note: note,
      uploadMethod: uploadMethod,
    };

    // Store prescription data in sessionStorage for retrieval
    sessionStorage.setItem(
      "prescriptionData",
      JSON.stringify(prescriptionData)
    );

    // Persist any selections made in the modal so FindPharmacy can restore
    try {
      sessionStorage.setItem(
        "findPharmacyState",
        JSON.stringify({ selectedPharmacies })
      );
    } catch {}

    // Navigate to FindPharmacy with special parameter indicating it's from prescription upload
    navigate("/find-pharmacy?from=prescription-upload");
    handleClose();
  };

  // Helper to compute distance between two lat/lng points in km
  const computeDistanceKm = (lat1, lon1, lat2, lon2) => {
    if ([lat1, lon1, lat2, lon2].some((v) => v === null || v === undefined))
      return null;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Estimate delivery time label by distance (simple heuristic)
  const estimateDeliveryTime = (km) => {
    if (km == null) return "--";
    if (km <= 1) return "20-30";
    if (km <= 2) return "30-45";
    if (km <= 5) return "35-60";
    return "45-75";
  };

  // Get user location and load nearby pharmacies when modal opens
  useEffect(() => {
    const ensureLocationAndLoad = async () => {
      if (!isOpen) return;
      // Get current location (or fallback to Colombo)
      const fallback = {
        lat: 6.9271,
        lng: 79.8612,
        name: "Colombo, Sri Lanka",
      };
      const getLocation = () =>
        new Promise((resolve) => {
          if (!navigator.geolocation) return resolve(fallback);
          navigator.geolocation.getCurrentPosition(
            (pos) =>
              resolve({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                name: "Your Current Location",
              }),
            () => resolve(fallback),
            { enableHighAccuracy: true, timeout: 8000 }
          );
        });

      const loc = await getLocation();
      setCurrentLocation(loc);

      // Load pharmacies
      try {
        setPharmLoading(true);
        setPharmError(null);
        const resp = await PharmacyService.getPharmaciesForMap({
          userLat: loc.lat,
          userLng: loc.lng,
          radiusKm: 10,
        });
        const mapped = (resp || []).map((p) => {
          const lat = parseFloat(p.latitude ?? p.lat);
          const lng = parseFloat(p.longitude ?? p.lng);
          const dist = computeDistanceKm(loc.lat, loc.lng, lat, lng);
          return {
            id: p.id,
            name: p.name,
            address: p.address,
            distance: dist != null ? Number(dist.toFixed(1)) : null,
            rating: p.averageRating || p.rating || 0,
            deliveryTime: estimateDeliveryTime(dist),
          };
        });
        // Sort by distance
        mapped.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
        setNearbyPharmacies(mapped);
      } catch (e) {
        console.error("Failed to load nearby pharmacies for modal", e);
        setPharmError("Unable to load nearby pharmacies.");
        setNearbyPharmacies([]);
      } finally {
        setPharmLoading(false);
      }
    };

    ensureLocationAndLoad();
  }, [isOpen]);

  // Rest of state management and handlers remain the same...
  // Handle file upload, camera functions, close modal, etc.

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrescriptionFile(file);
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
      alert(
        "Unable to access camera. Please check permissions or use file upload instead."
      );
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
      // Convert dataURL to File for upload
      const byteString = atob(imageDataUrl.split(",")[1]);
      const mimeString = imageDataUrl.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], `prescription_${Date.now()}.png`, {
        type: mimeString,
      });
      setPrescriptionFile(file);
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
    setPrescriptionFile(null);
    setSelectedPharmacies([]);
    setNote("");
    onClose();
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!prescriptionImage || selectedPharmacies.length === 0) {
      alert("Please upload a prescription and select at least one pharmacy.");
      return;
    }
    if (!isAuthenticated || userType !== "customer") {
      // Redirect to login; preserve intent and data to resume in FindPharmacy
      try {
        const redirectPath = "/find-pharmacy?from=prescription-upload";
        const intent = {
          source: "prescription-modal",
          path: redirectPath,
          role: "customer",
          ts: Date.now(),
        };
        sessionStorage.setItem("postAuthRedirect", JSON.stringify(intent));

        const prescriptionData = {
          image: prescriptionImage,
          note: note,
          uploadMethod: uploadMethod,
        };
        sessionStorage.setItem(
          "prescriptionData",
          JSON.stringify(prescriptionData)
        );
        sessionStorage.setItem(
          "findPharmacyState",
          JSON.stringify({ selectedPharmacies })
        );
      } catch (e) {
        console.warn("Failed to persist pre-auth modal state", e);
      }

      navigate(`/login?redirect=${encodeURIComponent("/find-pharmacy")}`);
      return;
    }

    try {
      setIsLoading(true);
      // Ensure we have a File to upload. If missing (e.g., pasted data URL), convert
      let fileToUpload = prescriptionFile;
      if (!fileToUpload && prescriptionImage?.startsWith("data:")) {
        const byteString = atob(prescriptionImage.split(",")[1]);
        const mimeString = prescriptionImage
          .split(",")[0]
          .split(":")[1]
          .split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++)
          ia[i] = byteString.charCodeAt(i);
        const blob = new Blob([ab], { type: mimeString });
        fileToUpload = new File([blob], `prescription_${Date.now()}.png`, {
          type: mimeString,
        });
      }

      const ids = selectedPharmacies.map((p) => p.id);
      const meta = {
        ...(ids.length === 1 ? { pharmacyId: ids[0] } : {}),
        pharmacyIds: ids,
        note: note || undefined,
        source: "modal",
        latitude: currentLocation?.lat,
        longitude: currentLocation?.lng,
      };

      const res = await PrescriptionService.uploadPrescription(
        fileToUpload,
        meta
      );
      // Optional: if backend returns prescription id
      if (res?.prescription?.id) {
        // Navigate to order preview or activities
        navigate(`/order-preview/${res.prescription.id}`);
      } else {
        navigate("/customer/activities");
      }
      if (ids.length > 1) {
        alert(`Prescription sent successfully to ${ids.length} pharmacies`);
      } else {
        const only = selectedPharmacies[0];
        alert(`Prescription sent successfully to ${only?.name || "pharmacy"}`);
      }
      handleClose();
    } catch (err) {
      console.error("Prescription upload failed", err);
      alert(err?.message || "Failed to upload prescription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal when clicking outside
  const modalContentRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target) &&
        !isLoading // don't allow closing while uploading
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
  }, [isOpen, isLoading]);

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
          {isLoading && (
            <div className="absolute inset-0 z-40 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="w-14 h-14 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
              <div className="text-gray-700 font-medium">
                Uploading your prescription…
              </div>
              <div className="mt-2 text-gray-500 text-sm">
                Please wait, this may take a few seconds.
              </div>
            </div>
          )}
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
                    <ScrollContainer
                      maxHeight="320px"
                      scrollbarTheme="default"
                      scrollbarWidth="6px"
                      className="space-y-3"
                    >
                      {pharmLoading && (
                        <div className="flex items-center justify-center py-8 text-gray-600">
                          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-3"></div>
                          Loading nearby pharmacies…
                        </div>
                      )}
                      {!pharmLoading && pharmError && (
                        <div className="text-center py-6 text-red-600 text-sm">
                          {pharmError}
                        </div>
                      )}
                      {!pharmLoading &&
                        !pharmError &&
                        nearbyPharmacies.length === 0 && (
                          <div className="text-center py-6 text-gray-600 text-sm">
                            No nearby pharmacies found.
                          </div>
                        )}
                      {!pharmLoading &&
                        !pharmError &&
                        nearbyPharmacies.map((pharmacy, index) => (
                          <motion.div
                            key={pharmacy.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.01 }}
                            className={`border rounded-xl p-4 transition-all cursor-pointer ${
                              selectedPharmacies.some(
                                (p) => p.id === pharmacy.id
                              )
                                ? "border-primary/50 bg-white/90 shadow-lg ring-2 ring-primary/20"
                                : "border-white/50 bg-white/40 hover:border-primary/30 hover:bg-white/60 backdrop-blur-sm"
                            }`}
                            onClick={() =>
                              setSelectedPharmacies((prev) => {
                                const exists = prev.some(
                                  (p) => p.id === pharmacy.id
                                );
                                return exists
                                  ? prev.filter((p) => p.id !== pharmacy.id)
                                  : [...prev, pharmacy];
                              })
                            }
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-lg text-gray-800">
                                    <span
                                      className="notranslate"
                                      translate="no"
                                    >
                                      {pharmacy.name}
                                    </span>
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
                                  className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                                    selectedPharmacies.some(
                                      (p) => p.id === pharmacy.id
                                    )
                                      ? "bg-primary text-white shadow-lg"
                                      : "bg-white/60 border border-gray-300 hover:border-primary/50"
                                  }`}
                                >
                                  {selectedPharmacies.some(
                                    (p) => p.id === pharmacy.id
                                  ) && <Check size={14} />}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </ScrollContainer>

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

                  {/* Selected Pharmacies Summary */}
                  {selectedPharmacies.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-primary/10 to-blue-50 border border-primary/20 rounded-xl p-4"
                    >
                      <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Check size={16} className="text-primary" />
                        Selected{" "}
                        {selectedPharmacies.length > 1
                          ? "Pharmacies"
                          : "Pharmacy"}
                      </h5>
                      <div className="text-sm text-gray-700">
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedPharmacies.map((p) => (
                            <li
                              key={p.id}
                              className="flex flex-wrap gap-2 items-center"
                            >
                              <span
                                className="font-medium notranslate"
                                translate="no"
                              >
                                {p.name}
                              </span>
                              <span className="text-gray-600">{p.address}</span>
                              <span className="text-gray-600">
                                • {p.distance} km
                              </span>
                              <span className="text-gray-600">
                                • {p.deliveryTime} mins
                              </span>
                              <span className="text-gray-600">
                                • ⭐ {p.rating}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {/* Additional Notes */}
                  {selectedPharmacies.length > 0 && (
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
                        !isLoading && selectedPharmacies.length > 0
                          ? { scale: 1.03 }
                          : {}
                      }
                      whileTap={
                        !isLoading && selectedPharmacies.length > 0
                          ? { scale: 0.97 }
                          : {}
                      }
                      onClick={handleSubmit}
                      disabled={selectedPharmacies.length === 0 || isLoading}
                      className={`px-6 py-3 bg-gradient-to-r from-primary to-primary-hover text-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2 order-1 sm:order-2 ${
                        selectedPharmacies.length === 0 || isLoading
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
