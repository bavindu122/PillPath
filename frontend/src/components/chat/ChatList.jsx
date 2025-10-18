import React, { useState } from 'react';
import { Search, MessageCircle, Plus, Clock, User, Users } from 'lucide-react';
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
    const lastContent = chat.lastMessage?.content || chat.lastMessage?.text || '';
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
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
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
    <div className={`bg-white border-r border-gray-200 flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Chats
          </h2>
          
          {user?.role === 'customer' && (
            <button
              onClick={() => setShowPharmacySearch(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Start new chat"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
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
          <div className="space-y-1 p-2">
            {filteredChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                currentUser={user}
                isActive={activeChat?.id === chat.id}
                isOnline={isUserOnline(getOtherParticipant(chat, user)?.id)}
                onClick={() => setActiveChat(chat)}
                formatTimestamp={formatTimestamp}
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
const ChatItem = ({ chat, currentUser, isActive, isOnline, onClick, formatTimestamp }) => {
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
      className={`p-3 rounded-lg cursor-pointer transition-all ${
        isActive
          ? 'bg-blue-50 border-l-4 border-blue-500'
          : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              {currentUser?.role === 'customer' ? (
                <Users className="w-5 h-5 text-gray-600" />
              ) : (
                <User className="w-5 h-5 text-gray-600" />
              )}
            </div>
          )}
          
          {/* Online indicator */}
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>

        {/* Chat Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-gray-900 truncate">{displayName}</h3>
            <div className="flex items-center space-x-1">
              {lastMessage?.timestamp && (
                <span className="text-xs text-gray-500">
                  {formatTimestamp(lastMessage.timestamp)}
                </span>
              )}
              {unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
          </div>

          {/* Last Message */}
          {lastMessage ? (
            <p className="text-sm text-gray-600 truncate">
              {lastMessage.senderId === currentUser?.id && (
                <span className="text-gray-500">You: </span>
              )}
              {lastMessage.messageType === 'image' ? (
                <span className="italic">📷 Image</span>
              ) : lastMessage.messageType === 'file' ? (
                <span className="italic">📎 File</span>
              ) : (
                lastMessage.content
              )}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">No messages yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton
const ChatListSkeleton = () => {
  return (
    <div className="space-y-1 p-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-3 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
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
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <Search className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-gray-500 text-center">No chats found</p>
        <p className="text-gray-400 text-sm text-center">Try a different search term</p>
      </div>
    );
  }

  if (!hasChats) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-gray-500 text-center mb-2">No chats yet</p>
        {userRole === 'customer' ? (
          <>
            <p className="text-gray-400 text-sm text-center mb-4">
              Start a conversation with a pharmacy
            </p>
            <button
              onClick={onStartNewChat}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Start New Chat
            </button>
          </>
        ) : (
          <p className="text-gray-400 text-sm text-center">
            Customers will appear here when they start conversations
          </p>
        )}
      </div>
    );
  }

  return null;
};

export default ChatList;