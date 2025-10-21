import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import TrustSafety from "./Home/TrustSafety";
import Benefits from "./Home/Benefits";
import { assets } from "../assets/assets";

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
  Check,
  Clock,
  Shield,
  CircleAlert,
  AlertCircle,
  Camera,
  Smartphone,
  Files,
  Truck,
  Store,
  Locate,
  Search,
  UserCog,
  Bell,
  CalendarClock,
  ArrowRight,
  FolderOpen,
  Layers,
  Share2,
  Settings,
  LayoutGrid,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  Info,
  Lightbulb,
  HelpCircle,
} from "lucide-react";
import { Cta } from "./Home/Components/Cta";

// Enhanced service feature data structure with guide books
const serviceFeatures = [
  {
    id: 1,
    icon: <FileUp size={32} strokeWidth={1.5} />,
    title: "Prescription Upload",
    description:
      "Securely upload and manage your prescriptions with professional pharmacist review.",
    color: "from-primary to-primary-hover",
    textColor: "text-primary-blue",
    bgColor: "bg-primary/5",
    guideBook: [
      "Ensure the prescription photo is clear and all text is readable.",
      "Use good lighting to avoid shadows or glare.",
      "Upload prescriptions in supported formats: JPG, PNG, PDF.",
      "Check your upload history to track submitted prescriptions.",
      "Contact support if you face issues with uploading.",
    ],
    steps: [
      {
        title: "Capture your prescription",
        description: "Take a clear photo or scan of your prescription",
        icon: <Camera size={20} />,
      },
      {
        title: "Upload to our secure platform",
        description:
          "Use our app or website to securely upload your prescription",
        icon: <Upload size={20} />,
      },
      {
        title: "Pharmacist verification",
        description: "Our pharmacists verify your prescription for accuracy",
        icon: <Shield size={20} />,
      },
      {
        title: "Ready for pharmacy matching",
        description:
          "Once verified, your prescription is ready to be matched with pharmacies",
        icon: <Check size={20} />,
      },
    ],
    benefits: [
      "HIPAA-compliant security",
      "Electronic prescription tracking",
      "Prescription history management",
      "Automatic refill reminders",
    ],
  },
  {
    id: 2,
    icon: <Target size={32} strokeWidth={1.5} />,
    title: "Pharmacy Finder",
    description:
      "Locate nearby pharmacies with real-time inventory and availability tracking.",
    color: "from-secondary to-secondary-hover",
    textColor: "text-secondary-green",
    bgColor: "bg-secondary/5",
    guideBook: [
      "Enable location services for accurate nearby pharmacy results.",
      "Use filters to narrow down pharmacies by services or ratings.",
      "Compare prices and availability before selecting a pharmacy.",
      "Read pharmacy reviews to ensure quality service.",
      "Save favorite pharmacies for quick access.",
    ],
    steps: [
      {
        title: "Enable location services",
        description: "Allow the app to use your location or enter your address",
        icon: <Locate size={20} />,
      },
      {
        title: "View nearby pharmacies",
        description:
          "See a map of pharmacies in your area with availability status",
        icon: <Map size={20} />,
      },
      {
        title: "Compare medication prices",
        description: "View price comparisons across multiple pharmacies",
        icon: <Search size={20} />,
      },
      {
        title: "Select your preferred pharmacy",
        description:
          "Choose the pharmacy that best meets your needs and budget",
        icon: <Store size={20} />,
      },
    ],
    benefits: [
      "Real-time inventory tracking",
      "Distance and driving directions",
      "Price comparison tools",
      "Pharmacy reviews and ratings",
    ],
  },
  {
    id: 3,
    icon: <UserPlus size={32} strokeWidth={1.5} />,
    title: "Family Profiles",
    description:
      "Create and manage medication profiles for your entire family in one place.",
    color: "from-accent to-accent-light",
    textColor: "text-accent-purple",
    bgColor: "bg-accent/5",
    guideBook: [
      "Create profiles for each family member with accurate medical info.",
      "Set permissions carefully to protect privacy.",
      "Use reminders to keep track of medication schedules.",
      "Update profiles regularly with new prescriptions or allergies.",
      "Share profiles with healthcare providers if needed.",
    ],
    steps: [
      {
        title: "Create individual profiles",
        description: "Set up separate profiles for each family member",
        icon: <UserPlus size={20} />,
      },
      {
        title: "Add medical information",
        description: "Enter allergies, conditions, and current medications",
        icon: <Files size={20} />,
      },
      {
        title: "Set access permissions",
        description: "Control who can view and manage each profile",
        icon: <UserCog size={20} />,
      },
      {
        title: "Set up medication reminders",
        description: "Create custom reminders for each family member",
        icon: <Bell size={20} />,
      },
    ],
    benefits: [
      "Centralized family medication management",
      "Simplified reordering for the whole family",
      "Medication interaction warnings",
      "Emergency access for healthcare providers",
    ],
  },
  {
    id: 4,
    icon: <ShoppingCart size={32} strokeWidth={1.5} />,
    title: "OTC Store",
    description:
      "Browse and purchase over-the-counter medications with home delivery options.",
    color: "from-primary-hover to-primary",
    textColor: "text-primary-blue",
    bgColor: "bg-primary/5",
    guideBook: [
      "Browse categories to find products suited to your needs.",
      "Read product details carefully before purchase.",
      "Check for bundle discounts and special offers.",
      "Choose delivery or pickup based on convenience.",
      "Track your orders and manage returns easily.",
    ],
    steps: [
      {
        title: "Browse OTC categories",
        description: "Explore products by category or health concern",
        icon: <LayoutGrid size={20} />,
      },
      {
        title: "View detailed product information",
        description: "See uses, dosage, ingredients and customer reviews",
        icon: <Layers size={20} />,
      },
      {
        title: "Add items to cart",
        description: "Select quantities and add products to your shopping cart",
        icon: <ShoppingCart size={20} />,
      },
      {
        title: "Choose delivery method",
        description: "Select home delivery or pickup from a local pharmacy",
        icon: <Truck size={20} />,
      },
    ],
    benefits: [
      "Curated health products",
      "Pharmacist-recommended items",
      "Bundle discounts",
      "Automatic reordering options",
    ],
  },
  {
    id: 5,
    icon: <Award size={32} strokeWidth={1.5} />,
    title: "Loyalty Points",
    description:
      "Earn and redeem rewards for purchases, referrals, and consistent medication adherence.",
    color: "from-secondary-hover to-secondary",
    textColor: "text-secondary-green",
    bgColor: "bg-secondary/5",
    guideBook: [
      "Earn points with every purchase and prescription fill.",
      "Refer friends to gain bonus points.",
      "Check your points balance regularly in the dashboard.",
      "Redeem points for discounts, free delivery, or premium features.",
      "Participate in promotional events to maximize rewards.",
    ],
    steps: [
      {
        title: "Earn points automatically",
        description:
          "Points are awarded for each purchase and prescription fill",
        icon: <Star size={20} />,
      },
      {
        title: "Get bonus points",
        description: "Earn extra points for referrals and medication adherence",
        icon: <Award size={20} />,
      },
      {
        title: "Track your rewards",
        description: "Monitor your points balance in the rewards dashboard",
        icon: <FolderOpen size={20} />,
      },
      {
        title: "Redeem for benefits",
        description:
          "Use points for discounts, free delivery, or premium features",
        icon: <Share2 size={20} />,
      },
    ],
    benefits: [
      "Points never expire",
      "Multiple earning opportunities",
      "Tiered rewards program",
      "Special promotional events",
    ],
  },
];

const Services = () => {
  const [activeFeature, setActiveFeature] = useState(1);
  const [hoveredCard, setHoveredCard] = useState(null);
  // expandedGuide is now an object keyed by feature id
  const [expandedGuide, setExpandedGuide] = useState({});
  const location = useLocation();

  // Helper to get the expanded guide for the current feature
  const getExpandedGuide = () => expandedGuide[activeFeature] ?? null;

  // Helper to set the expanded guide for the current feature
  const handleSetExpandedGuide = (guideIndex) => {
    setExpandedGuide((prev) => ({
      ...prev,
      [activeFeature]: prev[activeFeature] === guideIndex ? null : guideIndex,
    }));
  };

  // Optionally, reset expanded guide when activeFeature changes
  // useEffect(() => {
  //   setExpandedGuide(prev => ({ ...prev, [activeFeature]: null }));
  // }, [activeFeature]);

  const activeService = serviceFeatures.find((f) => f.id === activeFeature);
  useEffect(() => {
    // Handle URL hash for direct navigation
    if (location.hash) {
      const featureId = location.hash.replace("#feature-", "");
      if (/^\d+$/.test(featureId)) {
        const id = parseInt(featureId, 10);
        const featureExists = serviceFeatures.some((f) => f.id === id);
        if (featureExists) {
          setActiveFeature(id);
          // Scroll to the feature section
          setTimeout(() => {
            const featureSection = document.getElementById("feature-details");
            if (featureSection) {
              featureSection.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);
        }
      }
    }
  }, [location.hash]);
  return (
    <>
      <Navbar />
      {/* Hero Section with Enhanced Glassmorphism */}
      {/* Hero Section with Enhanced Glassmorphism and 3D Model */}
      <section className="relative overflow-hidden pt-20 pb-10">
        {/* Updated background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#030B17] via-[#0F172A] to-[#1E1B4B] -z-10"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up text-white">
                Comprehensive{" "}
                <span className="text-gradient-primary">Pharmacy Services</span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto lg:mx-0 mb-10 animate-fade-in-up delay-200">
                Discover how PillPath simplifies your pharmacy experience with
                powerful digital tools designed around your needs.
              </p>
              <div className="flex flex-wrap lg:justify-start justify-center gap-4 animate-fade-in-up delay-300">
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-hover text-white font-medium rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Explore Services
                  <ChevronRight size={18} />
                </a>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-xl text-white border border-white/30 font-medium rounded-2xl shadow-xl hover:bg-white/30 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* 3D Model Image */}
            <div className="hidden lg:flex justify-center lg:justify-end animate-fade-in-scale delay-500">
              <div className="relative">
                {/* Floating elements around image */}
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/30 rounded-full blur-xl animate-float-delay"></div>
                <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-accent/30 rounded-full blur-xl animate-float-gentle"></div>

                {/* Main 3D image */}
                <img
                  src={assets.granpa}
                  alt="Digital Pharmacy Services"
                  className="max-w-full h-auto object-contain filter drop-shadow-2xl float-animation"
                  style={{ maxHeight: "450px" }}
                />

                {/* Optional: Add a glow effect behind image */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-3xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full"
          >
            <path
              fill="rgba(255,255,255,0.05)"
              fillOpacity="1"
              d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,186.7C672,213,768,235,864,224C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>
      {/* Enhanced Services Overview with Glassmorphism Cards */}
      {/* Enhanced Services Overview with Dark Glassmorphism Cards */}
      <section
        id="features"
        className="py-20 px-4 bg-gradient-to-br from-[#030B17] via-[#0F172A] to-[#1E1B4B] relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-40"></div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up text-white">
              Our <span className="text-gradient-primary">Services</span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full mx-auto mb-6"></div>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              PillPath offers a comprehensive suite of services designed to make
              managing your medications simpler, safer, and more convenient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {serviceFeatures.map((feature) => (
              <div
                key={feature.id}
                className={`group p-6 rounded-2xl border transition-all duration-500 cursor-pointer bg-white/5 backdrop-blur-xl border-white/10 shadow-xl hover:shadow-2xl hover:translate-y-[-8px] relative overflow-hidden ${
                  activeFeature === feature.id
                    ? "border-white/20 bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)] translate-y-[-8px]"
                    : ""
                }`}
                onClick={() => setActiveFeature(feature.id)}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Glassmorphism background effects */}
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:opacity-80 transition-opacity duration-700"></div>
                <div className="absolute bottom-[-30px] left-[-30px] w-40 h-40 bg-secondary/10 rounded-full blur-2xl group-hover:opacity-80 transition-opacity duration-700"></div>

                <div className="flex items-start gap-4 relative z-10">
                  <div
                    className={`p-4 rounded-2xl transition-all duration-500 bg-gradient-to-br ${
                      feature.color
                    } text-white shadow-lg ${
                      hoveredCard === feature.id ? "scale-110" : "scale-100"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-bold mb-3 transition-all duration-300 ${
                        activeFeature === feature.id
                          ? feature.textColor
                          : "text-white"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-4">
                      {feature.description}
                    </p>

                    {/* Active indicator */}
                    {activeFeature === feature.id && (
                      <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        look for more details below
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Enhanced Detailed Feature Section with Dark Theme */}
      {activeService && (
        <section
          id="feature-details"
          className="py-20 px-4 relative overflow-hidden bg-gradient-to-br from-[#0A0E1A] via-[#1E1B4B] to-[#030B17]"
        >
          {/* Enhanced background effects */}
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-gradient-to-tl from-accent/20 to-transparent rounded-full blur-3xl"></div>

          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
              {/* Feature Overview - Enhanced */}
              <div className="xl:col-span-2">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/10 relative overflow-hidden">
                  {/* Card background effects */}
                  <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-[-30px] left-[-30px] w-48 h-48 bg-secondary/10 rounded-full blur-2xl"></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`p-4 rounded-2xl bg-gradient-to-br ${activeService.color} text-white shadow-lg`}
                      >
                        {activeService.icon}
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white">
                        {activeService.title}
                      </h2>
                    </div>

                    <p className="text-white/80 text-lg mb-8 leading-relaxed">
                      {activeService.description}
                    </p>

                    {/* Enhanced How It Works */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <Lightbulb className="text-primary" size={24} />
                        How It Works
                      </h3>

                      <div className="space-y-4">
                        {activeService.steps.map((step, index) => (
                          <div
                            key={index}
                            className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg"
                          >
                            {/* Step Number */}
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 bg-gradient-to-br ${activeService.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                            >
                              {index + 1}
                            </div>

                            {/* Step Icon */}
                            <div className="flex-shrink-0 mt-1">
                              <div className="p-2 rounded-lg bg-white/10 group-hover:scale-105 transition-transform duration-300">
                                {step.icon}
                              </div>
                            </div>

                            {/* Step Content */}
                            <div className="flex-1">
                              <h4 className="font-bold mb-2 text-white text-lg">
                                {step.title}
                              </h4>
                              <p className="text-white/70 leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Benefits */}
                    <div className="mb-8">
                      <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                        <Star className="text-primary" size={20} />
                        Key Benefits
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {activeService.benefits.map((benefit, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                          >
                            <div
                              className={`p-1 rounded-full bg-gradient-to-br ${activeService.color} text-white mt-1 flex-shrink-0`}
                            >
                              <Check size={14} />
                            </div>
                            <span className="text-white/90 font-medium">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <Link
                        to="/register"
                        className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${activeService.color} text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105`}
                      >
                        Try It Now
                        <ArrowRight size={18} />
                      </Link>
                      <a
                        href="#demo-video"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-xl text-white border border-white/20 font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300"
                      >
                        Watch Demo
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Guide Book Sidebar */}
              <div className="xl:col-span-1">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/10 sticky top-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                    <BookOpen className="text-primary" size={24} />
                    Quick Guide
                  </h3>

                  <div className="space-y-3 mb-6">
                    {activeService.guideBook.map((tip, index) => (
                      <div
                        key={index}
                        className="group p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                        onClick={() => handleSetExpandedGuide(index)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 bg-gradient-to-br ${activeService.color}`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-white/90 font-medium leading-relaxed">
                              {tip}
                            </p>
                          </div>
                          <ChevronDown
                            size={16}
                            className={`text-white/60 transition-transform duration-300 ${
                              getExpandedGuide() === index ? "rotate-180" : ""
                            }`}
                          />
                        </div>

                        {getExpandedGuide() === index && (
                          <div className="mt-3 pt-3 border-t border-white/20 animate-fade-in">
                            <p className="text-white/70 text-sm">
                              Pro tip: This feature helps ensure the best
                              experience with our platform.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Help Section */}
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle className="text-primary" size={20} />
                      <h4 className="font-bold text-white">Need Help?</h4>
                    </div>
                    <p className="text-white/70 text-sm mb-3">
                      Our support team is here to help you get the most out of{" "}
                      {activeService.title}.
                    </p>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      <MessageSquare size={16} />
                      Contact Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* Enhanced FAQ Section with Dark Theme */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#1E1B4B] via-[#0F172A] to-[#030B17] relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-40"></div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Frequently Asked{" "}
              <span className="text-gradient-primary">Questions</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-4"></div>
            <p className="text-white/70">
              Find answers to common questions about our services
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Is PillPath available nationwide?",
                answer:
                  "Yes, PillPath is available across Sri Lanka, partnering with hundreds of pharmacies nationwide to provide our services.",
              },
              {
                question:
                  "How secure is my prescription and medical information?",
                answer:
                  "PillPath employs HIPAA-compliant security measures, including end-to-end encryption, secure servers, and strict access controls to protect your sensitive medical information.",
              },
              {
                question: "Can I use PillPath for my entire family?",
                answer:
                  "Absolutely! Our Family Profiles feature allows you to manage medications for your entire family from a single account, with appropriate privacy controls.",
              },
              {
                question: "How do I earn loyalty points?",
                answer:
                  "You earn points automatically with every prescription fill, OTC purchase, and by maintaining medication adherence. Bonus points are awarded for referrals and participating in health initiatives.",
              },
              {
                question: "Is there a membership fee to use PillPath?",
                answer:
                  "PillPath's basic services are completely free. We offer premium features through a subscription plan, but our core prescription management and pharmacy finder services have no fees.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-xl hover:bg-white/10 transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-3 text-white flex items-start gap-2">
                  <HelpCircle
                    className="text-primary mt-1 flex-shrink-0"
                    size={20}
                  />
                  {faq.question}
                </h3>
                <p className="text-white/80 leading-relaxed pl-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/70 mb-4">Still have questions?</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-hover text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Contact Us
              <MessageSquare size={18} />
            </Link>
          </div>
        </div>
      </section>{" "}
      <Benefits />
      <TrustSafety />
      {/* Enhanced CTA Section */}
      <Cta></Cta>
    </>
  );
};

export default Services;
