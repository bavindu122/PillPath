import React from 'react';

export default function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <h2 className="text-3xl font-semibold text-gray-900">{value}</h2>
      </div>
      {icon}
    </div>
  );
}
