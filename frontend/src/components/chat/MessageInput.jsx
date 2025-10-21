import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../../contexts/ChatContextLive';

const MessageInput = ({ chatId, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false);
  
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const { sendMessage, sendTypingIndicator } = useChat();

  // Handle input change
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    if (!chatId) return;
    
    if (!typing) {
      setTyping(true);
      sendTypingIndicator(chatId, true);
    }
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      sendTypingIndicator(chatId, false);
    }, 1000);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    if (disabled || !chatId) return;

    try {
      // Stop typing indicator
      if (typing) {
        setTyping(false);
        sendTypingIndicator(chatId, false);
      }

      // Send text message
      await sendMessage(chatId, message.trim());

      // Clear form
      setMessage('');
      
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="message-input customer-message-input bg-white/90 backdrop-blur-sm p-4">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-3 bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-blue-100">
        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="w-full px-4 py-3 border-0 bg-transparent focus:outline-none resize-none h-10 text-gray-900 placeholder-gray-400 font-medium"
            style={{ color: '#111827' }}
            disabled={disabled}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110 shadow-md disabled:shadow-none"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;