import React from 'react';

export default function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-2">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}
