import React, { useState } from 'react';
import { Check, CheckCheck, Download, Eye, Image as ImageIcon, FileText, Clock } from 'lucide-react';

const MessageBubble = ({ message, currentUser, showAvatar = true, isGrouped = false }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const isOwnMessage = message.senderId === currentUser?.id;
  const timestamp = new Date(message.timestamp);
  
  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for day separator
  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  // Get message status icon
  const getStatusIcon = () => {
    if (!isOwnMessage) return null;
    
    switch (message.status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      case 'sending':
        return <Clock className="w-4 h-4 text-gray-400 animate-pulse" />;
      default:
        return <Check className="w-4 h-4 text-gray-400" />;
    }
  };

  // Handle file download
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Render message content based on type
  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'image':
        return (
          <div className="relative max-w-xs">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            )}
            
            {imageError ? (
              <div className="p-4 bg-gray-100 rounded-lg flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500 text-sm">Image failed to load</span>
              </div>
            ) : (
              <img
                src={message.fileUrl || message.content}
                alt="Shared image"
                className={`rounded-lg max-w-full h-auto ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            )}
            
            {message.caption && (
              <p className="mt-2 text-sm">{message.caption}</p>
            )}
          </div>
        );

      case 'file':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg max-w-xs">
            <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {message.fileName || 'File'}
              </p>
              {message.fileSize && (
                <p className="text-xs text-gray-500">
                  {formatFileSize(message.fileSize)}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDownload(message.fileUrl, message.fileName)}
              className="p-1 text-blue-600 hover:text-blue-700"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        );

      case 'prescription':
        return (
          <div className="p-3 bg-blue-50 rounded-lg max-w-xs">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Prescription</span>
            </div>
            {message.content && (
              <p className="text-sm text-gray-700 mb-2">{message.content}</p>
            )}
            <div className="flex space-x-2">
              <button
                onClick={() => window.open(message.fileUrl, '_blank')}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                <Eye className="w-3 h-3 inline mr-1" />
                View
              </button>
              <button
                onClick={() => handleDownload(message.fileUrl, message.fileName)}
                className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
              >
                <Download className="w-3 h-3 inline mr-1" />
                Download
              </button>
            </div>
          </div>
        );

      default:
        return <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>;
    }
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-${isGrouped ? '1' : '4'}`}>
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {showAvatar && !isOwnMessage && !isGrouped && (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
            {message.senderAvatar ? (
              <img
                src={message.senderAvatar}
                alt={message.senderName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-gray-600">
                {message.senderName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
        )}

        {/* Spacer for grouped messages */}
        {!showAvatar && !isOwnMessage && isGrouped && (
          <div className="w-8"></div>
        )}

        {/* Message Bubble */}
        <div className="flex flex-col">
          {/* Sender name for other's messages */}
          {!isOwnMessage && !isGrouped && (
            <span className="text-xs text-gray-500 mb-1 px-2">
              {message.senderName || 'Unknown User'}
            </span>
          )}

          {/* Message Content */}
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwnMessage
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
            } ${isGrouped ? 'mt-1' : ''}`}
          >
            {renderMessageContent()}
          </div>

          {/* Timestamp and Status */}
          <div className={`flex items-center space-x-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500">
              {formatTime(timestamp)}
            </span>
            {getStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Date Separator Component
export const DateSeparator = ({ date }) => {
  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="flex items-center justify-center my-4">
      <div className="bg-gray-100 px-4 py-1 rounded-full">
        <span className="text-xs text-gray-600 font-medium">
          {formatDate(new Date(date))}
        </span>
      </div>
    </div>
  );
};

// Typing Indicator Component
export const TypingIndicator = ({ senderName, avatar }) => {
  return (
    <div className="flex items-end space-x-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={senderName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <span className="text-xs font-medium text-gray-600">
            {senderName?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        )}
      </div>
      
      <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-sm">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;