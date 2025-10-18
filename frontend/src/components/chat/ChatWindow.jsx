import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Phone, Video, MoreVertical, User, Users, Circle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../contexts/ChatContextLive';
import MessageBubble, { DateSeparator, TypingIndicator } from './MessageBubble';
import MessageInput from './MessageInput';

const ChatWindow = ({ onBack, className = '' }) => {
  const { user } = useAuth();
  const {
    activeChat,
    messages,
    fetchMessages,
    typingUsers,
    onlineUsers,
    loading
  } = useChat();
  
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(0);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const prevScrollHeight = useRef(0);

  // Get current chat messages
  const chatMessages = activeChat ? messages[activeChat.id] || [] : [];

  // Get other participant information
  const otherParticipant = activeChat ? (
    user?.role === 'customer' 
      ? (activeChat.pharmacy || activeChat.pharmacist)
      : activeChat.customer
  ) : null;

  // Check if other participant is online
  const isOtherParticipantOnline = otherParticipant ? onlineUsers.has(otherParticipant.id) : false;

  // Check if other participant is typing
  const isOtherParticipantTyping = activeChat && typingUsers[activeChat.id] && 
    Object.keys(typingUsers[activeChat.id]).some(userId => 
      userId !== user?.id && typingUsers[activeChat.id][userId]
    );

  // Scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      });
    }
  }, []);

  // Load initial messages when chat changes
  useEffect(() => {
    if (activeChat && !messages[activeChat.id]) {
      fetchMessages(activeChat.id, 0);
    }
  }, [activeChat, messages, fetchMessages]);

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    if (chatMessages.length > 0) {
      const container = messagesContainerRef.current;
      if (container) {
        const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 100;
        if (isScrolledToBottom) {
          scrollToBottom();
        }
      }
    }
  }, [chatMessages, scrollToBottom]);

  // Load more messages when scrolling to top
  const handleScroll = useCallback(async () => {
    const container = messagesContainerRef.current;
    if (!container || loadingMessages || !hasMoreMessages || !activeChat) return;

    if (container.scrollTop === 0) {
      setLoadingMessages(true);
      prevScrollHeight.current = container.scrollHeight;
      
      try {
        const newMessages = await fetchMessages(activeChat.id, page + 1);
        if (newMessages.length === 0) {
          setHasMoreMessages(false);
        } else {
          setPage(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error loading more messages:', error);
      } finally {
        setLoadingMessages(false);
        
        // Maintain scroll position
        if (container.scrollHeight !== prevScrollHeight.current) {
          container.scrollTop = container.scrollHeight - prevScrollHeight.current;
        }
      }
    }
  }, [loadingMessages, hasMoreMessages, activeChat, page, fetchMessages]);

  // Group messages by date and sender
  const groupedMessages = React.useMemo(() => {
    if (!chatMessages.length) return [];

    const groups = [];
    let currentDate = null;
    let currentSender = null;
    let currentGroup = [];

    chatMessages.forEach((message, index) => {
      const messageDate = new Date(message.timestamp).toDateString();
      
      // Add date separator
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ type: 'messages', messages: currentGroup });
          currentGroup = [];
        }
        groups.push({ type: 'date', date: messageDate });
        currentDate = messageDate;
        currentSender = null;
      }

      // Check if we should group with previous message
      const shouldGroup = currentSender === message.senderId && 
        index > 0 && 
        new Date(message.timestamp) - new Date(chatMessages[index - 1].timestamp) < 300000; // 5 minutes

      if (!shouldGroup && currentGroup.length > 0) {
        groups.push({ type: 'messages', messages: currentGroup });
        currentGroup = [];
      }

      currentGroup.push({
        ...message,
        isGrouped: shouldGroup,
        showAvatar: !shouldGroup || currentGroup.length === 0
      });
      currentSender = message.senderId;
    });

    if (currentGroup.length > 0) {
      groups.push({ type: 'messages', messages: currentGroup });
    }

    return groups;
  }, [chatMessages]);

  if (!activeChat) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No chat selected</h3>
          <p className="text-gray-500">Choose a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-3">
          {/* Back Button (Mobile) */}
          <button
            onClick={onBack}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div className="relative">
            {otherParticipant?.avatar || otherParticipant?.profileImage ? (
              <img
                src={otherParticipant.avatar || otherParticipant.profileImage}
                alt={otherParticipant.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                {user?.role === 'customer' ? (
                  <Users className="w-5 h-5 text-gray-600" />
                ) : (
                  <User className="w-5 h-5 text-gray-600" />
                )}
              </div>
            )}
            
            {/* Online indicator */}
            {isOtherParticipantOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          {/* Participant Info */}
          <div>
            <h3 className="font-medium text-gray-900">
              {otherParticipant?.name || 'Unknown User'}
            </h3>
            <div className="flex items-center space-x-1">
              <Circle 
                className={`w-2 h-2 ${isOtherParticipantOnline ? 'text-green-500 fill-current' : 'text-gray-400'}`} 
              />
              <span className="text-xs text-gray-500">
                {isOtherParticipantTyping ? 'Typing...' : 
                 isOtherParticipantOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            title="Voice call"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            title="Video call"
          >
            <Video className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            title="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-1"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Loading more messages indicator */}
        {loadingMessages && (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {/* No more messages indicator */}
        {!hasMoreMessages && chatMessages.length > 0 && (
          <div className="text-center py-2">
            <span className="text-xs text-gray-500">This is the beginning of your conversation</span>
          </div>
        )}

        {/* Messages */}
        {groupedMessages.length === 0 && !loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h3>
              <p className="text-gray-500">Send a message to begin chatting</p>
            </div>
          </div>
        ) : (
          groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.type === 'date' ? (
                <DateSeparator date={group.date} />
              ) : (
                <div className="space-y-1">
                  {group.messages.map((message, messageIndex) => (
                    <MessageBubble
                      key={message.id || `${groupIndex}-${messageIndex}`}
                      message={message}
                      currentUser={user}
                      showAvatar={message.showAvatar}
                      isGrouped={message.isGrouped}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isOtherParticipantTyping && (
          <TypingIndicator
            senderName={otherParticipant?.name}
            avatar={otherParticipant?.avatar || otherParticipant?.profileImage}
          />
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput 
        chatId={activeChat.id} 
        disabled={loading}
      />
    </div>
  );
};

export default ChatWindow;