import React, { useState, useEffect } from 'react';
import { MessageCircle, Wifi, WifiOff } from 'lucide-react';
import { useChat } from '../contexts/ChatContextLive';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';

const ChatPage = () => {
  const [showChatList, setShowChatList] = useState(true);
  const { activeChat, connected, error, clearError } = useChat();

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

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
        </div>

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

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex items-center justify-between">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat List - Desktop: Always visible, Mobile: Conditional */}
        <div className={`${
          showChatList ? 'block' : 'hidden'
        } lg:block w-full lg:w-80 xl:w-96 border-r border-gray-200`}>
          <ChatList />
        </div>

        {/* Chat Window - Desktop: Always visible, Mobile: Conditional */}
        <div className={`${
          !showChatList ? 'block' : 'hidden'
        } lg:block flex-1`}>
          <ChatWindow onBack={handleBack} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;