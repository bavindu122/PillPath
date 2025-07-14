import { useState, useEffect } from "react";

/**
 * Custom hook to manage sidebar state including expansion and responsive behavior
 * @returns {object} Object containing sidebar state and controls
 */
export const useCustomerSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const collapseSidebar = () => {
    setIsExpanded(false);
  };

  const expandSidebar = () => {
    setIsExpanded(true);
  };

  return {
    isExpanded,
    isMobile,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
    setIsExpanded
  };
};
