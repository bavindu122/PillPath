import React, { useState } from "react";
import { User, Mail, Phone, Lock, Calendar, ArrowRight, Check, Info } from "lucide-react";
import { Link } from "react-router-dom";
import GradientButton from "../../../components/UIs/GradientButton";

const CustomerForm = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
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

  const validate = () => {
    const newErrors = {};
    
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phone) newErrors.phone = "Phone number is required";
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 md:p-8 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">Create Customer Account</h2>
      <p className="text-white/70 text-center mb-6">Fill in your details to get started</p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* First Name */}
          <div className="relative group">
            <label className="block text-white/90 text-sm font-medium mb-2">
              First Name <span className="text-secondary">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.firstName ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/25 transition-all duration-300`}
                placeholder="Enter first name"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                <User size={20} />
              </div>
            </div>
            {errors.firstName && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <Info size={12} /> {errors.firstName}
              </p>
            )}
          </div>
          
          {/* Last Name */}
          <div className="relative group">
            <label className="block text-white/90 text-sm font-medium mb-2">
              Last Name <span className="text-secondary">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.lastName ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/25 transition-all duration-300`}
                placeholder="Enter last name"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                <User size={20} />
              </div>
            </div>
            {errors.lastName && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <Info size={12} /> {errors.lastName}
              </p>
            )}
          </div>
        </div>
        
        {/* Email */}
        <div className="relative group">
          <label className="block text-white/90 text-sm font-medium mb-2">
            Email Address <span className="text-secondary">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.email ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/25 transition-all duration-300`}
              placeholder="Enter your email"
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
        
        {/* Phone */}
        <div className="relative group">
          <label className="block text-white/90 text-sm font-medium mb-2">
            Phone Number <span className="text-secondary">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.phone ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/25 transition-all duration-300`}
              placeholder="Enter phone number"
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
        
        {/* Password */}
        <div className="relative group">
          <label className="block text-white/90 text-sm font-medium mb-2">
            Password <span className="text-secondary">*</span>
          </label>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.password ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/25 transition-all duration-300`}
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
        
        {/* Confirm Password */}
        <div className="relative group">
          <label className="block text-white/90 text-sm font-medium mb-2">
            Confirm Password <span className="text-secondary">*</span>
          </label>
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.confirmPassword ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/25 transition-all duration-300`}
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
        
        {/* Date of Birth */}
        <div className="relative group">
          <label className="block text-white/90 text-sm font-medium mb-2">
            Date of Birth <span className="text-secondary">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border ${errors.dateOfBirth ? "border-red-400" : "border-white/30"} placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/25 transition-all duration-300`}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
              <Calendar size={20} />
            </div>
          </div>
          {errors.dateOfBirth && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <Info size={12} /> {errors.dateOfBirth}
            </p>
          )}
        </div>
        
        {/* Terms and Conditions */}
        <div className="relative group">
          <label className={`flex items-start gap-3 cursor-pointer group ${errors.termsAccepted ? "text-red-400" : "text-white/90"}`}>
            <div className="relative mt-1">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="peer appearance-none w-5 h-5 border border-white/30 rounded checked:bg-secondary checked:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all duration-300"
              />
              <Check size={16} className="absolute top-0.5 left-0.5 text-white opacity-0 transition-opacity duration-300 pointer-events-none peer-checked:opacity-100" />
            </div>
            <div>
              <span className="text-sm">
                I agree to the <Link to="/terms" className="text-secondary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-secondary hover:underline">Privacy Policy</Link>
              </span>
              {errors.termsAccepted && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <Info size={12} /> {errors.termsAccepted}
                </p>
              )}
            </div>
          </label>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-xl text-white bg-white/20 hover:bg-white/30 transition-colors duration-300 w-1/3"
          >
            Back
          </button>
          
          <GradientButton 
            text="Create Account"
            gradient="from-secondary/90 to-secondary"
            hoverGradient="hover:from-secondary hover:to-secondary/90"
            className="w-2/3"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;