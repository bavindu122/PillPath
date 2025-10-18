import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, Search, Users, Plus, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../../services/api';
import { normalizeChatsList } from '../../../../utils/chatNormalize';
import ChatWindow from './ChatWindow';

const Chat = () => {
  const { customerId: urlCustomerId } = useParams();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeThread, setActiveThread] = useState(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  useEffect(() => {
    fetchThreads();
  }, []);

  // Set active thread based on URL parameter
  useEffect(() => {
    if (urlCustomerId && threads.length > 0) {
      const thread = threads.find(t => t.customerId === urlCustomerId);
      if (thread) {
        setActiveThread(thread);
        if (window.innerWidth < 1024) {
          setShowMobileChat(true);
        }
      }
    }
  }, [urlCustomerId, threads]);

  // Handle responsive behavior - show chat window when chat is selected on mobile
  useEffect(() => {
    if (activeThread && window.innerWidth < 1024) {
      setShowMobileChat(true);
    }
  }, [activeThread]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/v1/chats/threads');
      const threadsData = Array.isArray(data)
        ? data
        : (data?.threads || data?.content || data?.items || []);
      const normalized = normalizeChatsList(threadsData || [], { sort: true });
      setThreads(normalized || []);
    } catch (err) {
      const raw = err?.response?.data;
      if (typeof raw === 'string' && raw.startsWith('<!doctype')) {
        setError('Received HTML instead of JSON. Check API URL (/v1/chats/threads) and backend routing.');
      } else {
        setError(err?.response?.data?.message || err.message || 'Failed to load chats');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleThreadClick = (thread) => {
    setActiveThread(thread);
    if (window.innerWidth < 1024) {
      setShowMobileChat(true);
    }
  };

  // Handle back from chat window on mobile
  const handleBackToChats = () => {
    setShowMobileChat(false);
    setActiveThread(null);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    
    const diffInHours = diffInMinutes / 60;
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    
    const diffInDays = diffInHours / 24;
    if (diffInDays < 7) return `${Math.floor(diffInDays)}d ago`;
    
    return date.toLocaleDateString();
  };

  // Filter threads based on search
  const filteredThreads = threads.filter(thread => {
    const name = thread.customer?.name || thread.customerName || `Customer ${thread.customerId}`;
    const last = thread.lastMessage?.content || '';
    const q = searchTerm.toLowerCase();
    return name?.toLowerCase().includes(q) || last?.toLowerCase().includes(q);
  });

  const totalUnread = threads.reduce((sum, thread) => sum + (thread.unreadCount || 0), 0);

  if (loading && threads.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading chats...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <MessageSquare className="h-8 w-8 mr-3 text-blue-600" />
                Customer Chats
              </h1>
              <p className="text-gray-600">
                Manage conversations with your customers
                {totalUnread > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {totalUnread} unread
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchThreads}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw size={20} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">⚠️</div>
              <div>
                <p className="text-red-800 font-medium">Error loading chats</p>
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={fetchThreads}
                  className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Chat Interface */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Chat List Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`lg:col-span-1 ${showMobileChat ? 'hidden lg:block' : 'block'}`}
            >
              <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-sm border border-blue-100 h-full flex flex-col">
                {/* Search */}
                <div className="p-4 border-b border-blue-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredThreads.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm ? 'No matching conversations' : 'No conversations yet'}
                      </h3>
                      <p className="text-gray-500">
                        {searchTerm 
                          ? 'Try adjusting your search terms'
                          : 'Customer conversations will appear here when they start chatting with your pharmacy'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-blue-100">
                      {filteredThreads.map((thread) => (
                        <div
                          key={thread.customerId || thread.id}
                          onClick={() => handleThreadClick(thread)}
                          className={`p-4 cursor-pointer transition-all duration-200 hover:bg-blue-50/50 ${
                            activeThread?.customerId === thread.customerId 
                              ? 'bg-blue-100/70 border-l-4 border-l-blue-600' 
                              : 'hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                                <Users className="h-6 w-6 text-white" />
                              </div>
                              {/* Online indicator */}
                              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {thread.customerName || `Customer ${thread.customerId}`}
                                </p>
                                <div className="flex items-center space-x-2">
                                  {thread.unreadCount > 0 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white shadow-sm">
                                      {thread.unreadCount}
                                    </span>
                                  )}
                                  <div className="flex items-center text-xs text-gray-500 font-medium">
                                    <span>{formatTime(thread.lastMessageTime)}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 truncate mt-1 leading-relaxed">
                                {thread.lastMessage?.content || 'No messages yet'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`lg:col-span-2 ${!showMobileChat ? 'hidden lg:block' : 'block'}`}
            >
              <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-sm border border-blue-100 h-full">
                {activeThread ? (
                  <ChatWindow 
                    customerId={activeThread.customerId}
                    onBack={handleBackToChats}
                    thread={activeThread}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
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

        {/* Empty State */}
        {!loading && filteredThreads.length === 0 && !searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No conversations yet
            </h3>
            <p className="text-gray-600 mb-6">
              Customer conversations will appear here when they start chatting with your pharmacy
            </p>
            <button
              onClick={fetchThreads}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Refresh Chats
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Chat;