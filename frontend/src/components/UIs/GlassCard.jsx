import React from "react";
import PropTypes from "prop-types";
import GradientButton from "./GradientButton";

const GlassCard = ({
  title,
  icon: Icon,
  iconColor = "text-primary",
  headerGradient = "from-secondary/90 to-primary-hover/90",
  children,
  className = "",
  animationDelay = "delay-300",
}) => {
  return (
    <div className={`w-full sm:w-auto mx-auto lg:mx-0 animate-fade-in-right ${animationDelay}`}>
      <div className="group flex flex-col items-center justify-center mb-6 h-auto w-full sm:w-[340px] max-w-full bg-white/20 backdrop-blur-xl rounded-2xl gap-4 hover:translate-y-[-8px] hover:shadow-2xl transition-all duration-500 shadow-xl relative overflow-hidden border border-white/30">
        {/* Background glass elements */}
        <div className="absolute top-[-40px] right-[-30px] w-64 h-64 bg-secondary/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-[-50px] left-[-40px] w-80 h-80 bg-primary/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute top-[30%] left-[-20px] w-40 h-40 bg-secondary/10 rounded-full blur-xl group-hover:scale-105 transition-transform duration-700"></div>

        {/* Prescription themed floating elements */}
        <div className="absolute top-[10%] right-[10%] w-8 h-4 bg-indigo-400/40 rounded-full rotate-45 animate-pulse-slow"></div>
        <div className="absolute bottom-[15%] left-[15%] w-6 h-3 bg-pink-400/40 rounded-full rotate-[30deg] animate-pulse-slow"></div>
        <div
          className="absolute top-[60%] right-[15%] w-4 h-4 bg-teal-400/30 rounded-full animate-ping"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-[70%] left-[20%] w-2 h-2 bg-indigo-300/30 rounded-full animate-ping"
          style={{ animationDuration: "4s" }}
        ></div>

        {/* Paper/prescription element */}
        <div className="absolute top-[35%] right-[15%] w-12 h-16 bg-white/30 rounded-sm rotate-12 border-t-2 border-indigo-300/30"></div>

        {/* Modern glass morphism header */}
        <div className={`bg-gradient-to-r ${headerGradient} backdrop-blur-md p-4 md:p-6 rounded-t-2xl flex flex-col justify-center items-center w-full relative overflow-hidden border-b border-white/10`}>
          {/* Glass reflections */}
          <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-white/20 to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-xl"></div>

          {/* Enhanced animated rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-40 rounded-full border-2 border-white/20 opacity-70 animate-ping-slow"></div>
            <div
              className="absolute w-60 h-60 rounded-full border border-white/10 opacity-50 animate-ping-slow"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute w-20 h-20 rounded-full border-2 border-white/30 opacity-80 animate-ping-slow"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          {/* Scattered dots pattern */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.3,
                }}
              ></div>
            ))}
          </div>

          <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold text-white tracking-wide drop-shadow-md relative z-10">
            {title}
          </h3>

          {Icon && (
            <div className="relative z-10">
              <div className="absolute inset-0 bg-white/30 rounded-full blur-md transform scale-110 group-hover:scale-125 transition-transform duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-md p-3 md:p-4 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300 border border-white/50">
                <Icon className={`w-10 h-10 md:w-12 md:h-12 ${iconColor} animate-pulse drop-shadow-md`} />
              </div>
            </div>
          )}
        </div>

        {/* Card content */}
        <div className="w-full px-4 md:px-6 pb-4 md:pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};

GlassCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  iconColor: PropTypes.string,
  headerGradient: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  animationDelay: PropTypes.string,
};

export default GlassCard;

















// import React from "react";
// import PropTypes from "prop-types";
// import GradientButton from "./GradientButton";

// const GlassCard = ({
//   title,
//   icon: Icon,
//   iconColor = "text-primary",
//   headerGradient = "from-secondary/90 to-primary-hover/90",
//   children,
//   className = "",
//   animationDelay = "delay-300",
// }) => {
//   return (
//     <div className={`w-full sm:w-auto mx-auto lg:mx-0 animate-fade-in-right ${animationDelay}`}>
//       <div className="group flex flex-col items-center justify-center mb-6 h-auto w-full sm:w-[340px] max-w-full bg-white/20 backdrop-blur-xl rounded-2xl gap-4 hover:translate-y-[-8px] hover:shadow-2xl transition-all duration-500 shadow-xl relative overflow-hidden border border-white/30">
//         {/* Background glass elements */}
//         <div className="absolute top-[-40px] right-[-30px] w-64 h-64 bg-secondary/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
//         <div className="absolute bottom-[-50px] left-[-40px] w-80 h-80 bg-primary/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
//         <div className="absolute top-[30%] left-[-20px] w-40 h-40 bg-secondary/10 rounded-full blur-xl group-hover:scale-105 transition-transform duration-700"></div>

//         {/* Prescription themed floating elements */}
//         <div className="absolute top-[10%] right-[10%] w-8 h-4 bg-indigo-400/40 rounded-full rotate-45 animate-pulse-slow"></div>
//         <div className="absolute bottom-[15%] left-[15%] w-6 h-3 bg-pink-400/40 rounded-full rotate-[30deg] animate-pulse-slow"></div>
//         <div
//           className="absolute top-[60%] right-[15%] w-4 h-4 bg-teal-400/30 rounded-full animate-ping"
//           style={{ animationDuration: "3s" }}
//         ></div>
//         <div
//           className="absolute top-[70%] left-[20%] w-2 h-2 bg-indigo-300/30 rounded-full animate-ping"
//           style={{ animationDuration: "4s" }}
//         ></div>

//         {/* Paper/prescription element */}
//         <div className="absolute top-[35%] right-[15%] w-12 h-16 bg-white/30 rounded-sm rotate-12 border-t-2 border-indigo-300/30"></div>

//         {/* Modern glass morphism header */}
//         <div className={`bg-gradient-to-r ${headerGradient} backdrop-blur-md p-4 md:p-6 rounded-t-2xl flex flex-col justify-center items-center w-full relative overflow-hidden border-b border-white/10`}>
//           {/* Glass reflections */}
//           <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-white/20 to-transparent"></div>
//           <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-xl"></div>

//           {/* Enhanced animated rings */}
//           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//             <div className="w-40 h-40 rounded-full border-2 border-white/20 opacity-70 animate-ping-slow"></div>
//             <div
//               className="absolute w-60 h-60 rounded-full border border-white/10 opacity-50 animate-ping-slow"
//               style={{ animationDelay: "0.5s" }}
//             ></div>
//             <div
//               className="absolute w-20 h-20 rounded-full border-2 border-white/30 opacity-80 animate-ping-slow"
//               style={{ animationDelay: "1s" }}
//             ></div>
//           </div>

//           {/* Scattered dots pattern */}
//           <div className="absolute inset-0 overflow-hidden opacity-30">
//             {[...Array(20)].map((_, i) => (
//               <div
//                 key={i}
//                 className="absolute w-1 h-1 bg-white rounded-full"
//                 style={{
//                   top: `${Math.random() * 100}%`,
//                   left: `${Math.random() * 100}%`,
//                   opacity: Math.random() * 0.5 + 0.3,
//                 }}
//               ></div>
//             ))}
//           </div>

//           <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold text-white tracking-wide drop-shadow-md relative z-10">
//             {title}
//           </h3>

//           {Icon && (
//             <div className="relative z-10">
//               <div className="absolute inset-0 bg-white/30 rounded-full blur-md transform scale-110 group-hover:scale-125 transition-transform duration-500"></div>
//               <div className="relative bg-white/80 backdrop-blur-md p-3 md:p-4 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300 border border-white/50">
//                 <Icon className={`w-10 h-10 md:w-12 md:h-12 ${iconColor} animate-pulse drop-shadow-md`} />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Card content */}
//         <div className="w-full px-4 md:px-6 pb-4 md:pb-6">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// GlassCard.propTypes = {
//   title: PropTypes.string.isRequired,
//   icon: PropTypes.elementType,
//   iconColor: PropTypes.string,
//   headerGradient: PropTypes.string,
//   children: PropTypes.node.isRequired,
//   className: PropTypes.string,
//   animationDelay: PropTypes.string,
// };

// export default GlassCard;