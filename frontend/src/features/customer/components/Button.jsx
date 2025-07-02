import React from "react";

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`bg-pButton text-white px-4 py-2 rounded-lg font-medium hover:bg-pButtonH transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
