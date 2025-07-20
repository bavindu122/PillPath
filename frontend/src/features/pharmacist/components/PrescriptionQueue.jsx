import React from 'react';
import { Filter, Clock, Calendar, User, XCircle, MessageCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../pages/index-pharmacist.css';

const PrescriptionQueue = ({ prescriptions, onApprove, onReject, onClarify }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High Priority':
        return 'priority-high';
      case 'Medium Priority':
        return 'priority-medium';
      case 'Low Priority':
        return 'priority-low';
      default:
        return 'priority-default';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center animate-fade-in-left">
          <div className="w-1 h-6 rounded-full mr-3" style={{ background: 'linear-gradient(to bottom, var(--pharma-blue-600), var(--pharma-blue-700))' }}></div>
          Prescription Queue
        </h2>
        <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:shadow-md transition-all duration-200 group nav-item" style={{ borderColor: 'var(--pharma-gray-300)', backgroundColor: 'transparent' }}>
          <Filter className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
          <span className="text-sm font-medium">Filter</span>
        </button>
      </div>

      <div className="space-y-4">
        {prescriptions.map((prescription, index) => (
          <div
            key={prescription.id}
            className={`border rounded-xl p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group animate-fade-in-left`}
            style={{
              animationDelay: `${index * 150}ms`,
              borderColor: 'var(--pharma-gray-200)',
              backgroundColor: 'white'
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:shadow-md transition-shadow duration-200" style={{ background: 'linear-gradient(to bottom right, var(--pharma-gray-200), var(--pharma-gray-300))' }}>
                    <User className="h-6 w-6" style={{ color: 'var(--pharma-gray-600)' }} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white status-indicator" style={{ backgroundColor: 'var(--pharma-green-500)' }}></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="font-semibold transition-colors duration-200" style={{ color: 'var(--pharma-gray-900)' }}>
                      {prescription.patientName}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(prescription.priority)} transition-all duration-200 hover:shadow-sm`}>
                      {prescription.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-xs" style={{ color: 'var(--pharma-gray-500)' }}>
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
                  className="flex items-center space-x-1 px-4 py-2 text-xs font-medium rounded-lg hover:shadow-md transform hover:scale-105 transition-all duration-200"
                  style={{
                    background: 'var(--pharma-blue-100)',
                    color: 'var(--pharma-blue-800)'
                  }}
                >
                  <Eye className="h-3 w-3" />
                  <span>Review</span>
                </Link>
                <button
                  onClick={() => onClarify(prescription.id)}
                  className="flex items-center space-x-1 px-4 py-2 text-xs font-medium rounded-lg hover:shadow-md transform hover:scale-105 transition-all duration-200"
                  style={{
                    background: 'var(--pharma-yellow-100)',
                    color: 'var(--pharma-yellow-800)'
                  }}
                >
                  <MessageCircle className="h-3 w-3" />
                  <span>Clarify</span>
                </button>
                <button
                  onClick={() => onReject(prescription.id)}
                  className="flex items-center space-x-1 px-4 py-2 text-xs font-medium rounded-lg hover:shadow-md transform hover:scale-105 transition-all duration-200"
                  style={{
                    background: 'var(--pharma-red-100)',
                    color: 'var(--pharma-red-800)'
                  }}
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