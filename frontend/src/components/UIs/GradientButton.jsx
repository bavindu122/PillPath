import React from "react";
import PropTypes from "prop-types"; // Fixed import statement

const GradientButton = ({
  text,
  icon: Icon,
  iconSize = 16,
  gradient = "from-secondary/90 to-secondary",
  hoverGradient = "from-secondary hover:to-secondary/90",
  onClick,
  className = "",
  animationDelay = "delay-600",
  fullWidth = true,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${
        fullWidth ? "w-full" : ""
      } bg-gradient-to-r ${gradient} hover:${hoverGradient} text-white py-3 md:py-4 rounded-xl backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-secondary/30 active:scale-[0.98] transition-all duration-300 group-hover:scale-[1.02] relative overflow-hidden animate-scale-in ${animationDelay} ${className}`}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      <div className="absolute -inset-1 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 rounded-xl"></div>
      <div className="flex gap-2 md:gap-3 items-center justify-center font-medium relative z-10">
        {Icon && <Icon size={iconSize} className="animate-bounce-gentle" />}
        <span className="text-sm md:text-base">{text}</span>
      </div>
    </button>
  );
};

GradientButton.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  iconSize: PropTypes.number,
  gradient: PropTypes.string,
  hoverGradient: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  animationDelay: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default GradientButton;
