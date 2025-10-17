import React from "react";

// Minimal, reusable loading indicator used across routes/guards
export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center w-full h-full py-12">
      <div className="flex items-center space-x-3 text-gray-600">
        <svg
          className="animate-spin h-5 w-5 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
