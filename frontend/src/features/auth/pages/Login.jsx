import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowRight,
  LogIn,
  Mail,
  AlertCircle,
  Building2,
  Users,
  Stethoscope,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { assets } from "../../../assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../../components/Layout/Navbar";
import GradientButton from "../../../components/UIs/GradientButton";
import { useAuth } from "../../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, socialLogin, loading, error, isAuthenticated, userType } =
    useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ✅ UPDATED: Enhanced redirect logic honoring preserved redirect only for role-appropriate targets
  useEffect(() => {
    if (isAuthenticated && userType) {
      console.log("User authenticated, redirecting...", { userType });
      const params = new URLSearchParams(location.search);
      const redirectRaw = params.get("redirect");
      const redirectTo = redirectRaw ? decodeURIComponent(redirectRaw) : null;

      // Try restoring a saved pre-auth intent (e.g., upload flow)
      const savedIntentRaw = sessionStorage.getItem("postAuthRedirect");
      let savedIntent = null;
      if (savedIntentRaw) {
        try {
          savedIntent = JSON.parse(savedIntentRaw);
        } catch {}
      }

      // Safety: only allow internal redirects starting with '/'
      const isSafeInternal = redirectTo && redirectTo.startsWith("/");

      // Only honor redirect if it matches the user's role scope
      const roleRoot =
        userType === "customer"
          ? "/customer"
          : userType === "pharmacy-admin"
          ? "/pharmacy"
          : userType === "pharmacist"
          ? "/pharmacist"
          : userType === "admin"
          ? "/admin"
          : null;

      if (isSafeInternal && roleRoot && redirectTo.startsWith(roleRoot)) {
        navigate(redirectTo, { replace: true });
        return;
      }

      // If a post-auth intent exists and matches user role, prefer it
      if (
        savedIntent &&
        savedIntent.role === userType &&
        typeof savedIntent.path === "string" &&
        savedIntent.path.startsWith("/")
      ) {
        // Clear saved intent and any auxiliary state
        sessionStorage.removeItem("postAuthRedirect");
        // Keep findPharmacyState for the destination page to read
        navigate(savedIntent.path, { replace: true });
        return;
      }

      // ✅ Route based on userType from backend
      switch (userType) {
        case "customer":
          navigate("/customer", { replace: true });
          break;
        case "pharmacy-admin":
          navigate("/pharmacy", { replace: true });
          break;
        case "pharmacist":
          navigate("/pharmacist", { replace: true });
          break;
        case "admin":
          navigate("/admin", { replace: true });
          break;
        default:
          navigate("/customer", { replace: true });
      }
    }
  }, [isAuthenticated, userType, navigate, location.search]);

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

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ UPDATED: Simplified login handler for unified backend
  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitError("");

      console.log("Attempting unified login with:", formData);

      // ✅ Use unified login - backend will determine user type
      const response = await login(formData);
      console.log("Login successful:", response);

      // Navigation will be handled by the useEffect above based on response.userType
    } catch (error) {
      console.error("Login failed:", error);
      setSubmitError(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-hover to-accent relative overflow-hidden px-4 py-25">
      <Navbar />

      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>
      <div className="absolute top-32 right-20 w-80 h-80 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
      <div className="absolute -bottom-20 left-32 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000"></div>

      {/* Medical pattern background */}
      <div className="medical-pattern absolute inset-0 opacity-5"></div>

      {/* Animated geometric shapes */}
      <div className="absolute top-20 left-[20%] w-20 h-20 border-4 border-white/10 rounded-lg rotate-12 animate-spin-slow"></div>
      <div className="absolute bottom-40 right-[15%] w-16 h-16 border-4 border-secondary/20 rounded-full animate-pulse-slow"></div>

      {/* Glassmorphism login card */}
      <div
        className={`relative bg-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl border-white/20 p-6 sm:p-8 w-full max-w-md flex flex-col items-center gap-5 sm:gap-6 hover:shadow-3xl hover:bg-white/20 transition-all duration-500 fade-in ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Glass edge highlights */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30"></div>
        <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-black/5"></div>
        <div className="absolute top-[5%] bottom-[5%] left-0 w-[1px] bg-white/20"></div>
        <div className="absolute top-[5%] bottom-[5%] right-0 w-[1px] bg-black/5"></div>

        {/* Logo and branding */}
        <div className="flex flex-col items-center mb-1 relative z-10">
          <img
            src={assets.logo2}
            alt="icon"
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-34 md:h-34 filter drop-shadow-lg animate-fade-in-scale"
          />
          <h1 className="text-2xl font-bold text-white mt-4 text-center">
            Sign In to PillPath
          </h1>
          <p className="text-white/70 text-sm mt-1 text-center">
            Your <span className="text-secondary-green">health</span> journey
            starts here
          </p>

          {/* Animated rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-20 h-20 rounded-full border border-white/40 animate-ping-slow"></div>
            <div
              className="absolute w-32 h-32 rounded-full border border-white/20 animate-ping-slow"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
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

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="w-full space-y-5">
          {/* Email input */}
          <div className="w-full relative z-10 animate-fade-in-up delay-300">
            <label className="block text-light text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative group">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/25 transition-all duration-300 ${
                  errors.email ? "border-red-400" : "border-white/30"
                }`}
                disabled={loading}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-colors duration-200">
                <Mail size={20} />
              </div>
            </div>
            {errors.email && (
              <p className="text-red-300 text-xs mt-1 animate-fade-in">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password input */}
          <div className="w-full relative z-10 animate-fade-in-up delay-400">
            <label className="block text-light text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border placeholder-white/60 text-white pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/25 transition-all duration-300 ${
                  errors.password ? "border-red-400" : "border-white/30"
                }`}
                disabled={loading}
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

          {/* Forgot password */}
          <div className="w-full text-right relative z-10 animate-fade-in-up delay-500">
            <Link
              to="/forgot-password"
              className="text-info text-sm hover:text-primary-blue hover:underline transition-all duration-200"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign in button */}
          <div className="w-full animate-fade-in-up delay-600">
            <GradientButton
              text={loading ? "Signing In..." : "Sign In"}
              icon={LogIn}
              iconSize={18}
              gradient="from-secondary/90 to-secondary"
              hoverGradient="hover:from-secondary hover:to-accent/70"
              type="submit"
              disabled={loading}
              className={`${loading ? "opacity-80 pointer-events-none" : ""}`}
            />
          </div>
        </form>

        {/* Social login divider */}
        <div className="flex items-center w-full my-1 relative z-10 animate-fade-in-up delay-700">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="text-muted text-xs sm:text-sm px-4">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* Social login buttons */}
        <div className="flex flex-col items-center relative z-10 animate-fade-in-up delay-800 w-full">
          
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  if (!credentialResponse || !credentialResponse.credential) {
                    throw new Error(
                      "Google did not return a valid credential."
                    );
                  }
                  const idToken = credentialResponse.credential;
                  // Debug: verify Google ID token payload on login
                  try {
                    const payload = JSON.parse(atob(idToken.split(".")[1]));
                    console.log("[Google OAuth][Login] idToken payload:", {
                      aud: payload.aud,
                      iss: payload.iss,
                      email: payload.email,
                      exp: payload.exp,
                    });
                  } catch (e) {
                    console.warn(
                      "[Google OAuth][Login] Failed to decode idToken payload"
                    );
                  }
                  await socialLogin({ provider: "google", idToken });
                  // Navigation handled by useEffect
                } catch (error) {
                  setSubmitError(error.message || "Google sign in failed.");
                }
              }}
              onError={() => setSubmitError("Google sign in failed.")}
              width={320}
              text="continue_with"
              theme="filled_blue"
              shape="pill"
              size="large"
              logo_alignment="center"
            />
         
          <div className="text-white/70 text-sm mt-2">Sign in with Google</div>
        </div>

        {/* Create account link */}
        <div className="w-full mt-2 relative z-10 animate-fade-in-up delay-900">
          <p className="text-muted text-xs sm:text-sm text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-secondary-green font-medium hover:underline transition-all duration-200"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Medical/Pharmacy themed floating elements */}
        <div className="absolute top-[15%] right-[10%] w-8 h-4 bg-secondary/30 rounded-full rotate-45 animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] left-[12%] w-6 h-3 bg-primary/40 rounded-full rotate-[30deg] animate-pulse-slow"></div>
        <div
          className="absolute top-[70%] right-[8%] w-4 h-4 bg-accent/30 rounded-full animate-ping"
          style={{ animationDuration: "3s" }}
        ></div>
      </div>
    </div>
  );
};

export default Login;
