import React, { useState, useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  MapPin,
  FileText,
  ClipboardCheck,
  Clock,
  ArrowRight,
  ArrowLeft,
  Check,
  Info,
  Crosshair,
  Map,
} from "lucide-react";
import { Link } from "react-router-dom";
import GradientButton from "../../../components/UIs/GradientButton";
import { Globe } from "lucide-react";

// Fix for Leaflet default icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const PharmacyForm = ({ onBack, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // ✅ Updated formData to include location
  const [formData, setFormData] = useState({
    // Pharmacy Details (matching PharmacyRegistrationRequest)
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    operatingHours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    services: [],
    deliveryAvailable: false,
    deliveryRadius: "",

    // ✅ Location fields
    latitude: null,
    longitude: null,

    // Admin Details (matching PharmacyRegistrationRequest)
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPassword: "",
    adminPhoneNumber: "",
    adminPosition: "",
    adminLicenseNumber: "",

    // UI-only fields (not sent to backend)
    confirmPassword: "",
    website: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [locationStatus, setLocationStatus] = useState("idle"); // 'idle', 'getting', 'success', 'error'
  const [locationError, setLocationError] = useState("");

  // ✅ Initialize Leaflet map when coordinates are available
  const initializeMap = (lat, lng) => {
    if (!mapRef.current) return;

    // Clear existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create new map
    mapInstanceRef.current = L.map(mapRef.current).setView([lat, lng], 15);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstanceRef.current);

    // Create custom marker icon
    const pharmacyIcon = L.divIcon({
      className: "custom-pharmacy-marker",
      html: `<div style="
        width: 30px; 
        height: 30px; 
        background-color: #4CAF50; 
        border: 3px solid white; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        <span style="color: white; font-weight: bold; font-size: 16px;">+</span>
      </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    // Add draggable marker
    markerRef.current = L.marker([lat, lng], {
      icon: pharmacyIcon,
      draggable: true,
    }).addTo(mapInstanceRef.current);

    // Update coordinates when marker is dragged
    markerRef.current.on("dragend", (event) => {
      const newPosition = event.target.getLatLng();
      setFormData((prev) => ({
        ...prev,
        latitude: newPosition.lat,
        longitude: newPosition.lng,
      }));
    });

    // Update coordinates when map is clicked
    mapInstanceRef.current.on("click", (event) => {
      const { lat: newLat, lng: newLng } = event.latlng;
      markerRef.current.setLatLng([newLat, newLng]);
      setFormData((prev) => ({
        ...prev,
        latitude: newLat,
        longitude: newLng,
      }));
    });

    // Add popup to marker
    markerRef.current
      .bindPopup(
        `
      <div style="text-align: center; font-family: Arial, sans-serif;">
        <b>📍 Pharmacy Location</b><br>
        <small>Drag marker or click map to adjust position</small>
      </div>
    `
      )
      .openPopup();
  };

  // ✅ Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setLocationStatus("error");
      return;
    }

    setLocationStatus("getting");
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
        setLocationStatus("success");

        // Initialize map with the location
        initializeMap(latitude, longitude);
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        setLocationError(errorMessage);
        setLocationStatus("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  // ✅ Manual coordinate input handler
  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);

    if (!isNaN(numValue)) {
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));

      // Update map if both coordinates are available
      if (name === "latitude" && formData.longitude) {
        initializeMap(numValue, formData.longitude);
      } else if (name === "longitude" && formData.latitude) {
        initializeMap(formData.latitude, numValue);
      }
    }
  };

  // ✅ Update map when coordinates change programmatically
  useEffect(() => {
    if (formData.latitude && formData.longitude && mapRef.current) {
      initializeMap(formData.latitude, formData.longitude);
    }
  }, [formData.latitude, formData.longitude]);

  // ✅ Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("operatingHours.")) {
      const day = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [day]: value,
        },
      }));
    } else if (name === "services") {
      // Handle services as comma-separated values
      const servicesArray = value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
      setFormData((prev) => ({
        ...prev,
        services: servicesArray,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Basic Information - Pharmacy Details
      if (!formData.name) newErrors.name = "Pharmacy name is required";
      if (!formData.phoneNumber)
        newErrors.phoneNumber = "Phone number is required";

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
    }

    if (step === 2) {
      // Legal Documentation
      if (!formData.licenseNumber)
        newErrors.licenseNumber = "License number is required";
      if (!formData.licenseExpiryDate)
        newErrors.licenseExpiryDate = "License expiry date is required";
    }

    if (step === 3) {
      // Admin Details
      if (!formData.adminFirstName)
        newErrors.adminFirstName = "Admin first name is required";
      if (!formData.adminLastName)
        newErrors.adminLastName = "Admin last name is required";
      if (!formData.adminEmail)
        newErrors.adminEmail = "Admin email is required";
      if (!formData.adminPhoneNumber)
        newErrors.adminPhoneNumber = "Admin phone is required";
      if (!formData.adminPosition)
        newErrors.adminPosition = "Admin position is required";

      if (!formData.adminPassword) {
        newErrors.adminPassword = "Password is required";
      } else if (formData.adminPassword.length < 8) {
        newErrors.adminPassword = "Password must be at least 8 characters";
      }

      if (formData.adminPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (step === 4) {
      // Location & Services
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.latitude || !formData.longitude) {
        newErrors.location = "Pharmacy location is required";
      }
      if (!formData.termsAccepted)
        newErrors.termsAccepted = "You must accept the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateStep(currentStep)) {
      // ✅ Prepare data for backend (include location)
      const backendData = {
        // Pharmacy details
        name: formData.name,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        licenseNumber: formData.licenseNumber,
        licenseExpiryDate: formData.licenseExpiryDate,
        operatingHours: formData.operatingHours,
        services: formData.services,
        deliveryAvailable: formData.deliveryAvailable,
        deliveryRadius: formData.deliveryRadius
          ? parseInt(formData.deliveryRadius, 10)
          : null,

        // ✅ Include location data
        latitude: formData.latitude,
        longitude: formData.longitude,

        // Admin details
        adminFirstName: formData.adminFirstName,
        adminLastName: formData.adminLastName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
        adminPhoneNumber: formData.adminPhoneNumber,
        adminPosition: formData.adminPosition,
        adminLicenseNumber: formData.adminLicenseNumber,
      };

      console.log(
        "Submitting pharmacy registration with location:",
        backendData
      );
      onSubmit(backendData);
    }
  };

  // Progress bar calculation
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 md:p-8 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
        Register Your Pharmacy
      </h2>
      <p className="text-white/70 text-center mb-6">
        Step {currentStep} of {totalSteps}:{" "}
        {currentStep === 1
          ? "Basic Information"
          : currentStep === 2
          ? "Legal Documentation"
          : currentStep === 3
          ? "Admin Account"
          : "Location & Services"}
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 h-2 rounded-full mb-8">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mb-8 px-2">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`flex flex-col items-center ${
              currentStep >= step ? "text-white" : "text-white/40"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all duration-300 ${
                currentStep > step
                  ? "bg-accent text-white"
                  : currentStep === step
                  ? "bg-white/20 text-white border-2 border-accent"
                  : "bg-white/10 text-white/40"
              }`}
            >
              {currentStep > step ? <Check size={16} /> : step}
            </div>
            <span className="text-xs hidden md:block">
              {step === 1
                ? "Basic Info"
                : step === 2
                ? "Legal Docs"
                : step === 3
                ? "Admin"
                : "Location"}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Steps 1-3 remain the same as before */}
        {/* Step 1: Basic Information - Pharmacy Details */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Pharmacy Name <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${
                    errors.name ? "border-red-400" : "border-white/30"
                  } placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                  placeholder="Enter pharmacy name"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <Building2 size={20} />
                </div>
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <Info size={12} /> {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative group">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Phone Number <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${
                      errors.phoneNumber ? "border-red-400" : "border-white/30"
                    } placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                    placeholder="Enter phone number"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                    <Phone size={20} />
                  </div>
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <Info size={12} /> {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div className="relative group">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Email Address <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${
                      errors.email ? "border-red-400" : "border-white/30"
                    } placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                    placeholder="Enter email address"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                    <Mail size={20} />
                  </div>
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <Info size={12} /> {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Website (optional)
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300"
                  placeholder="Enter website URL (optional)"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <Globe size={20} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Legal Documentation */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Pharmacy License Number <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${
                    errors.licenseNumber ? "border-red-400" : "border-white/30"
                  } placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                  placeholder="Enter pharmacy license number"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <FileText size={20} />
                </div>
              </div>
              {errors.licenseNumber && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <Info size={12} /> {errors.licenseNumber}
                </p>
              )}
            </div>

            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                License Expiry Date <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="licenseExpiryDate"
                  value={formData.licenseExpiryDate}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${
                    errors.licenseExpiryDate
                      ? "border-red-400"
                      : "border-white/30"
                  } placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <Calendar size={20} />
                </div>
              </div>
              {errors.licenseExpiryDate && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <Info size={12} /> {errors.licenseExpiryDate}
                </p>
              )}
            </div>

            <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
              <p className="text-white/80 text-sm">
                All legal documentation will be verified before your pharmacy
                account is approved. Please ensure all information is accurate
                and up-to-date.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Admin Account Details */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative group">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Admin First Name <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="adminFirstName"
                    value={formData.adminFirstName}
                    onChange={handleChange}
                    className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${
                      errors.adminFirstName
                        ? "border-red-400"
                        : "border-white/30"
                    } placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                    placeholder="Enter first name"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                    <User size={20} />
                  </div>
                </div>
                {errors.adminFirstName && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <Info size={12} /> {errors.adminFirstName}
                  </p>
                )}
              </div>

              <div className="relative group">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Admin Last Name <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="adminLastName"
                    value={formData.adminLastName}
                    onChange={handleChange}
                    className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${
                      errors.adminLastName
                        ? "border-red-400"
                        : "border-white/30"
                    } placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                    placeholder="Enter last name"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                    <User size={20} />
                  </div>
                </div>
                {errors.adminLastName && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <Info size={12} /> {errors.adminLastName}
                  </p>
                )}
              </div>
            </div>

            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Admin Email <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${
                    errors.adminEmail ? "border-red-400" : "border-white/30"
                  } placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                  placeholder="Enter admin email"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <Mail size={20} />
                </div>
              </div>
              {errors.adminEmail && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <Info size={12} /> {errors.adminEmail}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative group">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Admin Phone <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="adminPhoneNumber"
                    value={formData.adminPhoneNumber}
                    onChange={handleChange}
                    className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${
                      errors.adminPhoneNumber
                        ? "border-red-400"
                        : "border-white/30"
                    } placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                    placeholder="Enter admin phone"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                    <Phone size={20} />
                  </div>
                </div>
                {errors.adminPhoneNumber && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <Info size={12} /> {errors.adminPhoneNumber}
                  </p>
                )}
              </div>

              <div className="relative group">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Position/Title <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="adminPosition"
                    value={formData.adminPosition}
                    onChange={handleChange}
                    className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${
                      errors.adminPosition
                        ? "border-red-400"
                        : "border-white/30"
                    } placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                    placeholder="e.g. Pharmacist, Manager"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                    <ClipboardCheck size={20} />
                  </div>
                </div>
                {errors.adminPosition && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <Info size={12} /> {errors.adminPosition}
                  </p>
                )}
              </div>
            </div>

            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Admin License Number (if applicable)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="adminLicenseNumber"
                  value={formData.adminLicenseNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300"
                  placeholder="Enter license number (optional)"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <FileText size={20} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative group">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Password <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="adminPassword"
                    value={formData.adminPassword}
                    onChange={handleChange}
                    className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${
                      errors.adminPassword
                        ? "border-red-400"
                        : "border-white/30"
                    } placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                    placeholder="Create a password"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                    <Lock size={20} />
                  </div>
                </div>
                {errors.adminPassword && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <Info size={12} /> {errors.adminPassword}
                  </p>
                )}
              </div>

              <div className="relative group">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Confirm Password <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${
                      errors.confirmPassword
                        ? "border-red-400"
                        : "border-white/30"
                    } placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                    placeholder="Confirm your password"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                    <Lock size={20} />
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <Info size={12} /> {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ✅ UPDATED Step 4: Location & Services with Leaflet Map */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Complete Address <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${
                    errors.address ? "border-red-400" : "border-white/30"
                  } placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                  placeholder="Enter complete address of the pharmacy"
                  rows={3}
                ></textarea>
                <div className="absolute left-3 top-6 text-white/60">
                  <MapPin size={20} />
                </div>
              </div>
              {errors.address && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <Info size={12} /> {errors.address}
                </p>
              )}
            </div>

            {/* ✅ UPDATED: Location Section with Leaflet */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-white/90 text-sm font-medium">
                  Pharmacy Location <span className="text-accent">*</span>
                </label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationStatus === "getting"}
                  className="flex items-center gap-2 px-3 py-2 bg-accent/20 hover:bg-accent/30 rounded-lg text-white text-sm transition-colors duration-300 disabled:opacity-50"
                >
                  <Crosshair size={16} />
                  {locationStatus === "getting"
                    ? "Getting Location..."
                    : "Use Current Location"}
                </button>
              </div>

              {/* Location Status */}
              {locationStatus === "success" && (
                <div className="p-3 bg-green-500/20 border border-green-500/40 rounded-lg">
                  <p className="text-green-200 text-sm">
                    ✓ Location captured successfully
                  </p>
                </div>
              )}

              {locationError && (
                <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-lg">
                  <p className="text-red-200 text-sm">⚠ {locationError}</p>
                </div>
              )}

              {errors.location && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <Info size={12} /> {errors.location}
                </p>
              )}

              {/* Manual Coordinate Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                  <label className="block text-white/70 text-xs font-medium mb-2">
                    Latitude <span className="text-accent">*</span>
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude || ""}
                    onChange={handleCoordinateChange}
                    step="any"
                    className="w-full rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300"
                    placeholder="e.g. 6.9271"
                  />
                </div>

                <div className="relative group">
                  <label className="block text-white/70 text-xs font-medium mb-2">
                    Longitude <span className="text-accent">*</span>
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude || ""}
                    onChange={handleCoordinateChange}
                    step="any"
                    className="w-full rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300"
                    placeholder="e.g. 79.8612"
                  />
                </div>
              </div>

              {/* ✅ UPDATED: Leaflet Map Container */}
              <div className="relative">
                <div
                  ref={mapRef}
                  className="w-full h-64 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center"
                  style={{
                    display:
                      formData.latitude && formData.longitude
                        ? "block"
                        : "flex",
                  }}
                >
                  {!formData.latitude || !formData.longitude ? (
                    <div className="text-center text-white/60">
                      <Map size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        Interactive map will appear here
                      </p>
                      <p className="text-xs">
                        Click "Use Current Location" or enter coordinates
                        manually
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="p-3 bg-blue-500/20 border border-blue-500/40 rounded-lg">
                <p className="text-blue-200 text-sm">
                  📍 Accurate location helps customers find your pharmacy
                  easily. You can click "Use Current Location" for automatic
                  detection, enter coordinates manually, or drag the marker on
                  the map to adjust the position.
                </p>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="space-y-3">
              <label className="block text-white/90 text-sm font-medium">
                Operating Hours
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.keys(formData.operatingHours).map((day) => (
                  <div key={day} className="relative group">
                    <label className="block text-white/70 text-xs font-medium mb-1 capitalize">
                      {day}
                    </label>
                    <input
                      type="text"
                      name={`operatingHours.${day}`}
                      value={formData.operatingHours[day]}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300"
                      placeholder="e.g. 9:00-17:00 or Closed"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Services Offered
              </label>
              <div className="relative">
                <textarea
                  name="services"
                  value={formData.services.join(", ")}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300"
                  placeholder="Enter services separated by commas (e.g. Prescription Filling, Consultation, Delivery)"
                  rows={2}
                ></textarea>
                <div className="absolute left-3 top-6 text-white/60">
                  <ClipboardCheck size={20} />
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="space-y-3">
              <div className="relative group">
                <label className="flex items-center gap-3 cursor-pointer text-white/90">
                  <input
                    type="checkbox"
                    name="deliveryAvailable"
                    checked={formData.deliveryAvailable}
                    onChange={handleChange}
                    className="w-5 h-5 border border-white/30 rounded checked:bg-accent checked:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-300"
                  />
                  <span className="text-sm">Delivery Service Available</span>
                </label>
              </div>

              {formData.deliveryAvailable && (
                <div className="relative group">
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Delivery Radius (km)
                  </label>
                  <input
                    type="number"
                    name="deliveryRadius"
                    value={formData.deliveryRadius}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300"
                    placeholder="Enter delivery radius in kilometers"
                    min="1"
                    max="100"
                  />
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="relative group mt-4">
              <label
                className={`flex items-start gap-3 cursor-pointer group ${
                  errors.termsAccepted ? "text-red-400" : "text-white/90"
                }`}
              >
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="peer appearance-none w-5 h-5 border border-white/30 rounded checked:bg-accent checked:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-300"
                  />
                  <Check
                    size={16}
                    className="absolute top-0.5 left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300 pointer-events-none"
                  />
                </div>
                <div>
                  <span className="text-sm">
                    I agree to the{" "}
                    <Link to="/terms" className="text-accent hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-accent hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                  {errors.termsAccepted && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <Info size={12} /> {errors.termsAccepted}
                    </p>
                  )}
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 rounded-xl text-white bg-white/20 hover:bg-white/30 transition-colors duration-300 flex items-center justify-center gap-2 w-1/3"
            >
              <ArrowLeft size={16} />
              Previous
            </button>
          ) : (
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 rounded-xl text-white bg-white/20 hover:bg-white/30 transition-colors duration-300 w-1/3"
            >
              Back
            </button>
          )}

          {currentStep < totalSteps ? (
            <GradientButton
              text="Next Step"
              icon={ArrowRight}
              gradient="from-accent/90 to-accent"
              hoverGradient="hover:from-accent hover:to-accent/90"
              className="w-2/3"
              onClick={nextStep}
            />
          ) : (
            <GradientButton
              text="Register Pharmacy"
              gradient="from-accent/90 to-accent"
              hoverGradient="hover:from-accent hover:to-accent/90"
              className="w-2/3"
              type="submit"
            />
          )}
        </div>
      </form>

      {/* ✅ Add custom styles for the map */}
      <style jsx>{`
        .custom-pharmacy-marker {
          background: transparent !important;
          border: none !important;
        }

        .leaflet-container {
          border-radius: 12px;
          z-index: 1;
        }

        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.95) !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }

        .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.95) !important;
        }
      `}</style>
    </div>
  );
};

export default PharmacyForm;
