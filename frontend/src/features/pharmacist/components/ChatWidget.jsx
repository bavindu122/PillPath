import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Paperclip, Smile } from 'lucide-react';
import '../pages/index-pharmacist.css';

const ChatWidget = ({ messages, onSendMessage, patientName }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white rounded-xl shadow-lg border border-blue-100 h-[640px] flex flex-col">
      {/* Chat Header */}
      <div className="px-4 py-4 border-b border-blue-100 flex-shrink-0 bg-white/90 backdrop-blur-sm shadow-sm rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-md">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse shadow-sm"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{patientName}</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm font-medium text-green-600">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-gradient-to-b from-blue-50/30 to-transparent">
        {messages.map((message) => {
          const isPharmacist = message.sender === 'pharmacist';
          return (
            <div
              key={message.id}
              className={`flex ${isPharmacist ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isPharmacist ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                {/* Avatar for non-pharmacist messages */}
                {!isPharmacist && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-gray-600">P</span>
                  </div>
                )}

                {/* Message bubble */}
                <div className="flex flex-col">
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isPharmacist
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                  </div>
                  <div className={`flex items-center space-x-1 mt-1 ${isPharmacist ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 border-t border-blue-100 bg-white/80 backdrop-blur-sm rounded-b-xl" style={{ position: 'sticky', bottom: 0, zIndex: 10 }}>
        <div className="p-4">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-end space-x-3 bg-white rounded-2xl p-2 shadow-sm border border-blue-100">
            {/* Attachment Button */}
            <button
              type="button"
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-all duration-200 transform hover:scale-110"
              title="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            {/* Message Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 border-0 bg-transparent focus:outline-none text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Emoji Button */}
            <button
              type="button"
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-all duration-200 transform hover:scale-110"
              title="Add emoji"
            >
              <Smile className="h-5 w-5" />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110 shadow-md disabled:shadow-none"
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;