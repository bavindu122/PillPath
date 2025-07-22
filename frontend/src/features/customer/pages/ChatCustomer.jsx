import React, { useState } from 'react';
import { MessageSquare, Search, Filter, Users, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerChatList from '../components/CustomerChatList';
import CustomerChatWindow from '../components/CustomerChatWindow';

const ChatCustomer = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for pharmacy chats - replace with actual API call
  const [chats] = useState([
    {
      id: 1,
      pharmacyName: "CityHealth Pharmacy",
      pharmacyAvatar: "/api/placeholder/40/40",
      lastMessage: "Your prescription is ready for pickup",
      lastMessageTime: "2024-01-15T10:30:00Z",
      unreadCount: 2,
      status: "active",
      prescriptionId: "RX123456",
      pharmacyLocation: "Downtown Branch",
    },
    {
      id: 2,
      pharmacyName: "MediCare Plus",
      pharmacyAvatar: "/api/placeholder/40/40",
      lastMessage: "We need to verify your insurance information",
      lastMessageTime: "2024-01-14T15:45:00Z",
      unreadCount: 1,
      status: "waiting",
      prescriptionId: "RX123457",
      pharmacyLocation: "Mall Branch",
    },
    {
      id: 3,
      pharmacyName: "Family Care Pharmacy",
      pharmacyAvatar: "/api/placeholder/40/40",
      lastMessage: "Thank you for your business!",
      lastMessageTime: "2024-01-13T09:20:00Z",
      unreadCount: 0,
      status: "resolved",
      prescriptionId: "RX123455",
      pharmacyLocation: "Suburb Branch",
    },
    {
      id: 4,
      pharmacyName: "QuickMeds Pharmacy",
      pharmacyAvatar: "/api/placeholder/40/40",
      lastMessage: "Your medication is now available",
      lastMessageTime: "2024-01-12T14:15:00Z",
      unreadCount: 0,
      status: "resolved",
      prescriptionId: "RX123454",
      pharmacyLocation: "Express Branch",
    },
  ]);

  // Filter chats based on search and status
  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || chat.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    // Mark messages as read when opening chat
    const updatedChats = chats.map(c => 
      c.id === chat.id ? { ...c, unreadCount: 0 } : c
    );
  };

  return (
    <div className="min-h-screen p-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Pharmacy Chats
              </h1>
              <p className="text-white/70">
                Communicate with pharmacies about your prescriptions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 text-white">
                  <MessageSquare size={20} />
                  <span className="font-medium">{chats.length} Conversations</span>
                </div>
              </div>
              {totalUnread > 0 && (
                <div className="bg-red-500 text-white rounded-full px-3 py-1 text-sm font-medium">
                  {totalUnread} Unread
                </div>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
              <input
                type="text"
                placeholder="Search pharmacies or messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All Chats</option>
              <option value="active">Active</option>
              <option value="waiting">Waiting</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </motion.div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
          {/* Chat List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <CustomerChatList
              chats={filteredChats}
              selectedChat={selectedChat}
              onSelectChat={handleChatSelect}
            />
          </motion.div>

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <CustomerChatWindow
              selectedChat={selectedChat}
              onClose={() => setSelectedChat(null)}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ChatCustomer;
