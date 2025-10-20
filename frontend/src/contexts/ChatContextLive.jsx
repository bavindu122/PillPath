import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import chatService from '../services/chatService';
import PharmacyService from '../services/api/PharmacyService';
import stompWebSocketService from '../services/stompWebsocketService';
import { normalizeChatsList, normalizeMessage, normalizeChat } from '../utils/chatNormalize';

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
      const currentMessages = state.messages[chatId] || [];
      const updatedMessages = [...currentMessages, message];
      // Sort messages by timestamp to maintain proper order
      const sortedMessages = updatedMessages.sort((a, b) => {
        const timeA = new Date(a.timestamp || a.time || 0).getTime();
        const timeB = new Date(b.timestamp || b.time || 0).getTime();
        return timeA - timeB; // ascending order (oldest first, newest last)
      });
      return {
        ...state,
        messages: {
          ...state.messages,
          [chatId]: sortedMessages
        }
      };
    
    case CHAT_ACTIONS.UPDATE_CHAT_LAST_MESSAGE: {
      const updated = state.chats.map(chat =>
        chat.id === action.payload.chatId
          ? {
              ...chat,
              lastMessage: action.payload.message,
              lastMessageTime: action.payload.message.timestamp,
              unreadCount: chat.id === state.activeChat?.id ? 0 : (chat.unreadCount || 0) + 1,
            }
          : chat
      );
      // Move updated chat to top to reflect recency
      const idx = updated.findIndex(c => c.id === action.payload.chatId);
      if (idx > -1) {
        const [item] = updated.splice(idx, 1);
        return { ...state, chats: [item, ...updated] };
      }
      return { ...state, chats: updated };
    }
    
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
  const normalized = normalizeChatsList(chatsData || [], { sort: true });
  dispatch({ type: CHAT_ACTIONS.SET_CHATS, payload: normalized });
      
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
      console.log('📥 Raw messages from API:', messagesData);
      
      const list = Array.isArray(messagesData?.messages) ? messagesData.messages : (messagesData || []);
      console.log('📥 Messages list extracted:', list);
      
      const normalized = list.map(msg => {
        console.log('🔄 Normalizing message:', { 
          id: msg.id, 
          content: msg.content, 
          text: msg.text,
          rawKeys: Object.keys(msg)
        });
        return normalizeMessage(msg);
      });
      
      console.log('📥 Normalized messages:', normalized.map(m => ({ id: m.id, content: m.content, text: m.text })));
      
      // Merge with existing based on page: page 0 replace; page>0 prepend older
      const existing = state.messages[chatId] || [];
      const existingIds = new Set(existing.map(m => m.id));
      const deduped = normalized.filter(m => !existingIds.has(m.id));
      const merged = page > 0 ? [...deduped, ...existing] : [...deduped];
      // Sort all messages by timestamp to ensure proper order
      const sortedMerged = merged.sort((a, b) => {
        const timeA = new Date(a.timestamp || a.time || 0).getTime();
        const timeB = new Date(b.timestamp || b.time || 0).getTime();
        return timeA - timeB; // ascending order (oldest first, newest last)
      });
      dispatch({ type: CHAT_ACTIONS.SET_MESSAGES, payload: { chatId, messages: sortedMerged } });
      return deduped;
    } catch (error) {
      console.error('Error fetching messages:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to load messages' });
      return [];
    }
  }, [state.messages]);

  // Send message to backend
  const sendMessage = useCallback(async (chatId, content, messageType = 'text', metadata = {}) => {
    if (!chatId || !content.trim()) return;

    try {
      const timestamp = new Date().toISOString();
      const messageData = {
        content: content.trim(),
        messageType,
        ...metadata
      };

      // Add optimistic message immediately with proper senderId
      const optimisticMessage = normalizeMessage({
        id: `temp-${Date.now()}`,
        chatId,
        content: messageData.content,
        messageType,
        senderId: user?.id, // This will be normalized to ensure consistency
        senderName: user?.name || user?.firstName || 'You',
        timestamp,
        status: 'sending',
        metadata,
      });
      
      // TEMPORARY DEBUG
      console.log('✅ Creating optimistic message:', {
        id: optimisticMessage.id,
        senderId: optimisticMessage.senderId,
        content: optimisticMessage.content,
        text: optimisticMessage.text,
        messageType: optimisticMessage.messageType,
        allKeys: Object.keys(optimisticMessage)
      });

      dispatch({
        type: CHAT_ACTIONS.ADD_MESSAGE,
        payload: { chatId, message: optimisticMessage }
      });
      
      console.log('✅ Optimistic message added to state, should be visible now');
      console.log('📊 Current messages count:', (state.messages[chatId] || []).length + 1);

      // Send to backend (include required fields for API)
      const apiPayload = {
        // Start with minimal schema most backends accept
        content: messageData.content,
        senderId: user?.id, // Explicitly include senderId
      };
      
      console.log('📤 Sending customer message to backend:', { chatId, content: messageData.content });
      const sentRaw = await chatService.sendMessage(chatId, apiPayload);
      console.log('✅ Message sent to backend:', sentRaw);
      
      // The backend will broadcast this message via STOMP to /topic/chat/room/{chatRoomId}
      // Our STOMP subscription will receive it and replace the optimistic message
      // No need to manually update here - let STOMP handle it to avoid race conditions
      
      return sentRaw;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Mark optimistic message as failed
      const currentMessages = state.messages[chatId] || [];
      const updatedMessages = currentMessages.map(msg => 
        msg.id === optimisticMessage.id 
          ? { ...msg, status: 'failed' }
          : msg
      );
      
      dispatch({
        type: CHAT_ACTIONS.SET_MESSAGES,
        payload: { chatId, messages: updatedMessages }
      });
      
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

      // Try to enrich chat with pharmacy details so UI can display names/avatars
      let enrichedChat = newChat;
      try {
        if (pharmacyId && (!newChat?.pharmacy && !newChat?.pharmacist)) {
          const details = await chatService.getPharmacyDetails(pharmacyId);
          const pharmacyName = details?.name || details?.pharmacyName || details?.displayName;
          const avatar = details?.logo || details?.avatar || details?.profileImageUrl;
          enrichedChat = {
            ...newChat,
            pharmacyId,
            pharmacyName,
            pharmacy: {
              id: pharmacyId,
              name: pharmacyName,
              avatar
            }
          };
        }
      } catch (e) {
        // Non-fatal if details fetch fails
      }

      if (enrichedChat) {
        dispatch({ type: CHAT_ACTIONS.ADD_CHAT, payload: enrichedChat });
        dispatch({ type: CHAT_ACTIONS.SET_ACTIVE_CHAT, payload: enrichedChat });
        
        // Fetch initial messages if any
        await fetchMessages(enrichedChat.id);
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
      // Join the chat room for realtime updates
      try { webSocketService.joinChat(chat.id); } catch (_) {}
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

    // Send typing indicator through STOMP if connected
    if (stompConnectedRef.current && stompWebSocketService.isConnected()) {
      const userName = user.name || user.firstName || 'Customer';
      stompWebSocketService.sendTypingIndicator(chatId, isTyping, userName);
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
  }, [user]);

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

  // Track active chat room subscription
  const activeSubscriptionRef = useRef(null);
  const stompConnectedRef = useRef(false);

  // STOMP WebSocket connection management
  useEffect(() => {
    if (user && token) {
      console.log('🚀 Initializing customer chat with STOMP WebSocket');
      
      const initializeChat = async () => {
        try {
          // Connect to STOMP WebSocket
          console.log('🔌 Connecting customer to STOMP...', {
            userId: user.id,
            userType: 'CUSTOMER'
          });
          
          await stompWebSocketService.connect(token, user.id, 'CUSTOMER');
          
          console.log('✅ Customer STOMP connected successfully');
          stompConnectedRef.current = true;
          dispatch({ type: CHAT_ACTIONS.SET_CONNECTED, payload: true });

          // Fetch initial chats
          await fetchChats();
          
        } catch (error) {
          console.error('❌ Failed to connect customer STOMP:', error);
          dispatch({ type: CHAT_ACTIONS.SET_CONNECTED, payload: false });
          stompConnectedRef.current = false;
          
          // Retry after 5 seconds
          setTimeout(() => {
            console.log('🔄 Retrying customer STOMP connection...');
            stompConnectedRef.current = false;
            initializeChat();
          }, 5000);
        }
      };

      initializeChat();

      // Cleanup function
      return () => {
        console.log('🧹 Cleaning up customer STOMP connection');
        if (activeSubscriptionRef.current) {
          stompWebSocketService.unsubscribeFromRoom(activeSubscriptionRef.current);
          activeSubscriptionRef.current = null;
        }
        stompWebSocketService.disconnect();
        stompConnectedRef.current = false;
      };
    }
  }, [user, token, fetchChats]);

  // Subscribe to active chat room for real-time messages
  useEffect(() => {
    if (!state.activeChat || !stompConnectedRef.current) {
      console.log('⚠️ Cannot subscribe to chat room:', {
        hasActiveChat: !!state.activeChat,
        stompConnected: stompConnectedRef.current
      });
      return;
    }

    const chatRoomId = state.activeChat.id || state.activeChat.chatId;
    if (!chatRoomId) {
      console.error('❌ Active chat has no chatRoomId:', state.activeChat);
      return;
    }

    console.log('📡 Customer subscribing to chat room:', chatRoomId, 'Active chat:', state.activeChat);

    // Unsubscribe from previous room if any
    if (activeSubscriptionRef.current && activeSubscriptionRef.current !== chatRoomId) {
      stompWebSocketService.unsubscribeFromRoom(activeSubscriptionRef.current);
    }

    // Message handler for real-time messages
    const handleNewMessage = (messageData) => {
      console.log('📨 Customer received new message via STOMP:', messageData);
      console.log('📨 Raw message fields:', {
        id: messageData.id,
        chatId: messageData.chatId,
        chatRoomId: messageData.chatRoomId,
        threadId: messageData.threadId,
        conversationId: messageData.conversationId,
        senderId: messageData.senderId,
        senderType: messageData.senderType,
        content: messageData.content
      });
      
      // Normalize the message
      const message = normalizeMessage(messageData);
      
      console.log('📨 Normalized message:', {
        id: message.id,
        chatId: message.chatId,
        senderId: message.senderId,
        senderType: message.senderType,
        content: message.content
      });
      
      if (!message.chatId) {
        console.error('❌ Message has no chatId after normalization!', { raw: messageData, normalized: message });
        return;
      }

      // Check for duplicates or replace optimistic messages
      const currentMessages = state.messages[message.chatId] || [];
      
      // First check: is this the real version of an optimistic message?
      const optimisticIndex = currentMessages.findIndex(msg => 
        msg.id && String(msg.id).startsWith('temp-') &&
        msg.content === message.content && 
        String(msg.senderId) === String(message.senderId) && 
        Math.abs(new Date(msg.timestamp).getTime() - new Date(message.timestamp).getTime()) < 10000
      );
      
      if (optimisticIndex !== -1) {
        console.log('🔄 Replacing optimistic message with real message:', {
          optimistic: currentMessages[optimisticIndex].id,
          real: message.id
        });
        
        // Replace optimistic message with real one
        const updatedMessages = [...currentMessages];
        updatedMessages[optimisticIndex] = message;
        
        dispatch({
          type: CHAT_ACTIONS.SET_MESSAGES,
          payload: { chatId: message.chatId, messages: updatedMessages }
        });
        
        dispatch({
          type: CHAT_ACTIONS.UPDATE_CHAT_LAST_MESSAGE,
          payload: { chatId: message.chatId, message }
        });
        return;
      }
      
      // Second check: is this an exact duplicate by ID?
      const isDuplicate = currentMessages.some(msg => msg.id === message.id);

      if (isDuplicate) {
        console.log('⚠️ Duplicate message ignored:', message.id);
        return;
      }

      console.log('✅ Adding message to customer chat');
      
      console.log('📨 Message being dispatched:', {
        id: message.id,
        chatId: message.chatId,
        content: message.content,
        text: message.text,
        senderId: message.senderId,
        senderType: message.senderType,
        allKeys: Object.keys(message)
      });
      
      dispatch({
        type: CHAT_ACTIONS.ADD_MESSAGE,
        payload: { chatId: message.chatId, message }
      });

      dispatch({
        type: CHAT_ACTIONS.UPDATE_CHAT_LAST_MESSAGE,
        payload: { chatId: message.chatId, message }
      });
    };

    // Typing indicator handler
    const handleTypingIndicator = (typingData) => {
      console.log('⌨️ Typing indicator:', typingData);
      dispatch({
        type: CHAT_ACTIONS.SET_TYPING_STATUS,
        payload: { 
          chatId: chatRoomId, 
          userId: typingData.userId, 
          isTyping: typingData.isTyping 
        }
      });
    };

    // Presence handler
    const handlePresenceUpdate = (presenceData) => {
      console.log('👤 Presence update:', presenceData);
      dispatch({
        type: CHAT_ACTIONS.SET_ONLINE_STATUS,
        payload: { 
          userId: presenceData.userId, 
          isOnline: presenceData.action === 'joined' 
        }
      });
    };

    // Subscribe to the chat room
    stompWebSocketService.subscribeToRoom(
      chatRoomId,
      handleNewMessage,
      handleTypingIndicator,
      handlePresenceUpdate
    );

    activeSubscriptionRef.current = chatRoomId;

    // Cleanup when active chat changes
    return () => {
      if (activeSubscriptionRef.current === chatRoomId) {
        console.log('🧹 Unsubscribing from chat room:', chatRoomId);
        stompWebSocketService.unsubscribeFromRoom(chatRoomId);
        activeSubscriptionRef.current = null;
      }
    };
  }, [state.activeChat, state.messages]);

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