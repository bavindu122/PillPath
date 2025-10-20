import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
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

// Mock Data
const MOCK_PHARMACIES = [
  {
    id: '1',
    name: 'City Pharmacy',
    address: '123 Main St, Downtown',
    phone: '+1 (555) 123-4567',
    rating: 4.5,
    reviewCount: 128,
    isOpen: true,
    operatingHours: '8:00 AM - 10:00 PM',
    description: 'Full-service pharmacy with 24/7 consultation available'
  },
  {
    id: '2',
    name: 'HealthCare Plus',
    address: '456 Oak Ave, Midtown',
    phone: '+1 (555) 987-6543',
    rating: 4.2,
    reviewCount: 89,
    isOpen: true,
    operatingHours: '9:00 AM - 9:00 PM',
    description: 'Specialized in chronic disease management and wellness'
  },
  {
    id: '3',
    name: 'MedPoint Pharmacy',
    address: '789 Pine St, Uptown',
    phone: '+1 (555) 456-7890',
    rating: 4.7,
    reviewCount: 203,
    isOpen: false,
    operatingHours: '7:00 AM - 11:00 PM',
    description: 'Fast prescription filling with home delivery options'
  }
];

const MOCK_CHATS = [
  {
    id: 'chat1',
    pharmacy: {
      id: '1',
      name: 'City Pharmacy',
      avatar: null,
      profileImage: null
    },
    pharmacist: {
      id: 'pharmacist1',
      name: 'Dr. Sarah Johnson',
      avatar: null
    },
    customer: {
      id: 'customer1',
      name: 'John Doe',
      avatar: null
    },
    lastMessage: {
      id: 'msg1',
      content: 'Thank you for your question about the medication. I\'ll check the availability and get back to you shortly.',
      senderId: 'pharmacist1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      messageType: 'text'
    },
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    unreadCount: 1,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: 'chat2',
    pharmacy: {
      id: '2',
      name: 'HealthCare Plus',
      avatar: null,
      profileImage: null
    },
    pharmacist: {
      id: 'pharmacist2',
      name: 'Dr. Michael Chen',
      avatar: null
    },
    customer: {
      id: 'customer1',
      name: 'John Doe',
      avatar: null
    },
    lastMessage: {
      id: 'msg2',
      content: 'Your prescription is ready for pickup. We\'re open until 9 PM today.',
      senderId: 'pharmacist2',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      messageType: 'text'
    },
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
  }
];

const MOCK_MESSAGES = {
  'chat1': [
    {
      id: 'msg1-1',
      chatId: 'chat1',
      senderId: 'customer1',
      senderName: 'John Doe',
      content: 'Hi, I have a question about my blood pressure medication. Can you help me understand the side effects?',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      messageType: 'text',
      status: 'read'
    },
    {
      id: 'msg1-2',
      chatId: 'chat1',
      senderId: 'pharmacist1',
      senderName: 'Dr. Sarah Johnson',
      content: 'Of course! I\'d be happy to help you with that. Which blood pressure medication are you currently taking?',
      timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      messageType: 'text',
      status: 'read'
    },
    {
      id: 'msg1-3',
      chatId: 'chat1',
      senderId: 'customer1',
      senderName: 'John Doe',
      content: 'I\'m taking Lisinopril 10mg once daily. I\'ve been experiencing a dry cough lately.',
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
      messageType: 'text',
      status: 'read'
    },
    {
      id: 'msg1-4',
      chatId: 'chat1',
      senderId: 'pharmacist1',
      senderName: 'Dr. Sarah Johnson',
      content: 'A dry cough is indeed a known side effect of Lisinopril. It affects about 10-15% of patients. Let me provide you with some information and alternatives.',
      timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(),
      messageType: 'text',
      status: 'read'
    },
    {
      id: 'msg1-5',
      chatId: 'chat1',
      senderId: 'pharmacist1',
      senderName: 'Dr. Sarah Johnson',
      content: 'Thank you for your question about the medication. I\'ll check the availability and get back to you shortly.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      messageType: 'text',
      status: 'delivered'
    }
  ],
  'chat2': [
    {
      id: 'msg2-1',
      chatId: 'chat2',
      senderId: 'customer1',
      senderName: 'John Doe',
      content: 'Hello, is my prescription ready for pickup?',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      messageType: 'text',
      status: 'read'
    },
    {
      id: 'msg2-2',
      chatId: 'chat2',
      senderId: 'pharmacist2',
      senderName: 'Dr. Michael Chen',
      content: 'Your prescription is ready for pickup. We\'re open until 9 PM today.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      messageType: 'text',
      status: 'read'
    }
  ]
};

// Initial State with mock data
const initialState = {
  chats: MOCK_CHATS,
  activeChat: null,
  messages: MOCK_MESSAGES,
  loading: false,
  error: null,
  typingUsers: {},
  onlineUsers: new Set(['pharmacist1', 'pharmacist2']),
  websocket: null,
  connected: false, // Set to false since we're using mock data
  mockMode: true // Flag to indicate we're in mock mode
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

  // Mock API calls for demo purposes
  const fetchChats = useCallback(async () => {
    dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: true });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    dispatch({ type: CHAT_ACTIONS.SET_CHATS, payload: MOCK_CHATS });
    dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: false });
  }, []);

  const fetchMessages = useCallback(async (chatId, page = 0) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const messages = MOCK_MESSAGES[chatId] || [];
      dispatch({
        type: CHAT_ACTIONS.SET_MESSAGES,
        payload: { chatId, messages }
      });
      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to load messages' });
      return [];
    }
  }, []);

  // Mock send message
  const sendMessage = useCallback(async (chatId, content, messageType = 'text', metadata = {}) => {
    try {
      const message = {
        id: `msg-${Date.now()}`,
        chatId,
        content,
        messageType,
        senderId: user?.id || 'current-user',
        senderName: user?.name || 'You',
        timestamp: new Date().toISOString(),
        status: 'sending',
        ...metadata
      };

      // Add message immediately
      dispatch({
        type: CHAT_ACTIONS.ADD_MESSAGE,
        payload: { chatId, message }
      });

      // Update chat last message
      dispatch({
        type: CHAT_ACTIONS.UPDATE_CHAT_LAST_MESSAGE,
        payload: { chatId, message }
      });

      // Simulate network delay and update status
      setTimeout(() => {
        const updatedMessage = { ...message, status: 'delivered' };
        // In a real implementation, you'd update the specific message
        console.log('Message delivered:', updatedMessage);
      }, 1000);

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to send message' });
      throw error;
    }
  }, [user]);

  // Mock start chat
  const startChat = useCallback(async (pharmacyId) => {
    try {
      const pharmacy = MOCK_PHARMACIES.find(p => p.id === pharmacyId);
      if (!pharmacy) {
        throw new Error('Pharmacy not found');
      }

      const newChat = {
        id: `chat-${Date.now()}`,
        pharmacy: {
          id: pharmacy.id,
          name: pharmacy.name,
          avatar: null,
          profileImage: null
        },
        pharmacist: {
          id: `pharmacist-${pharmacy.id}`,
          name: `Dr. ${pharmacy.name} Staff`,
          avatar: null
        },
        customer: {
          id: user?.id || 'current-user',
          name: user?.name || 'Customer',
          avatar: null
        },
        lastMessage: null,
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        createdAt: new Date().toISOString()
      };
      
      dispatch({ type: CHAT_ACTIONS.ADD_CHAT, payload: newChat });
      dispatch({ type: CHAT_ACTIONS.SET_ACTIVE_CHAT, payload: newChat });
      
      return newChat;
    } catch (error) {
      console.error('Error starting chat:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: 'Failed to start chat' });
      throw error;
    }
  }, [user]);

  // Mock search pharmacies
  const searchPharmacies = useCallback(async (query) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return MOCK_PHARMACIES.filter(pharmacy =>
      pharmacy.name.toLowerCase().includes(query.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(query.toLowerCase())
    );
  }, []);

  // Set active chat
  const setActiveChat = useCallback((chat) => {
    dispatch({ type: CHAT_ACTIONS.SET_ACTIVE_CHAT, payload: chat });
    
    // Mark messages as read (mock)
    if (chat && chat.unreadCount > 0) {
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

  // Mock typing indicator
  const sendTypingIndicator = useCallback((chatId, isTyping) => {
    dispatch({
      type: CHAT_ACTIONS.SET_TYPING_STATUS,
      payload: {
        chatId,
        userId: user?.id || 'current-user',
        isTyping
      }
    });

    // Clear typing after 3 seconds
    if (isTyping) {
      setTimeout(() => {
        dispatch({
          type: CHAT_ACTIONS.SET_TYPING_STATUS,
          payload: {
            chatId,
            userId: user?.id || 'current-user',
            isTyping: false
          }
        });
      }, 3000);
    }
  }, [user]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: CHAT_ACTIONS.CLEAR_ERROR });
  }, []);

  // Initialize mock data on mount
  useEffect(() => {
    console.log('🚀 Chat system initialized with mock data');
    console.log('📝 Available chats:', MOCK_CHATS.length);
    console.log('💬 Available messages:', Object.keys(MOCK_MESSAGES).length);
    
    if (user) {
      fetchChats();
    }
  }, [user, fetchChats]);

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
    mockMode: state.mockMode,

    // Actions
    fetchChats,
    fetchMessages,
    sendMessage,
    startChat,
    setActiveChat,
    sendTypingIndicator,
    clearError,
    searchPharmacies // Add search function
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