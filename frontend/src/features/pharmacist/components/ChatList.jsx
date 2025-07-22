import React from 'react';
import ChatConversationCard from './ChatConversationCard';
import { ScrollContainer } from '../../../components/UIs';

const ChatList = ({ conversations, currentConversation, onSelectConversation }) => {
  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.95 8.95 0 01-2.697-.413l-4.344 1.448c-.644.215-1.325-.42-1.109-1.073l1.15-3.451A7.972 7.972 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--pharma-text-primary)' }}>
          No conversations found
        </h3>
        <p style={{ color: 'var(--pharma-text-secondary)' }}>
          No conversations match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b" style={{ borderColor: 'var(--pharma-border)' }}>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--pharma-text-primary)' }}>
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
