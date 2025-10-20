import { Client } from '@stomp/stompjs';

/**
 * STOMP WebSocket Service for Real-time Chat
 * 
 * This service handles WebSocket connections to the Spring Boot backend
 * using STOMP protocol over SockJS for reliable real-time messaging.
 * 
 * Backend Architecture:
 * - Message destinations: /app/chat.room.{chatRoomId}
 * - Subscribe to: /topic/chat/room/{chatRoomId}
 * - Typing indicators: /app/chat.typing.{chatRoomId}, /topic/chat/room/{chatRoomId}/typing
 * - Presence: /app/chat.join.{chatRoomId}, /topic/chat/room/{chatRoomId}/presence
 */
class StompWebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.messageHandlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.userId = null;
    this.userType = null;
    this.token = null;
  }

  /**
   * Connect to WebSocket server with STOMP
   * @param {string} token - JWT authentication token
   * @param {number} userId - Current user ID
   * @param {string} userType - User type (CUSTOMER, PHARMACY_ADMIN, PHARMACIST, ADMIN)
   */
  connect(token, userId, userType) {
    if (this.client?.connected) {
      console.log('✅ STOMP client already connected');
      return Promise.resolve();
    }

    this.userId = userId;
    this.userType = userType;
    this.token = token;

    return new Promise((resolve, reject) => {
      try {
        // Use native WebSocket instead of SockJS for direct connection
        // Backend supports both native WebSocket and SockJS
        const wsUrl = `ws://localhost:8080/ws/chat?userId=${userId}&role=${userType.toLowerCase()}`;
        
        // Create STOMP client with native WebSocket
        this.client = new Client({
          brokerURL: wsUrl,
          
          connectHeaders: {
            Authorization: `Bearer ${token}`,
            'X-WS-UserId': String(userId),
            'X-WS-Role': userType.toLowerCase()
          },

          debug: (str) => {
            // Only log important STOMP events, not all frames
            if (str.includes('Opening') || str.includes('Connected') || str.includes('ERROR') || str.includes('closing')) {
              console.log('🔌 STOMP:', str);
            }
          },

          reconnectDelay: 5000,
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,

          onConnect: (frame) => {
            console.log('✅ STOMP Connected:', frame);
            this.connected = true;
            this.reconnectAttempts = 0;
            resolve();
          },

          onStompError: (frame) => {
            console.error('❌ STOMP Error:', frame.headers['message'], frame.body);
            this.connected = false;
            reject(new Error(frame.headers['message'] || 'STOMP connection error'));
          },

          onWebSocketClose: () => {
            console.log('🔌 WebSocket closed');
            this.connected = false;
            this.handleReconnect();
          },

          onWebSocketError: (error) => {
            console.error('❌ WebSocket Error:', error);
            reject(error);
          }
        });

        // Activate the connection
        this.client.activate();

      } catch (error) {
        console.error('❌ Failed to create STOMP client:', error);
        reject(error);
      }
    });
  }

  /**
   * Handle reconnection with exponential backoff
   */
  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);
    
    console.log(`🔄 Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.token && this.userId && this.userType) {
        this.connect(this.token, this.userId, this.userType);
      }
    }, delay);
  }

  /**
   * Subscribe to a chat room for real-time messages
   * @param {number} chatRoomId - Chat room ID
   * @param {Function} onMessage - Callback for new messages
   * @param {Function} onTyping - Callback for typing indicators
   * @param {Function} onPresence - Callback for user presence updates
   */
  subscribeToRoom(chatRoomId, onMessage, onTyping = null, onPresence = null) {
    if (!this.client?.connected) {
      console.warn('⚠️ Cannot subscribe: STOMP not connected');
      return null;
    }

    const roomKey = `room_${chatRoomId}`;
    
    // Unsubscribe if already subscribed
    if (this.subscriptions.has(roomKey)) {
      this.unsubscribeFromRoom(chatRoomId);
    }

    try {
      // Subscribe to messages
      const messageSub = this.client.subscribe(
        `/topic/chat/room/${chatRoomId}`,
        (message) => {
          try {
            const payload = JSON.parse(message.body);
            console.log('📨 Received message in room', chatRoomId, ':', payload);
            if (onMessage) onMessage(payload);
          } catch (e) {
            console.error('❌ Failed to parse message:', e);
          }
        }
      );

      // Subscribe to typing indicators
      let typingSub = null;
      if (onTyping) {
        typingSub = this.client.subscribe(
          `/topic/chat/room/${chatRoomId}/typing`,
          (message) => {
            try {
              const payload = JSON.parse(message.body);
              console.log('⌨️ Typing indicator:', payload);
              onTyping(payload);
            } catch (e) {
              console.error('❌ Failed to parse typing indicator:', e);
            }
          }
        );
      }

      // Subscribe to presence updates
      let presenceSub = null;
      if (onPresence) {
        presenceSub = this.client.subscribe(
          `/topic/chat/room/${chatRoomId}/presence`,
          (message) => {
            try {
              const payload = JSON.parse(message.body);
              console.log('👤 Presence update:', payload);
              onPresence(payload);
            } catch (e) {
              console.error('❌ Failed to parse presence update:', e);
            }
          }
        );
      }

      // Store subscriptions
      this.subscriptions.set(roomKey, { messageSub, typingSub, presenceSub });

      // Send join notification
      this.joinRoom(chatRoomId);

      console.log(`✅ Subscribed to room ${chatRoomId}`);
      return roomKey;

    } catch (error) {
      console.error('❌ Failed to subscribe to room:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from a chat room
   * @param {number} chatRoomId - Chat room ID
   */
  unsubscribeFromRoom(chatRoomId) {
    const roomKey = `room_${chatRoomId}`;
    const subs = this.subscriptions.get(roomKey);
    
    if (subs) {
      try {
        subs.messageSub?.unsubscribe();
        subs.typingSub?.unsubscribe();
        subs.presenceSub?.unsubscribe();
        this.subscriptions.delete(roomKey);
        
        // Send leave notification
        this.leaveRoom(chatRoomId);
        
        console.log(`✅ Unsubscribed from room ${chatRoomId}`);
      } catch (error) {
        console.error('❌ Failed to unsubscribe:', error);
      }
    }
  }

  /**
   * Send a message to a chat room
   * @param {number} chatRoomId - Chat room ID
   * @param {string} text - Message text
   * @param {number} senderId - Sender user ID
   * @param {string} senderType - Sender type (CUSTOMER, ADMIN, etc.)
   */
  sendMessage(chatRoomId, text, senderId, senderType) {
    if (!this.client?.connected) {
      console.error('❌ Cannot send message: STOMP not connected');
      return Promise.reject(new Error('Not connected'));
    }

    try {
      const payload = {
        chatRoomId,
        text,
        senderId,
        senderType
      };

      this.client.publish({
        destination: `/app/chat.room.${chatRoomId}`,
        body: JSON.stringify(payload)
      });

      console.log('📤 Sent message to room', chatRoomId);
      return Promise.resolve();

    } catch (error) {
      console.error('❌ Failed to send message:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Send typing indicator
   * @param {number} chatRoomId - Chat room ID
   * @param {boolean} isTyping - Whether user is typing
   * @param {string} userName - User's display name
   */
  sendTypingIndicator(chatRoomId, isTyping, userName) {
    if (!this.client?.connected) return;

    try {
      const payload = {
        chatRoomId,
        isTyping,
        userId: this.userId,
        userName
      };

      this.client.publish({
        destination: `/app/chat.typing.${chatRoomId}`,
        body: JSON.stringify(payload)
      });

      console.log('⌨️ Sent typing indicator:', isTyping);

    } catch (error) {
      console.error('❌ Failed to send typing indicator:', error);
    }
  }

  /**
   * Join a chat room (send join notification)
   * @param {number} chatRoomId - Chat room ID
   */
  joinRoom(chatRoomId) {
    if (!this.client?.connected) return;

    try {
      this.client.publish({
        destination: `/app/chat.join.${chatRoomId}`,
        body: JSON.stringify({ chatRoomId })
      });

      console.log('📡 Joined room:', chatRoomId);

    } catch (error) {
      console.error('❌ Failed to join room:', error);
    }
  }

  /**
   * Leave a chat room (send leave notification)
   * @param {number} chatRoomId - Chat room ID
   */
  leaveRoom(chatRoomId) {
    if (!this.client?.connected) return;

    try {
      this.client.publish({
        destination: `/app/chat.leave.${chatRoomId}`,
        body: JSON.stringify({ chatRoomId })
      });

      console.log('📡 Left room:', chatRoomId);

    } catch (error) {
      console.error('❌ Failed to leave room:', error);
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.client) {
      // Unsubscribe from all rooms
      this.subscriptions.forEach((_, roomKey) => {
        const chatRoomId = roomKey.replace('room_', '');
        this.unsubscribeFromRoom(parseInt(chatRoomId));
      });

      // Deactivate client
      this.client.deactivate();
      this.connected = false;
      this.client = null;
      
      console.log('🔌 STOMP client disconnected');
    }
  }

  /**
   * Check if connected
   * @returns {boolean}
   */
  isConnected() {
    return this.connected && this.client?.connected;
  }
}

// Export singleton instance
const stompWebSocketService = new StompWebSocketService();
export default stompWebSocketService;
