import React from 'react';
import { Clock, AlertCircle, CheckCircle, MessageCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomerChatList = ({ chats, selectedChat, onSelectChat }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'waiting':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'waiting':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-white/10 text-white/70 border-white/20';
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

  if (chats.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center h-full">
        <div className="text-white/40 mb-4">
          <MessageCircle className="mx-auto h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium mb-2 text-white">
          No conversations found
        </h3>
        <p className="text-white/60">
          No conversations match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 h-full flex flex-col">
      <div className="p-4 border-b border-white/20">
        <h3 className="text-lg font-semibold text-white">
          Pharmacy Chats ({chats.length})
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat, index) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectChat(chat)}
            className={`p-4 border-b border-white/10 cursor-pointer transition-all duration-200 hover:bg-white/5 ${
              selectedChat?.id === chat.id ? 'bg-white/10 border-l-4 border-l-blue-400' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Pharmacy Avatar */}
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {chat.pharmacyName.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Chat Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white font-medium truncate">
                    {chat.pharmacyName}
                  </h4>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(chat.status)}
                    <span className="text-white/60 text-xs">
                      {formatTime(chat.lastMessageTime)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-3 w-3 text-white/40" />
                  <span className="text-white/60 text-xs">
                    {chat.pharmacyLocation}
                  </span>
                </div>

                <p className="text-white/70 text-sm truncate mb-2">
                  {chat.lastMessage}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">
                    Prescription: {chat.prescriptionId}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(chat.status)}`}>
                      {chat.status}
                    </span>
                    {chat.unreadCount > 0 && (
                      <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-medium">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CustomerChatList;
