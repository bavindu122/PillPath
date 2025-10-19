import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Send, Paperclip, Image, Smile, Mic, X, File } from 'lucide-react';
import { useChat } from '../../contexts/ChatContextLive';

const MessageInput = ({ chatId, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typing, setTyping] = useState(false);
  
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  
  const { sendMessage, sendTypingIndicator } = useChat();

  // Handle input change
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    if (!chatId) return;
    
    if (!typing) {
      setTyping(true);
      sendTypingIndicator(chatId, true);
    }
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      sendTypingIndicator(chatId, false);
    }, 1000);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() && attachments.length === 0) return;
    if (disabled || !chatId) return;

    try {
      // Stop typing indicator
      if (typing) {
        setTyping(false);
        sendTypingIndicator(chatId, false);
      }

      // Send text message
      if (message.trim()) {
        await sendMessage(chatId, message.trim());
      }

      // Send attachments
      for (const attachment of attachments) {
        await sendAttachment(attachment);
      }

      // Clear form
      setMessage('');
      setAttachments([]);
      
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Send attachment
  const sendAttachment = async (attachment) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', attachment.file);
      formData.append('chatId', chatId);
      formData.append('messageType', attachment.type);
      
      if (attachment.caption) {
        formData.append('caption', attachment.caption);
      }

      // Upload file first (this would be a separate endpoint)
      const uploadResponse = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      
      const fileData = await uploadResponse.json();
      
      // Send message with file reference
      await sendMessage(chatId, attachment.caption || '', attachment.type, {
        fileUrl: fileData.url,
        fileName: attachment.file.name,
        fileSize: attachment.file.size,
        mimeType: attachment.file.type
      });
      
    } catch (error) {
      console.error('Failed to send attachment:', error);
    }
  };

  // Handle file selection
  const handleFileSelect = (files, type = 'file') => {
    const newAttachments = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      type: type === 'image' ? 'image' : 'file',
      preview: type === 'image' ? URL.createObjectURL(file) : null,
      caption: ''
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  // Remove attachment
  const removeAttachment = (id) => {
    setAttachments(prev => {
      const updated = prev.filter(att => att.id !== id);
      // Cleanup object URLs
      const removed = prev.find(att => att.id === id);
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  // Update attachment caption
  const updateAttachmentCaption = (id, caption) => {
    setAttachments(prev =>
      prev.map(att => att.id === id ? { ...att, caption } : att)
    );
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], 'voice-message.wav', { type: 'audio/wav' });
        handleFileSelect([file], 'audio');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      attachments.forEach(att => {
        if (att.preview) {
          URL.revokeObjectURL(att.preview);
        }
      });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Common emojis for quick access
  const commonEmojis = ['😊', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '👏', '🙏'];

  return (
    <div className="message-input customer-message-input bg-white/90 backdrop-blur-sm p-4">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 space-y-2">
          {attachments.map((attachment) => (
            <AttachmentPreview
              key={attachment.id}
              attachment={attachment}
              onRemove={removeAttachment}
              onCaptionChange={updateAttachmentCaption}
            />
          ))}
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setMessage(prev => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="p-2 hover:bg-gray-200 rounded text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-3 bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-blue-100">
        {/* Attachment Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-all duration-200 transform hover:scale-110"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          <input
            ref={imageInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files, 'image')}
          />
        </div>

        {/* Image Button */}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-all duration-200 transform hover:scale-110"
          title="Send image"
        >
          <Image className="w-5 h-5" />
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="w-full px-4 py-3 border-0 bg-transparent focus:outline-none resize-none h-10 text-gray-900 placeholder-gray-400 font-medium"
            style={{ color: '#111827' }}
            disabled={disabled}
          />
        </div>

        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-all duration-200 transform hover:scale-110"
          title="Add emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Voice Message Button */}
        <button
          type="button"
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={stopRecording}
          className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
            isRecording
              ? 'bg-red-500 text-white shadow-lg animate-pulse'
              : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
          }`}
          title="Hold to record voice message"
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110 shadow-md disabled:shadow-none"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

// Attachment Preview Component
const AttachmentPreview = ({ attachment, onRemove, onCaptionChange }) => {
  const isImage = attachment.type === 'image';
  
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      {/* Preview */}
      <div className="flex-shrink-0">
        {isImage ? (
          <img
            src={attachment.preview}
            alt="Preview"
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
            <File className="w-6 h-6 text-blue-600" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {attachment.file.name}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(attachment.file.size)}
        </p>
        
        {/* Caption Input */}
        <input
          type="text"
          placeholder="Add a caption..."
          value={attachment.caption}
          onChange={(e) => onCaptionChange(attachment.id, e.target.value)}
          className="mt-2 w-full text-sm border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(attachment.id)}
        className="p-1 text-gray-400 hover:text-gray-600"
        title="Remove attachment"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default MessageInput;