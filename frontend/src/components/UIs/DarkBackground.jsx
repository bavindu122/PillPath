// Create a reusable DarkBackground component
const DarkBackground = ({ children, className = "" }) => {
  return (
    <section className={`py-20 relative overflow-hidden ${className}`}>
      {/* Main dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900"></div>
      
      {/* Enhanced floating elements for dark theme */}
      <div className="absolute top-20 left-[10%] w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float-slow"></div>
      <div className="absolute top-32 right-20 w-80 h-80 bg-indigo-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay"></div>
      <div className="absolute -bottom-20 left-32 w-96 h-96 bg-slate-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-6000"></div>
      
      {/* Medical pattern overlay */}
      <div className="medical-pattern absolute inset-0 opacity-10"></div>
      
      {/* Content with relative z-index */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
};

export default DarkBackground;