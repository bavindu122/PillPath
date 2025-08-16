import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Phone, Video, MoreVertical, MapPin, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerChatWindow = ({ selectedChat, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Mock messages for the selected chat
  useEffect(() => {
    if (selectedChat) {
      // Mock conversation data - replace with actual API call
      const mockMessages = [
        {
          id: 1,
          sender: 'pharmacy',
          message: 'Hello! We have received your prescription request.',
          timestamp: '2024-01-15T09:00:00Z',
          senderName: selectedChat.pharmacyName,
        },
        {
          id: 2,
          sender: 'customer',
          message: 'Great! When will it be ready for pickup?',
          timestamp: '2024-01-15T09:05:00Z',
          senderName: 'You',
        },
        {
          id: 3,
          sender: 'pharmacy',
          message: 'Your prescription will be ready in about 30 minutes. We will notify you when it\'s ready.',
          timestamp: '2024-01-15T09:10:00Z',
          senderName: selectedChat.pharmacyName,
        },
        {
          id: 4,
          sender: 'customer',
          message: 'Perfect! Do I need to bring anything specific?',
          timestamp: '2024-01-15T09:15:00Z',
          senderName: 'You',
        },
        {
          id: 5,
          sender: 'pharmacy',
          message: 'Please bring a valid ID and your insurance card. Your prescription is ready for pickup!',
          timestamp: '2024-01-15T10:30:00Z',
          senderName: selectedChat.pharmacyName,
        },
      ];
      setMessages(mockMessages);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'customer',
        message: message.trim(),
        timestamp: new Date().toISOString(),
        senderName: 'You',
      };
      setMessages([...messages, newMessage]);
      setMessage('');

      // Simulate pharmacy response after a delay
      setTimeout(() => {
        const response = {
          id: Date.now() + Math.floor(Math.random() * 1000), // Generate a unique ID
          sender: 'pharmacy',
          message: 'Thank you for your message. We will get back to you shortly.',
          timestamp: new Date().toISOString(),
          senderName: selectedChat.pharmacyName,
        };
        setMessages(prev => [...prev, response]);
      }, 2000);

      // Cleanup timeout if selectedChat changes or component unmounts
      return () => clearTimeout(timeoutId);
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!selectedChat) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/40 mb-4">
            <User className="mx-auto h-16 w-16" />
          </div>
          <h3 className="text-xl font-medium mb-2 text-white">
            Select a conversation
          </h3>
          <p className="text-white/60">
            Choose a pharmacy chat from the list to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {selectedChat.pharmacyName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-white font-semibold">
                {selectedChat.pharmacyName}
              </h3>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin className="h-3 w-3" />
                {selectedChat.pharmacyLocation}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <Phone size={18} />
            </button>
            <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <Video size={18} />
            </button>
            <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
        
        {/* Prescription Info */}
        <div className="mt-3 p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Clock className="h-4 w-4" />
            <span>Prescription: {selectedChat.prescriptionId}</span>
            <span className="ml-auto px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
              {selectedChat.status}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${msg.sender === 'customer' ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  msg.sender === 'customer'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white border border-white/20'
                }`}>
                  <p className="text-sm">{msg.message}</p>
                </div>
                <div className={`flex items-center gap-2 mt-1 text-xs text-white/60 ${
                  msg.sender === 'customer' ? 'justify-end' : 'justify-start'
                }`}>
                  <span>{msg.senderName}</span>
                  <span>•</span>
                  <span>{formatMessageTime(msg.timestamp)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/20">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Paperclip size={18} />
          </button>
          <div className="flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerChatWindow;
