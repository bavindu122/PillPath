import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import api from '../../../../services/api';
import stompWebSocketService from '../../../../services/stompWebsocketService';
import { ArrowLeft, Send, User, Wifi, WifiOff, Phone, Video, MoreVertical, Circle, MessageCircle, Paperclip, Smile } from 'lucide-react';

const ChatWindow = ({ customerId: propCustomerId, onBack, thread, onMessagesRead }) => {
  const { customerId: paramCustomerId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const customerId = propCustomerId || paramCustomerId;
  
  // Debug: Log current user
  useEffect(() => {
    console.log('Current pharmacy admin user:', {
      id: user?.id,
      name: user?.fullName || user?.name,
      role: user?.role
    });
  }, [user]);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(0);
  const [chatDetails, setChatDetails] = useState(null);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const prevScrollHeight = useRef(0);
  const resolvedChatIdRef = useRef(null); // will hold the actual chat/thread id when resolved
  const stompConnected = useRef(false);

  // Customer info from chat details
  const customerInfo = chatDetails ? {
    name: chatDetails.customerName || `Customer ${customerId}`,
    avatar: chatDetails.customerProfilePicture || null,
    isOnline: connectionStatus === 'connected'
  } : {
    name: `Customer ${customerId}`,
    avatar: null,
    isOnline: connectionStatus === 'connected'
  };

  // Scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    }
  }, []);

  // Mark messages as read
  const markMessagesAsRead = async (chatId) => {
    try {
      await api.post(`/v1/chats/${chatId}/mark-read`);
      console.log('✅ Messages marked as read for chat:', chatId);
      
      // Notify parent component to update unread count
      if (onMessagesRead) {
        onMessagesRead(customerId);
      }
    } catch (error) {
      console.warn('⚠️ Failed to mark messages as read:', error.message);
    }
  };

  // Fetch chat details to get customer info and resolve chat ID
  const fetchChatDetails = async () => {
    try {
      // Fetch threads and find one that matches the customerId
      const { data } = await api.get('/v1/chats/threads');
      const list = Array.isArray(data) ? data : (data?.threads || data?.items || data?.content || []);
      const found = list.find(t => String(t.customerId) === String(customerId) || String(t.customer?.id) === String(customerId));
      
      if (found) {
        setChatDetails(found);
        resolvedChatIdRef.current = found.id || found.chatId || found.threadId;
        console.log('✅ Resolved chat ID:', resolvedChatIdRef.current, 'for customer:', customerId);
        
        // Mark messages as read when opening the chat
        if (resolvedChatIdRef.current) {
          markMessagesAsRead(resolvedChatIdRef.current);
        }
      } else {
        console.warn('⚠️ Chat not found for customer:', customerId);
      }
    } catch (e) {
      console.error('❌ Failed to fetch chat details:', e);
    }
  };

  // Connect on mount
  useEffect(() => {
    if (customerId && user && token) {
      connectStompWebSocket();
    }

    return () => {
      cleanup();
    };
  }, [customerId, user, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    if (messages.length > 0) {
      const container = messagesContainerRef.current;
      if (container) {
        const isNearBottom = container.scrollHeight - container.clientHeight - container.scrollTop <= 100;
        if (isNearBottom) {
          scrollToBottom();
        }
      }
    }
  }, [messages, scrollToBottom]);

  // Load more messages when scrolling to top
  const handleScroll = useCallback(async () => {
    const container = messagesContainerRef.current;
    if (!container || loadingMessages || !hasMoreMessages) return;
    
    const atTop = container.scrollTop <= 0;
    if (atTop) {
      setLoadingMessages(true);
      prevScrollHeight.current = container.scrollHeight;
      
      try {
        // Simulate loading more messages - replace with actual API call
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
  }, [loadingMessages, hasMoreMessages]);

  const cleanup = () => {
    // Unsubscribe from chat room
    if (resolvedChatIdRef.current && stompConnected.current) {
      stompWebSocketService.unsubscribeFromRoom(resolvedChatIdRef.current);
    }
  };

  const connectStompWebSocket = async () => {
    if (stompConnected.current || !user || !token) {
      console.log('⚠️ Skipping STOMP connection:', { 
        alreadyConnected: stompConnected.current, 
        hasUser: !!user, 
        hasToken: !!token 
      });
      return;
    }

    setConnectionStatus('connecting');

    try {
      // Resolve chat ID first
      await fetchChatDetails();

      if (!resolvedChatIdRef.current) {
        console.warn('⚠️ Could not resolve chat ID, will retry...');
        setConnectionStatus('disconnected');
        return;
      }

      // Connect to STOMP WebSocket
      console.log('🔌 Connecting to STOMP WebSocket...', {
        userId: user.id,
        userType: 'PHARMACY_ADMIN',
        chatRoomId: resolvedChatIdRef.current
      });
      
      await stompWebSocketService.connect(token, user.id, 'PHARMACY_ADMIN');
      
      console.log('✅ STOMP connected successfully');
      setConnectionStatus('connected');
      stompConnected.current = true;

      // Load message history from API
      if (resolvedChatIdRef.current) {
        try {
          const response = await api.get(`/v1/chats/${resolvedChatIdRef.current}/messages?page=0&size=50`);
          const messagesData = response.data?.messages || response.data?.content || [];
          
          console.log('📥 Loaded messages from API:', messagesData.map(msg => ({
            id: msg.id,
            senderId: msg.senderId,
            senderType: msg.senderType,
            senderName: msg.senderName,
            content: msg.content?.substring(0, 30)
          })));
          
          // Convert API messages to component format
          const formattedMessages = messagesData.map(msg => ({
            id: msg.id,
            chatRoomId: msg.chatRoomId,
            senderId: msg.senderId,
            senderType: msg.senderType,
            senderName: msg.senderName,
            senderAvatar: msg.senderProfilePicture,
            sender: msg.senderType === 'CUSTOMER' ? 'customer' : 'admin',
            content: msg.content,
            text: msg.content,
            timestamp: msg.timestamp,
            time: msg.timestamp,
            isRead: msg.isRead
          }));
          
          setMessages(formattedMessages.reverse()); // Messages are returned newest first, we want oldest first
        } catch (err) {
          console.warn('⚠️ Failed to load message history:', err);
        }

        // Subscribe to chat room for real-time updates
        console.log('📡 Subscribing to chat room:', resolvedChatIdRef.current);
        stompWebSocketService.subscribeToRoom(
          resolvedChatIdRef.current,
          handleNewMessage,
          handleTypingIndicator,
          handlePresenceUpdate
        );
      }

    } catch (error) {
      console.error('❌ Failed to connect STOMP WebSocket:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      setConnectionStatus('disconnected');
      stompConnected.current = false;
      
      // Retry after 5 seconds
      setTimeout(() => {
        console.log('🔄 Retrying STOMP connection...');
        stompConnected.current = false;
        connectStompWebSocket();
      }, 5000);
    }
  };

  const handleNewMessage = (messageData) => {
    console.log('📨 Pharmacy Admin received new message via STOMP:', messageData);
    console.log('📨 Raw message fields:', {
      id: messageData.id,
      chatId: messageData.chatId,
      chatRoomId: messageData.chatRoomId,
      senderId: messageData.senderId,
      senderType: messageData.senderType,
      content: messageData.content
    });
    
    // Add message to UI
    addMessage(messageData);
    
    // Auto-mark as read since the chat window is open
    if (resolvedChatIdRef.current && messageData.senderType !== 'ADMIN' && messageData.senderType !== 'PHARMACY_ADMIN') {
      markMessagesAsRead(resolvedChatIdRef.current);
    }
  };

  const handleTypingIndicator = (typingData) => {
    console.log('⌨️ Typing indicator:', typingData);
    // TODO: Implement typing indicator UI
  };

  const handlePresenceUpdate = (presenceData) => {
    console.log('👤 Presence update:', presenceData);
    // TODO: Implement presence tracking UI
  };

  const addMessage = (messageData) => {
    // Prevent duplicate messages
    setMessages(prev => {
      const exists = prev.some(msg => msg.id === messageData.id);
      if (exists) {
        console.log('⚠️ Duplicate message ignored:', messageData.id);
        return prev;
      }

      const newMsg = {
        id: messageData.id || Date.now() + Math.random(),
        chatRoomId: messageData.chatRoomId,
        customerId: messageData.customerId,
        senderId: messageData.senderId || messageData.sender,
        senderType: messageData.senderType || (messageData.sender === 'admin' ? 'ADMIN' : 'CUSTOMER'),
        sender: messageData.senderType === 'CUSTOMER' ? 'customer' : 'admin',
        senderName: messageData.senderName || (messageData.senderType === 'ADMIN' ? user?.fullName || user?.name || 'Admin' : chatDetails?.customerName || 'Customer'),
        senderAvatar: messageData.senderProfilePicture || messageData.senderAvatar || (messageData.senderType === 'ADMIN' ? user?.profilePictureUrl : chatDetails?.customerProfilePicture),
        text: messageData.text || messageData.content,
        content: messageData.content || messageData.text,
        time: messageData.time || messageData.timestamp || new Date().toISOString(),
        timestamp: messageData.time || messageData.timestamp || new Date().toISOString()
      };

      console.log('✅ Adding message:', {
        id: newMsg.id,
        senderId: newMsg.senderId,
        senderType: newMsg.senderType,
        content: newMsg.content?.substring(0, 30)
      });

      return [...prev, newMsg];
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || connectionStatus !== 'connected' || !resolvedChatIdRef.current) return;

    setSending(true);
    const messageText = newMessage.trim();
    const chatRoomId = resolvedChatIdRef.current;

    // Clear input immediately for better UX
    setNewMessage('');

    try {
      // Save message to database via API
      // The backend will automatically broadcast via WebSocket after saving
      console.log('📤 Sending message to chat room:', chatRoomId);
      
      const response = await api.post(`/v1/chats/pharmacy-admin/dashboard/chats/${chatRoomId}/messages`, {
        text: messageText,
        senderId: user?.id
      });
      
      console.log('✅ Message saved and broadcasted:', response.data);

      // Note: No need to manually send via STOMP here because:
      // 1. The backend API saves the message
      // 2. The backend then broadcasts it via WebSocket
      // 3. We'll receive it via our subscription and add it to the UI
      // This prevents duplicate messages

    } catch (error) {
      console.error('❌ Failed to send message:', error);
      alert('Failed to send message. Please try again.');
      // Restore the message text if failed
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="h-4 w-4 text-green-600" />;
      case 'connecting': case 'reconnecting': 
        return <div className="animate-spin h-4 w-4 border-2 border-yellow-600 border-t-transparent rounded-full" />;
      case 'disconnected': default: return <WifiOff className="h-4 w-4 text-red-600" />;
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'reconnecting': return 'Reconnecting...';
      case 'disconnected': default: return 'Disconnected';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-white border-l border-blue-100" style={{ height: '100%', maxHeight: '100%' }}>
      {/* Chat Header */}
      <div className="px-4 py-4 border-b border-blue-100 flex items-center justify-between bg-white/90 backdrop-blur-sm flex-shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          {/* Back Button */}
          <button
            onClick={() => onBack ? onBack() : navigate('/pharmacy/chats')}
            className="lg:hidden p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div className="relative">
            {customerInfo.avatar ? (
              <img
                src={customerInfo.avatar}
                alt={customerInfo.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
            
            {/* Online indicator */}
            {customerInfo.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse shadow-sm"></div>
            )}
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{customerInfo.name}</h3>
            <div className="flex items-center space-x-2">
              <Circle 
                className={`w-2 h-2 ${customerInfo.isOnline ? 'text-green-500 fill-current' : 'text-gray-400'}`} 
              />
              <span className={`text-sm font-medium ${
                customerInfo.isOnline ? 'text-green-600' : 'text-gray-500'
              }`}>
                {getConnectionStatusText()}
              </span>
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
          
          {/* Connection status */}
          <div className="flex items-center space-x-2 ml-2">
            {getConnectionStatusIcon()}
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
        {!hasMoreMessages && messages.length > 0 && (
          <div className="text-center py-2">
            <span className="text-xs text-gray-500">This is the beginning of your conversation</span>
          </div>
        )}

        {/* Messages */}
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Ready to chat!</h3>
              <p className="text-gray-600 leading-relaxed">
                Send your first message to start a conversation with {customerInfo.name}. 
                Assist them with their health and pharmacy needs.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              currentUser={user}
              showAvatar={true}
              isGrouped={false}
            />
          ))
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
              disabled={connectionStatus !== 'connected'}
              title="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            {/* Message Input */}
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 border-0 bg-transparent focus:outline-none resize-none h-10 text-gray-800 placeholder-gray-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                disabled={connectionStatus !== 'connected'}
              />
            </div>

            {/* Emoji Button */}
            <button
              type="button"
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-all duration-200 transform hover:scale-110"
              disabled={connectionStatus !== 'connected'}
              title="Add emoji"
            >
              <Smile className="h-5 w-5" />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!newMessage.trim() || sending || connectionStatus !== 'connected'}
              className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110 shadow-md disabled:shadow-none"
              title="Send message"
            >
              {sending ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
          
          {connectionStatus !== 'connected' && (
            <p className="text-xs mt-2 text-center text-gray-500">
              {connectionStatus === 'connecting' ? 'Connecting to chat...' : 'Chat is offline. Messages will be sent when reconnected.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// MessageBubble Component - identical to customer chat
const MessageBubble = ({ message, currentUser, showAvatar = true, isGrouped = false }) => {
  // Check if message is from current user (pharmacy admin)
  // Priority: Check senderId match first, then check senderType
  const isOwnMessage = currentUser?.id 
    ? String(message.senderId) === String(currentUser.id)
    : (message.senderType === 'ADMIN' || message.senderType === 'PHARMACY_ADMIN' || message.sender === 'admin');
  
  // Debug logging
  console.log('Message debug:', {
    messageId: message.id,
    senderId: message.senderId,
    senderType: message.senderType,
    sender: message.sender,
    currentUserId: currentUser?.id,
    isOwnMessage,
    content: message.content?.substring(0, 30)
  });
    
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
                {message.senderName?.charAt(0)?.toUpperCase() || 'C'}
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
              {message.senderName || 'Customer'}
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

export default ChatWindow;