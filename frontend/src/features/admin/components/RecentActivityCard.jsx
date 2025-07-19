import React from 'react';
import {
  
  Activity,
  
} from 'lucide-react';

export default function RecentActivityCard({ title, activities }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-10">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Activity size={36} className="mr-2 text-blue-800" /> 
        {title}
      </h3>
      <ul className="divide-y divide-gray-200">
        {activities.map((item) => (
          <li key={item.id} className="py-2 flex justify-between items-start">
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{item.user}</span>
              <span className="text-sm text-gray-600">{item.action}</span>
            </div>
            <div className="text-sm text-gray-400">{item.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
