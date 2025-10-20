import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

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
  UPDATE_CHAT: 'UPDATE_CHAT'
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
  connected: false
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
    
    default:
      return state;
  }
};

// Chat Provider Component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();

  // WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (!user || state.websocket) return;

    try {
      const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8080'}/ws/chat`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: false });
        
        // Send authentication message
        ws.send(JSON.stringify({
          type: 'auth',
          token: localStorage.getItem('authToken'),
          userId: user.id
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Connection error' });
      };

      state.websocket = ws;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to connect to chat service' });
    }
  }, [user, state.websocket]);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((data) => {
    switch (data.type) {
      case 'new_message':
        dispatch({
          type: CHAT_ACTIONS.ADD_MESSAGE,
          payload: { chatId: data.chatId, message: data.message }
        });
        dispatch({
          type: CHAT_ACTIONS.UPDATE_CHAT_LAST_MESSAGE,
          payload: { chatId: data.chatId, message: data.message }
        });
        break;
      
      case 'typing':
        dispatch({
          type: CHAT_ACTIONS.SET_TYPING_STATUS,
          payload: {
            chatId: data.chatId,
            userId: data.userId,
            isTyping: data.isTyping
          }
        });
        break;
      
      case 'user_online':
        dispatch({
          type: CHAT_ACTIONS.SET_ONLINE_STATUS,
          payload: { userId: data.userId, isOnline: true }
        });
        break;
      
      case 'user_offline':
        dispatch({
          type: CHAT_ACTIONS.SET_ONLINE_STATUS,
          payload: { userId: data.userId, isOnline: false }
        });
        break;
      
      default:
        console.log('Unknown message type:', data.type);
    }
  }, []);

  // Fetch chats
  const fetchChats = useCallback(async () => {
    try {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: true });
      const response = await api.get('/chats');
      dispatch({ type: CHAT_ACTIONS.SET_CHATS, payload: response.data });
    } catch (error) {
      console.error('Error fetching chats:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to load chats' });
    } finally {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Fetch messages for a chat
  const fetchMessages = useCallback(async (chatId, page = 0) => {
    try {
      const response = await api.get(`/chats/${chatId}/messages?page=${page}`);
      dispatch({
        type: CHAT_ACTIONS.SET_MESSAGES,
        payload: { chatId, messages: response.data }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to load messages' });
      return [];
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (chatId, content, messageType = 'text') => {
    try {
      const message = {
        chatId,
        content,
        messageType,
        senderId: user.id,
        timestamp: new Date().toISOString()
      };

      // Send via WebSocket for real-time delivery
      if (state.websocket && state.websocket.readyState === WebSocket.OPEN) {
        state.websocket.send(JSON.stringify({
          type: 'send_message',
          ...message
        }));
      }

      // Also send via API for persistence
      const response = await api.post(`/chats/${chatId}/messages`, message);
      
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to send message' });
      throw error;
    }
  }, [user, state.websocket]);

  // Start new chat
  const startChat = useCallback(async (pharmacyId) => {
    try {
      const response = await api.post('/chats/start', { pharmacyId });
      const newChat = response.data;
      
      dispatch({ type: CHAT_ACTIONS.ADD_CHAT, payload: newChat });
      dispatch({ type: CHAT_ACTIONS.SET_ACTIVE_CHAT, payload: newChat });
      
      return newChat;
    } catch (error) {
      console.error('Error starting chat:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to start chat' });
      throw error;
    }
  }, []);

  // Set active chat
  const setActiveChat = useCallback((chat) => {
    dispatch({ type: CHAT_ACTIONS.SET_ACTIVE_CHAT, payload: chat });
    
    // Mark messages as read
    if (chat && chat.unreadCount > 0) {
      api.post(`/chats/${chat.id}/mark-read`).catch(console.error);
      dispatch({
        type: CHAT_ACTIONS.UPDATE_CHAT,
        payload: { ...chat, unreadCount: 0 }
      });
    }
    
    // Fetch messages if not already loaded
    if (chat && !state.messages[chat.id]) {
      fetchMessages(chat.id);
    }
  }, [state.messages, fetchMessages]);

  // Send typing indicator
  const sendTypingIndicator = useCallback((chatId, isTyping) => {
    if (state.websocket && state.websocket.readyState === WebSocket.OPEN) {
      state.websocket.send(JSON.stringify({
        type: 'typing',
        chatId,
        userId: user.id,
        isTyping
      }));
    }
  }, [state.websocket, user]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: CHAT_ACTIONS.CLEAR_ERROR });
  }, []);

  // Connect WebSocket when user is available
  useEffect(() => {
    if (user) {
      connectWebSocket();
      fetchChats();
    }

    return () => {
      if (state.websocket) {
        state.websocket.close();
      }
    };
  }, [user]);

  const value = {
    // State
    chats: state.chats,
    activeChat: state.activeChat,
    messages: state.messages,
    loading: state.loading,
    error: state.error,
    typingUsers: state.typingUsers,
    onlineUsers: state.onlineUsers,
    connected: state.websocket?.readyState === WebSocket.OPEN,

    // Actions
    fetchChats,
    fetchMessages,
    sendMessage,
    startChat,
    setActiveChat,
    sendTypingIndicator,
    clearError
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