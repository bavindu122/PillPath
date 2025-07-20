import React from "react";
import CustomerForm from "./CustomerForm";
import PharmacyForm from "./PharmacyForm";

const RegisterForm = ({ role, onBack, onSubmit }) => {
  const handleSubmit = (formData) => {
    // ✅ Pass the role and formData to parent
    console.log(`${role} registration submitted:`, formData);
    onSubmit(formData, role); // Pass role to distinguish registration type
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