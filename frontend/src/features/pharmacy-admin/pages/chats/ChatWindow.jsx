import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import api from '../../../../services/api';
import { ArrowLeft, Send, User, Wifi, WifiOff, Phone, Video, MoreVertical, Circle, MessageCircle, Paperclip, Smile } from 'lucide-react';

const ChatWindow = ({ customerId: propCustomerId, onBack, thread }) => {
  const { customerId: paramCustomerId } = useParams();
  const navigate = useNavigate();
  const customerId = propCustomerId || paramCustomerId;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(0);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const prevScrollHeight = useRef(0);
  const resolvedChatIdRef = useRef(null); // will hold the actual chat/thread id when resolved
  const ws = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Mock customer info - replace with actual data
  const customerInfo = {
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

  useEffect(() => {
    if (customerId) {
      connectWebSocket();
    }

    return () => {
      cleanup();
    };
  }, [customerId]);

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
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  };

  const { user, token } = useAuth();

  const connectWebSocket = () => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    setConnectionStatus('connecting');

    try {
      ws.current = new WebSocket('ws://localhost:8080/ws/chat');

      ws.current.onopen = async () => {
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;
        // Authenticate this admin socket if we have a token
        try {
          if (token && ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'auth', token, userId: user?.id }));
          }
        } catch (e) {
          // ignore
        }

        // Resolve actual chat id (thread/conversation id) if the route param is a customerId
        const resolveChatId = async () => {
          try {
            // Fetch threads and find one that matches the customerId
            const { data } = await api.get('/v1/chats/threads');
            const list = Array.isArray(data) ? data : (data?.threads || data?.items || data?.content || []);
            const found = list.find(t => String(t.customerId) === String(customerId) || String(t.customer?.id) === String(customerId));
            if (found) {
              resolvedChatIdRef.current = found.id || found.chatId || found.threadId;
            }
          } catch (e) {
            // ignore - leave resolvedChatIdRef null
            console.warn('Failed to resolve chat id for customer', customerId, e);
          }
        };

        await resolveChatId();

        // Send join message using resolved chat id when available
        if (ws.current?.readyState === WebSocket.OPEN) {
          try {
            if (resolvedChatIdRef.current) {
              ws.current.send(JSON.stringify({ type: 'join_chat', chatId: resolvedChatIdRef.current }));
            } else {
              // fallback to watch for legacy backends using customerId
              ws.current.send(JSON.stringify({ type: 'watch', customerId: customerId }));
            }
          } catch (e) {
            console.warn('Failed to send join/watch for chat', e);
          }
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      ws.current.onclose = (event) => {
        setConnectionStatus('disconnected');
        
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current - 1), 30000);
          
          setConnectionStatus('reconnecting');

          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, delay);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnectionStatus('disconnected');
    }
  };

  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'new_message':
      case 'message': {
        // Accept messages that target this chat by chatId, customerId, or threadId
        const incomingChatId = message.chatId || message.threadId || message.conversationId || null;
        const incomingCustomerId = message.customerId || message.customerId;
        const matched = (
          incomingChatId && String(incomingChatId) === String(resolvedChatIdRef.current)
        ) || (
          String(incomingCustomerId) === String(customerId)
        );

        if (matched) {
          addMessage(message);
        }
        break;
      }
      case 'watch_success':
        // Successfully watching this customer's messages
        break;
      case 'error':
        console.error('WebSocket error:', message.message);
        break;
      default:
        // Ignore unknown message types
        break;
    }
  };

  const addMessage = (messageData) => {
    const newMsg = {
      id: Date.now() + Math.random(),
      customerId: messageData.customerId,
      sender: messageData.sender,
      text: messageData.text || messageData.content,
      time: messageData.time || messageData.timestamp || new Date().toISOString(),
      timestamp: messageData.time || messageData.timestamp || new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || connectionStatus !== 'connected') return;

    setSending(true);
    const messageData = {
      customerId: customerId,
      sender: 'admin',
      text: newMessage.trim(),
      time: new Date().toISOString()
    };

    // Add message immediately to UI
    addMessage(messageData);

    // Send via WebSocket using the backend's expected event types
    if (ws.current?.readyState === WebSocket.OPEN) {
      try {
        // Preferred structured send_message payload
        ws.current.send(JSON.stringify({
          type: 'send_message',
          chatId: customerId,
          content: messageData.text,
          messageType: 'text',
          sender: 'admin',
          senderId: user?.id,
          timestamp: messageData.time
        }));

        // Also send a lightweight legacy payload for compatibility
        ws.current.send(JSON.stringify({
          type: 'message',
          customerId: customerId,
          sender: 'admin',
          text: messageData.text,
          time: messageData.time
        }));
      } catch (e) {
        console.error('Failed to send WS message:', e);
      }
    }

    setNewMessage('');
    setSending(false);
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
              currentUser={{ id: 'admin', role: 'admin' }}
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
  const isOwnMessage = String(message.senderId) === String(currentUser?.id) || message.sender === 'admin';
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