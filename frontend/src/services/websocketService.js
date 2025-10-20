/**
 * WebSocket Service for real-time chat functionality
 * Handles WebSocket connections and message handling
 */
class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = {};
    this.isAuthenticated = false;
    this.userId = null;
    this.token = null;
  }

  /**
   * Connect to WebSocket server
   */
  connect(userId, token) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    this.userId = userId;
    this.token = token;

    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8080'}/ws/chat`;
    
    try {
      this.socket = new WebSocket(wsUrl);
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.emit('error', error);
    }
  }

  /**
   * Setup WebSocket event listeners
   */
  setupEventListeners() {
    if (!this.socket) return;

    this.socket.onopen = (event) => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Send authentication message
      this.authenticate();
      
      this.emit('connected', event);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.isAuthenticated = false;
      this.emit('disconnected', event);
      
      // Attempt to reconnect
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect();
      } else {
        console.error('Max reconnection attempts reached');
        this.emit('error', new Error('Failed to reconnect to chat service'));
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }

  /**
   * Authenticate with the server
   */
  authenticate() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.send({
      type: 'auth',
      token: this.token,
      userId: this.userId
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  handleMessage(data) {
    switch (data.type) {
      case 'auth_success':
        this.isAuthenticated = true;
        console.log('WebSocket authentication successful');
        this.emit('authenticated', data);
        break;

      case 'auth_error':
        console.error('WebSocket authentication failed:', data.message);
        this.emit('auth_error', data);
        break;

      case 'new_message':
        this.emit('new_message', data);
        break;

      case 'message_delivered':
        this.emit('message_delivered', data);
        break;

      case 'message_read':
        this.emit('message_read', data);
        break;

      case 'typing_start':
        this.emit('typing_start', data);
        break;

      case 'typing_stop':
        this.emit('typing_stop', data);
        break;

      case 'user_online':
        this.emit('user_online', data);
        break;

      case 'user_offline':
        this.emit('user_offline', data);
        break;

      case 'chat_updated':
        this.emit('chat_updated', data);
        break;

      case 'error':
        console.error('Server error:', data.message);
        this.emit('server_error', data);
        break;

      default:
        console.log('Unknown message type:', data.type);
        this.emit('unknown_message', data);
    }
  }

  /**
   * Send a message through WebSocket
   */
  send(data) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot send message');
      return false;
    }

    try {
      this.socket.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
      return false;
    }
  }

  /**
   * Send a chat message
   */
  sendMessage(chatId, content, messageType = 'text', metadata = {}) {
    return this.send({
      type: 'send_message',
      chatId,
      content,
      messageType,
      metadata,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send typing indicator
   */
  sendTypingIndicator(chatId, isTyping) {
    return this.send({
      type: isTyping ? 'typing_start' : 'typing_stop',
      chatId,
      userId: this.userId
    });
  }

  /**
   * Mark message as read
   */
  markMessageAsRead(chatId, messageId) {
    return this.send({
      type: 'mark_read',
      chatId,
      messageId
    });
  }

  /**
   * Join a chat room
   */
  joinChat(chatId) {
    return this.send({
      type: 'join_chat',
      chatId
    });
  }

  /**
   * Leave a chat room
   */
  leaveChat(chatId) {
    return this.send({
      type: 'leave_chat',
      chatId
    });
  }

  /**
   * Schedule reconnection attempt
   */
  scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (this.userId && this.token) {
        this.connect(this.userId, this.token);
      }
    }, delay);
  }

  /**
   * Add event listener
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (!this.listeners[event]) return;
    
    this.listeners[event] = this.listeners[event].filter(
      listener => listener !== callback
    );
  }

  /**
   * Emit event to all listeners
   */
  emit(event, data) {
    if (!this.listeners[event]) return;
    
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.close(1000, 'Client disconnecting');
      this.socket = null;
    }
    this.isAuthenticated = false;
    this.reconnectAttempts = 0;
    console.log('WebSocket disconnected');
  }

  /**
   * Get connection status
   */
  isConnected() {
    return this.socket && this.socket.readyState === WebSocket.OPEN && this.isAuthenticated;
  }

  /**
   * Get WebSocket ready state
   */
  getReadyState() {
    if (!this.socket) return WebSocket.CLOSED;
    return this.socket.readyState;
  }

  /**
   * Clear all event listeners
   */
  clearListeners() {
    this.listeners = {};
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;