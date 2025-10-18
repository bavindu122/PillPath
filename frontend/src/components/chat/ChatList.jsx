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
    <div className={`bg-gradient-to-b from-blue-50 to-white border-r border-blue-100 flex flex-col h-full min-h-0 shadow-sm ${className}`}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-blue-100 bg-white/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-900 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-blue-600" />
            Messages
          </h2>
          
          {user?.role === 'customer' && (
            <button
              onClick={() => setShowPharmacySearch(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              title="Start new conversation"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">New Chat</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="chat-search-input w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-full focus:ring-3 focus:ring-blue-300 focus:border-blue-400 text-sm bg-white/80 backdrop-blur-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 chat-list-scroll min-h-0">
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
          <div className="space-y-2">
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
      className={`chat-item p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg transform scale-[1.02]' 
          : 'bg-white hover:bg-blue-50 shadow-sm hover:shadow-md border border-blue-100'
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
              isActive ? 'bg-blue-500' : 'bg-gradient-to-br from-blue-400 to-blue-600'
            }`}>
              {currentUser?.role === 'customer' ? (
                <Users className="w-6 h-6 text-white" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
          )}
          
          {/* Online indicator */}
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-3 border-white rounded-full shadow-sm animate-pulse"></div>
          )}
        </div>

        {/* Chat Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
              {displayName}
            </h3>
            <div className="flex items-center space-x-2">
              {lastMessage?.timestamp && (
                <span className={`text-xs font-medium ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTimestamp(lastMessage.timestamp)}
                </span>
              )}
              {unreadCount > 0 && (
                <span className={`text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-bold shadow-sm ${
                  isActive 
                    ? 'bg-white text-blue-600' 
                    : 'bg-red-500 text-white animate-pulse'
                }`}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
          </div>

          {/* Last Message */}
          {lastMessage ? (
            <p className={`text-sm truncate flex items-center ${isActive ? 'text-blue-100' : 'text-gray-600'}`}>
              {lastMessage.senderId === currentUser?.id && (
                <span className={`font-medium mr-1 ${isActive ? 'text-blue-200' : 'text-blue-600'}`}>You: </span>
              )}
              {lastMessage.messageType === 'image' ? (
                <span className="italic flex items-center">
                  <span className="mr-1">📷</span> Photo
                </span>
              ) : lastMessage.messageType === 'file' ? (
                <span className="italic flex items-center">
                  <span className="mr-1">📎</span> File
                </span>
              ) : (
                <span className="font-medium">{lastMessage.content}</span>
              )}
            </p>
          ) : (
            <p className={`text-sm italic ${isActive ? 'text-blue-200' : 'text-gray-400'}`}>
              Start your conversation...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton
const ChatListSkeleton = () => {
  return (
    <div className="space-y-3 p-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 rounded-2xl bg-white shadow-sm border border-blue-100">
          <div className="flex items-start space-x-3">
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
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4">
          <Search className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 text-center mb-2">No conversations found</h3>
        <p className="text-gray-500 text-center">Try searching with different keywords</p>
      </div>
    );
  }

  if (!hasChats) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <MessageCircle className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 text-center mb-3">Welcome to Messages!</h3>
        {userRole === 'customer' ? (
          <>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              Connect with pharmacies for quick consultations,<br />
              prescription inquiries, and health support.
            </p>
            <button
              onClick={onStartNewChat}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
            >
              <Plus className="w-5 h-5" />
              Start Your First Conversation
            </button>
          </>
        ) : (
          <p className="text-gray-500 text-center leading-relaxed">
            Customer conversations will appear here.<br />
            Stay ready to help with their health needs!
          </p>
        )}
      </div>
    );
  }

  return null;
};

export default ChatList;