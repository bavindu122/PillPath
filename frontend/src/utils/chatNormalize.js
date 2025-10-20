// Utility functions to normalize chat and message shapes across varying backend payloads

// Normalize a single message to a consistent shape
export function normalizeMessage(raw = {}) {
  const timestamp = raw.timestamp || raw.time || raw.createdAt || raw.updatedAt;
  
  // Extract senderId - prioritize senderId field over sender
  const senderId = raw.senderId !== undefined && raw.senderId !== null 
    ? raw.senderId 
    : (raw.sender !== undefined && raw.sender !== null 
      ? raw.sender 
      : (raw.fromUserId ?? raw.authorId));
  
  const normalized = {
    id: raw.id || raw.messageId || `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    chatId: raw.chatId || raw.chatRoomId || raw.threadId || raw.conversationId,
    content: raw.content ?? raw.text ?? raw.message ?? '',
    text: raw.text ?? raw.content ?? raw.message ?? '', // Add text as alias for backward compatibility
    messageType: raw.messageType || raw.type || 'text',
    senderId: senderId,
    senderName: raw.senderName || raw.senderDisplayName || raw.authorName,
    senderType: raw.senderType,
    timestamp: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString(),
    status: raw.status || 'delivered',
    metadata: raw.metadata || {},
  };
  
  return normalized;
}

// Normalize a chat/thread item
export function normalizeChat(raw = {}) {
  const last = raw.lastMessage || raw.last || raw.latestMessage || raw.preview;
  const lastMessage = last ? normalizeMessage(last) : null;

  const updatedAt = raw.updatedAt || raw.lastMessageTime || lastMessage?.timestamp || raw.createdAt;

  return {
    id: raw.id || raw.chatId || raw.threadId || raw.conversationId,
    pharmacyId: raw.pharmacyId,
    customerId: raw.customerId,
    pharmacy: raw.pharmacy || raw.pharmacist || null,
    pharmacist: raw.pharmacist || null,
    customer: raw.customer || null,
    customerName: raw.customerName || raw.customer?.name || raw.customer?.fullName,
    customerProfilePicture: raw.customerProfilePicture || raw.customer?.profilePictureUrl || raw.customer?.avatar,
    pharmacyName: raw.pharmacyName || raw.pharmacy?.name || raw.pharmacist?.name,
    pharmacyLogoUrl: raw.pharmacyLogoUrl || raw.pharmacy?.logoUrl || raw.pharmacy?.logo,
    lastMessage,
    lastMessageTime: lastMessage?.timestamp || (raw.lastMessageTime ? new Date(raw.lastMessageTime).toISOString() : undefined),
    unreadCount: raw.unreadCount || 0,
    archived: raw.archived || false,
    updatedAt: updatedAt ? new Date(updatedAt).toISOString() : undefined,
    // keep raw for debugging if needed
    __raw: raw,
  };
}

// Normalize an array of chats and optionally sort by last activity desc
export function normalizeChatsList(list = [], { sort = true } = {}) {
  const normalized = (Array.isArray(list) ? list : []).map(normalizeChat);
  if (!sort) return normalized;
  return normalized.sort((a, b) => {
    const at = new Date(a.lastMessageTime || a.updatedAt || 0).getTime();
    const bt = new Date(b.lastMessageTime || b.updatedAt || 0).getTime();
    return bt - at; // newest first
  });
}
