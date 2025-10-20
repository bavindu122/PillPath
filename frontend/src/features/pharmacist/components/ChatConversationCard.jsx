import React from 'react';
import { Clock, AlertCircle, CheckCircle, User } from 'lucide-react';

const ChatConversationCard = ({ conversation, isSelected, onSelect }) => {
  const {
    id,
    patientName,
    patientAvatar,
    lastMessage,
    lastMessageTime,
    unreadCount,
    status,
    priority,
    prescriptionId
  } = conversation;

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'waiting':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      const now = new Date();
      const diffInMinutes = (now - date) / (1000 * 60);
      const diffInHours = diffInMinutes / 60;
      const diffInDays = diffInHours / 24;
      
      if (diffInMinutes < 1) {
        return 'Just now';
      } else if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)}m ago`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else if (diffInDays < 7) {
        return `${Math.floor(diffInDays)}d ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`p-4 border-b border-blue-100 cursor-pointer transition-all duration-200 hover:bg-blue-50/50 ${
        isSelected ? 'bg-blue-100/70 border-l-4 border-l-blue-600' : 'hover:shadow-sm'
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0 relative">
          {patientAvatar ? (
            <img
              src={patientAvatar}
              alt={patientName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <User className="h-6 w-6 text-white" />
            </div>
          )}
          {/* Online indicator for active chats */}
          {status === 'active' && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse shadow-sm"></div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {patientName}
              </h4>
              {getStatusIcon()}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
              <span className="text-xs text-gray-500 font-medium">
                {formatTime(lastMessageTime)}
              </span>
            </div>
          </div>

          {/* Prescription ID if available */}
          {prescriptionId && (
            <p className="text-xs mb-1 text-gray-500 font-medium">
              {prescriptionId}
            </p>
          )}

          {/* Last Message */}
          <p className="text-sm text-gray-600 truncate mb-2 leading-relaxed">
            {lastMessage.startsWith('You:') ? (
              <span className="font-medium text-blue-600">You: </span>
            ) : null}
            {lastMessage.replace('You: ', '')}
          </p>

          {/* Priority Badge */}
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor()} shadow-sm`}>
            {priority} priority
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatConversationCard;
