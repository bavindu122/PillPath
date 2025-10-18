import React from 'react';
import ChatWindow from '../../../components/chat/ChatWindow';

const StyledChatWindow = ({ onBack, className = '', ...props }) => {
  return (
    <div className={`h-full ${className}`}>
      <ChatWindow 
        {...props}
        onBack={onBack}
        className="h-full [&_.message-bubble.sent]:bg-blue-600 [&_.message-bubble.received]:bg-white/15 [&_.message-bubble.received]:text-white [&_.message-input]:bg-white/10 [&_.message-input]:border-white/20 [&_.message-input]:text-white [&_.message-input::placeholder]:text-white/50"
      />
    </div>
  );
};

export default StyledChatWindow;