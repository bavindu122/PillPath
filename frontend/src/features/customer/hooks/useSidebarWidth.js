import { useState, useEffect } from "react";

/**
 * Custom hook to manage sidebar width state by observing DOM changes
 * @returns {string} Current sidebar width class ('w-64' or 'w-20')
 */
export const useSidebarWidth = () => {
  const [sidebarWidth, setSidebarWidth] = useState("w-64");

  useEffect(() => {
    const sidebarElement = document.querySelector(
      '[class*="w-64"], [class*="w-20"]'
    );
    
    if (!sidebarElement) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const currentClasses = mutation.target.className;
          if (currentClasses.includes("w-20")) {
            setSidebarWidth("w-20");
          } else if (currentClasses.includes("w-64")) {
            setSidebarWidth("w-64");
          }
        }
      });
    });

    observer.observe(sidebarElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  return sidebarWidth;
};
