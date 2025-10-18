import React, { useEffect, useState } from 'react';
import { useChat } from '../../contexts/ChatContextLive';
import { useAuth } from '../../hooks/useAuth';
import webSocketService from '../../services/websocketService';
import chatService from '../../services/chatService';

/**
 * Example component demonstrating how to use the chat system
 * This component shows how to:
 * - Connect to WebSocket
 * - Send and receive messages
 * - Handle typing indicators
 * - Search for pharmacies
 * - Start new chats
 */
const ChatExampleUsage = () => {
  const { user } = useAuth();
  const {
    chats,
    activeChat,
    messages,
    connected,
    loading,
    error,
    sendMessage,
    startChat,
    setActiveChat,
    fetchChats,
    sendTypingIndicator
  } = useChat();

  const [exampleMessage, setExampleMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pharmacies, setPharmacies] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Example: Search for pharmacies
  const handlePharmacySearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setSearchLoading(true);
      const results = await chatService.searchPharmacies(searchQuery);
      setPharmacies(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Example: Start a new chat with a pharmacy
  const handleStartChat = async (pharmacyId) => {
    try {
      const newChat = await startChat(pharmacyId);
      console.log('Started new chat:', newChat);
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  // Example: Send a message
  const handleSendMessage = async () => {
    if (!activeChat || !exampleMessage.trim()) return;

    try {
      await sendMessage(activeChat.id, exampleMessage);
      setExampleMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Example: Handle typing indicators
  const handleTypingStart = () => {
    if (activeChat) {
      sendTypingIndicator(activeChat.id, true);
    }
  };

  const handleTypingStop = () => {
    if (activeChat) {
      sendTypingIndicator(activeChat.id, false);
    }
  };

  // Example: WebSocket event handling
  useEffect(() => {
    // Listen for incoming messages
    const handleNewMessage = (data) => {
      console.log('New message received:', data);
      // The ChatContext automatically handles this
    };

    // Listen for typing indicators
    const handleTyping = (data) => {
      console.log('User typing:', data);
    };

    // Listen for user online/offline status
    const handleUserStatus = (data) => {
      console.log('User status changed:', data);
    };

    // Add event listeners
    webSocketService.on('new_message', handleNewMessage);
    webSocketService.on('typing_start', handleTyping);
    webSocketService.on('user_online', handleUserStatus);
    webSocketService.on('user_offline', handleUserStatus);

    // Cleanup
    return () => {
      webSocketService.off('new_message', handleNewMessage);
      webSocketService.off('typing_start', handleTyping);
      webSocketService.off('user_online', handleUserStatus);
      webSocketService.off('user_offline', handleUserStatus);
    };
  }, []);

  // Example: Upload and send file
  const handleFileUpload = async (file) => {
    if (!activeChat) return;

    try {
      // Upload file first
      const uploadResult = await chatService.uploadFile(file, activeChat.id);
      
      // Send message with file reference
      await sendMessage(
        activeChat.id,
        '', // Empty content for file message
        'file',
        {
          fileUrl: uploadResult.url,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type
        }
      );
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Chat System Example Usage</h1>

      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${connected ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{connected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div>User: {user?.name || 'Not logged in'}</div>
          <div>Role: {user?.role || 'Unknown'}</div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Pharmacy Search (Customer only) */}
      {user?.role === 'customer' && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Search Pharmacies</h2>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pharmacy by name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handlePharmacySearch}
              disabled={searchLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Search Results */}
          {pharmacies.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Search Results:</h3>
              {pharmacies.map((pharmacy) => (
                <div key={pharmacy.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <div className="font-medium">{pharmacy.name}</div>
                    <div className="text-sm text-gray-600">{pharmacy.address}</div>
                  </div>
                  <button
                    onClick={() => handleStartChat(pharmacy.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Start Chat
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chat List */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Available Chats ({chats.length})</h2>
        {loading ? (
          <div>Loading chats...</div>
        ) : chats.length === 0 ? (
          <div className="text-gray-600">No chats available</div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`p-3 rounded border cursor-pointer ${
                  activeChat?.id === chat.id ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {user?.role === 'customer' 
                      ? (chat.pharmacy?.name || chat.pharmacist?.name || 'Unknown Pharmacy')
                      : (chat.customer?.name || 'Unknown Customer')}
                  </div>
                  {chat.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <div className="text-sm text-gray-600 truncate">
                    {chat.lastMessage.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Chat */}
      {activeChat && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Active Chat</h2>
          <div className="mb-4">
            <strong>Chat with:</strong> {
              user?.role === 'customer' 
                ? (activeChat.pharmacy?.name || activeChat.pharmacist?.name || 'Unknown Pharmacy')
                : (activeChat.customer?.name || 'Unknown Customer')
            }
          </div>

          {/* Messages */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Messages ({messages[activeChat.id]?.length || 0}):</h3>
            <div className="max-h-40 overflow-y-auto bg-white p-3 border rounded">
              {messages[activeChat.id]?.length === 0 ? (
                <div className="text-gray-500">No messages yet</div>
              ) : (
                messages[activeChat.id]?.map((message, index) => (
                  <div key={index} className="mb-2">
                    <span className="font-medium">
                      {message.senderId === user?.id ? 'You' : 'Other'}:
                    </span>
                    <span className="ml-2">{message.content}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Send Message */}
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={exampleMessage}
                onChange={(e) => setExampleMessage(e.target.value)}
                onFocus={handleTypingStart}
                onBlur={handleTypingStop}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={!exampleMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>

            {/* File Upload Example */}
            <input
              type="file"
              onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>
      )}

      {/* API Examples */}
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Available API Endpoints</h2>
        <div className="text-sm space-y-1 font-mono">
          <div>GET /api/chats - Get all chats</div>
          <div>GET /api/chats/:id/messages - Get chat messages</div>
          <div>POST /api/chats/start - Start new chat</div>
          <div>POST /api/chats/:id/messages - Send message</div>
          <div>POST /api/chats/:id/mark-read - Mark as read</div>
          <div>GET /api/pharmacies/search?name=... - Search pharmacies</div>
          <div>POST /api/chats/upload - Upload file</div>
          <div>WebSocket: ws://localhost:8080/ws/chat - Real-time messaging</div>
        </div>
      </div>
    </div>
  );
};

export default ChatExampleUsage;