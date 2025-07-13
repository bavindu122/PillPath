import React from 'react';

const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Add Staff */}
      <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-3a4 4 0 11-8 0 4 4 0 018 0zM12 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"></path></svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Add Staff</h3>
          <p className="text-gray-500 text-sm">Add new team member</p>
        </div>
      </div>

      {/* Add Inventory */}
      <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
        <div className="p-3 bg-green-100 rounded-full">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Add Inventory</h3>
          <p className="text-gray-500 text-sm">New product entry</p>
        </div>
      </div>

      {/* Update Pharmacy */}
      <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
        <div className="p-3 bg-purple-100 rounded-full">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.54-1.282 2.074-1.282 2.614 0l.54 1.282a1 1 0 001.54.49l1.282-.54c1.282-.54 1.822.49 1.282 1.282l-.54 1.282a1 1 0 00.49 1.54l1.282.54c1.282.54 1.282 2.074 0 2.614l-1.282.54a1 1 0 00-.49 1.54l.54 1.282c.54 1.282-.49 1.822-1.282 1.282l-1.282-.54a1 1 0 00-1.54.49l-.54 1.282c-.54 1.282-2.074 1.282-2.614 0l-.54-1.282a1 1 0 00-1.54-.49l-1.282.54c-1.282.54-1.822-.49-1.282-1.282l.54-1.282a1 1 0 00-.49-1.54l-1.282-.54c-1.282-.54-1.282-2.074 0-2.614l1.282-.54a1 1 0 00.49-1.54l-.54-1.282c-.54-1.282.49-1.822 1.282-1.282l1.282.54a1 1 0 001.54-.49z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Update Pharmacy</h3>
          <p className="text-gray-500 text-sm">Edit pharmacy details</p>
        </div>
      </div>

      {/* Update Prices */}
      <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
        <div className="p-3 bg-red-100 rounded-full">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5.5l-.5 1.5A3.5 3.5 0 0110 8a3.5 3.5 0 01-3.5-3.5V3z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14h-6"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10H8.5l-.5 1.5A3.5 3.5 0 018.5 15a3.5 3.5 0 01-3.5-3.5V10z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 17h-6"></path></svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Update Prices</h3>
          <p className="text-gray-500 text-sm">Manage pricing</p>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;