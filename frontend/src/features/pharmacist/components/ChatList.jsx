import React from 'react';
import ChatConversationCard from './ChatConversationCard';
import { ScrollContainer } from '../../../components/UIs';
import { Users } from 'lucide-react';

const ChatList = ({ conversations, currentConversation, onSelectConversation }) => {
  if (conversations.length === 0) {
    return (
      <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-sm border border-blue-100 p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No conversations found
        </h3>
        <p className="text-gray-500">
          No conversations match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-sm border border-blue-100">
      <div className="px-4 py-4 border-b border-blue-100 bg-white/90 backdrop-blur-sm rounded-t-lg">
        <h3 className="text-lg font-semibold text-gray-900">
          Conversations ({conversations.length})
        </h3>
      </div>
      <ScrollContainer 
        maxHeight="384px" 
        scrollbarTheme="default"
        scrollbarWidth="6px"
        className="space-y-0"
      >
        {conversations.map((conversation) => (
            <ChatConversationCard
              key={conversation.id}
              conversation={conversation}
              isSelected={currentConversation?.id === conversation.id}
              onSelect={() => onSelectConversation(conversation)}
            />
          ))}
        </ScrollContainer>
    </div>
  );
};

export default ChatList;
