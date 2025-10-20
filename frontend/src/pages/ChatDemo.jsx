import React from 'react';
import { useChat } from '../contexts/ChatContextLive';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import PharmacySearchModal from '../components/chat/PharmacySearchModal';

const ChatDemo = () => {
  const { chats, activeChat, mockMode, connected } = useChat();
  const [showSearch, setShowSearch] = React.useState(false);

  return (
    <div className="h-screen bg-gray-100">
      {/* Demo Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Chat System Demo</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Mode: {mockMode ? '🚀 Mock Data' : '📡 Live API'}</span>
              <span>Status: {connected ? '🟢 Connected' : '🔴 Offline'}</span>
              <span>Chats: {chats.length}</span>
            </div>
          </div>
          <button
            onClick={() => setShowSearch(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search Pharmacies
          </button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex h-full">
        {/* Chat List */}
        <div className="w-80 border-r border-gray-200 bg-white">
          <ChatList />
        </div>

        {/* Chat Window */}
        <div className="flex-1">
          {activeChat ? (
            <ChatWindow />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome to PillPath Chat
                </h2>
                <p className="text-gray-600 mb-4">
                  {mockMode 
                    ? 'Demo mode with sample data. Select a chat from the left or search for pharmacies.'
                    : 'Select a conversation to start messaging'
                  }
                </p>
                <button
                  onClick={() => setShowSearch(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Find Pharmacy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Modal */}
      <PharmacySearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onPharmacySelect={() => setShowSearch(false)}
      />
    </div>
  );
};

export default ChatDemo;