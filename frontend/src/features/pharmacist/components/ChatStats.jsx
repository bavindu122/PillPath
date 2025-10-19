import React from 'react';
import { MessageSquare, Users, Clock, CheckCircle } from 'lucide-react';

const ChatStats = ({ totalChats, unreadCount, activeChats, resolvedChats }) => {
  const stats = [
    {
      title: 'Total Conversations',
      value: totalChats.toString(),
      subtitle: 'Active communications',
      icon: MessageSquare,
      color: 'blue',
      bgColor: 'from-blue-500 to-blue-600',
      textColor: 'text-black',
      iconColor: 'text-white'
    },
    {
      title: 'Unread Messages',
      value: unreadCount.toString(),
      subtitle: 'Require attention',
      icon: Users,
      color: 'red',
      bgColor: 'from-red-500 to-red-600',
      textColor: 'text-black',
      iconColor: 'text-white'
    },
    {
      title: 'Active Chats',
      value: activeChats.toString(),
      subtitle: 'Currently ongoing',
      icon: Clock,
      color: 'yellow',
      bgColor: 'from-yellow-500 to-yellow-600',
      textColor: 'text-black',
      iconColor: 'text-white'
    },
    {
      title: 'Resolved Today',
      value: resolvedChats.toString(),
      subtitle: 'Completed today',
      icon: CheckCircle,
      color: 'green',
      bgColor: 'from-green-500 to-green-600',
      textColor: 'text-black',
      iconColor: 'text-white'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`bg-gradient-to-r ${stat.bgColor} border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group backdrop-blur-sm`}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'slideInUp 0.6s ease-out forwards'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={`text-sm font-medium mb-2 ${stat.textColor} opacity-90`}>
                  {stat.title}
                </p>
                <p className={`text-3xl font-bold mb-1 ${stat.textColor} group-hover:scale-105 transition-transform duration-200`}>
                  {stat.value}
                </p>
                <p className={`text-xs ${stat.textColor} opacity-80`}>
                  {stat.subtitle}
                </p>
              </div>
              
              <div className={`${stat.iconColor} opacity-80 group-hover:opacity-100 transition-opacity duration-200`}>
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
