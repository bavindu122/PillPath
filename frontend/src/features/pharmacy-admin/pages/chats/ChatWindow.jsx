import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, User, Wifi, WifiOff } from 'lucide-react';

const ChatWindow = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const ws = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

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
  }, [messages]);

  const cleanup = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  };

  const connectWebSocket = () => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    setConnectionStatus('connecting');

    try {
      ws.current = new WebSocket('ws://localhost:8080/ws/chat');

      ws.current.onopen = () => {
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;
        
        // Send watch message for this customer
        if (customerId && ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({
            type: 'watch',
            customerId: customerId
          }));
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
      case 'message':
        // Only show messages for this customer
        if (message.customerId === customerId) {
          addMessage(message);
        }
        break;
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
      text: messageData.text,
      time: messageData.time,
      timestamp: messageData.time
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

    // Send via WebSocket
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(messageData));
    }

    setNewMessage('');
    setSending(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/pharmacy/chats')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Customer {customerId}</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {getConnectionStatusIcon()}
                  <span>{getConnectionStatusText()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No messages yet. Start a conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'admin'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t bg-white p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={connectionStatus !== 'connected'}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending || connectionStatus !== 'connected'}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {sending ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;