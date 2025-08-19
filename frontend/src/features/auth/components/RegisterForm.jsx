import React, { useState } from "react";
import CustomerForm from "./CustomerForm";
import PharmacyForm from "./PharmacyForm";
import { useAuth } from "../../../hooks/useAuth";

const RegisterForm = ({ role, onBack, onSubmit }) => {
  const { register } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ UPDATED: Better error handling
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`${role} registration form data:`, formData);
      
      // ✅ Call register with the form data and role
      const response = await register(formData, role);
      
      console.log("Registration API response:", response);
      
      // ✅ Call parent's onSubmit with the response
      onSubmit(response);
    } catch (error) {
      console.error('Registration submission failed:', error);
      setError(error.message || 'Registration failed. Please try again.');
      
      // Show user-friendly error messages
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        setError('An account with this email already exists. Please use a different email or try logging in.');
      } else if (error.message.includes('JPA EntityManager')) {
        setError('Server is temporarily unavailable. Please try again in a few moments.');
      } else if (error.message.includes('connection')) {
        setError('Unable to connect to server. Please check your internet connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/40 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}
      
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
    </>
  );
};

export default RegisterForm;