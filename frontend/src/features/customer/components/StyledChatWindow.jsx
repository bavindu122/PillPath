import React from 'react';
import ChatWindow from '../../../components/chat/ChatWindow';

// Error Boundary Component
class ChatErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ChatWindow Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full min-h-0 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Chat Error</h3>
            <p className="text-gray-600 mb-4">Something went wrong with the chat window</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const StyledChatWindow = ({ onBack, className = '', ...props }) => {
  return (
    <ChatErrorBoundary>
      <div className={`h-full flex flex-col ${className}`}>
        <div className="chat-window-container h-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex flex-col">
          <ChatWindow 
            {...props}
            onBack={onBack}
            className="h-full flex flex-col [&_.message-bubble.sent]:bg-blue-600 [&_.message-bubble.received]:bg-white/15 [&_.message-bubble.received]:text-white"
          />
        </div>
      </div>
    </ChatErrorBoundary>
  );
};

export default StyledChatWindow;