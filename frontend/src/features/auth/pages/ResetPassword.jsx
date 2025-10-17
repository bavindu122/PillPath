import React, { useState, useEffect } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader,
  ArrowRight,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../../components/Layout/Navbar";
import GradientButton from "../../../components/UIs/GradientButton";
import {
  verifyResetToken,
  resetPassword,
} from "../../../services/api/authApi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [mounted, setMounted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValid(false);
        setIsVerifying(false);
        setSubmitError("Invalid or missing reset token");
        return;
      }

      try {
        const response = await verifyResetToken(token);
        setIsValid(response.success);
        if (!response.success) {
          setSubmitError(
            response.message || "This reset link is invalid or has expired"
          );
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsValid(false);
        setSubmitError("Unable to verify reset token. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitError) setSubmitError("");
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword =
        "Password must contain uppercase, lowercase, number, and special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setSubmitError("");

    try {
      const response = await resetPassword({
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      if (response.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setSubmitError(
          response.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      setSubmitError(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-hover to-accent">
        <Navbar />
        <div className="text-center">
          <Loader className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-hover to-accent relative overflow-hidden px-4 py-25">
      <Navbar />

      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>
      <div className="absolute top-32 right-20 w-80 h-80 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
      <div className="absolute -bottom-20 left-32 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>

      {/* Medical pattern background */}
      <div className="medical-pattern absolute inset-0 opacity-5"></div>

      {/* Glassmorphism card */}
      <div
        className={`relative bg-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl border-white/20 p-6 sm:p-8 w-full max-w-md flex flex-col items-center gap-5 sm:gap-6 hover:shadow-3xl hover:bg-white/20 transition-all duration-500 fade-in ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Glass edge highlights */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30"></div>
        <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-black/5"></div>

        {/* Logo and branding */}
        <div className="flex flex-col items-center mb-1 relative z-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 animate-fade-in-scale">
            {success ? (
              <CheckCircle size={40} className="text-green-400" />
            ) : !isValid ? (
              <AlertCircle size={40} className="text-red-400" />
            ) : (
              <Lock size={40} className="text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mt-4 text-center">
            {success
              ? "Password Reset!"
              : !isValid
              ? "Invalid Link"
              : "Reset Your Password"}
          </h1>
          <p className="text-white/70 text-sm mt-1 text-center px-4">
            {success
              ? "Your password has been changed successfully"
              : !isValid
              ? "This password reset link is invalid or expired"
              : "Enter your new password below"}
          </p>
        </div>

        {success ? (
          /* Success Message */
          <div className="w-full space-y-5 relative z-10 animate-fade-in">
            <div className="w-full p-4 bg-green-500/20 border border-green-500/40 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-200 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-green-100 text-sm leading-relaxed">
                    Your password has been successfully reset. You can now sign
                    in with your new password.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-white/70 text-sm mb-4">
                Redirecting to login page...
              </p>
              <GradientButton
                text="Go to Login"
                icon={ArrowRight}
                iconSize={18}
                gradient="from-secondary/90 to-secondary"
                hoverGradient="hover:from-secondary hover:to-accent/70"
                onClick={() => navigate("/login")}
              />
            </div>
          </div>
        ) : !isValid ? (
          /* Invalid Token Message */
          <div className="w-full space-y-5 relative z-10 animate-fade-in">
            <div className="w-full p-4 bg-red-500/20 border border-red-500/40 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-red-200 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-200 text-sm leading-relaxed">
                    {submitError ||
                      "This password reset link is invalid or has expired. Please request a new one."}
                  </p>
                </div>
              </div>
            </div>

            <GradientButton
              text="Request New Link"
              icon={ArrowRight}
              iconSize={18}
              gradient="from-secondary/90 to-secondary"
              hoverGradient="hover:from-secondary hover:to-accent/70"
              onClick={() => navigate("/forgot-password")}
            />
          </div>
        ) : (
          /* Reset Password Form */
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* Error Display */}
            {submitError && (
              <div className="w-full p-3 bg-red-500/20 border border-red-500/40 rounded-lg animate-fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-200" />
                  <p className="text-red-200 text-sm">{submitError}</p>
                </div>
              </div>
            )}

            {/* New Password input */}
            <div className="w-full relative z-10 animate-fade-in-up delay-300">
              <label className="block text-light text-sm font-medium mb-2">
                New Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border placeholder-white/60 text-white pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/25 transition-all duration-300 ${
                    errors.newPassword ? "border-red-400" : "border-white/30"
                  }`}
                  disabled={isLoading}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-colors duration-200">
                  <Lock size={20} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-300 text-xs mt-1 animate-fade-in">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password input */}
            <div className="w-full relative z-10 animate-fade-in-up delay-400">
              <label className="block text-light text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border placeholder-white/60 text-white pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/25 transition-all duration-300 ${
                    errors.confirmPassword ? "border-red-400" : "border-white/30"
                  }`}
                  disabled={isLoading}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-colors duration-200">
                  <Lock size={20} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-300 text-xs mt-1 animate-fade-in">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password requirements */}
            <div className="w-full p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 animate-fade-in-up delay-500">
              <p className="text-white text-xs font-semibold mb-2">
                Password must contain:
              </p>
              <ul className="text-white/70 text-xs space-y-1">
                <li
                  className={
                    formData.newPassword.length >= 8
                      ? "text-green-300"
                      : ""
                  }
                >
                  • At least 8 characters
                </li>
                <li
                  className={
                    /[A-Z]/.test(formData.newPassword) &&
                    /[a-z]/.test(formData.newPassword)
                      ? "text-green-300"
                      : ""
                  }
                >
                  • Uppercase and lowercase letters
                </li>
                <li
                  className={
                    /\d/.test(formData.newPassword) ? "text-green-300" : ""
                  }
                >
                  • At least one number
                </li>
                <li
                  className={
                    /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)
                      ? "text-green-300"
                      : ""
                  }
                >
                  • At least one special character
                </li>
              </ul>
            </div>

            {/* Submit button */}
            <div className="w-full animate-fade-in-up delay-600">
              <GradientButton
                text={isLoading ? "Resetting..." : "Reset Password"}
                icon={Lock}
                iconSize={18}
                gradient="from-secondary/90 to-secondary"
                hoverGradient="hover:from-secondary hover:to-accent/70"
                type="submit"
                disabled={isLoading}
                className={`${isLoading ? "opacity-80 pointer-events-none" : ""}`}
              />
            </div>
          </form>
        )}

        {/* Decorative elements */}
        <div className="absolute top-[15%] right-[10%] w-8 h-4 bg-secondary/30 rounded-full rotate-45 animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] left-[12%] w-6 h-3 bg-primary/40 rounded-full rotate-[30deg] animate-pulse-slow"></div>
      </div>
    </div>
  );
};

export default ResetPassword;
