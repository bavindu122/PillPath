import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, Clock, User, Users } from 'lucide-react';
import api from '../../../../services/api';
import { normalizeChatsList } from '../../../../utils/chatNormalize';

const ChatList = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use axios client with baseURL (http://localhost:8080/api) and target /v1
      const { data } = await api.get('/v1/chats/threads');
      // Normalize possible response shapes and sort by recency
      const threadsData = Array.isArray(data)
        ? data
        : (data?.threads || data?.content || data?.items || []);
      const normalized = normalizeChatsList(threadsData || [], { sort: true });
      setThreads(normalized || []);
    } catch (err) {
      // If backend returned HTML (e.g., 404 page), show a clear message
      const raw = err?.response?.data;
      if (typeof raw === 'string' && raw.startsWith('<!doctype')) {
        setError('Received HTML instead of JSON. Check API URL (/v1/chats/threads) and backend routing.');
      } else {
        setError(err?.response?.data?.message || err.message || 'Failed to load chats');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleThreadClick = (customerId) => {
    navigate(`/pharmacy/chats/${customerId}`);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const filteredThreads = threads.filter(thread => {
    const name = thread.customer?.name || thread.customerName || `Customer ${thread.customerId}`;
    const last = thread.lastMessage?.content || '';
    const q = searchTerm.toLowerCase();
    return name?.toLowerCase().includes(q) || last?.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading chats...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="h-8 w-8 mr-3 text-blue-600" />
            Customer Chats
          </h1>
          <p className="text-gray-600 mt-1">Manage conversations with your customers</p>
        </div>

        {/* Search and Refresh */}
        <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-sm border border-blue-100 p-6 mb-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/80 backdrop-blur-sm"
              />
            </div>
            <button
              onClick={fetchThreads}
              disabled={loading}
              className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">⚠️</div>
              <div>
                <p className="text-red-800 font-medium">Error loading chats</p>
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={fetchThreads}
                  className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat List */}
        <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-sm border border-blue-100">
          {filteredThreads.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No matching conversations' : 'No conversations yet'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Customer conversations will appear here when they start chatting with your pharmacy'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-blue-100">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.customerId || thread.id}
                  onClick={() => handleThreadClick(thread.customerId)}
                  className="p-4 hover:bg-blue-50/50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        {/* Online indicator - you can add logic here */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {thread.customerName || `Customer ${thread.customerId}`}
                          </p>
                          <div className="flex items-center space-x-2">
                            {thread.unreadCount > 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white shadow-sm">
                                {thread.unreadCount}
                              </span>
                            )}
                            <div className="flex items-center text-xs text-gray-500 font-medium">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(thread.lastMessageTime)}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1 leading-relaxed">
                          {thread.lastMessage?.content || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;