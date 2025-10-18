import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import chatService from '../services/chatService';
import PharmacyService from '../services/api/PharmacyService';
import webSocketService from '../services/websocketService';

// Chat Context
const ChatContext = createContext();

// Action Types
const CHAT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CHATS: 'SET_CHATS',
  SET_ACTIVE_CHAT: 'SET_ACTIVE_CHAT',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_MESSAGES: 'SET_MESSAGES',
  UPDATE_CHAT_LAST_MESSAGE: 'UPDATE_CHAT_LAST_MESSAGE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_TYPING_STATUS: 'SET_TYPING_STATUS',
  SET_ONLINE_STATUS: 'SET_ONLINE_STATUS',
  ADD_CHAT: 'ADD_CHAT',
  UPDATE_CHAT: 'UPDATE_CHAT',
  SET_CONNECTED: 'SET_CONNECTED',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT'
};

// Initial State
const initialState = {
  chats: [],
  activeChat: null,
  messages: {},
  loading: false,
  error: null,
  typingUsers: {},
  onlineUsers: new Set(),
  websocket: null,
  connected: false,
  unreadCount: 0,
  mockMode: false // This is live mode
};

// Reducer
const chatReducer = (state, action) => {
  switch (action.type) {
    case CHAT_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case CHAT_ACTIONS.SET_CHATS:
      return { ...state, chats: action.payload };
    
    case CHAT_ACTIONS.ADD_CHAT:
      return {
        ...state,
        chats: [action.payload, ...state.chats.filter(chat => chat.id !== action.payload.id)]
      };
    
    case CHAT_ACTIONS.UPDATE_CHAT:
      return {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === action.payload.id ? { ...chat, ...action.payload } : chat
        )
      };
    
    case CHAT_ACTIONS.SET_ACTIVE_CHAT:
      return { ...state, activeChat: action.payload };
    
    case CHAT_ACTIONS.SET_MESSAGES:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatId]: action.payload.messages
        }
      };
    
    case CHAT_ACTIONS.ADD_MESSAGE:
      const { chatId, message } = action.payload;
      return {
        ...state,
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), message]
        }
      };
    
    case CHAT_ACTIONS.UPDATE_CHAT_LAST_MESSAGE:
      return {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === action.payload.chatId
            ? { 
                ...chat, 
                lastMessage: action.payload.message,
                lastMessageTime: action.payload.message.timestamp,
                unreadCount: chat.id === state.activeChat?.id ? 0 : (chat.unreadCount || 0) + 1
              }
            : chat
        )
      };
    
    case CHAT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    
    case CHAT_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case CHAT_ACTIONS.SET_TYPING_STATUS:
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.chatId]: action.payload.isTyping
            ? { ...state.typingUsers[action.payload.chatId], [action.payload.userId]: true }
            : { ...state.typingUsers[action.payload.chatId], [action.payload.userId]: false }
        }
      };
    
    case CHAT_ACTIONS.SET_ONLINE_STATUS:
      const newOnlineUsers = new Set(state.onlineUsers);
      if (action.payload.isOnline) {
        newOnlineUsers.add(action.payload.userId);
      } else {
        newOnlineUsers.delete(action.payload.userId);
      }
      return { ...state, onlineUsers: newOnlineUsers };
    
    case CHAT_ACTIONS.SET_CONNECTED:
      return { ...state, connected: action.payload };
    
    case CHAT_ACTIONS.SET_UNREAD_COUNT:
      return { ...state, unreadCount: action.payload };
    
    default:
      return state;
  }
};

// Chat Provider Component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user, token } = useAuth();

  // Fetch chats from backend
  const fetchChats = useCallback(async () => {
    if (!user || !token) return;
    
    dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const chatsData = await chatService.getChats();
      dispatch({ type: CHAT_ACTIONS.SET_CHATS, payload: chatsData || [] });
      
      // Also fetch unread count
      const unreadData = await chatService.getUnreadCount();
      dispatch({ type: CHAT_ACTIONS.SET_UNREAD_COUNT, payload: unreadData?.count || 0 });
      
    } catch (error) {
      console.error('Error fetching chats:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to load chats' });
    } finally {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: false });
    }
  }, [user, token]);

  // Fetch messages for a specific chat
  const fetchMessages = useCallback(async (chatId, page = 0) => {
    if (!chatId) return [];
    
    try {
      const messagesData = await chatService.getMessages(chatId, page);
      dispatch({
        type: CHAT_ACTIONS.SET_MESSAGES,
        payload: { chatId, messages: messagesData?.messages || [] }
      });
      return messagesData?.messages || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to load messages' });
      return [];
    }
  }, []);

  // Send message to backend
  const sendMessage = useCallback(async (chatId, content, messageType = 'text', metadata = {}) => {
    if (!chatId || !content.trim()) return;

    try {
      const messageData = {
        content: content.trim(),
        messageType,
        ...metadata
      };

      // Add optimistic message immediately
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        chatId,
        content: messageData.content,
        messageType,
        senderId: user?.id,
        senderName: user?.name || user?.firstName || 'You',
        timestamp: new Date().toISOString(),
        status: 'sending',
        ...metadata
      };

      dispatch({
        type: CHAT_ACTIONS.ADD_MESSAGE,
        payload: { chatId, message: optimisticMessage }
      });

      // Send to backend
      const sentMessage = await chatService.sendMessage(chatId, messageData);
      
      // Update with real message data
      if (sentMessage) {
        // Remove optimistic message and add real one
        const currentMessages = state.messages[chatId] || [];
        const updatedMessages = currentMessages.filter(msg => msg.id !== optimisticMessage.id);
        updatedMessages.push(sentMessage);
        
        dispatch({
          type: CHAT_ACTIONS.SET_MESSAGES,
          payload: { chatId, messages: updatedMessages }
        });

        // Update chat last message
        dispatch({
          type: CHAT_ACTIONS.UPDATE_CHAT_LAST_MESSAGE,
          payload: { chatId, message: sentMessage }
        });
      }

      return sentMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to send message' });
      throw error;
    }
  }, [user, state.messages]);

  // Start a new chat with a pharmacy
  const startChat = useCallback(async (pharmacyId) => {
    console.log('Starting chat with:', { pharmacyId, user, token });
    
    if (!pharmacyId) {
      throw new Error('Pharmacy ID is required');
    }

    if (!user) {
      throw new Error('You must be logged in to start a chat');
    }

    if (!token) {
      throw new Error('Authentication token is missing. Please log in again.');
    }

    try {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: true });
      
      console.log('Calling chatService.startChat with pharmacyId:', pharmacyId);
      const newChat = await chatService.startChat(pharmacyId);
      console.log('Chat service response:', newChat);
      
      if (newChat) {
        dispatch({ type: CHAT_ACTIONS.ADD_CHAT, payload: newChat });
        dispatch({ type: CHAT_ACTIONS.SET_ACTIVE_CHAT, payload: newChat });
        
        // Fetch initial messages if any
        await fetchMessages(newChat.id);
      }
      
      return newChat;
    } catch (error) {
      console.error('Error starting chat:', error);
      
      // Provide more specific error messages
      if (error.response?.status === 403) {
        const errorMessage = 'Access denied. Please check your authentication and try again.';
        dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: errorMessage });
        throw new Error(errorMessage);
      } else if (error.response?.status === 401) {
        const errorMessage = 'Your session has expired. Please log in again.';
        dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: errorMessage });
        throw new Error(errorMessage);
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to start chat';
        dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: errorMessage });
        throw new Error(errorMessage);
      }
    } finally {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: false });
    }
  }, [user, token, fetchMessages]);

  // Search pharmacies using backend API
  const searchPharmacies = useCallback(async (query, filters = {}) => {
    try {
      // Use PharmacyService to search pharmacies
      const pharmaciesData = await PharmacyService.getPharmaciesForCustomers({
        search: query,
        ...filters
      });
      
      return pharmaciesData || [];
    } catch (error) {
      console.error('Error searching pharmacies:', error);
      // Fallback to chat service search if pharmacy service fails
      try {
        return await chatService.searchPharmacies(query, filters);
      } catch (fallbackError) {
        console.error('Fallback search also failed:', fallbackError);
        throw new Error('Failed to search pharmacies');
      }
    }
  }, []);

  // Set active chat and mark as read
  const setActiveChat = useCallback(async (chat) => {
    dispatch({ type: CHAT_ACTIONS.SET_ACTIVE_CHAT, payload: chat });
    
    if (chat) {
      // Mark messages as read
      if (chat.unreadCount > 0) {
        try {
          await chatService.markAsRead(chat.id);
          dispatch({
            type: CHAT_ACTIONS.UPDATE_CHAT,
            payload: { ...chat, unreadCount: 0 }
          });
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      }
      
      // Fetch messages if not already loaded
      if (!state.messages[chat.id]) {
        await fetchMessages(chat.id);
      }
    }
  }, [state.messages, fetchMessages]);

  // Send typing indicator
  const sendTypingIndicator = useCallback((chatId, isTyping) => {
    if (!chatId || !user) return;

    dispatch({
      type: CHAT_ACTIONS.SET_TYPING_STATUS,
      payload: {
        chatId,
        userId: user.id,
        isTyping
      }
    });

    // Send typing indicator through WebSocket if connected
    if (state.connected && webSocketService.isConnected()) {
      webSocketService.sendTypingIndicator(chatId, isTyping);
    }

    // Clear typing after 3 seconds
    if (isTyping) {
      setTimeout(() => {
        dispatch({
          type: CHAT_ACTIONS.SET_TYPING_STATUS,
          payload: {
            chatId,
            userId: user.id,
            isTyping: false
          }
        });
      }, 3000);
    }
  }, [user, state.connected]);

  // Upload file for chat
  const uploadFile = useCallback(async (file, chatId) => {
    try {
      return await chatService.uploadFile(file, chatId);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: CHAT_ACTIONS.CLEAR_ERROR });
  }, []);

  // WebSocket connection management
  useEffect(() => {
    if (user && token) {
      console.log('🚀 Initializing chat system with WebSocket');
      
      // Connect to WebSocket
      webSocketService.connect(token);
      
      // Set up WebSocket event listeners
      const handleConnect = () => {
        console.log('✅ WebSocket connected');
        dispatch({ type: CHAT_ACTIONS.SET_CONNECTED, payload: true });
      };
      
      const handleDisconnect = () => {
        console.log('❌ WebSocket disconnected');
        dispatch({ type: CHAT_ACTIONS.SET_CONNECTED, payload: false });
      };
      
      const handleNewMessage = (message) => {
        console.log('📨 New message received:', message);
        dispatch({
          type: CHAT_ACTIONS.ADD_MESSAGE,
          payload: { chatId: message.chatId, message }
        });
        
        dispatch({
          type: CHAT_ACTIONS.UPDATE_CHAT_LAST_MESSAGE,
          payload: { chatId: message.chatId, message }
        });
      };
      
      const handleTypingStatus = ({ chatId, userId, isTyping }) => {
        dispatch({
          type: CHAT_ACTIONS.SET_TYPING_STATUS,
          payload: { chatId, userId, isTyping }
        });
      };
      
      const handleUserOnlineStatus = ({ userId, isOnline }) => {
        dispatch({
          type: CHAT_ACTIONS.SET_ONLINE_STATUS,
          payload: { userId, isOnline }
        });
      };

      // Register event listeners
      webSocketService.on('connect', handleConnect);
      webSocketService.on('disconnect', handleDisconnect);
      webSocketService.on('newMessage', handleNewMessage);
      webSocketService.on('typing', handleTypingStatus);
      webSocketService.on('userOnline', handleUserOnlineStatus);
      webSocketService.on('userOffline', handleUserOnlineStatus);

      // Fetch initial data
      fetchChats();

      // Cleanup function
      return () => {
        webSocketService.off('connect', handleConnect);
        webSocketService.off('disconnect', handleDisconnect);
        webSocketService.off('newMessage', handleNewMessage);
        webSocketService.off('typing', handleTypingStatus);
        webSocketService.off('userOnline', handleUserOnlineStatus);
        webSocketService.off('userOffline', handleUserOnlineStatus);
        webSocketService.disconnect();
      };
    }
  }, [user, token, fetchChats]);

  const value = {
    // State
    chats: state.chats,
    activeChat: state.activeChat,
    messages: state.messages,
    loading: state.loading,
    error: state.error,
    typingUsers: state.typingUsers,
    onlineUsers: state.onlineUsers,
    connected: state.connected,
    unreadCount: state.unreadCount,
    mockMode: state.mockMode,

    // Actions
    fetchChats,
    fetchMessages,
    sendMessage,
    startChat,
    setActiveChat,
    sendTypingIndicator,
    uploadFile,
    clearError,
    searchPharmacies
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;