import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, Clock, User } from 'lucide-react';
import api from '../../../../services/api';

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
      // Normalize possible response shapes
      const threadsData = Array.isArray(data)
        ? data
        : (data?.threads || data?.content || data?.items || []);
      setThreads(threadsData || []);
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
    const name = thread.customerName || thread.customer || `Customer ${thread.customerId}`;
    const last = thread.lastMessage || thread.content || '';
    const q = searchTerm.toLowerCase();
    return name?.toLowerCase().includes(q) || last?.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="h-8 w-8 mr-3 text-blue-600" />
            Customer Chats
          </h1>
          <p className="text-gray-600 mt-1">Manage conversations with your customers</p>
        </div>

        {/* Search and Refresh */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchThreads}
              disabled={loading}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        <div className="bg-white rounded-lg shadow-sm">
          {filteredThreads.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
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
            <div className="divide-y divide-gray-200">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.customerId}
                  onClick={() => handleThreadClick(thread.customerId)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {thread.customerName || `Customer ${thread.customerId}`}
                          </p>
                          <div className="flex items-center space-x-2">
                            {thread.unreadCount > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {thread.unreadCount}
                              </span>
                            )}
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(thread.lastMessageTime)}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {thread.lastMessage || thread.content || 'No messages yet'}
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