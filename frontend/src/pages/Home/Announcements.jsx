import React, { useState, useEffect } from "react";
import { Bell, Calendar, ChevronRight, Megaphone, Zap } from "lucide-react";
import AdminService from "../../services/api/AdminService";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getAnnouncements();
      // Filter only active announcements and sort by newest first
      const activeAnnouncements = response
        .filter((announcement) => announcement.active)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6); // Show only latest 6 announcements

      setAnnouncements(activeAnnouncements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setAnnouncements([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Don't render anything if loading or no announcements
  if (loading || announcements.length === 0) {
    return null;
  }

  return (
    <section className="py-20 relative overflow-hidden bg-dark-theme">
      {/* Futuristic floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="dark-float-element-1 absolute top-16 left-10 w-96 h-96 rounded-full"></div>
        <div className="dark-float-element-2 absolute bottom-20 right-16 w-80 h-80 rounded-full"></div>
        <div className="dark-float-element-3 absolute top-1/2 left-1/3 w-64 h-64 rounded-full"></div>
        <div className="dark-float-element-4 absolute bottom-32 left-20 w-72 h-72 rounded-full"></div>
      </div>

      {/* Medical pattern overlay */}
      <div className="absolute inset-0 medical-pattern-dark"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Futuristic Section Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            {/* Glowing ring effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-xl scale-150"></div>
            <div className="relative glass-card-dark w-20 h-20 rounded-full flex items-center justify-center">
              <Megaphone size={36} className="text-white" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 animate-pulse"></div>
            </div>
          </div>
          
          <h2 className="text-5xl font-bold text-dark-theme-primary mb-6 text-gradient-primary">
            System Announcements
          </h2>
          <p className="text-xl text-dark-theme-secondary max-w-3xl mx-auto leading-relaxed">
            Stay connected with the latest updates and important notifications from the PillPath healthcare network
          </p>
          
          {/* Animated underline */}
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-60">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Futuristic Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {announcements.map((announcement, index) => (
            <div
              key={announcement.id}
              className={`group glass-card-dark glass-card-dark-hover relative overflow-hidden ${
                index === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* Holographic border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Card Header with futuristic design */}
              <div className="relative p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bell size={18} className="text-white" />
                    </div>
                    <div>
                      <span className="text-white font-semibold text-sm uppercase tracking-wider opacity-90">
                        System Update
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar size={14} className="text-blue-400" />
                        <span className="text-blue-400 text-xs font-medium">
                          {formatDate(announcement.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium uppercase tracking-wide">Live</span>
                  </div>
                </div>
              </div>

              {/* Card Content with futuristic styling */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark-theme-primary mb-4 group-hover:text-gradient-primary transition-all duration-300">
                  {announcement.title}
                </h3>
                <p className="text-dark-theme-secondary leading-relaxed mb-6 line-clamp-3 text-sm">
                  {announcement.content}
                </p>
                
                {/* Priority indicator centered */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-2 text-amber-400 bg-amber-400/10 px-4 py-2 rounded-lg">
                    <Zap size={16} />
                    <span className="text-xs font-medium uppercase tracking-wide">Priority Update</span>
                  </div>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Futuristic View All Button */}
        {announcements.length >= 6 && (
          <div className="text-center mt-16">
            <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-105">
              <span className="relative z-10 flex items-center space-x-3">
                <span>Explore All Announcements</span>
                <ChevronRight size={20} className="transform group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Moving shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </div>
        )}
      </div>

      {/* Subtle animated background lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
      </div>
    </section>
  );
};

export default Announcements;