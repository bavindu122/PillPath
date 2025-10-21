// Quick test file to verify imports work correctly
import React from 'react';
import { ChatProvider, useChat } from './contexts/ChatContextLive';
import ChatList from './components/chat/ChatList';
import ChatWindow from './components/chat/ChatWindow';
import MessageBubble from './components/chat/MessageBubble';
import MessageInput from './components/chat/MessageInput';
import PharmacySearchModal from './components/chat/PharmacySearchModal';

// Test component to verify all imports work
const ImportTest = () => {
  return (
    <ChatProvider>
      <div>
        <h1>Import Test - All components imported successfully!</h1>
        <p>✅ ChatProvider imported</p>
        <p>✅ ChatList imported</p>
        <p>✅ ChatWindow imported</p>
        <p>✅ MessageBubble imported</p>
        <p>✅ MessageInput imported</p>
        <p>✅ PharmacySearchModal imported</p>
      </div>
    </ChatProvider>
  );
};

export default ImportTest;