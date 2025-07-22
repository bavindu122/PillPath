import React from 'react';
import {
  Activity,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Clock,
  User,
  Calendar
} from 'lucide-react';

const getActivityIcon = (action) => {
  switch (action.toLowerCase()) {
    case 'approve':
    case 'approved':
      return <CheckCircle size={16} className="text-green-500" />;
    case 'reject':
    case 'rejected':
      return <XCircle size={16} className="text-red-500" />;
    case 'suspend':
    case 'suspended':
      return <Pause size={16} className="text-red-500" />;
    case 'activate':
    case 'activated':
      return <Play size={16} className="text-green-500" />;
    case 'registered':
    case 'registration':
      return <User size={16} className="text-blue-500" />;
    default:
      return <Activity size={16} className="text-gray-500" />;
  }
};

const getActivityColor = (action) => {
  switch (action.toLowerCase()) {
    case 'approve':
    case 'approved':
    case 'activate':
    case 'activated':
      return 'text-green-600';
    case 'reject':
    case 'rejected':
    case 'suspend':
    case 'suspended':
      return 'text-red-600';
    case 'registered':
    case 'registration':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return date.toLocaleDateString();
};

export default function RecentActivityCard({ title = "Recent Activities", activities = [] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-10">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Activity size={24} className="mr-3 text-blue-600" /> 
        {title}
      </h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Activity size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No recent activities</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((item, index) => (
            <div key={item.id || index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(item.action)}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 truncate">
                        {item.user || item.pharmacyName || 'System'}
                      </span>
                      <span className={`text-sm font-medium ${getActivityColor(item.action)}`}>
                        {item.action}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">
                      {item.description || item.details || 'No details available'}
                    </p>
                    
                    {item.reason && (
                      <p className="text-xs text-gray-500 italic">
                        Reason: {item.reason}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0 text-right ml-4">
                    <div className="text-xs text-gray-400 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {formatTime(item.timestamp || item.time || item.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activities.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all activities
          </button>
        </div>
      )}
    </div>
  );
}