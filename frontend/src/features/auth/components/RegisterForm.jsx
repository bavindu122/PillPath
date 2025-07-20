import React from "react";
import CustomerForm from "./CustomerForm";
import PharmacyForm from "./PharmacyForm";
import { useAuth } from "../../../hooks/useAuth";

const RegisterForm = ({ role, onBack, onSubmit }) => {
  const { register } = useAuth();

  const handleSubmit = async (formData) => {
    try {
      console.log(`${role} registration submitted:`, formData);
      
      // ✅ Use the register function from useAuth
      const response = await register(formData, role);
      
      // Call parent's onSubmit with the response
      onSubmit(response);
    } catch (error) {
      console.error('Registration submission failed:', error);
      throw error; // Re-throw to let individual forms handle the error
    }
  };

  return (
    <>
      {role === "customer" ? (
        <CustomerForm onBack={onBack} onSubmit={handleSubmit} />
      ) : (
        <PharmacyForm onBack={onBack} onSubmit={handleSubmit} />
      )}
    </>
  );
};

export default RegisterForm;