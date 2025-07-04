import React from 'react';
import { Filter, Clock, Calendar, User, XCircle, MessageCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrescriptionQueue = ({ prescriptions, onApprove, onReject, onClarify }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High Priority':
        return 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200 priority-high';
      case 'Medium Priority':
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low Priority':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center animate-fade-in-left">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-3"></div>
          Prescription Queue
        </h2>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 group nav-item">
          <Filter className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
          <span className="text-sm font-medium">Filter</span>
        </button>
      </div>

      <div className="space-y-4">
        {prescriptions.map((prescription, index) => (
          <div
            key={prescription.id}
            className={`border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white group animate-fade-in-left`}
            style={{
              animationDelay: `${index * 150}ms`
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center group-hover:shadow-md transition-shadow duration-200">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white status-indicator"></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {prescription.patientName}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(prescription.priority)} transition-all duration-200 hover:shadow-sm`}>
                      {prescription.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{prescription.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{prescription.time}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                <Link
                  to={`/pharmacist/review/${prescription.id}`}
                  className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-medium rounded-lg hover:from-blue-200 hover:to-blue-300 hover:shadow-md transform hover:scale-105 transition-all duration-200"
                >
                  <Eye className="h-3 w-3" />
                  <span>Review</span>
                </Link>
                <button
                  onClick={() => onClarify(prescription.id)}
                  className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 text-xs font-medium rounded-lg hover:from-yellow-200 hover:to-yellow-300 hover:shadow-md transform hover:scale-105 transition-all duration-200"
                >
                  <MessageCircle className="h-3 w-3" />
                  <span>Clarify</span>
                </button>
                <button
                  onClick={() => onReject(prescription.id)}
                  className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-xs font-medium rounded-lg hover:from-red-200 hover:to-red-300 hover:shadow-md transform hover:scale-105 transition-all duration-200"
                >
                  <XCircle className="h-3 w-3" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionQueue;