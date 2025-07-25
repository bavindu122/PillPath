import React from 'react';
import { MessageSquare, Plus, User, Send } from 'lucide-react';
import '../pages/index-pharmacist.css';

const PatientMessages = ({ messages }) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold pharma-text-dark flex items-center animate-fade-in-left">
          <div className="w-1 h-5 rounded-full mr-3" style={{ background: 'linear-gradient(to bottom, var(--pharma-purple), var(--pharma-blue))' }}></div>
          Patient Messages
        </h2>
        <button className="flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-lg hover:shadow-md transform hover:scale-105 transition-all duration-200 pharma-text-primary" style={{ background: 'linear-gradient(to right, rgba(45, 93, 160, 0.1), rgba(45, 93, 160, 0.2))' }}>
          <Plus className="h-3 w-3" />
          <span>New Message</span>
        </button>
      </div>
      
      <div className="space-y-3">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className="flex items-start space-x-3 p-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg cursor-pointer transition-all duration-300 group transform hover:scale-102 animate-fade-up"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center group-hover:shadow-md transition-shadow duration-200">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              {message.unread && (
                <>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                </>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`text-sm ${message.unread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'} truncate group-hover:text-blue-600 transition-colors duration-200`}>
                  {message.name}
                </h4>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Send className="h-3 w-3 text-blue-500" />
                </div>
              </div>
              <p className="text-xs text-gray-500 truncate group-hover:text-gray-600 transition-colors duration-200">
                {message.message}
              </p>
              
              {/* Message preview animation */}
              <div className="mt-2 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientMessages;