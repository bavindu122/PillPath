import React from 'react';
import { MessageSquare, Users, AlertCircle } from 'lucide-react';
import PharmaPageLayout from '../components/PharmaPageLayout';
import ChatStats from '../components/ChatStats';
import ChatFilters from '../components/ChatFilters';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { useChatData } from '../hooks/useChatData';
import '../pages/index-pharmacist.css';

const Chat = () => {
  const {
    filteredConversations,
    currentConversation,
    totalChats,
    unreadCount,
    loading,
    error,
    searchTerm,
    filterStatus,
    sortBy,
    sortOrder,
    sendingMessage,
    sendMessage,
    setSearchTerm,
    setFilterStatus,
    setSortBy,
    setCurrentConversation,
    refetch
  } = useChatData();

  if (loading) {
    // Admin-like loading treatment within fixed-height shell
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-white flex flex-col">
        {/* Header (fixed) */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <MessageSquare className="h-8 w-8 mr-3 text-blue-600" />
                Patient Chat
              </h1>
              <p className="text-gray-600">Communicate with patients about prescriptions and inquiries</p>
            </div>
          </div>
        </div>

        {/* Body (fills remaining height) */}
        <div className="flex-1 px-6 pb-6 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading conversations...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // Admin-like error block within same shell
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-white flex flex-col">
        <div className="flex-shrink-0 px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <MessageSquare className="h-8 w-8 mr-3 text-blue-600" />
                Patient Chat
              </h1>
              <p className="text-gray-600">Communicate with patients about prescriptions and inquiries</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-red-800 font-medium">Error loading conversations</p>
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={refetch}
                  className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 pb-6 overflow-hidden" />
      </div>
    );
  }

  // Header actions (Admin-like badge)
  const headerActions = (
    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-full shadow-sm">
      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>
      <p className="text-sm font-semibold text-blue-700">
        {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
        {unreadCount > 0 && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {unreadCount} unread
          </span>
        )}
      </p>
    </div>
  );

  return (
    // Admin chat-like fixed-height page with inner scroll
    <div className="h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header (fixed) */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <MessageSquare className="h-8 w-8 mr-3 text-blue-600" />
              Patient Chat
            </h1>
            <p className="text-gray-600">Communicate with patients about prescriptions and inquiries</p>
          </div>
          {headerActions}
        </div>

        {/* Admin-like stats row directly under header */}
        <div className="mt-4">
          <ChatStats
            totalChats={totalChats}
            unreadCount={unreadCount}
            activeChats={filteredConversations.filter(c => c.status === 'active').length}
            resolvedChats={filteredConversations.filter(c => c.status === 'resolved').length}
          />
        </div>
      </div>

      {/* Main grid (fills height). Only inner panels scroll */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
          {/* Sidebar (filters + list) */}
          <div className="lg:col-span-1 h-full min-h-0 flex flex-col bg-white/40 backdrop-blur-xl rounded-lg shadow-xl border border-white/50">
            {/* Filters (fixed within card) */}
            <div className="flex-shrink-0 p-4 border-b border-white/30">
              <ChatFilters
                searchTerm={searchTerm}
                filterStatus={filterStatus}
                sortBy={sortBy}
                onSearchChange={setSearchTerm}
                onFilterStatusChange={setFilterStatus}
                onSortChange={setSortBy}
              />
            </div>

            {/* List (scrollable) */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {filteredConversations.length === 0 ? (
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
                      : 'Patient conversations will appear here when they start chatting'}
                  </p>
                </div>
              ) : (
                <ChatList
                  conversations={filteredConversations}
                  currentConversation={currentConversation}
                  onSelectConversation={setCurrentConversation}
                />
              )}
            </div>
          </div>

          {/* Chat window (scrollable messages area inside) */}
          <div className="lg:col-span-2 h-full min-h-0">
            <div className="bg-white/40 backdrop-blur-xl rounded-lg shadow-xl border border-white/50 h-full min-h-0 flex flex-col">
              <ChatWindow
                conversation={currentConversation}
                sendingMessage={sendingMessage}
                onSendMessage={sendMessage}
                className="h-full min-h-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
