import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  LogIn,
  AlertCircle,
  Shield,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import GradientButton from "../../../components/UIs/GradientButton";
import { useAdminAuth } from "../../../hooks/useAdminAuth"; // ✅ Remove AdminAuthProvider import

// ✅ Remove the wrapper - provider is already at App level
const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated } = useAdminAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ✅ Redirect if already authenticated - redirect to /admin (dashboard)
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin"); // ✅ Navigate to /admin which will redirect to /admin/overview
    }
  }, [isAuthenticated, navigate]);

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

  const validate = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdminSignIn = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitError("");
      console.log("Starting admin login...");

      const response = await login(formData);

      console.log("Admin login successful:", response);

      // ✅ Don't rely on response.success here since login() handles that
      // If login() doesn't throw an error, it was successful
      console.log("Redirecting to admin dashboard...");
      navigate("/admin");
    } catch (error) {
      console.error("Login failed:", error);
      setSubmitError(error.message || "Admin login failed. Please try again.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden px-4 py-8">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>
      <div className="absolute top-32 right-20 w-80 h-80 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
      <div className="absolute -bottom-20 left-32 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000"></div>

      {/* Admin pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-[10%] w-16 h-16 border-2 border-white/20 rounded-lg rotate-12 animate-spin-slow"></div>
        <div className="absolute bottom-40 right-[15%] w-12 h-12 border-2 border-blue-400/30 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-[60%] left-[20%] w-8 h-8 border-2 border-indigo-400/20 rounded-lg rotate-45 animate-pulse-slow"></div>
      </div>

      {/* Back to main site link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 z-20"
      >
        <Settings size={20} />
        <span className="text-sm">Back to Main Site</span>
      </Link>

      {/* Glassmorphism admin login card */}
      <div
        className={`relative bg-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-md flex flex-col items-center gap-6 hover:shadow-3xl hover:bg-white/20 transition-all duration-500 fade-in ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Glass edge highlights */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30"></div>
        <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-black/5"></div>
        <div className="absolute top-[5%] bottom-[5%] left-0 w-[1px] bg-white/20"></div>
        <div className="absolute top-[5%] bottom-[5%] right-0 w-[1px] bg-black/5"></div>

        {/* Admin branding */}
        <div className="flex flex-col items-center mb-2 relative z-10">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield size={40} className="text-white" />
            </div>
            {/* Animated rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-20 h-20 rounded-2xl border border-blue-400/40 animate-ping-slow"></div>
              <div
                className="absolute w-28 h-28 rounded-2xl border border-blue-300/20 animate-ping-slow"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mt-4 text-center">
            Admin Portal
          </h1>
          <p className="text-white/70 text-sm mt-1 text-center">
            PillPath Administrative Dashboard
          </p>
        </div>

        {/* Error Display */}
        {(submitError || error) && (
          <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-200" />
              <p className="text-red-200 text-sm">{submitError || error}</p>
            </div>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleAdminSignIn} className="w-full space-y-5">
          {/* Username input */}
          <div className="w-full relative z-10 animate-fade-in-up delay-300">
            <label className="block text-white/90 text-sm font-medium mb-2">
              Username
            </label>
            <div className="relative group">
              <input
                type="text"
                name="username"
                placeholder="Enter admin username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/25 transition-all duration-300 ${
                  errors.username ? "border-red-400" : "border-white/30"
                }`}
                disabled={loading}
                autoComplete="username"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-colors duration-200">
                <User size={20} />
              </div>
            </div>
            {errors.username && (
              <p className="text-red-300 text-xs mt-1 animate-fade-in">
                {errors.username}
              </p>
            )}
          </div>

          {/* Password input */}
          <div className="w-full relative z-10 animate-fade-in-up delay-400">
            <label className="block text-white/90 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter admin password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border placeholder-white/60 text-white pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white/25 transition-all duration-300 ${
                  errors.password ? "border-red-400" : "border-white/30"
                }`}
                disabled={loading}
                autoComplete="current-password"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-colors duration-200">
                <Lock size={20} />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-300 text-xs mt-1 animate-fade-in">
                {errors.password}
              </p>
            )}
          </div>

          {/* Admin sign in button */}
          <div className="w-full animate-fade-in-up delay-600">
            <GradientButton
              text={loading ? "Signing In..." : "Admin Sign In"}
              icon={LogIn}
              iconSize={18}
              gradient="from-blue-600/90 to-indigo-600"
              hoverGradient="hover:from-blue-700 hover:to-indigo-700"
              type="submit"
              disabled={loading}
              className={`${loading ? "opacity-80 pointer-events-none" : ""}`}
            />
          </div>
        </form>

        {/* Admin info */}
        <div className="w-full mt-4 relative z-10 animate-fade-in-up delay-700">
          <div className="text-center p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <p className="text-blue-200 text-xs">
              🔒 Authorized personnel only. All access is logged and monitored.
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="absolute top-4 right-4 bg-blue-500/20 p-2 rounded-lg">
          <Shield size={16} className="text-blue-300" />
        </div>
      </div>
    </div>
  );
};

// ✅ Export the component directly (no wrapper)
export default AdminLogin;
