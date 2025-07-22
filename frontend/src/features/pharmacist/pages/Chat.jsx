import React from 'react';
import { MessageSquare, Users, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PharmaPageLayout from '../components/PharmaPageLayout';
import ChatStats from '../components/ChatStats';
import ChatFilters from '../components/ChatFilters';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { useChatData } from '../hooks/useChatData';
import '../pages/index-pharmacist.css';

const Chat = () => {
  const navigate = useNavigate();
  
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
    return (
      <PharmaPageLayout
        title="Patient Chat"
        subtitle="Communicate with patients about prescriptions and inquiries"
        isLoading={true}
        loadingMessage="Loading Conversations..."
        showBackButton={false}
      />
    );
  }

  if (error) {
    return (
      <PharmaPageLayout
        title="Patient Chat"
        subtitle="Communicate with patients about prescriptions and inquiries"
        showBackButton={false}
      >
        <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: 'var(--pharma-red-50)', borderColor: 'var(--pharma-red-200)' }}>
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" style={{ color: 'var(--pharma-red-500)' }} />
            <p style={{ color: 'var(--pharma-red-800)' }}>Error loading conversations: {error}</p>
            <button
              onClick={refetch}
              className="ml-4 px-3 py-1 rounded text-sm hover:opacity-80 transition-opacity"
              style={{ backgroundColor: 'var(--pharma-red)', color: 'var(--pharma-text-light)' }}
            >
              Retry
            </button>
          </div>
        </div>
      </PharmaPageLayout>
    );
  }

  // Header actions showing chat count
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
    <PharmaPageLayout
      title="Patient Chat"
      subtitle="Communicate with patients about prescriptions and inquiries"
      isLoading={false}
      showBackButton={false}
      headerActions={headerActions}
    >
      <div className="space-y-6">
        {/* Chat Stats */}
        <div className="dashboard-fade-in-2">
          <ChatStats 
            totalChats={totalChats}
            unreadCount={unreadCount}
            activeChats={filteredConversations.filter(c => c.status === 'active').length}
            resolvedChats={filteredConversations.filter(c => c.status === 'resolved').length}
          />
        </div>

        {/* Main Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List Sidebar */}
          <div className="lg:col-span-1 dashboard-fade-in-3">
            <div className="space-y-4">
              {/* Filters */}
              <ChatFilters
                searchTerm={searchTerm}
                filterStatus={filterStatus}
                sortBy={sortBy}
                onSearchChange={setSearchTerm}
                onFilterStatusChange={setFilterStatus}
                onSortChange={setSortBy}
              />
              
              {/* Chat List */}
              <ChatList
                conversations={filteredConversations}
                currentConversation={currentConversation}
                onSelectConversation={setCurrentConversation}
              />
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 dashboard-fade-in-4">
            <ChatWindow
              conversation={currentConversation}
              sendingMessage={sendingMessage}
              onSendMessage={sendMessage}
            />
          </div>
        </div>
      </div>
    </PharmaPageLayout>
  );
};

export default Chat;
