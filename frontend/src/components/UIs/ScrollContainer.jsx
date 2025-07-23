import React from "react";

const ScrollContainer = ({
  children,
  className = "",
  maxHeight = "400px",
  scrollbarTheme = "default", // default, green, blue, purple, custom
  scrollbarWidth = "8px",
  customScrollbarColor = null,
  showScrollbar = true,
  ...props
}) => {
  // Define scrollbar color themes
  const scrollbarThemes = {
    default: {
      thumb: "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)", // Blue gradient
      track: "transparent",
      firefoxColor: "#3b82f6",
    },
    green: {
      thumb: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)", // Green gradient
      track: "transparent",
      firefoxColor: "#22c55e",
    },
    blue: {
      thumb: "linear-gradient(90deg, #06b6d4 0%, #0891b2 100%)", // Cyan gradient
      track: "transparent",
      firefoxColor: "#06b6d4",
    },
    purple: {
      thumb: "linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)", // Purple gradient
      track: "transparent",
      firefoxColor: "#8b5cf6",
    },
    custom: {
      thumb: customScrollbarColor || "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)",
      track: "transparent",
      firefoxColor: customScrollbarColor?.split(" ")[0] || "#3b82f6",
    },
  };

  const currentTheme = scrollbarThemes[scrollbarTheme] || scrollbarThemes.default;

  // Generate unique class name for this instance
  const scrollbarClass = `scroll-container-${scrollbarTheme}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const scrollbarStyles = showScrollbar
    ? `
        .${scrollbarClass}::-webkit-scrollbar {
          width: ${scrollbarWidth};
          height: ${scrollbarWidth};
          background: transparent;
        }
        .${scrollbarClass}::-webkit-scrollbar-thumb {
          background: ${currentTheme.thumb};
          border-radius: ${parseInt(scrollbarWidth) / 2}px;
          border: none;
        }
        .${scrollbarClass}::-webkit-scrollbar-thumb:hover {
          filter: brightness(1.1);
        }
        .${scrollbarClass}::-webkit-scrollbar-track {
          background: ${currentTheme.track};
          border-radius: ${parseInt(scrollbarWidth) / 2}px;
        }
        .${scrollbarClass}::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        /* Firefox scrollbar */
        .${scrollbarClass} {
          scrollbar-width: thin;
          scrollbar-color: ${currentTheme.firefoxColor} transparent;
        }
      `
    : `
        .${scrollbarClass}::-webkit-scrollbar {
          display: none;
        }
        .${scrollbarClass} {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div
        className={`overflow-auto ${scrollbarClass} ${className}`}
        style={{ 
          maxHeight: maxHeight,
          ...props.style 
        }}
        {...props}
      >
        {children}
      </div>
    </>
  );
};

// Predefined scroll container variants for common use cases
export const ModalScrollContainer = ({ children, className = "", ...props }) => (
  <ScrollContainer
    className={`p-6 ${className}`}
    maxHeight="calc(90vh - 180px)"
    scrollbarTheme="default"
    scrollbarWidth="6px"
    {...props}
  >
    {children}
  </ScrollContainer>
);

export const SidebarScrollContainer = ({ children, className = "", ...props }) => (
  <ScrollContainer
    className={className}
    maxHeight="100vh"
    scrollbarTheme="purple"
    scrollbarWidth="4px"
    {...props}
  >
    {children}
  </ScrollContainer>
);

export const ContentScrollContainer = ({ children, className = "", ...props }) => (
  <ScrollContainer
    className={className}
    maxHeight="70vh"
    scrollbarTheme="blue"
    scrollbarWidth="8px"
    {...props}
  >
    {children}
  </ScrollContainer>
);

export const HiddenScrollContainer = ({ children, className = "", ...props }) => (
  <ScrollContainer
    className={className}
    showScrollbar={false}
    {...props}
  >
    {children}
  </ScrollContainer>
);

export default ScrollContainer;
