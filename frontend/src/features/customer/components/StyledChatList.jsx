import React from 'react';
import ChatList from '../../../components/chat/ChatList';

const StyledChatList = ({ chats, className = '', ...props }) => {
  return (
    <div className={`h-full ${className}`}>
      <ChatList 
        {...props}
        className="h-full [&_.chat-item]:bg-white/5 [&_.chat-item]:border-white/10 [&_.chat-item]:text-white [&_.chat-item:hover]:bg-white/15 [&_.chat-item.active]:bg-blue-500/30 [&_.chat-item.active]:border-blue-400/50"
      />
    </div>
  );
};

export default StyledChatList;