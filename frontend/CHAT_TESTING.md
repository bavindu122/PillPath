# Chat System - Quick Test Guide

## 🚀 Testing the Chat System

The chat system is now set up with **mock data** so you can test it immediately without a backend.

### Access the Chat Demo

1. **Start your development server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Visit the chat demo page:**
   ```
   http://localhost:5173/chat-demo
   ```

### What You'll See

#### ✅ **Mock Data Included:**
- 2 sample chat conversations
- 3 pharmacies for search testing
- Sample messages with timestamps
- Online/offline indicators
- Typing indicators simulation

#### ✅ **Features to Test:**

1. **Chat List (Left Panel):**
   - View existing conversations
   - See unread message counts
   - Click chats to open them

2. **Chat Window (Right Panel):**
   - View conversation history
   - Send new messages
   - See message status (sending → delivered)
   - Auto-scroll to latest messages

3. **Pharmacy Search:**
   - Click "Search Pharmacies" button
   - Search for: "City", "Health", or "Med"
   - Start new conversations

4. **Message Features:**
   - Type messages and press Enter
   - See typing indicators
   - View timestamps
   - Message grouping by sender

### 🔧 **Switching Between Mock and Live Data**

**Currently using Mock Data (ChatContextMock.jsx):**
- No backend required
- Instant testing
- Sample conversations included

**To use Live Data later:**
In `src/App.jsx`, change:
```javascript
// Mock version (current)
import { ChatProvider } from "./contexts/ChatContextMock";

// Live version (when backend is ready)
import { ChatProvider } from "./contexts/ChatContext";
```

### 🎯 **Integration with Your App**

#### For Customer Dashboard:
```javascript
import CustomerChat from './features/customer/pages/CustomerChat';
// Add route: /customer/chat
```

#### For Pharmacist Dashboard:
```javascript
import PharmacistChat from './features/pharmacist/pages/PharmacistChat';
// Add route: /pharmacist/chat
```

### 📱 **Responsive Design**

The chat system works on:
- ✅ Desktop (side-by-side layout)
- ✅ Tablet (responsive layout)
- ✅ Mobile (full-screen chat switching)

### 🔄 **Backend Integration (Later)**

When your backend is ready, you'll need:

1. **API Endpoints:**
   ```
   GET  /api/chats                     # Get user's chats
   GET  /api/chats/:id/messages        # Get chat messages
   POST /api/chats/start               # Start new chat
   POST /api/chats/:id/messages        # Send message
   GET  /api/pharmacies/search         # Search pharmacies
   ```

2. **WebSocket Server:**
   ```
   ws://localhost:8080/ws/chat         # Real-time messaging
   ```

3. **Switch to Live ChatContext:**
   ```javascript
   import { ChatProvider } from "./contexts/ChatContext";
   ```

### 🐛 **Troubleshooting**

If you see "No chats" or empty data:
1. Make sure you're using `ChatContextMock`
2. Check browser console for errors
3. Ensure all imports are correct
4. Try refreshing the page

### 🎨 **Customization**

The chat system uses Tailwind CSS and is fully customizable:
- Colors in component files
- Layout in main chat components
- Mock data in `ChatContextMock.jsx`

---

**Ready to test!** Visit `http://localhost:5173/chat-demo` to see the chat system in action! 🚀