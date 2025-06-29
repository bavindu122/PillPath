import React, { useState } from "react";
import { Building2, User, Mail, Phone, Lock, Calendar, MapPin, FileText, ClipboardCheck, Clock, ArrowRight, ArrowLeft, Check, Info } from "lucide-react";
import { Link } from "react-router-dom";
import GradientButton from "../../../components/UIs/GradientButton";
import { Globe } from "lucide-react";

const PharmacyForm = ({ onBack, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState({
    // Basic Information
    pharmacyName: "",
    tradingName: "",
    ownerName: "",
    phone: "",
    email: "",
    website: "",
    password: "",
    confirmPassword: "",
    
    // Legal Documentation
    licenseNumber: "",
    licenseIssueDate: "",
    licenseExpiryDate: "",
    businessRegNumber: "",
    localAuthorityReg: "",
    
    // Pharmacist Details
    pharmacistName: "",
    slmcRegNumber: "",
    pharmacistContact: "",
    secondaryPharmacist: "",
    
    // Location & Services
    address: "",
    district: "",
    operatingHours: "",
    services: "",
    insurancePlans: "",
    termsAccepted: false
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.pharmacyName) newErrors.pharmacyName = "Pharmacy name is required";
      if (!formData.ownerName) newErrors.ownerName = "Owner name is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
      
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    if (step === 2) {
      if (!formData.licenseNumber) newErrors.licenseNumber = "License number is required";
      if (!formData.licenseIssueDate) newErrors.licenseIssueDate = "License issue date is required";
      if (!formData.licenseExpiryDate) newErrors.licenseExpiryDate = "License expiry date is required";
      if (!formData.businessRegNumber) newErrors.businessRegNumber = "Business registration number is required";
      if (!formData.localAuthorityReg) newErrors.localAuthorityReg = "Local authority registration is required";
    }
    
    if (step === 3) {
      if (!formData.pharmacistName) newErrors.pharmacistName = "Pharmacist name is required";
      if (!formData.slmcRegNumber) newErrors.slmcRegNumber = "SLMC registration number is required";
      if (!formData.pharmacistContact) newErrors.pharmacistContact = "Pharmacist contact is required";
    }
    
    if (step === 4) {
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.district) newErrors.district = "District is required";
      if (!formData.operatingHours) newErrors.operatingHours = "Operating hours are required";
      if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  // Progress bar calculation
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 md:p-8 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">Register Your Pharmacy</h2>
      <p className="text-white/70 text-center mb-6">Step {currentStep} of {totalSteps}: {
        currentStep === 1 ? "Basic Information" :
        currentStep === 2 ? "Legal Documentation" :
        currentStep === 3 ? "Pharmacist Details" :
        "Location & Services"
      }</p>
      
      {/* Progress Bar */}
      <div className="w-full bg-white/10 h-2 rounded-full mb-8">
        <div 
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between mb-8 px-2">
        {[1, 2, 3, 4].map(step => (
          <div 
            key={step}
            className={`flex flex-col items-center ${
              currentStep >= step ? "text-white" : "text-white/40"
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all duration-300 ${
              currentStep > step 
                ? "bg-accent text-white" 
                : currentStep === step 
                  ? "bg-white/20 text-white border-2 border-accent" 
                  : "bg-white/10 text-white/40"
            }`}>
              {currentStep > step ? <Check size={16} /> : step}
            </div>
            <span className="text-xs hidden md:block">{
              step === 1 ? "Basic Info" :
              step === 2 ? "Legal Docs" :
              step === 3 ? "Pharmacist" :
              "Location"
            }</span>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Pharmacy Name (Official) <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="pharmacyName"
                  value={formData.pharmacyName}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.pharmacyName ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                  placeholder="Enter official pharmacy name"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <Building2 size={20} />
                </div>
              </div>
              {errors.pharmacyName && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <Info size={12} /> {errors.pharmacyName}
                </p>
              )}
            </div>
            
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Trading Name (if different)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="tradingName"
                  value={formData.tradingName}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300"
                  placeholder="Enter trading name if different"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <Building2 size={20} />
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Owner/Manager Name <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.ownerName ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                  placeholder="Enter owner/manager name"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <User size={20} />
                </div>
              </div>
              {errors.ownerName && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <Info size={12} /> {errors.ownerName}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative group">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Contact Phone Number <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.phone ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                    placeholder="Enter contact phone"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                    <Phone size={20} />
                  </div>
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <Info size={12} /> {errors.phone}
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
                    className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.email ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
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
                Website (if available)
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative group">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Password <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.password ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                    placeholder="Create a password"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                    <Lock size={20} />
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <Info size={12} /> {errors.password}
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
                    className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.confirmPassword ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
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
        
        {/* Step 2: Legal Documentation */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                NMRA License Number <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.licenseNumber ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                  placeholder="Enter NMRA license number"
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative group">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  License Issue Date <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="licenseIssueDate"
                    value={formData.licenseIssueDate}
                    onChange={handleChange}
                    className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.licenseIssueDate ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                    <Calendar size={20} />
                  </div>
                </div>
                {errors.licenseIssueDate && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <Info size={12} /> {errors.licenseIssueDate}
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
                    className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.licenseExpiryDate ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
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
            </div>
            
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Business Registration Number <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="businessRegNumber"
                  value={formData.businessRegNumber}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.businessRegNumber ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                  placeholder="Enter business registration number"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <ClipboardCheck size={20} />
                </div>
              </div>
              {errors.businessRegNumber && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <Info size={12} /> {errors.businessRegNumber}
                </p>
              )}
            </div>
            
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Local Authority Registration <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="localAuthorityReg"
                  value={formData.localAuthorityReg}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.localAuthorityReg ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                  placeholder="Enter local authority registration"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <FileText size={20} />
                </div>
              </div>
              {errors.localAuthorityReg && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <Info size={12} /> {errors.localAuthorityReg}
                </p>
              )}
            </div>
            
            <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
              <p className="text-white/80 text-sm">
                All legal documentation will be verified before your pharmacy account is approved. Please ensure all information is accurate and up-to-date.
              </p>
            </div>
          </div>
        )}
        
        {/* Step 3: Pharmacist Details */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Registered Pharmacist Name <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="pharmacistName"
                  value={formData.pharmacistName}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.pharmacistName ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                  placeholder="Enter registered pharmacist name"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <User size={20} />
                </div>
              </div>
              {errors.pharmacistName && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <Info size={12} /> {errors.pharmacistName}
                </p>
              )}
            </div>
            
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                SLMC Registration Number <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="slmcRegNumber"
                  value={formData.slmcRegNumber}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.slmcRegNumber ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                  placeholder="Enter SLMC registration number"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <ClipboardCheck size={20} />
                </div>
              </div>
              {errors.slmcRegNumber && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <Info size={12} /> {errors.slmcRegNumber}
                </p>
              )}
            </div>
            
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Pharmacist Contact Details <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="pharmacistContact"
                  value={formData.pharmacistContact}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.pharmacistContact ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                  placeholder="Enter pharmacist contact details"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <Phone size={20} />
                </div>
              </div>
              {errors.pharmacistContact && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <Info size={12} /> {errors.pharmacistContact}
                </p>
              )}
            </div>
            
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Secondary Pharmacist (if applicable)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="secondaryPharmacist"
                  value={formData.secondaryPharmacist}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300"
                  placeholder="Enter secondary pharmacist name (optional)"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <User size={20} />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
              <p className="text-white/80 text-sm">
                The registered pharmacist will be responsible for all prescription-related activities on the platform.
              </p>
            </div>
          </div>
        )}
        
        {/* Step 4: Location & Services */}
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
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.address ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
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
            
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                District/Province <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.district ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                  placeholder="Enter district or province"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <MapPin size={20} />
                </div>
              </div>
              {errors.district && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <Info size={12} /> {errors.district}
                </p>
              )}
            </div>
            
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Operating Hours <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="operatingHours"
                  value={formData.operatingHours}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.operatingHours ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300`}
                  placeholder="e.g. Mon-Fri: 9am-7pm, Sat: 10am-4pm"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <Clock size={20} />
                </div>
              </div>
              {errors.operatingHours && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <Info size={12} /> {errors.operatingHours}
                </p>
              )}
            </div>
            
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Services Offered (delivery, consultation, etc.)
              </label>
              <div className="relative">
                <textarea
                  name="services"
                  value={formData.services}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300"
                  placeholder="List services your pharmacy offers"
                  rows={2}
                ></textarea>
                <div className="absolute left-3 top-6 text-white/60">
                  <ClipboardCheck size={20} />
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Accepted Insurance Plans
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="insurancePlans"
                  value={formData.insurancePlans}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white/25 transition-all duration-300"
                  placeholder="List accepted insurance plans (optional)"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <FileText size={20} />
                </div>
              </div>
            </div>
            
            {/* Terms and Conditions */}
            <div className="relative group mt-4">
              <label className={`flex items-start gap-3 cursor-pointer group ${errors.termsAccepted ? "text-red-400" : "text-white/90"}`}>
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="appearance-none w-5 h-5 border border-white/30 rounded checked:bg-accent checked:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-300"
                  />
                  <Check size={16} className="absolute top-0.5 left-0.5 text-white opacity-0 checked:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                <div>
                  <span className="text-sm">
                    I agree to the <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
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
    </div>
  );
};

export default PharmacyForm;