import React from "react";
import ChatList from "../../../components/chat/ChatList";

const StyledChatList = ({ chats, className = "", ...props }) => {
  return (
    <div className={`h-full flex flex-col min-h-0 ${className}`}>
      <div className="h-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm flex flex-col">
        <ChatList {...props} chats={chats} className="h-full flex flex-col" />
      </div>
    </div>
  );
};

export default StyledChatList;
