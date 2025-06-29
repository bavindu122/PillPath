import React from "react";
import CustomerForm from "./CustomerForm";
import PharmacyForm from "./PharmacyForm";

const RegisterForm = ({ role, onBack, onSubmit }) => {
  const handleSubmit = (formData) => {
    // Here you would typically handle the form submission
    // like sending data to an API
    console.log(`${role} registration submitted:`, formData);
    onSubmit(formData);
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