import api from './api';

/**
 * Chat API Service
 * Handles all chat-related API calls
 */
export const chatService = {
  
  // Get all chats for the current user
  async getChats() {
    try {
      const response = await api.get('/chats');
      return response.data;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  },

  // Get messages for a specific chat
  async getMessages(chatId, page = 0, limit = 50) {
    try {
      const response = await api.get(`/chats/${chatId}/messages`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Send a message
  async sendMessage(chatId, messageData) {
    try {
      const response = await api.post(`/chats/${chatId}/messages`, messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Start a new chat with a pharmacy
  async startChat(pharmacyId) {
    try {
      const response = await api.post('/chats/start', { pharmacyId });
      return response.data;
    } catch (error) {
      console.error('Error starting chat:', error);
      throw error;
    }
  },

  // Mark messages as read
  async markAsRead(chatId) {
    try {
      const response = await api.post(`/chats/${chatId}/mark-read`);
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Get chat details
  async getChatDetails(chatId) {
    try {
      const response = await api.get(`/chats/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat details:', error);
      throw error;
    }
  },

  // Upload file for chat
  async uploadFile(file, chatId) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatId', chatId);

      const response = await api.post('/chats/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Delete a message
  async deleteMessage(chatId, messageId) {
    try {
      const response = await api.delete(`/chats/${chatId}/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  // Search pharmacies
  async searchPharmacies(query, filters = {}) {
    try {
      const params = { name: query, ...filters };
      const response = await api.get('/pharmacies/search', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching pharmacies:', error);
      throw error;
    }
  },

  // Get pharmacy details
  async getPharmacyDetails(pharmacyId) {
    try {
      const response = await api.get(`/pharmacies/${pharmacyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pharmacy details:', error);
      throw error;
    }
  },

  // Block/Unblock user
  async blockUser(userId) {
    try {
      const response = await api.post(`/users/${userId}/block`);
      return response.data;
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  },

  async unblockUser(userId) {
    try {
      const response = await api.post(`/users/${userId}/unblock`);
      return response.data;
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  },

  // Report a message or user
  async reportMessage(messageId, reason) {
    try {
      const response = await api.post(`/messages/${messageId}/report`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error reporting message:', error);
      throw error;
    }
  },

  // Get unread message count
  async getUnreadCount() {
    try {
      const response = await api.get('/chats/unread-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Archive/Unarchive chat
  async archiveChat(chatId) {
    try {
      const response = await api.post(`/chats/${chatId}/archive`);
      return response.data;
    } catch (error) {
      console.error('Error archiving chat:', error);
      throw error;
    }
  },

  async unarchiveChat(chatId) {
    try {
      const response = await api.post(`/chats/${chatId}/unarchive`);
      return response.data;
    } catch (error) {
      console.error('Error unarchiving chat:', error);
      throw error;
    }
  },

  // Get chat participants
  async getChatParticipants(chatId) {
    try {
      const response = await api.get(`/chats/${chatId}/participants`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat participants:', error);
      throw error;
    }
  },

  // Leave chat (for group chats)
  async leaveChat(chatId) {
    try {
      const response = await api.post(`/chats/${chatId}/leave`);
      return response.data;
    } catch (error) {
      console.error('Error leaving chat:', error);
      throw error;
    }
  }
};

export default chatService;