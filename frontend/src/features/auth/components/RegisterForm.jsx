import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import CustomerForm from "./CustomerForm";
import PharmacyForm from "./PharmacyForm";
import { useAuth } from "../../../hooks/useAuth";

const RegisterForm = ({ role, onBack, onSubmit, showGoogle }) => {
  const { register, socialLogin } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ UPDATED: Better error handling
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      console.log(`${role} registration form data:`, formData);

      // ✅ Call register with the form data and role
      const response = await register(formData, role);

      console.log("Registration API response:", response);

      setSuccess(true);
      // ✅ Call parent's onSubmit with the response
      onSubmit(response);
    } catch (error) {
      console.error("Registration submission failed:", error);
      setError(error.message || "Registration failed. Please try again.");

      // Show user-friendly error messages
      if (
        error.message.includes("already registered") ||
        error.message.includes("already exists")
      ) {
        setError(
          "An account with this email already exists. Please use a different email or try logging in."
        );
      } else if (error.message.includes("JPA EntityManager")) {
        setError(
          "Server is temporarily unavailable. Please try again in a few moments."
        );
      } else if (error.message.includes("connection")) {
        setError(
          "Unable to connect to server. Please check your internet connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 w-full max-w-2xl mx-auto">
      {role === "customer" ? (
        <CustomerForm
          onBack={onBack}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      ) : (
        <PharmacyForm
          onBack={onBack}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      )}
      {/* Google Sign Up for Customers (now at bottom) */}
      {showGoogle && (
        <>
          <div className="w-full flex items-center my-4">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-white/50 text-xs px-4">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>
          <div className="flex flex-col items-center mt-4">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                setLoading(true);
                setError(null);
                setSuccess(false);
                try {
                  if (!credentialResponse || !credentialResponse.credential) {
                    setError("Google did not return a valid credential.");
                    setLoading(false);
                    return;
                  }
                  const idToken = credentialResponse.credential;
                  const googleData = {
                    provider: "google",
                    idToken,
                  };
                  const response = await socialLogin(googleData);
                  if (response && response.token) {
                    console.log("Google signup token:", response.token);
                  } else {
                    console.log("No token data");
                  }
                  setSuccess(true);
                  onSubmit(response);
                } catch (error) {
                  setError(error.message || "Google registration failed.");
                } finally {
                  setLoading(false);
                }
              }}
              onError={() => setError("Google sign in failed.")}
              width={300}
              text="signup_with"
              shape="rectangular"
              size="large"
            />
            <div className="text-white/70 text-sm mt-2">
              Sign up with Google
            </div>
            <div className="text-white/60 text-xs mt-1 italic">
              Note: Google sign up is available for customers only.
            </div>
          </div>
        </>
      )}
      {success && (
        <div className="w-full mb-4 p-3 bg-green-500/20 border border-green-500/40 rounded-lg animate-fade-in text-green-900 text-center font-semibold">
          Registration successful!
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
