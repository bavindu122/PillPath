import React from 'react';

export default function PageHeader({ icon: Icon, title, subtitle }) {
  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold text-gray-800 flex items-center">
        <Icon className="mr-3 text-blue-600" size={36} />
        {title}
      </h1>
      <p className="text-gray-600 mt-2">{subtitle}</p>
    </header>
  );
}