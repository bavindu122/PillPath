import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  User,
  Users,
  Circle,
  MessageCircle,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../contexts/ChatContextLive";
import MessageBubble, { DateSeparator, TypingIndicator } from "./MessageBubble";
import MessageInput from "./MessageInput";

const ChatWindow = ({ onBack, className = "" }) => {
  const { user } = useAuth();

  const {
    activeChat,
    messages,
    fetchMessages,
    typingUsers,
    onlineUsers,
    loading,
  } = useChat();

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(0);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [hasNewSinceAway, setHasNewSinceAway] = useState(false);

  const messagesContainerRef = useRef(null);
  const prevScrollHeight = useRef(0);

  // Get current chat messages
  const chatMessages = activeChat ? messages[activeChat.id] || [] : [];

  // Get other participant information
  const otherParticipant = activeChat
    ? user?.role === "customer"
      ? activeChat.pharmacy || activeChat.pharmacist
      : activeChat.customer
    : null;
  const displayName =
    otherParticipant?.name ||
    otherParticipant?.pharmacyName ||
    otherParticipant?.displayName ||
    otherParticipant?.title ||
    activeChat?.pharmacyName ||
    "Unknown User";

  // Check if other participant is online
  const isOtherParticipantOnline = otherParticipant
    ? onlineUsers.has(otherParticipant.id)
    : false;

  // Check if other participant is typing
  const isOtherParticipantTyping =
    activeChat &&
    typingUsers[activeChat.id] &&
    Object.keys(typingUsers[activeChat.id]).some(
      (uid) =>
        String(uid) !== String(user?.id) && typingUsers[activeChat.id][uid]
    );

  // Scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  }, []);

  // Load initial messages when chat changes
  useEffect(() => {
    if (!activeChat) return;

    // Reset pagination and state on chat switch
    setPage(0);
    setHasMoreMessages(true);
    setLoadingMessages(false);
    setShowScrollToBottom(false);
    setHasNewSinceAway(false);

    // Fetch first page if not present and scroll to bottom
    if (!messages[activeChat.id]) {
      fetchMessages(activeChat.id, 0).finally(() => {
        // After initial fetch, scroll bottom on next paint
        setTimeout(() => scrollToBottom(false), 50);
      });
    } else {
      // Ensure we're at bottom when switching between existing chats
      setTimeout(() => scrollToBottom(false), 50);
    }
  }, [activeChat, messages, fetchMessages, scrollToBottom]);

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    if (chatMessages.length > 0) {
      const container = messagesContainerRef.current;
      if (container) {
        const isNearBottom =
          container.scrollHeight -
            container.clientHeight -
            container.scrollTop <=
          100;
        if (isNearBottom) {
          scrollToBottom();
          setHasNewSinceAway(false);
          setShowScrollToBottom(false);
        } else {
          // New messages arrived while user is scrolled up
          setHasNewSinceAway(true);
          setShowScrollToBottom(true);
        }
      }
    }
  }, [chatMessages, scrollToBottom]);

  // Load more messages when scrolling to top
  const handleScroll = useCallback(async () => {
    const container = messagesContainerRef.current;
    if (!container || loadingMessages || !hasMoreMessages || !activeChat)
      return;
    // Track scroll-to-bottom button visibility
    const isNearBottom =
      container.scrollHeight - container.clientHeight - container.scrollTop <=
      100;
    setShowScrollToBottom(!isNearBottom);
    if (isNearBottom) {
      setHasNewSinceAway(false);
    }

    // Newest at bottom, so older at top; load when reaching top
    const atTop = container.scrollTop <= 0;
    if (atTop) {
      setLoadingMessages(true);
      prevScrollHeight.current = container.scrollHeight;

      try {
        const newMessages = await fetchMessages(activeChat.id, page + 1);
        if (newMessages.length === 0) {
          setHasMoreMessages(false);
        } else {
          setPage((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error loading more messages:", error);
      } finally {
        setLoadingMessages(false);
        // Maintain viewport position after prepending
        const newScrollHeight = container.scrollHeight;
        const delta = newScrollHeight - prevScrollHeight.current;
        container.scrollTop = delta;
      }
    }
  }, [loadingMessages, hasMoreMessages, activeChat, page, fetchMessages]);

  // Group messages by date and sender (newest at bottom)
  const groupedMessages = React.useMemo(() => {
    if (!chatMessages.length) return [];

    // Sort messages by timestamp in ascending order (oldest first, newest last)
    const sorted = [...chatMessages].sort((a, b) => {
      const timeA = new Date(a.timestamp || a.time || 0).getTime();
      const timeB = new Date(b.timestamp || b.time || 0).getTime();
      return timeA - timeB; // ascending order
    });

    const groups = [];
    let currentDate = null;
    let currentSender = null;
    let currentGroup = [];

    sorted.forEach((message, index) => {
      const ts = message.timestamp || message.time || new Date().toISOString();
      const dateObj = new Date(ts);
      const messageDate = isNaN(dateObj.getTime())
        ? new Date().toDateString()
        : dateObj.toDateString();

      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ type: "messages", messages: currentGroup });
          currentGroup = [];
        }
        groups.push({ type: "date", date: messageDate });
        currentDate = messageDate;
        currentSender = null;
      }

      // Determine grouping relative to previous (ascending order)
      const prev = sorted[index - 1];
      const currentTime = new Date(
        message.timestamp || message.time || 0
      ).getTime();
      const prevTime = new Date(prev?.timestamp || prev?.time || 0).getTime();
      const withinFiveMin =
        currentTime && prevTime && currentTime - prevTime < 300000;
      const shouldGroup =
        currentSender === message.senderId && index > 0 && withinFiveMin;

      if (!shouldGroup && currentGroup.length > 0) {
        groups.push({ type: "messages", messages: currentGroup });
        currentGroup = [];
      }

      currentGroup.push({
        ...message,
        isGrouped: shouldGroup,
        showAvatar: !shouldGroup || currentGroup.length === 0,
      });
      currentSender = message.senderId;
    });

    if (currentGroup.length > 0) {
      groups.push({ type: "messages", messages: currentGroup });
    }

    return groups;
  }, [chatMessages]);

  if (!activeChat) {
    return (
      <div
        className={`flex items-center justify-center h-full bg-transparent ${className}`}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No chat selected
          </h3>
          <p className="text-gray-500">
            Choose a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`chat-window-container flex flex-col bg-transparent ${className}`}
      style={{ height: "100%", maxHeight: "100%" }}
    >
      {/* Chat Header */}
      <div className="px-4 py-4 border-white/30 flex items-center justify-between bg-white/60 backdrop-blur-md flex-shrink-0 shadow-sm ">
        <div className="flex items-center space-x-3">
          {/* Back Button (Mobile) */}
          <button
            onClick={onBack}
            className="lg:hidden p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div className="relative">
            {otherParticipant?.avatar || otherParticipant?.profileImage ? (
              <img
                src={otherParticipant.avatar || otherParticipant.profileImage}
                alt={displayName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                {user?.role === "customer" ? (
                  <Users className="w-6 h-6 text-white" />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
            )}

            {/* Online indicator */}
            {isOtherParticipantOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse shadow-sm"></div>
            )}
          </div>

          {/* Participant Info */}
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {displayName}
            </h3>
            <div className="flex items-center space-x-2">
              <Circle
                className={`w-2 h-2 ${
                  isOtherParticipantOnline
                    ? "text-green-500 fill-current"
                    : "text-gray-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isOtherParticipantTyping
                    ? "text-gray-900"
                    : isOtherParticipantOnline
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {isOtherParticipantTyping
                  ? "Typing..."
                  : isOtherParticipantOnline
                  ? "Online"
                  : "Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1">
          <button
            className="p-3 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-all duration-200 transform hover:scale-110"
            title="Voice call"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            className="p-3 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-all duration-200 transform hover:scale-110"
            title="Video call"
          >
            <Video className="w-5 h-5" />
          </button>
          <button
            className="p-3 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-all duration-200 transform hover:scale-110"
            title="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area - Scrollable content */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto p-6 space-y-2 bg-gradient-to-b from-white/20 to-transparent min-h-0 chat-messages-container backdrop-blur-sm"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Loading more messages indicator */}
        {loadingMessages && (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {/* No more messages indicator */}
        {!hasMoreMessages && chatMessages.length > 0 && (
          <div className="text-center py-2">
            <span className="text-xs text-gray-500">
              This is the beginning of your conversation
            </span>
          </div>
        )}

        {/* Messages */}
        {groupedMessages.length === 0 && !loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Ready to chat!
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Send your first message to start a conversation with{" "}
                {displayName}. They're here to help with your health and
                pharmacy needs.
              </p>
            </div>
          </div>
        ) : (
          groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.type === "date" ? (
                <DateSeparator date={group.date} />
              ) : (
                <div className="space-y-1">
                  {group.messages.map((message, messageIndex) => (
                    <MessageBubble
                      key={message.id || `${groupIndex}-${messageIndex}`}
                      message={message}
                      currentUser={user}
                      showAvatar={message.showAvatar}
                      isGrouped={message.isGrouped}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isOtherParticipantTyping && (
          <TypingIndicator
            senderName={otherParticipant?.name}
            avatar={otherParticipant?.avatar || otherParticipant?.profileImage}
          />
        )}

        {/* Scroll to bottom button */}
        {showScrollToBottom && (
          <button
            type="button"
            onClick={() => scrollToBottom()}
            className="absolute right-4 bottom-4 flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-md text-blue-700 hover:text-blue-900 hover:bg-white/90 transition-colors"
            title="Scroll to latest"
          >
            <ChevronDown className="w-5 h-5" />
            {hasNewSinceAway && (
              <span className="text-xs font-medium">New</span>
            )}
          </button>
        )}

        {/* Bottom anchor for scroll */}
        <div style={{ height: 1 }} />
      </div>

      {/* Message Input - Fixed at bottom */}
      <div
        className="flex-shrink-0 border-t border-white/30 bg-white/60 backdrop-blur-md"
        style={{ position: "sticky", bottom: 0, zIndex: 10 }}
      >
        <MessageInput
          chatId={activeChat?.id}
          disabled={loading || !activeChat}
          className="text-black placeholder:text-gray-500"
        />
      </div>
    </div>
  );
};

export default ChatWindow;
