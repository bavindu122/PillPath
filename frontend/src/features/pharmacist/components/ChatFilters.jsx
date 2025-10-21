import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

const ChatFilters = ({
  searchTerm,
  filterStatus,
  sortBy,
  onSearchChange,
  onFilterStatusChange,
  onSortChange
}) => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-sm border border-blue-100 p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/80 backdrop-blur-sm"
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          <Filter className="inline h-4 w-4 mr-1" />
          Status
        </label>
        <select
          value={filterStatus}
          onChange={(e) => onFilterStatusChange(e.target.value)}
          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/80 backdrop-blur-sm"
        >
          <option value="">All Conversations</option>
          <option value="active">Active</option>
          <option value="waiting">Waiting</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Sort Options */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          <ArrowUpDown className="inline h-4 w-4 mr-1" />
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/80 backdrop-blur-sm"
        >
          <option value="recent">Most Recent</option>
          <option value="patient">Patient Name</option>
          <option value="priority">Priority</option>
          <option value="unread">Unread Count</option>
        </select>
      </div>
    </div>
  );
};

export default ChatFilters;
