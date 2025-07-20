import React from 'react';
import { MessageSquare, Users, Clock, CheckCircle } from 'lucide-react';
import '../pages/index-pharmacist.css';

const ChatStats = ({ totalChats, unreadCount, activeChats, resolvedChats }) => {
  const stats = [
    {
      title: 'Total Conversations',
      value: totalChats.toString(),
      subtitle: 'Active communications',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      title: 'Unread Messages',
      value: unreadCount.toString(),
      subtitle: 'Require attention',
      icon: Users,
      color: 'red'
    },
    {
      title: 'Active Chats',
      value: activeChats.toString(),
      subtitle: 'Currently ongoing',
      icon: Clock,
      color: 'yellow'
    },
    {
      title: 'Resolved Today',
      value: resolvedChats.toString(),
      subtitle: 'Completed today',
      icon: CheckCircle,
      color: 'green'
    }
  ];

  const getCardClass = (color) => {
    const classes = {
      blue: 'chat-stats-blue',
      red: 'chat-stats-red',
      yellow: 'chat-stats-yellow',
      green: 'chat-stats-green'
    };
    return classes[color] || classes.blue;
  };

  const getIconClass = (color) => {
    const classes = {
      blue: 'chat-icon-blue',
      red: 'chat-icon-red',
      yellow: 'chat-icon-yellow',
      green: 'chat-icon-green'
    };
    return classes[color] || classes.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${getCardClass(stat.color)} border rounded-xl p-6 hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer group`}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'slideInUp 0.6s ease-out forwards'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2 group-hover:transition-colors duration-200" style={{ color: 'var(--pharma-gray-600)' }}>
                  {stat.title}
                </p>
                <p className="text-3xl font-bold mb-1 group-hover:scale-105 transition-transform duration-200" style={{ color: 'var(--pharma-gray-900)' }}>
                  {stat.value}
                </p>
                <p className="text-xs group-hover:transition-colors duration-200" style={{ color: 'var(--pharma-gray-500)' }}>
                  {stat.subtitle}
                </p>
              </div>
              
              <div className={`${getIconClass(stat.color)} opacity-80 group-hover:opacity-100 transition-opacity duration-200`}>
                <Icon className="h-8 w-8" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatStats;
