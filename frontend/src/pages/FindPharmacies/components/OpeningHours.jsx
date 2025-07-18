import React from "react";
import { Clock } from "lucide-react";

const OpeningHours = ({ pharmacy, showTitle = true, className = "", miniView = false }) => {
  if (!pharmacy) return null;

  // Operating hours data - ensure it's always an array
  const operatingHours = Array.isArray(pharmacy.operatingHours) 
    ? pharmacy.operatingHours 
    : [
        { day: "Monday", hours: "8:00 AM - 9:00 PM" },
        { day: "Tuesday", hours: "8:00 AM - 9:00 PM" },
        { day: "Wednesday", hours: "8:00 AM - 9:00 PM" },
        { day: "Thursday", hours: "8:00 AM - 9:00 PM" },
        { day: "Friday", hours: "8:00 AM - 9:00 PM" },
        { day: "Saturday", hours: "9:00 AM - 7:00 PM" },
        { day: "Sunday", hours: "10:00 AM - 6:00 PM" }
      ];

  const getCurrentDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  };

  const getCurrentDayIndex = () => {
    return new Date().getDay();
  };

  const currentDay = getCurrentDay();
  const currentDayIndex = getCurrentDayIndex();

  // For mini view, show only yesterday, today, and tomorrow
  const getMiniViewHours = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const result = [];
    
    // Yesterday
    const yesterdayIndex = (currentDayIndex - 1 + 7) % 7;
    const yesterdayData = operatingHours.find(h => h.day === days[yesterdayIndex]);
    if (yesterdayData) {
      result.push({ ...yesterdayData, label: "Yesterday" });
    }
    
    // Today
    const todayData = operatingHours.find(h => h.day === currentDay);
    if (todayData) {
      result.push({ ...todayData, label: "Today" });
    }
    
    // Tomorrow
    const tomorrowIndex = (currentDayIndex + 1) % 7;
    const tomorrowData = operatingHours.find(h => h.day === days[tomorrowIndex]);
    if (tomorrowData) {
      result.push({ ...tomorrowData, label: "Tomorrow" });
    }
    
    return result;
  };

  const displayHours = miniView ? getMiniViewHours() : operatingHours;

  return (
    <div className={`bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-xl ${className}`}>
      {showTitle && (
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Operating Hours</h2>
        </div>
      )}
      
      {/* Current Status - only show in full view */}
      {!miniView && (
        <div className="mt-6 mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">
              {pharmacy.isOpen ? "Currently Open" : "Currently Closed"}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Today: {operatingHours.find(h => h.day === currentDay)?.hours}
          </p>
        </div>
      )}

      {/* Mini view status */}
      {miniView && (
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium text-sm">
              {pharmacy.isOpen ? "Currently Open" : "Currently Closed"}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {displayHours.map((schedule) => (
          <div 
            key={schedule.day} 
            className={`flex justify-between items-center py-2 px-3 rounded-lg transition-colors ${
              miniView 
                ? (schedule.label === "Today" 
                    ? 'bg-blue-50 border-l-4 border-blue-500 shadow-sm' 
                    : 'bg-white/40 hover:bg-white/60')
                : (schedule.day === currentDay 
                    ? 'bg-blue-50 border-l-4 border-blue-500 shadow-sm' 
                    : 'bg-white/40 hover:bg-white/60')
            }`}
          >
            <span className={`font-medium text-sm ${
              miniView 
                ? (schedule.label === "Today" 
                    ? 'text-blue-800' 
                    : 'text-gray-700')
                : (schedule.day === currentDay 
                    ? 'text-blue-800' 
                    : 'text-gray-700')
            }`}>
              {miniView ? schedule.label : schedule.day}
            </span>
            <span className={`font-semibold text-sm ${
              miniView 
                ? (schedule.label === "Today" 
                    ? 'text-blue-800' 
                    : 'text-gray-600')
                : (schedule.day === currentDay 
                    ? 'text-blue-800' 
                    : 'text-gray-600')
            }`}>
              {schedule.hours}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpeningHours;