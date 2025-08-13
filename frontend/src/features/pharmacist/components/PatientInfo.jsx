import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Clock,
  MapPin
} from 'lucide-react';
import '../pages/index-pharmacist.css';

const PatientInfo = ({ patientData }) => {
  if (!patientData) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 pharma-bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-4 pharma-bg-gray-200 rounded"></div>
            <div className="h-4 pharma-bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 pharma-bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pharma-border pb-4">
          <h3 className="text-lg font-semibold pharma-text-dark flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Patient Information</span>
          </h3>
        </div>

        {/* Patient Avatar and Basic Info */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-50">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h4 className="text-xl font-medium pharma-text-dark">{patientData.name}</h4>
            <p className="text-sm pharma-text-muted">Patient</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h5 className="font-medium pharma-text-gray-700">Contact Details</h5>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 pharma-bg-gray-50 rounded-lg">
              <Mail className="h-4 w-4 pharma-text-gray-500" />
              <div>
                <p className="text-xs pharma-text-gray-500">Email</p>
                <p className="text-sm font-medium pharma-text-dark">{patientData.email ? patientData.email : 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 pharma-bg-gray-50 rounded-lg">
              <Phone className="h-4 w-4 pharma-text-gray-500" />
              <div>
                <p className="text-xs pharma-text-gray-500">Phone</p>
                <p className="text-sm font-medium pharma-text-dark">{patientData.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="space-y-4">
          <h5 className="font-medium pharma-text-gray-700">Order Timeline</h5>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600">Order Created</p>
                <p className="text-sm font-medium pharma-text-dark">{patientData.orderDate}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50">
              <Clock className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-green-600">Completed</p>
                <p className="text-sm font-medium pharma-text-dark">{patientData.completedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t pharma-border">
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center space-x-1 px-3 py-2 text-xs rounded-lg hover:shadow-md transition-all duration-200 bg-blue-50">
              <Mail className="h-3 w-3 text-blue-600" />
              <span className="text-blue-600">Send Email</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 text-xs bg-gray-50 pharma-text-gray-700 rounded-lg hover:shadow-md transition-colors duration-200">
              <Phone className="h-3 w-3 " />
              <span>Call Patient</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;