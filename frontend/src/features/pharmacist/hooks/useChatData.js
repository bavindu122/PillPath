import { useState, useEffect } from 'react';

export const useChatData = () => {
  const [data, setData] = useState({
    conversations: [],
    currentConversation: null,
    totalChats: 0,
    unreadCount: 0,
    loading: true,
    error: null,
    searchTerm: '',
    filterStatus: 'all',
    sortBy: 'recent',
    sortOrder: 'desc'
  });

  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchChatData();
  }, []);

  const fetchChatData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true }));
      
      // Replace with actual API calls
      const conversationsResponse = await fetchConversations();
      const unreadCount = conversationsResponse.filter(conv => conv.unreadCount > 0).length;

      setData(prev => ({
        ...prev,
        conversations: conversationsResponse,
        totalChats: conversationsResponse.length,
        unreadCount,
        loading: false,
        error: null
      }));
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  // Mock API function - replace with actual API calls
  const fetchConversations = () => {
    const now = new Date();
    const today = new Date(now);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return Promise.resolve([
      {
        id: 1,
        patientId: 'P001',
        patientName: 'Emma Wilson',
        patientEmail: 'emma.wilson@email.com',
        patientAvatar: '/src/assets/img/meds/pharma.jpg',
        lastMessage: 'Thank you for the clarification about the dosage. When should I take the medication?',
        lastMessageTime: new Date(now.getTime() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
        unreadCount: 2,
        status: 'active',
        priority: 'High',
        prescriptionId: 'RX-250714-01',
        medication: 'Amoxicillin 500mg',
        isOnline: true,
        conversationType: 'prescription_inquiry',
        messages: [
          {
            id: 1,
            senderId: 'P001',
            sender: 'patient',
            text: 'Hi, I have a question about my prescription.',
            timestamp: new Date(today.getTime() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
            isRead: true
          },
          {
            id: 2,
            senderId: 'PHARM001',
            sender: 'pharmacist',
            text: 'Hello Emma! I\'d be happy to help. What\'s your question?',
            timestamp: new Date(today.getTime() - 28 * 60 * 1000).toISOString(), // 28 minutes ago
            isRead: true
          },
          {
            id: 3,
            senderId: 'P001',
            sender: 'patient',
            text: 'I\'m not sure about the dosage instructions. It says take twice daily, but should it be with food?',
            timestamp: new Date(today.getTime() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
            isRead: true
          },
          {
            id: 4,
            senderId: 'PHARM001',
            sender: 'pharmacist',
            text: 'For Amoxicillin, it\'s best to take it with food to reduce stomach upset. Take one tablet in the morning with breakfast and one in the evening with dinner.',
            timestamp: new Date(today.getTime() - 22 * 60 * 1000).toISOString(), // 22 minutes ago
            isRead: true
          },
          {
            id: 5,
            senderId: 'P001',
            sender: 'patient',
            text: 'Thank you for the clarification about the dosage. When should I take the medication?',
            timestamp: new Date(today.getTime() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
            isRead: false
          }
        ]
      },
      {
        id: 2,
        patientId: 'P002',
        patientName: 'Michael Chen',
        patientEmail: 'michael.chen@email.com',
        patientAvatar: '/src/assets/img/meds/pharma.jpg',
        lastMessage: 'Is my prescription ready for pickup?',
        lastMessageTime: new Date(now.getTime() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
        unreadCount: 1,
        status: 'waiting',
        priority: 'Medium',
        prescriptionId: 'RX-250714-02',
        medication: 'Ibuprofen 400mg',
        isOnline: false,
        conversationType: 'pickup_inquiry',
        messages: [
          {
            id: 1,
            senderId: 'P002',
            sender: 'patient',
            text: 'Hi, I submitted my prescription yesterday. Is it ready for pickup?',
            timestamp: new Date(today.getTime() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
            isRead: false
          }
        ]
      },
      {
        id: 3,
        patientId: 'P003',
        patientName: 'Sarah Johnson',
        patientEmail: 'sarah.johnson@email.com',
        patientAvatar: '/src/assets/img/meds/pharma.jpg',
        lastMessage: 'Thank you for your help!',
        lastMessageTime: new Date(now.getTime() - 60 * 60 * 1000).toISOString(), // 1 hour ago
        unreadCount: 0,
        status: 'resolved',
        priority: 'Low',
        prescriptionId: 'RX-250714-03',
        medication: 'Vitamin C 1000mg',
        isOnline: true,
        conversationType: 'general_inquiry',
        messages: [
          {
            id: 1,
            senderId: 'P003',
            sender: 'patient',
            text: 'Can I take this vitamin with my other medications?',
            timestamp: new Date(today.getTime() - 70 * 60 * 1000).toISOString(), // 70 minutes ago
            isRead: true
          },
          {
            id: 2,
            senderId: 'PHARM001',
            sender: 'pharmacist',
            text: 'Yes, Vitamin C is generally safe to take with most medications. However, I\'d recommend spacing it 2 hours apart from any iron supplements.',
            timestamp: new Date(today.getTime() - 65 * 60 * 1000).toISOString(), // 65 minutes ago
            isRead: true
          },
          {
            id: 3,
            senderId: 'P003',
            sender: 'patient',
            text: 'Thank you for your help!',
            timestamp: new Date(today.getTime() - 60 * 60 * 1000).toISOString(), // 60 minutes ago
            isRead: true
          }
        ]
      },
      {
        id: 4,
        patientId: 'P004',
        patientName: 'David Rodriguez',
        patientEmail: 'david.rodriguez@email.com',
        patientAvatar: '/src/assets/img/meds/pharma.jpg',
        lastMessage: 'Are there any side effects I should watch for?',
        lastMessageTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        unreadCount: 1,
        status: 'active',
        priority: 'High',
        prescriptionId: 'RX-250714-04',
        medication: 'Cough Syrup 200ml',
        isOnline: false,
        conversationType: 'side_effects_inquiry',
        messages: [
          {
            id: 1,
            senderId: 'P004',
            sender: 'patient',
            text: 'I just started taking the cough syrup. Are there any side effects I should watch for?',
            timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            isRead: false
          }
        ]
      },
      {
        id: 5,
        patientId: 'P005',
        patientName: 'Lisa Anderson',
        patientEmail: 'lisa.anderson@email.com',
        patientAvatar: '/src/assets/img/meds/pharma.jpg',
        lastMessage: 'Can I get a refill on this prescription?',
        lastMessageTime: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        unreadCount: 0,
        status: 'waiting',
        priority: 'Medium',
        prescriptionId: 'RX-250714-05',
        medication: 'Allergy Relief 10mg',
        isOnline: true,
        conversationType: 'refill_request',
        messages: [
          {
            id: 1,
            senderId: 'P005',
            sender: 'patient',
            text: 'Hi, I\'m running low on my allergy medication. Can I get a refill on this prescription?',
            timestamp: new Date(now.getTime() - 3.25 * 60 * 60 * 1000).toISOString(), // 3 hours 15 min ago
            isRead: true
          },
          {
            id: 2,
            senderId: 'PHARM001',
            sender: 'pharmacist',
            text: 'Let me check your prescription details. I\'ll need to verify with your doctor for the refill authorization.',
            timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
            timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
            isRead: true
          }
        ]
      }
    ]);
  };

  const sendMessage = async (conversationId, message) => {
    try {
      setSendingMessage(true);
      
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const newMessage = {
        id: Date.now(),
        senderId: 'PHARM001',
        sender: 'pharmacist',
        text: message,
        timestamp: new Date().toISOString(),
        isRead: true
      };

      setData(prev => ({
        ...prev,
        conversations: prev.conversations.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, newMessage],
                lastMessage: message,
                lastMessageTime: new Date().toISOString()
              }
            : conv
        ),
        currentConversation: prev.currentConversation?.id === conversationId 
          ? {
              ...prev.currentConversation,
              messages: [...prev.currentConversation.messages, newMessage],
              lastMessage: message,
              lastMessageTime: 'Just now'
            }
          : prev.currentConversation
      }));
      
      setSendingMessage(false);
      return true;
    } catch (error) {
      setSendingMessage(false);
      throw new Error('Failed to send message');
    }
  };

  const markAsRead = (conversationId) => {
    setData(prev => ({
      ...prev,
      conversations: prev.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    }));
  };

  const setSearchTerm = (term) => {
    setData(prev => ({ ...prev, searchTerm: term }));
  };

  const setFilterStatus = (status) => {
    setData(prev => ({ ...prev, filterStatus: status }));
  };

  const setSortBy = (field) => {
    setData(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const setCurrentConversation = (conversation) => {
    if (conversation && conversation.unreadCount > 0) {
      markAsRead(conversation.id);
    }
    setData(prev => ({ ...prev, currentConversation: conversation }));
  };

  // Filter and sort conversations
  const filteredConversations = data.conversations
    .filter(conv => {
      const matchesSearch = conv.patientName.toLowerCase().includes(data.searchTerm.toLowerCase()) ||
                           conv.medication.toLowerCase().includes(data.searchTerm.toLowerCase()) ||
                           conv.lastMessage.toLowerCase().includes(data.searchTerm.toLowerCase());
      const matchesStatus = data.filterStatus === 'all' || conv.status === data.filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const direction = data.sortOrder === 'asc' ? 1 : -1;
      if (data.sortBy === 'recent') {
        return direction * (new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
      } else if (data.sortBy === 'patient') {
        return direction * a.patientName.localeCompare(b.patientName);
      } else if (data.sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return direction * (priorityOrder[b.priority] - priorityOrder[a.priority]);
      } else if (data.sortBy === 'unread') {
        return direction * (b.unreadCount - a.unreadCount);
      }
      return 0;
    });

  return {
    ...data,
    filteredConversations,
    sendingMessage,
    sendMessage,
    markAsRead,
    setSearchTerm,
    setFilterStatus,
    setSortBy,
    setCurrentConversation,
    refetch: fetchChatData
  };
};
