import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import '../pages/index-pharmacist.css';

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
    <div className="flex h-screen pharma-bg-light overflow-hidden">
      <div className="sidebar-slide-in hidden lg:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full" style={{ backgroundColor: 'rgba(45, 93, 160, 0.1)' }}>
            <div className="flex space-x-1">
              <div className="w-3 h-3 pharma-bg-primary rounded-full loading-dot-1"></div>
              <div className="w-3 h-3 pharma-bg-primary rounded-full loading-dot-2"></div>
              <div className="w-3 h-3 pharma-bg-primary rounded-full loading-dot-3"></div>
            </div>
          </div>
          <p className="pharma-text-gray-600 font-medium animate-pulse text-sm sm:text-base">{loadingMessage}</p>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return loadingScreen;
  }

  return (
    <div className="flex h-screen pharma-bg-light overflow-hidden">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <div className="hidden xl:block sidebar-slide-in">
        <Sidebar />
      </div>
      
      {/* Mobile Sidebar */}
      <div className="xl:hidden">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden xl:ml-0">
        {/* Header */}
        <div className="dashboard-fade-in-1 flex-shrink-0">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          {/* Page Header */}
          {(title || showBackButton || headerActions) && (
  <div className="dashboard-fade-in-1 mb-6 lg:mb-8 h-16 flex">
    <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-6 w-full h-full items-center">
                {showBackButton && onBack && (
                  <button
                    onClick={onBack}
                    className="flex items-center space-x-2 sm:space-x-3 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50 px-3 sm:px-4 py-2 rounded-lg group w-fit"
                  >
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="font-medium text-sm sm:text-base">Back To Previous</span>
                  </button>
                )}

                {title && (
                  <div className="text-center flex-1 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 py-6 sm:py-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-800">{title}</h1>
                    {subtitle && <p className="text-gray-600 mt-1 text-sm sm:text-base">{subtitle}</p>}
                  </div>
                )}

                {headerActions && (
                  <div className="flex items-center space-x-2 sm:space-x-4 justify-center sm:justify-end sm:ml-auto">
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