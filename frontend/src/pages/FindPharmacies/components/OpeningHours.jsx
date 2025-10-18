import React from "react";
import { Clock } from "lucide-react";

const OpeningHours = ({ pharmacy, showTitle = true, className = "", miniView = false }) => {
  if (!pharmacy) return null;

  // Convert database operating hours object to array format
  const getOperatingHoursArray = () => {
    // If operating hours is null, undefined, or empty object
    if (!pharmacy.operatingHours || typeof pharmacy.operatingHours !== 'object' || Object.keys(pharmacy.operatingHours).length === 0) {
      // Return empty data if no operating hours available
      return [
        { day: "Monday", hours: "Not specified" },
        { day: "Tuesday", hours: "Not specified" },
        { day: "Wednesday", hours: "Not specified" },
        { day: "Thursday", hours: "Not specified" },
        { day: "Friday", hours: "Not specified" },
        { day: "Saturday", hours: "Not specified" },
        { day: "Sunday", hours: "Not specified" }
      ];
    }

    // Convert database object to array
    const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dbHours = pharmacy.operatingHours;
    
    return daysOrder.map(day => {
      const dayLower = day.toLowerCase();
      const hours = dbHours[dayLower] || dbHours[day] || "";
      return {
        day: day,
        hours: hours.trim() || "Not specified"
      };
    });
  };

  // Operating hours data - ensure it's always an array
  const operatingHours = Array.isArray(pharmacy.operatingHours) 
    ? pharmacy.operatingHours 
    : getOperatingHoursArray();

  const getCurrentDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  };

  const getCurrentDayIndex = () => {
    return new Date().getDay();
  };

  const currentDay = getCurrentDay();
  const currentDayIndex = getCurrentDayIndex();

  // Check if pharmacy is currently open
  const isCurrentlyOpen = () => {
    if (pharmacy.currentStatus) {
      return pharmacy.currentStatus.toLowerCase().includes('open');
    }
    
    // Fallback logic based on operating hours
    const todayHours = operatingHours.find(h => h.day === currentDay)?.hours;
    if (!todayHours || todayHours.toLowerCase().includes('closed') || todayHours.toLowerCase().includes('not specified')) {
      return false;
    }
    
    // Simple check - you can enhance this with actual time parsing
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 8 && currentHour < 21; // Basic 8AM-9PM assumption
  };

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
  const isOpen = isCurrentlyOpen();

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
            <div className={`w-2 h-2 rounded-full animate-pulse ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-medium ${isOpen ? 'text-green-700' : 'text-red-700'}`}>
              {pharmacy.currentStatus || (isOpen ? "Currently Open" : "Currently Closed")}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Today: {operatingHours.find(h => h.day === currentDay)?.hours || "Hours not available"}
          </p>
        </div>
      )}

      {/* Mini view status */}
      {miniView && (
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-medium text-sm ${isOpen ? 'text-green-700' : 'text-red-700'}`}>
              {pharmacy.currentStatus || (isOpen ? "Currently Open" : "Currently Closed")}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {displayHours.map((schedule, index) => (
          <div 
            key={schedule.day || index} 
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