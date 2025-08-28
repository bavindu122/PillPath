import React from 'react';
import { Bell, User } from 'lucide-react';
import '../pages/index-pharmacist.css';

const Header = () => {
  return (
    <header className="pharma-bg-card shadow-sm border-b pharma-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Empty div to maintain layout structure */}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 pharma-text-muted hover:pharma-text-gray-500 focus:outline-none focus:ring-2 rounded-full transition-colors duration-200" style={{ focusRingColor: 'var(--pharma-blue)' }}>
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full pharma-bg-danger ring-2 ring-white"></span>
          </button>
          
          {/* Profile */}
          <div className="flex items-center space-x-3">
            <div className="flex flex-col text-right">
              <span className="text-sm font-medium pharma-text-dark">Dr. Sarah Johnson</span>
              <span className="text-xs pharma-text-muted">Lead Pharmacist</span>
            </div>
            <div className="h-8 w-8 rounded-full pharma-bg-primary flex items-center justify-center">
              <User className="h-5 w-5 pharma-text-light" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;