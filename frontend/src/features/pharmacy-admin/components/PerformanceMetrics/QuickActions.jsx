import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const getCardColor = (type) => {
    switch (type) {
      case 'Add Staff':
        return 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'Add Inventory':
        return 'border-green-200 bg-gradient-to-br from-green-50 to-green-100';
      case 'Update Pharmacy':
        return 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'Update Prices':
        return 'border-red-200 bg-gradient-to-br from-red-50 to-red-100';
      default:
        return 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'Add Staff':
        return 'text-blue-600';
      case 'Add Inventory':
        return 'text-green-600';
      case 'Update Pharmacy':
        return 'text-purple-600';
      case 'Update Prices':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const quickActions = [
    {
      type: 'Add Staff',
      description: 'Add new team member',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-3a4 4 0 11-8 0 4 4 0 018 0zM12 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"></path></svg>
      ),
      link: '/pharmacy/pharmacystaff',
    },
    {
      type: 'Add Inventory',
      description: 'New product entry',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
      ),
      link: '/pharmacy/pharmacyinventory',
    },
    {
      type: 'Update Pharmacy',
      description: 'Edit pharmacy details',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.54-1.282 2.074-1.282 2.614 0l.54 1.282a1 1 0 001.54.49l1.282-.54c1.282-.54 1.822.49 1.282 1.282l-.54 1.282a1 1 0 00.49 1.54l1.282.54c1.282.54 1.282 2.074 0 2.614l-1.282.54a1 1 0 00-.49 1.54l.54 1.282c.54 1.282-.49 1.822-1.282 1.282l-1.282-.54a1 1 0 00-1.54.49l-.54 1.282c-.54 1.282-2.074 1.282-2.614 0l-.54-1.282a1 1 0 00-1.54-.49l-1.282.54c-1.282.54-1.822-.49-1.282-1.282l.54-1.282a1 1 0 00-.49-1.54l-1.282-.54c-1.282-.54-1.282-2.074 0-2.614l1.282-.54a1 1 0 00.49-1.54l-.54-1.282c-.54-1.282.49-1.822 1.282-1.282l1.282.54a1 1 0 001.54-.49z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
      ),
      link: '/pharmacy/pharmacyprofile',
    },
    {
      type: 'Update Prices',
      description: 'Manage pricing',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5.5l-.5 1.5A3.5 3.5 0 0110 8a3.5 3.5 0 01-3.5-3.5V3z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14h-6"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10H8.5l-.5 1.5A3.5 3.5 0 018.5 15a3.5 3.5 0 01-3.5-3.5V10z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 17h-6"></path></svg>
      ),
      link: '/pharmacy/pharmacyinventory',
    },
  ];

  const navigate = useNavigate();

  return (
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
      {quickActions.map((action, index) => (
        <div
          key={index}
          onClick={() => navigate(action.link)}
          className={`${getCardColor(action.type)} border rounded-2xl px-8 py-8 min-w-[220px] min-h-[180px] flex flex-col items-center justify-center shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group`}
          style={{
            animationDelay: `${index * 100}ms`,
            animation: 'slideInUp 0.6s ease-out forwards'
          }}
        >
          <div className="flex flex-col items-center w-full mb-4">
            <div className={`mb-4 ${getIconColor(action.type)} opacity-90 group-hover:opacity-100 transition-opacity duration-200`}>
              {React.cloneElement(action.icon, { className: `w-10 h-10 ${getIconColor(action.type)}` })}
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-1 group-hover:scale-105 transition-transform duration-200 text-center">
              {action.type}
            </h3>
            <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors duration-200 text-center">
              {action.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickActions;







