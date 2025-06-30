import React, { useState } from "react";
import {
  FileUp,
  Map,
  Users,
  ShoppingCart,
  Star,
  Pill,
  ChevronRight,
  Upload,
  Target,
  UserPlus,
  ShoppingBag,
  Award,
  BookOpen,
} from "lucide-react";

const features = [
  {
    id: 1,
    icon: <Upload size={28} strokeWidth={1.5} />,
    activeIcon: <FileUp size={32} strokeWidth={1.5} />,
    title: "Prescription Upload",
    description:
      "Securely upload and manage your prescriptions with professional pharmacist review",
    color: "from-primary to-primary-hover",
    textColor: "text-primary-blue",
    delay: "delay-100",
  },
  {
    id: 2,
    icon: <Map size={28} strokeWidth={1.5} />,
    activeIcon: <Target size={32} strokeWidth={1.5} />,
    title: "Pharmacy Finder",
    description:
      "Locate nearby pharmacies with real-time inventory and availability tracking",
    color: "from-secondary to-secondary-hover",
    textColor: "text-secondary-green",
    delay: "delay-200",
  },
  {
    id: 3,
    icon: <Users size={28} strokeWidth={1.5} />,
    activeIcon: <UserPlus size={32} strokeWidth={1.5} />,
    title: "Family Profiles",
    description:
      "Create and manage medication profiles for your entire family in one place",
    color: "from-accent to-accent-light",
    textColor: "text-accent-purple",
    delay: "delay-300",
  },
  {
    id: 4,
    icon: <ShoppingBag size={28} strokeWidth={1.5} />,
    activeIcon: <ShoppingCart size={32} strokeWidth={1.5} />,
    title: "OTC Store",
    description:
      "Browse and purchase over-the-counter medications with home delivery options",
    color: "from-primary-hover to-primary",
    textColor: "text-primary-blue",
    delay: "delay-400",
  },
  {
    id: 5,
    icon: <Star size={28} strokeWidth={1.5} />,
    activeIcon: <Award size={32} strokeWidth={1.5} />,
    title: "Loyalty Points",
    description:
      "Earn and redeem rewards for purchases, referrals, and consistent medication adherence",
    color: "from-secondary-hover to-secondary",
    textColor: "text-secondary-green",
    delay: "delay-500",
  },
  {
    id: 6,
    icon: <BookOpen size={28} strokeWidth={1.5} />,
    activeIcon: <Pill size={32} strokeWidth={1.5} />,
    title: "Medicine Information",
    description:
      "Access comprehensive medication information, potential interactions, and usage guidelines",
    color: "from-accent-light to-accent",
    textColor: "text-accent-purple",
    delay: "delay-600",
  },
];

const CoreFeatures = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Eye-catching animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#030B17] via-[#0F172A] to-[#1E1B4B]"></div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        <div className="particles-container">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 animate-float-random"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 20 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Medical-themed decorative elements */}
      <div className="absolute top-10 left-[10%] w-40 h-40 rounded-full border-4 border-primary/10 rotate-45 opacity-20"></div>
      <div className="absolute bottom-10 right-[10%] w-60 h-60 rounded-full border-4 border-accent/10 -rotate-12 opacity-20"></div>
      <div className="absolute top-1/2 left-0 w-72 h-72 -translate-y-1/2 rounded-full radial-pulse-accent opacity-10"></div>
      <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full radial-pulse-primary opacity-10"></div>

      <div className="container mx-auto relative z-10">
        {/* More compact header */}
        <div className="text-center mb-10">
          <h6 className="text-secondary-green uppercase tracking-wider text-sm font-semibold mb-2 animate-fade-in-up">
            Comprehensive Solution
          </h6>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up text-shadow-sm">
            <span className="text-gradient-primary">Core</span>{" "}
            <span className="text-white">Features</span>
          </h2>

          <div className="w-20 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full mx-auto mb-4"></div>

          <p className="text-white text-base max-w-xl mx-auto animate-fade-in-up delay-200">
            Discover the powerful features that make PillPath your complete
            pharmacy solution.
          </p>
        </div>

        {/* Denser 3-column grid that becomes 2-column and 1-column on smaller screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`${feature.delay} animate-fade-in-up rounded-xl bg-white/10 backdrop-blur-md border border-white/10 p-5 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group relative overflow-hidden`}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* Glass highlight effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex items-start gap-4">
                {/* More compact icon */}
                <div
                  className={`shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-md transform group-hover:scale-110 transition-all duration-500 z-10`}
                >
                  <div
                    className={`transition-all duration-300 ${
                      hoveredFeature === feature.id
                        ? "opacity-0 scale-50"
                        : "opacity-100 scale-100"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                      hoveredFeature === feature.id
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-150"
                    }`}
                  >
                    {feature.activeIcon}
                  </div>
                </div>

                <div className="flex-1">
                  {/* Title with gradient on hover */}
                  <h3
                    className={`text-lg font-bold mb-2 transition-colors duration-300 relative z-10 ${
                      hoveredFeature === feature.id
                        ? feature.textColor
                        : "text-light"
                    }`}
                  >
                    {feature.title}
                  </h3>

                  {/* Description with better readability */}
                  <p className="text-muted text-sm mb-3 font-normal leading-relaxed relative z-10">
                    {feature.description}
                  </p>

                  {/* Enhanced "Learn more" link */}
                  <a
                    href="#"
                    className={`inline-flex items-center text-sm font-medium ${feature.textColor} hover:opacity-80 transition-all duration-300 relative z-10`}
                  >
                    <span className="border-b border-current pb-0.5">
                      Learn more
                    </span>
                    <ChevronRight
                      size={16}
                      className="ml-1 group-hover:translate-x-2 transition-transform duration-500"
                    />
                  </a>
                </div>
              </div>

              {/* Subtle border accent on hover */}
              <div
                className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r ${feature.color} group-hover:w-full transition-all duration-700`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreFeatures;
