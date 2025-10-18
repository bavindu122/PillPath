# Chat System Implementation

This document provides a comprehensive guide to the chat system implementation for PillPath, enabling real-time communication between customers and pharmacists.

## Features

### Customer Features
- **Pharmacy Search**: Search for pharmacies by name using a search bar
- **Start New Chat**: Select a pharmacy to start a new conversation
- **Chat History**: View all previous conversations with pharmacies
- **Real-time Messaging**: Send and receive messages instantly
- **File Sharing**: Upload and share images, documents, and prescriptions
- **Typing Indicators**: See when pharmacists are typing
- **Online Status**: See if pharmacists are online/offline

### Pharmacist Features
- **Patient Management**: View all conversations with customers
- **Message Filtering**: Filter chats by unread, active, or all conversations
- **Real-time Updates**: Receive instant notifications for new messages
- **File Downloads**: Download shared files and prescriptions
- **Typing Indicators**: See when customers are typing
- **Chat Statistics**: View conversation summaries and metrics

### Technical Features
- **WebSocket Integration**: Real-time bidirectional communication
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Message Status**: Delivery and read receipts
- **Auto-scroll**: Messages automatically scroll to bottom
- **Image Preview**: In-line image preview with click-to-expand
- **Message Grouping**: Messages from same sender are grouped together
- **Date Separators**: Clear date separators between conversation days
- **Error Handling**: Comprehensive error handling and retry mechanisms
- **Offline Support**: Graceful handling of network disconnections

## Architecture

### Component Structure
```
src/
├── contexts/
│   └── ChatContext.jsx          # Global chat state management
├── components/
│   └── chat/
│       ├── ChatList.jsx         # List of conversations
│       ├── ChatWindow.jsx       # Main chat interface
│       ├── MessageBubble.jsx    # Individual message display
│       ├── MessageInput.jsx     # Message composition
│       ├── PharmacySearchModal.jsx # Pharmacy search interface
│       └── index.js             # Component exports
├── features/
│   ├── customer/
│   │   └── pages/
│   │       └── CustomerChat.jsx # Customer chat page
│   └── pharmacist/
│       └── pages/
│           └── PharmacistChat.jsx # Pharmacist chat page
├── services/
│   ├── chatService.js           # API service for chat operations
│   └── websocketService.js      # WebSocket connection management
└── pages/
    └── Chat.jsx                 # Standalone chat page
```

### State Management

The chat system uses React Context API for global state management with the following structure:

```javascript
{
  chats: [],                    // Array of chat conversations
  activeChat: null,             // Currently selected chat
  messages: {},                 // Messages grouped by chat ID
  loading: false,               // Loading state
  error: null,                  // Error messages
  typingUsers: {},             // Typing indicators by chat
  onlineUsers: Set(),          // Set of online user IDs
  websocket: null,             // WebSocket connection
  connected: false             // Connection status
}
```

## API Integration

### REST API Endpoints

#### Chat Management
- `GET /api/chats` - Retrieve all chats for current user
- `GET /api/chats/:id` - Get specific chat details
- `POST /api/chats/start` - Start new chat with pharmacy
- `POST /api/chats/:id/mark-read` - Mark messages as read
- `DELETE /api/chats/:id` - Delete/archive chat

#### Messages
- `GET /api/chats/:id/messages` - Get chat messages (paginated)
- `POST /api/chats/:id/messages` - Send new message
- `DELETE /api/chats/:id/messages/:messageId` - Delete message
- `POST /api/chats/:id/messages/:messageId/report` - Report message

#### File Handling
- `POST /api/chats/upload` - Upload file for chat
- `GET /api/files/:fileId` - Download file

#### Pharmacy Search
- `GET /api/pharmacies/search?name=query` - Search pharmacies by name
- `GET /api/pharmacies/:id` - Get pharmacy details

### WebSocket Events

#### Client → Server
```javascript
// Authentication
{
  type: 'auth',
  token: 'jwt_token',
  userId: 'user_id'
}

// Send message
{
  type: 'send_message',
  chatId: 'chat_id',
  content: 'message_content',
  messageType: 'text|image|file',
  metadata: {}
}

// Typing indicators
{
  type: 'typing_start|typing_stop',
  chatId: 'chat_id',
  userId: 'user_id'
}

// Join/Leave chat
{
  type: 'join_chat|leave_chat',
  chatId: 'chat_id'
}
```

#### Server → Client
```javascript
// New message
{
  type: 'new_message',
  chatId: 'chat_id',
  message: {
    id: 'message_id',
    senderId: 'user_id',
    content: 'message_content',
    timestamp: 'iso_string',
    messageType: 'text|image|file'
  }
}

// Message status updates
{
  type: 'message_delivered|message_read',
  chatId: 'chat_id',
  messageId: 'message_id',
  userId: 'user_id'
}

// Typing indicators
{
  type: 'typing_start|typing_stop',
  chatId: 'chat_id',
  userId: 'user_id',
  userName: 'user_name'
}

// User status
{
  type: 'user_online|user_offline',
  userId: 'user_id',
  userName: 'user_name'
}
```

## Usage Examples

### Basic Integration

1. **Wrap your app with ChatProvider**:
```javascript
import { ChatProvider } from './contexts/ChatContext';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        {/* Your app components */}
      </ChatProvider>
    </AuthProvider>
  );
}
```

2. **Use chat hook in components**:
```javascript
import { useChat } from './contexts/ChatContext';

function ChatComponent() {
  const {
    chats,
    activeChat,
    sendMessage,
    startChat,
    connected
  } = useChat();

  // Your component logic
}
```

### Customer Implementation

```javascript
import CustomerChat from './features/customer/pages/CustomerChat';

// In your customer dashboard route
<Route path="/chat" element={<CustomerChat />} />
```

### Pharmacist Implementation

```javascript
import PharmacistChat from './features/pharmacist/pages/PharmacistChat';

// In your pharmacist dashboard route
<Route path="/chat" element={<PharmacistChat />} />
```

### Starting a New Chat

```javascript
const { startChat } = useChat();

const handleStartNewChat = async (pharmacyId) => {
  try {
    const chat = await startChat(pharmacyId);
    console.log('New chat started:', chat);
  } catch (error) {
    console.error('Failed to start chat:', error);
  }
};
```

### Sending Messages

```javascript
const { sendMessage } = useChat();

const handleSendMessage = async (chatId, content) => {
  try {
    await sendMessage(chatId, content, 'text');
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};
```

### File Upload

```javascript
const handleFileUpload = async (file, chatId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatId', chatId);

    const response = await fetch('/api/chats/upload', {
      method: 'POST',
      body: formData
    });
    
    const fileData = await response.json();
    await sendMessage(chatId, '', 'file', {
      fileUrl: fileData.url,
      fileName: file.name,
      fileSize: file.size
    });
  } catch (error) {
    console.error('File upload failed:', error);
  }
};
```

## Environment Configuration

Add these environment variables to your `.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080

# File Upload Configuration
VITE_MAX_FILE_SIZE=10485760  # 10MB in bytes
VITE_ALLOWED_FILE_TYPES=image/*,application/pdf,text/*

# Chat Configuration
VITE_MESSAGES_PER_PAGE=50
VITE_TYPING_TIMEOUT=1000
VITE_RECONNECT_ATTEMPTS=5
```

## Styling

The chat system uses Tailwind CSS for styling. Key design principles:

- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Accessibility**: ARIA labels and keyboard navigation support
- **Consistent Colors**: Blue for primary actions, gray for secondary elements
- **Message Bubbles**: Rounded corners with different colors for sent/received
- **Loading States**: Skeleton loaders and spinners for better UX
- **Dark Mode Ready**: Uses Tailwind's dark mode utilities

## Error Handling

The system includes comprehensive error handling:

- **Network Errors**: Automatic retry with exponential backoff
- **Authentication Errors**: Redirect to login when tokens expire
- **File Upload Errors**: Clear error messages with retry options
- **WebSocket Disconnections**: Automatic reconnection attempts
- **API Errors**: User-friendly error messages with action suggestions

## Performance Optimizations

- **Virtual Scrolling**: For large message histories
- **Message Pagination**: Load messages on demand
- **Image Lazy Loading**: Load images as they come into view
- **Debounced Search**: Prevent excessive API calls during pharmacy search
- **Connection Pooling**: Reuse WebSocket connections
- **Message Caching**: Store recent messages in localStorage

## Security Considerations

- **JWT Authentication**: Secure token-based authentication
- **Input Sanitization**: All user inputs are sanitized
- **File Type Validation**: Restrict file uploads to safe types
- **Rate Limiting**: Prevent message spam and abuse
- **Content Moderation**: Flag inappropriate content
- **HTTPS/WSS**: Secure connections in production

## Testing

Run the test suite with:

```bash
npm test
```

Key test areas:
- Component rendering and interactions
- WebSocket connection and message handling
- API service methods
- Context state management
- File upload functionality
- Error scenarios and edge cases

## Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
Ensure these are configured for production:
- WebSocket server URL (WSS for HTTPS sites)
- API base URL
- File upload limits
- CORS configuration
- Authentication settings

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check server is running
   - Verify WebSocket URL in environment
   - Check firewall/proxy settings

2. **Messages Not Sending**
   - Verify authentication token
   - Check network connectivity
   - Inspect browser console for errors

3. **File Upload Issues**
   - Check file size limits
   - Verify file type restrictions
   - Ensure server has write permissions

4. **Typing Indicators Not Working**
   - Confirm WebSocket connection
   - Check if user is in correct chat room
   - Verify event handling

### Debug Mode

Enable debug logging:
```javascript
localStorage.setItem('chat_debug', 'true');
```

This will log all WebSocket events and API calls to the console.

## Future Enhancements

Planned features for future releases:
- Voice messages
- Video calling
- Message reactions/emojis
- Message search functionality
- Chat backup/export
- Multi-language support
- Push notifications
- Message encryption
- Group chats
- Chat bots for common queries