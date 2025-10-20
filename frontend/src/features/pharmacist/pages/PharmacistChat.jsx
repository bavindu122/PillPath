import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Filter, Settings } from 'lucide-react';
import { useChat } from '../../../contexts/ChatContextLive';
import ChatList from '../../../components/chat/ChatList';
import ChatWindow from '../../../components/chat/ChatWindow';

const PharmacistChat = () => {
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [chatFilter, setChatFilter] = useState('all'); // all, unread, active
  const { activeChat, chats, loading } = useChat();

  // Filter chats based on selected filter
  const filteredChats = chats.filter(chat => {
    switch (chatFilter) {
      case 'unread':
        return chat.unreadCount > 0;
      case 'active':
        return chat.lastMessageTime && 
               new Date() - new Date(chat.lastMessageTime) < 24 * 60 * 60 * 1000; // Last 24 hours
      default:
        return true;
    }
  });

  // Handle responsive behavior
  useEffect(() => {
    if (activeChat && window.innerWidth < 768) {
      setShowMobileChat(true);
    }
  }, [activeChat]);

  // Handle back from chat window on mobile
  const handleBackToChats = () => {
    setShowMobileChat(false);
  };

  // Get filter button class
  const getFilterButtonClass = (filter) => {
    const base = "px-3 py-1 text-sm rounded-full transition-colors";
    const active = "bg-blue-600 text-white";
    const inactive = "bg-gray-100 text-gray-600 hover:bg-gray-200";
    
    return `${base} ${chatFilter === filter ? active : inactive}`;
  };

  return (
    <div className="h-full bg-white">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-900">
            {showMobileChat && activeChat ? (
              activeChat.customer?.name || 'Customer'
            ) : (
              'Patient Messages'
            )}
          </h1>
        </div>
        
        {!showMobileChat && (
          <div className="flex items-center space-x-2">
            <select
              value={chatFilter}
              onChange={(e) => setChatFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Chats</option>
              <option value="unread">Unread</option>
              <option value="active">Active</option>
            </select>
          </div>
        )}
      </div>

      {/* Desktop/Tablet Layout */}
      <div className="hidden md:flex h-full">
        {/* Chat List Sidebar */}
        <div className="w-80 lg:w-96 border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <MessageCircle className="w-6 h-6 mr-2 text-blue-600" />
                Patient Messages
              </h2>
              <button
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Chat settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setChatFilter('all')}
                className={getFilterButtonClass('all')}
              >
                All ({chats.length})
              </button>
              <button
                onClick={() => setChatFilter('unread')}
                className={getFilterButtonClass('unread')}
              >
                Unread ({chats.filter(chat => chat.unreadCount > 0).length})
              </button>
              <button
                onClick={() => setChatFilter('active')}
                className={getFilterButtonClass('active')}
              >
                Active
              </button>
            </div>
          </div>
          
          <ChatList chats={filteredChats} />
        </div>

        {/* Chat Window */}
        <div className="flex-1">
          {activeChat ? (
            <ChatWindow />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                <p className="text-gray-500">
                  {loading ? 'Loading conversations...' : 
                   chats.length === 0 ? 'No patient messages yet' :
                   'Select a conversation to start messaging'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-full">
        {showMobileChat && activeChat ? (
          <ChatWindow onBack={handleBackToChats} />
        ) : (
          <div className="h-full">
            {/* Filter tabs for mobile */}
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => setChatFilter('all')}
                  className={getFilterButtonClass('all')}
                >
                  All
                </button>
                <button
                  onClick={() => setChatFilter('unread')}
                  className={getFilterButtonClass('unread')}
                >
                  Unread
                </button>
                <button
                  onClick={() => setChatFilter('active')}
                  className={getFilterButtonClass('active')}
                >
                  Active
                </button>
              </div>
            </div>

            <ChatList chats={filteredChats} />
            
            {/* Empty state for mobile */}
            {filteredChats.length === 0 && !loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {chatFilter === 'unread' ? 'No unread messages' :
                     chatFilter === 'active' ? 'No active conversations' :
                     'No patient messages yet'}
                  </p>
                  {chatFilter !== 'all' && (
                    <button
                      onClick={() => setChatFilter('all')}
                      className="mt-2 text-blue-600 hover:text-blue-700"
                    >
                      View all conversations
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Statistics (Desktop only) */}
      <div className="hidden lg:block fixed bottom-4 left-4">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Chat Summary</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-medium">{chats.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Unread:</span>
              <span className="font-medium text-red-600">
                {chats.filter(chat => chat.unreadCount > 0).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Active Today:</span>
              <span className="font-medium text-green-600">
                {chats.filter(chat => 
                  chat.lastMessageTime && 
                  new Date() - new Date(chat.lastMessageTime) < 24 * 60 * 60 * 1000
                ).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistChat;