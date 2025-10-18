import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Filter, Users, Clock, AlertCircle, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../../contexts/ChatContextLive';
import StyledChatList from '../components/StyledChatList';
import StyledChatWindow from '../components/StyledChatWindow';
import PharmacySearchModal from '../../../components/chat/PharmacySearchModal';
import '../../../styles/chat-customer.css';

const ChatCustomer = () => {
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showPharmacySearch, setShowPharmacySearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Use the new chat system
  const { 
    chats, 
    activeChat, 
    setActiveChat, 
    mockMode, 
    connected,
    loading,
    error 
  } = useChat();

  // Handle responsive behavior - show chat window when chat is selected on mobile
  useEffect(() => {
    if (activeChat && window.innerWidth < 1024) {
      setShowMobileChat(true);
    }
  }, [activeChat]);

  // Handle back from chat window on mobile
  const handleBackToChats = () => {
    setShowMobileChat(false);
  };

  // Handle pharmacy selection from search
  const handlePharmacySelect = (pharmacy, chat) => {
    setShowPharmacySearch(false);
    if (window.innerWidth < 1024) {
      setShowMobileChat(true);
    }
  };

  // Filter chats based on search and status
  const filteredChats = chats.filter(chat => {
    const pharmacyName = chat.pharmacy?.name || chat.pharmacist?.name || 'Unknown';
    const lastMessageContent = chat.lastMessage?.content || '';
    
    const matchesSearch = pharmacyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lastMessageContent.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === 'active') {
      matchesStatus = chat.unreadCount > 0 || (chat.lastMessageTime && 
        new Date() - new Date(chat.lastMessageTime) < 24 * 60 * 60 * 1000);
    } else if (filterStatus === 'unread') {
      matchesStatus = chat.unreadCount > 0;
    }
    
    return matchesSearch && matchesStatus;
  });

  const totalUnread = chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);

  return (
    <div className="min-h-screen p-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Pharmacy Chats
              </h1>
              <p className="text-white/70">
                Communicate with pharmacies about your prescriptions
              </p>
              {mockMode && (
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                  🚀 Demo Mode - {chats.length} sample conversations
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPharmacySearch(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">New Chat</span>
              </button>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 text-white">
                  <MessageSquare size={20} />
                  <span className="font-medium">{chats.length} Conversations</span>
                </div>
              </div>
              {totalUnread > 0 && (
                <div className="bg-red-500 text-white rounded-full px-3 py-1 text-sm font-medium">
                  {totalUnread} Unread
                </div>
              )}
            </div>
          </div>

          {/* Connection Status */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
              <input
                type="text"
                placeholder="Search pharmacies or messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All Chats</option>
              <option value="active">Active</option>
              <option value="unread">Unread</option>
            </select>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {/* Chat Interface */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
            {/* Desktop Chat List - Always visible on desktop */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`lg:col-span-1 ${showMobileChat ? 'hidden lg:block' : 'block'}`}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 h-full">
                <div className="p-4 border-b border-white/20">
                  <h3 className="text-lg font-semibold text-white">Conversations</h3>
                </div>
                <div className="h-full overflow-hidden">
                  <StyledChatList chats={filteredChats} />
                </div>
              </div>
            </motion.div>

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`lg:col-span-2 ${!showMobileChat ? 'hidden lg:block' : 'block'}`}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 h-full">
                {activeChat ? (
                  <StyledChatWindow onBack={handleBackToChats} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white">
                      <MessageSquare size={48} className="mx-auto mb-4 text-white/50" />
                      <h3 className="text-xl font-semibold mb-2">No Chat Selected</h3>
                      <p className="text-white/70 mb-4">
                        Choose a conversation to start messaging
                      </p>
                      <button
                        onClick={() => setShowPharmacySearch(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Start New Chat
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredChats.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users size={48} className="mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No chats match your filters' : 'No conversations yet'}
            </h3>
            <p className="text-white/70 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter settings'
                : 'Start a conversation with a pharmacy to get help with your prescriptions'
              }
            </p>
            <button
              onClick={() => setShowPharmacySearch(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Find Pharmacy
            </button>
          </motion.div>
        )}

        {/* Pharmacy Search Modal */}
        <PharmacySearchModal
          isOpen={showPharmacySearch}
          onClose={() => setShowPharmacySearch(false)}
          onPharmacySelect={handlePharmacySelect}
        />
      </div>
    </div>
  );
};

export default ChatCustomer;
