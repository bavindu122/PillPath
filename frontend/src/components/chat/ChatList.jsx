import React, { useState } from 'react';
import { Search, MessageCircle, Plus, User, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../contexts/ChatContextLive';
import PharmacySearchModal from './PharmacySearchModal';

const ChatList = ({ className = '' }) => {
  const { user } = useAuth();
  const { chats, activeChat, setActiveChat, loading, onlineUsers } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [showPharmacySearch, setShowPharmacySearch] = useState(false);

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    const searchTerm = searchQuery.toLowerCase();
    const otherParticipant = getOtherParticipant(chat, user) || {};
    const nameCandidates = [
      otherParticipant.name,
      otherParticipant.pharmacyName,
      otherParticipant.displayName,
      otherParticipant.title,
      chat.pharmacyName,
    ].filter(Boolean);
    const lastContent = chat.lastMessage?.content || '';
    return (
      nameCandidates.some(n => n?.toLowerCase().includes(searchTerm)) ||
      lastContent.toLowerCase().includes(searchTerm)
    );
  });

  // Get the other participant in the chat (not the current user)
  const getOtherParticipant = (chat, currentUser) => {
    if (currentUser?.role === 'customer') {
      return chat.pharmacy || chat.pharmacist;
    } else {
      return chat.customer;
    }
  };

  // Format timestamp for display
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

  // Check if user is online
  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  // Handle pharmacy selection from search modal
  const handlePharmacySelect = (pharmacy, chat) => {
    setActiveChat(chat);
    setShowPharmacySearch(false);
  };

  return (
    <div className={`flex flex-col h-full min-h-0 ${className}`}>
      {/* Search (fixed) */}
      <div className="flex-shrink-0 p-4 border-b border-blue-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/80 backdrop-blur-sm"
          />
        </div>
        
        {user?.role === 'customer' && (
          <button
            onClick={() => setShowPharmacySearch(true)}
            className="flex items-center justify-center gap-2 w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            title="Start new conversation"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New Chat</span>
          </button>
        )}
      </div>

      {/* Chat List (scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto chat-messages-scroll">
        {loading ? (
          <ChatListSkeleton />
        ) : filteredChats.length === 0 ? (
          <EmptyState
            hasChats={chats.length > 0}
            isSearching={searchQuery.length > 0}
            userRole={user?.role}
            onStartNewChat={() => setShowPharmacySearch(true)}
          />
        ) : (
          <div className="divide-y divide-blue-100">
            {filteredChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                currentUser={user}
                isActive={activeChat?.id === chat.id}
                isOnline={isUserOnline(getOtherParticipant(chat, user)?.id)}
                onClick={() => setActiveChat(chat)}
                formatTime={formatTime}
              />
            ))}
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

// Individual Chat Item Component
const ChatItem = ({ chat, currentUser, isActive, isOnline, onClick, formatTime }) => {
  const otherParticipant = currentUser?.role === 'customer' 
    ? (chat.pharmacy || chat.pharmacist)
    : chat.customer;

  const displayName =
    otherParticipant?.name ||
    otherParticipant?.pharmacyName ||
    otherParticipant?.displayName ||
    otherParticipant?.title ||
    chat.pharmacyName ||
    'Unknown User';
  const avatar = otherParticipant?.avatar || otherParticipant?.profileImage;
  const lastMessage = chat.lastMessage;
  const unreadCount = chat.unreadCount || 0;

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all duration-200 hover:bg-blue-50/50 ${
        isActive 
          ? 'bg-blue-100/70 border-l-4 border-l-blue-600' 
          : 'hover:shadow-sm'
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              {currentUser?.role === 'customer' ? (
                <Users className="w-6 h-6 text-white" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
          )}
          
          {/* Online indicator */}
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
          )}
        </div>

        {/* Chat Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 truncate">
              {displayName}
            </p>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
              <div className="flex items-center text-xs text-gray-500 font-medium">
                <span>{formatTime(lastMessage?.timestamp)}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 truncate mt-1 leading-relaxed">
            {lastMessage?.content || ''}
          </p>
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton
const ChatListSkeleton = () => {
  return (
    <div className="divide-y divide-blue-100">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gradient-to-r from-blue-200 to-blue-100 rounded-full animate-pulse w-3/4"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Empty State Component
const EmptyState = ({ hasChats, isSearching, userRole, onStartNewChat }) => {
  if (isSearching) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No matching conversations</h3>
        <p className="text-gray-500">Try adjusting your search terms</p>
      </div>
    );
  }

  if (!hasChats) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {userRole === 'customer' ? 'Welcome to Messages!' : 'No conversations yet'}
        </h3>
        {userRole === 'customer' ? (
          <>
            <p className="text-gray-600 mb-6">
              Connect with pharmacies for quick consultations and support
            </p>
            <button
              onClick={onStartNewChat}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
            >
              <Plus className="w-5 h-5" />
              Start Your First Conversation
            </button>
          </>
        ) : (
          <p className="text-gray-500">
            Customer conversations will appear here when they start chatting with your pharmacy
          </p>
        )}
      </div>
    );
  }

  return null;
};

export default ChatList;