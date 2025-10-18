import React from 'react';
import ChatList from '../../../components/chat/ChatList';

const StyledChatList = ({ chats, className = '', ...props }) => {
  return (
    <div className={`h-full flex flex-col min-h-0 ${className}`}>
      <div className="chat-list-container bg-transparent h-full rounded-lg flex flex-col">
        <ChatList 
          {...props}
          chats={chats}
          className="h-full flex flex-col [&_.chat-item]:bg-white/5 [&_.chat-item]:border-white/10 [&_.chat-item]:text-white [&_.chat-item:hover]:bg-white/15 [&_.chat-item.active]:bg-blue-500/30 [&_.chat-item.active]:border-blue-400/50 [&_.chat-search-input]:bg-white/10 [&_.chat-search-input]:text-white [&_.chat-search-input]:border-white/20 [&_.chat-search-input::placeholder]:text-white/60"
        />
      </div>
    </div>
  );
};

export default StyledChatList;