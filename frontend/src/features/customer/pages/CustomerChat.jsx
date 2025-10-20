import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus, Search } from 'lucide-react';
import { useChat } from '../../../contexts/ChatContextLive';
import ChatList from '../../../components/chat/ChatList';
import ChatWindow from '../../../components/chat/ChatWindow';
import PharmacySearchModal from '../../../components/chat/PharmacySearchModal';

const CustomerChat = () => {
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showPharmacySearch, setShowPharmacySearch] = useState(false);
  const { activeChat, chats } = useChat();

  // Handle responsive behavior - show chat window when chat is selected on mobile
  useEffect(() => {
    if (activeChat && window.innerWidth < 768) {
      setShowMobileChat(true);
    }
  }, [activeChat]);

  // Handle back from chat window on mobile
  const handleBackToChats = () => {
    setShowMobileChat(false);
  };

  // Handle starting new chat
  const handleStartNewChat = () => {
    setShowPharmacySearch(true);
  };

  // Handle pharmacy selection from search
  const handlePharmacySelect = (pharmacy, chat) => {
    setShowPharmacySearch(false);
    if (window.innerWidth < 768) {
      setShowMobileChat(true);
    }
  };

  return (
    <div className="h-full bg-white">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-900">
            {showMobileChat && activeChat ? (
              activeChat.pharmacy?.name || activeChat.pharmacist?.name || 'Chat'
            ) : (
              'Messages'
            )}
          </h1>
        </div>
        
        {!showMobileChat && (
          <button
            onClick={handleStartNewChat}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Start new chat"
          >
            <Plus className="w-5 h-5" />
          </button>
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
                Messages
              </h2>
              <button
                onClick={handleStartNewChat}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Start new chat"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <ChatList />
        </div>

        {/* Chat Window */}
        <div className="flex-1">
          {activeChat ? (
            <ChatWindow />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
                <p className="text-gray-500 mb-4">Choose a pharmacy to start messaging</p>
                <button
                  onClick={handleStartNewChat}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Search className="w-4 h-4 inline mr-2" />
                  Find Pharmacy
                </button>
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
            <ChatList />
            
            {/* Empty state for mobile when no chats */}
            {chats.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No conversations yet</p>
                  <button
                    onClick={handleStartNewChat}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Search className="w-4 h-4 inline mr-2" />
                    Find Pharmacy
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pharmacy Search Modal */}
      <PharmacySearchModal
        isOpen={showPharmacySearch}
        onClose={() => setShowPharmacySearch(false)}
        onPharmacySelect={handlePharmacySelect}
      />
    </div>
  );
};

export default CustomerChat;