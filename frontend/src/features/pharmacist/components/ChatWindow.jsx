import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Clock, AlertCircle, CheckCircle, Paperclip, Smile } from 'lucide-react';

const ChatWindow = ({ conversation, sendingMessage, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || sendingMessage || !conversation) return;

    await onSendMessage(conversation.id, message.trim());
    setMessage('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'waiting':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const formatMessageTime = (timeString) => {
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatMessageDate = (timeString) => {
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (!conversation) {
    return (
      <div className="bg-white rounded-lg shadow-sm h-full flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.95 8.95 0 01-2.697-.413l-4.344 1.448c-.644.215-1.325-.42-1.109-1.073l1.15-3.451A7.972 7.972 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--pharma-text-primary)' }}>
            Select a conversation
          </h3>
          <p style={{ color: 'var(--pharma-text-secondary)' }}>
            Choose a conversation from the list to start chatting with a patient.
          </p>
        </div>
      </div>
    );
  }

  const { patientName, patientAvatar, status, priority, prescriptionId, messages } = conversation;

  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col" style={{ height: '600px' }}>
      {/* Chat Header */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--pharma-border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            {patientAvatar ? (
              <img
                src={patientAvatar}
                alt={patientName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            )}
            
            {/* Patient Info */}
            <div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--pharma-text-primary)' }}>
                {patientName}
              </h3>
              <div className="flex items-center space-x-2">
                {prescriptionId && (
                  <span className="text-sm" style={{ color: 'var(--pharma-text-secondary)' }}>
                    Rx #{prescriptionId}
                  </span>
                )}
                <span className="text-sm" style={{ color: 'var(--pharma-text-secondary)' }}>•</span>
                <span className={`text-sm font-medium ${
                  priority === 'high' ? 'text-red-600' : 
                  priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {priority} priority
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            {getStatusIcon(status)}
            <span className="text-sm font-medium capitalize" style={{ color: 'var(--pharma-text-primary)' }}>
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-scroll-area" style={{ maxHeight: '500px', minHeight: '400px' }}>
        <div className="p-4 space-y-4">
          {messages.map((msg, index) => {
            const isPharmacist = msg.sender === 'pharmacist';
            const showDate = index === 0 || 
              formatMessageDate(msg.timestamp) !== formatMessageDate(messages[index - 1]?.timestamp);

            return (
              <div key={msg.id}>
                {/* Date Separator */}
                {showDate && (
                  <div className="text-center py-2">
                    <span className="text-xs px-3 py-1 rounded-full" 
                          style={{ 
                            backgroundColor: 'var(--pharma-gray-100)', 
                            color: 'var(--pharma-text-secondary)' 
                          }}>
                      {formatMessageDate(msg.timestamp)}
                    </span>
                  </div>
                )}

                {/* Message */}
                <div className={`flex ${isPharmacist ? 'justify-end' : 'justify-start'}`}>
                  <div className={`chat-message-bubble px-4 py-2 rounded-lg ${
                    isPharmacist 
                      ? 'bg-blue-500 text-white rounded-br-sm' 
                      : 'bg-white border rounded-bl-sm shadow-sm'
                  }`}
                  style={!isPharmacist ? { 
                    borderColor: 'var(--pharma-border)'
                  } : {}}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <div className={`mt-1 text-xs chat-message-time ${
                      isPharmacist ? 'text-blue-100' : ''
                    }`}
                    style={!isPharmacist ? { color: 'var(--pharma-text-secondary)' } : {}}
                    >
                      {formatMessageTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="chat-input-area p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={1}
              className="w-full px-4 py-3 border rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              style={{ 
                borderColor: 'var(--pharma-border)',
                backgroundColor: 'white',
                minHeight: '48px',
                maxHeight: '120px'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={sendingMessage || status === 'resolved'}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              disabled={sendingMessage || status === 'resolved'}
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              disabled={sendingMessage || status === 'resolved'}
            >
              <Smile className="h-5 w-5" />
            </button>
            <button
              type="submit"
              disabled={!message.trim() || sendingMessage || status === 'resolved'}
              className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {sendingMessage ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
        
        {status === 'resolved' && (
          <p className="text-xs mt-2 text-center" style={{ color: 'var(--pharma-text-secondary)' }}>
            This conversation has been resolved and is read-only.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
