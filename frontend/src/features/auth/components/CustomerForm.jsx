import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  User,
  Calendar,
  Phone,
  Lock,
} from "lucide-react";
import GradientButton from "../../../components/UIs/GradientButton";

const CustomerForm = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "", // ✅ FIXED: Changed back to 'phone' to match backend
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Validate phone (optional but if provided should be valid)
    if (formData.phone && !/^\+?[0-9\s\-()]{8,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Validate date of birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 13) {
        newErrors.dateOfBirth = "You must be at least 13 years old";
      }
    }

    // Validate terms
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Form has validation errors:", errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ FIXED: Just prepare and send form data to parent
      const submitData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || "",
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        termsAccepted: formData.termsAccepted,
      };

      console.log("Submitting form data to parent:", submitData);
      
      // ✅ FIXED: Call parent's onSubmit with form data (not API response)
      await onSubmit(submitData);
      
    } catch (error) {
      console.error("Form submission error:", error);

      // Extract and display backend validation errors
      if (error.message && typeof error.message === "string") {
        if (error.message.includes("email")) {
          setErrors((prev) => ({
            ...prev,
            email: "This email is already registered",
          }));
        } else {
          setErrors((prev) => ({ ...prev, form: error.message }));
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          form: "Registration failed. Please try again.",
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 w-full max-w-2xl">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        Back to role selection
      </button>

      <h2 className="text-2xl font-bold text-white mb-6">
        Create Customer Account
      </h2>

      {errors.form && (
        <div className="bg-red-500/20 border border-red-500/40 text-white p-4 rounded-xl mb-6">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name fields - row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              First Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className={`w-full bg-white/10 border ${
                  errors.firstName ? "border-red-400" : "border-white/20"
                } rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50`}
              />
              <User
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"
                size={20}
              />
            </div>
            {errors.firstName && (
              <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Last Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className={`w-full bg-white/10 border ${
                  errors.lastName ? "border-red-400" : "border-white/20"
                } rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50`}
              />
              <User
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"
                size={20}
              />
            </div>
            {errors.lastName && (
              <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className={`w-full bg-white/10 border ${
                errors.email ? "border-red-400" : "border-white/20"
              } rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50`}
            />
            <Mail
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"
              size={20}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone - ✅ FIXED: Changed name back to 'phone' */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Phone Number <span className="text-white/50">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone" // ✅ FIXED: Changed back to 'phone' to match backend
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={`w-full bg-white/10 border ${
                errors.phone ? "border-red-400" : "border-white/20"
              } rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50`}
            />
            <Phone
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"
              size={20}
            />
          </div>
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className={`w-full bg-white/10 border ${
                errors.password ? "border-red-400" : "border-white/20"
              } rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50`}
            />
            <Lock
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"
              size={20}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`w-full bg-white/10 border ${
                errors.confirmPassword ? "border-red-400" : "border-white/20"
              } rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50`}
            />
            <Lock
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"
              size={20}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Date of Birth
          </label>
          <div className="relative">
            <div
              className={`w-full bg-white/10 border ${
                errors.dateOfBirth ? "border-red-400" : "border-white/20"
              } rounded-xl pl-12 text-white focus-within:ring-2 focus-within:ring-accent/50`}
            >
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="w-full bg-transparent py-3 pr-4 focus:outline-none text-white placeholder-white/50"
              />
            </div>
            <Calendar
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50"
              size={20}
            />
          </div>
          {errors.dateOfBirth && (
            <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="termsAccepted"
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="focus:ring-accent h-4 w-4 text-accent border-white/30 rounded bg-white/10"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="terms" className="text-sm text-white/70">
                I agree to the{" "}
                <a href="#" className="text-accent hover:text-accent/80">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-accent hover:text-accent/80">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>
          {errors.termsAccepted && (
            <p className="text-red-400 text-xs mt-1">{errors.termsAccepted}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <GradientButton
            text={isSubmitting ? "Creating Account..." : "Create Account"}
            type="submit"
            disabled={isSubmitting}
            fullWidth
            gradient="from-accent via-accent to-accent-hover"
            hoverGradient="from-accent-hover via-accent to-accent"
          />
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
