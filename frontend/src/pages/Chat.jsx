import React, { useState, useEffect } from 'react';
import { MessageCircle, MessageSquare, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChat } from '../contexts/ChatContextLive';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';

const ChatPage = () => {
  const [showChatList, setShowChatList] = useState(true);
  const { activeChat, connected, error, clearError, chats, loading } = useChat();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowChatList(true);
      } else if (activeChat) {
        setShowChatList(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [activeChat]);

  // Handle back navigation on mobile
  const handleBack = () => {
    setShowChatList(true);
  };

  // Calculate total unread messages
  const totalUnread = chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);

  // PAGE WRAPPER is fixed height and non-scrollable. Inner panes handle scroll.
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Fixed Header (no scroll) */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <MessageSquare className="h-8 w-8 mr-3 text-blue-600" />
                Messages
              </h1>
              <p className="text-gray-600">
                Connect with pharmacies for consultations and support
                {totalUnread > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {totalUnread} unread
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {connected ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Wifi className="w-4 h-4" />
                    <span className="text-sm font-medium">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-red-600">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-sm font-medium">Disconnected</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">⚠️</div>
              <div className="flex-1">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main area fills remaining height and only inner panes scroll */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        {loading && chats.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading chats...</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
            {/* Chat List Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`lg:col-span-1 ${showChatList ? 'block' : 'hidden lg:block'} h-full min-h-0`}
            >
              <div className="bg-white/40 backdrop-blur-xl rounded-lg shadow-xl border border-white/50 h-full min-h-0 flex flex-col">
                <ChatList />
              </div>
            </motion.div>

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`lg:col-span-2 ${!showChatList ? 'block' : 'hidden lg:block'} h-full min-h-0`}
            >
              <div className="bg-white/40 backdrop-blur-xl rounded-lg shadow-xl border border-white/50 h-full min-h-0 flex flex-col">
                {activeChat ? (
                  <ChatWindow onBack={handleBack} />
                ) : (
                  <div className="flex items-center justify-center flex-1">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No chat selected</h3>
                      <p className="text-gray-500">Choose a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;