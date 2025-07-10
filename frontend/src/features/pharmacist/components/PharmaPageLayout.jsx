import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

const PharmaPageLayout = ({ 
  children, 
  title, 
  subtitle, 
  isLoading = false, 
  loadingMessage = "Loading...",
  showBackButton = false,
  onBack,
  headerActions
}) => {
  const loadingScreen = (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="sidebar-slide-in">
        <Sidebar />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full loading-dot-1"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full loading-dot-2"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full loading-dot-3"></div>
            </div>
          </div>
          <p className="text-gray-600 font-medium animate-pulse">{loadingMessage}</p>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return loadingScreen;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="sidebar-slide-in">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="dashboard-fade-in-1 flex-shrink-0">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header with optional back button and title */}
          {(title || showBackButton || headerActions) && (
            <div className="dashboard-fade-in-1 mb-8">
              <div className="flex items-center justify-between mb-6">
                {showBackButton && onBack && (
                  <button
                    onClick={onBack}
                    className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50 px-4 py-2 rounded-lg group"
                  >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="font-medium">Back to Dashboard</span>
                  </button>
                )}

                {title && (
                  <div className="text-center flex-1">
                    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                    {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
                  </div>
                )}

                {headerActions && (
                  <div className="flex items-center space-x-4">
                    {headerActions}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Page Content */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default PharmaPageLayout;
