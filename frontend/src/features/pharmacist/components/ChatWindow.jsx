import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Phone, Video, MoreVertical, User, Users, Circle, MessageCircle, Clock, AlertCircle, CheckCircle, Paperclip, Smile, Send } from 'lucide-react';

const ChatWindow = ({ conversation, sendingMessage, onSendMessage, onBack, className = '' }) => {
  const [message, setMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(0);
  
  const messagesContainerRef = useRef(null);
  const prevScrollHeight = useRef(0);

  // Scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    }
  }, []);

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    if (conversation?.messages?.length > 0) {
      const container = messagesContainerRef.current;
      if (container) {
        const isNearBottom = container.scrollHeight - container.clientHeight - container.scrollTop <= 100;
        if (isNearBottom) {
          scrollToBottom();
        }
      }
    }
  }, [conversation?.messages, scrollToBottom]);

  // Load more messages when scrolling to top
  const handleScroll = useCallback(async () => {
    const container = messagesContainerRef.current;
    if (!container || loadingMessages || !hasMoreMessages || !conversation) return;
    
    const atTop = container.scrollTop <= 0;
    if (atTop) {
      setLoadingMessages(true);
      prevScrollHeight.current = container.scrollHeight;
      
      try {
        // Simulate loading more messages - you can replace this with actual API call
        setTimeout(() => {
          setLoadingMessages(false);
          // Maintain viewport position after prepending
          const newScrollHeight = container.scrollHeight;
          const delta = newScrollHeight - prevScrollHeight.current;
          container.scrollTop = delta;
        }, 500);
      } catch (error) {
        console.error('Error loading more messages:', error);
        setLoadingMessages(false);
      }
    }
  }, [loadingMessages, hasMoreMessages, conversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || sendingMessage || !conversation) return;

    await onSendMessage(conversation.id, message.trim());
    setMessage('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'waiting':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const formatMessageTime = (timeString) => {
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatMessageDate = (timeString) => {
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Group messages by date and sender (newest at bottom)
  const groupedMessages = React.useMemo(() => {
    if (!conversation?.messages?.length) return [];
    
    // Sort messages by timestamp in ascending order (oldest first, newest last)
    const sorted = [...conversation.messages].sort((a, b) => {
      const timeA = new Date(a.timestamp || a.time || 0).getTime();
      const timeB = new Date(b.timestamp || b.time || 0).getTime();
      return timeA - timeB; // ascending order
    });
    
    const groups = [];
    let currentDate = null;
    let currentSender = null;
    let currentGroup = [];

    sorted.forEach((message, index) => {
      const ts = message.timestamp || message.time || new Date().toISOString();
      const dateObj = new Date(ts);
      const messageDate = isNaN(dateObj.getTime()) ? new Date().toDateString() : dateObj.toDateString();

      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ type: 'messages', messages: currentGroup });
          currentGroup = [];
        }
        groups.push({ type: 'date', date: messageDate });
        currentDate = messageDate;
        currentSender = null;
      }

      // Determine grouping relative to previous (ascending order)
      const prev = sorted[index - 1];
      const currentTime = new Date(message.timestamp || message.time || 0).getTime();
      const prevTime = new Date(prev?.timestamp || prev?.time || 0).getTime();
      const withinFiveMin = currentTime && prevTime && (currentTime - prevTime) < 300000;
      const shouldGroup = currentSender === message.senderId && index > 0 && withinFiveMin;

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
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className={`flex items-center justify-center h-full bg-transparent ${className}`}>
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

  const { patientName, patientAvatar, status, priority, prescriptionId, messages } = conversation;
  
  // Check if patient is online (mock data - replace with actual logic)
  const isPatientOnline = status === 'active';
  
  // Check if patient is typing (mock data - replace with actual logic)
  const isPatientTyping = false;

  return (
    <div className={`flex flex-col h-full bg-gradient-to-b from-blue-50 to-white border-l border-blue-100 ${className}`} style={{ height: '100%', maxHeight: '100%' }}>
      {/* Chat Header */}
      <div className="px-4 py-4 border-b border-blue-100 flex items-center justify-between bg-white/90 backdrop-blur-sm flex-shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          {/* Back Button (Mobile) */}
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Avatar */}
          <div className="relative">
            {patientAvatar ? (
              <img
                src={patientAvatar}
                alt={patientName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
            
            {/* Online indicator */}
            {isPatientOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse shadow-sm"></div>
            )}
          </div>

          {/* Patient Info */}
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{patientName}</h3>
            <div className="flex items-center space-x-2">
              <Circle 
                className={`w-2 h-2 ${isPatientOnline ? 'text-green-500 fill-current' : 'text-gray-400'}`} 
              />
              <span className={`text-sm font-medium ${
                isPatientTyping ? 'text-blue-600' : 
                isPatientOnline ? 'text-green-600' : 'text-gray-500'
              }`}>
                {isPatientTyping ? 'Typing...' : 
                 isPatientOnline ? 'Online' : 'Offline'}
              </span>
              {prescriptionId && (
                <>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{prescriptionId}</span>
                </>
              )}
              {priority && (
                <>
                  <span className="text-sm text-gray-400">•</span>
                  <span className={`text-sm font-medium ${
                    priority === 'high' ? 'text-red-600' : 
                    priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {priority} priority
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1">
          <button
            className="p-3 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-all duration-200 transform hover:scale-110"
            title="Voice call"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            className="p-3 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-all duration-200 transform hover:scale-110"
            title="Video call"
          >
            <Video className="w-5 h-5" />
          </button>
          <button
            className="p-3 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-all duration-200 transform hover:scale-110"
            title="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-2 ml-2">
            {getStatusIcon(status)}
            <span className="text-sm font-medium capitalize text-gray-700">
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area - Scrollable content */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-2 bg-gradient-to-b from-blue-50/30 to-transparent min-h-0"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Loading more messages indicator */}
        {loadingMessages && (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {/* No more messages indicator */}
        {!hasMoreMessages && messages?.length > 0 && (
          <div className="text-center py-2">
            <span className="text-xs text-gray-500">This is the beginning of your conversation</span>
          </div>
        )}

        {/* Messages */}
        {groupedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Ready to chat!</h3>
              <p className="text-gray-600 leading-relaxed">
                Send your first message to start a conversation with {patientName}. 
                Assist them with their health and pharmacy needs.
              </p>
            </div>
          </div>
        ) : (
          groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.type === 'date' ? (
                <DateSeparator date={group.date} />
              ) : (
                <div className="space-y-1">
                  {group.messages.map((msg, messageIndex) => (
                    <MessageBubble
                      key={msg.id || `${groupIndex}-${messageIndex}`}
                      message={msg}
                      currentUser={{ id: 'pharmacist', role: 'pharmacist' }}
                      showAvatar={msg.showAvatar}
                      isGrouped={msg.isGrouped}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isPatientTyping && (
          <TypingIndicator
            senderName={patientName}
            avatar={patientAvatar}
          />
        )}

        {/* Bottom anchor for scroll */}
        <div style={{ height: 1 }} />
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-blue-100 bg-white/80 backdrop-blur-sm" style={{ position: 'sticky', bottom: 0, zIndex: 10 }}>
        <div className="p-4">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-3 bg-white rounded-2xl p-2 shadow-sm border border-blue-100">
            {/* Attachment Button */}
            <button
              type="button"
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-all duration-200 transform hover:scale-110"
              disabled={sendingMessage || status === 'resolved'}
              title="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            {/* Message Input */}
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 border-0 bg-transparent focus:outline-none resize-none h-10 text-gray-800 placeholder-gray-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                disabled={sendingMessage || status === 'resolved'}
              />
            </div>

            {/* Emoji Button */}
            <button
              type="button"
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-all duration-200 transform hover:scale-110"
              disabled={sendingMessage || status === 'resolved'}
              title="Add emoji"
            >
              <Smile className="h-5 w-5" />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!message.trim() || sendingMessage || status === 'resolved'}
              className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110 shadow-md disabled:shadow-none"
              title="Send message"
            >
              {sendingMessage ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
          
          {status === 'resolved' && (
            <p className="text-xs mt-2 text-center text-gray-500">
              This conversation has been resolved and is read-only.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// MessageBubble Component - identical to customer chat
const MessageBubble = ({ message, currentUser, showAvatar = true, isGrouped = false }) => {
  const isOwnMessage = String(message.senderId) === String(currentUser?.id) || message.sender === 'pharmacist';
  const rawTs = message.timestamp || message.time;
  const parsedTs = rawTs ? new Date(rawTs) : new Date();
  const timestamp = isNaN(parsedTs.getTime()) ? new Date() : parsedTs;
  
  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-${isGrouped ? '1' : '4'}`}>
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {showAvatar && !isOwnMessage && !isGrouped && (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
            {message.senderAvatar ? (
              <img
                src={message.senderAvatar}
                alt={message.senderName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-gray-600">
                {message.senderName?.charAt(0)?.toUpperCase() || 'P'}
              </span>
            )}
          </div>
        )}

        {/* Spacer for grouped messages */}
        {!showAvatar && !isOwnMessage && isGrouped && (
          <div className="w-8"></div>
        )}

        {/* Message Bubble */}
        <div className="flex flex-col">
          {/* Sender name for other's messages */}
          {!isOwnMessage && !isGrouped && (
            <span className="text-xs text-gray-500 mb-1 px-2">
              {message.senderName || 'Patient'}
            </span>
          )}

          {/* Message Content */}
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwnMessage
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
            } ${isGrouped ? 'mt-1' : ''}`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content || message.text}</p>
          </div>

          {/* Timestamp */}
          <div className={`flex items-center space-x-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500">
              {formatTime(timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Date Separator Component
const DateSeparator = ({ date }) => {
  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="flex items-center justify-center my-4">
      <div className="bg-gray-100 px-4 py-1 rounded-full">
        <span className="text-xs text-gray-600 font-medium">
          {formatDate(new Date(date))}
        </span>
      </div>
    </div>
  );
};

// Typing Indicator Component
const TypingIndicator = ({ senderName, avatar }) => {
  return (
    <div className="flex items-end space-x-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={senderName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <span className="text-xs font-medium text-gray-600">
            {senderName?.charAt(0)?.toUpperCase() || 'P'}
          </span>
        )}
      </div>
      
      <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-sm">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
