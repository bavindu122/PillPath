import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  ChevronRight,
  ChevronLeft,
  Heart,
  Shield,
  Thermometer,
  Zap,
  Sun,
  Droplets,
  Activity,
  Eye,
  Package,
  Pill,
} from "lucide-react";

// Import your actual images
import allergyReliefImg from "../../assets/img/meds/allergy_relief.jpg";
import antacidImg from "../../assets/img/meds/Antacid.jpg";
import coughSyrupImg from "../../assets/img/meds/cough_syrup.jpg";
import ibuprofenImg from "../../assets/img/meds/Ibuprofen.jpg";
import panadolImg from "../../assets/img/meds/Panadol.jpg";
import paracetamolImg from "../../assets/img/meds/paracetamol.webp";
import vitaminCImg from "../../assets/img/meds/Vitamin_c.jpg";

const otcCategories = [
  {
    id: 1,
    name: "Pain Relief",
    description: "Headaches, muscle pain",
    icon: <Thermometer size={18} />,
    count: "25+",
  },
  {
    id: 2,
    name: "Cold & Flu",
    description: "Cough, congestion",
    icon: <Shield size={18} />,
    count: "18+",
  },
  {
    id: 3,
    name: "Digestive Health",
    description: "Antacids, relief",
    icon: <Heart size={18} />,
    count: "15+",
  },
  {
    id: 4,
    name: "Vitamins",
    description: "Daily nutrition",
    icon: <Zap size={18} />,
    count: "30+",
  },
  {
    id: 5,
    name: "Allergy Relief",
    description: "Seasonal allergies",
    icon: <Sun size={18} />,
    count: "12+",
  },
  {
    id: 6,
    name: "Skin Care",
    description: "Topical treatments",
    icon: <Droplets size={18} />,
    count: "20+",
  },
];

const otcProducts = [
  {
    id: 1,
    name: "Paracetamol",
    description: "Pain reliever and fever reducer",
    image: paracetamolImg,
    rating: 4.5,
    price: "$8.99",
    category: "Pain Relief",
  },
  {
    id: 2,
    name: "Ibuprofen",
    description: "Anti-inflammatory pain relief",
    image: ibuprofenImg,
    rating: 4.3,
    price: "$12.99",
    category: "Pain Relief",
  },
  {
    id: 3,
    name: "Vitamin C",
    description: "Immune system support",
    image: vitaminCImg,
    rating: 4.7,
    price: "$15.99",
    category: "Vitamins",
  },
  {
    id: 4,
    name: "Cough Syrup",
    description: "Relieves cough and throat irritation",
    image: coughSyrupImg,
    rating: 4.2,
    price: "$9.99",
    category: "Cold & Flu",
  },
  {
    id: 5,
    name: "Antacid",
    description: "Relieves heartburn and indigestion",
    image: antacidImg,
    rating: 4.4,
    price: "$7.99",
    category: "Digestive",
  },
  {
    id: 6,
    name: "Allergy Relief",
    description: "Reduces allergy symptoms",
    image: allergyReliefImg,
    rating: 4.6,
    price: "$14.99",
    category: "Allergy",
  },
];

const OtcProducts = () => {
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollContainerRef = useRef(null);
  const autoScrollRef = useRef(null);
  const duplicatedProducts = [...otcProducts, ...otcProducts];
  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling) return;

    autoScrollRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const cardWidth = 240; // w-56 + gap
        const maxScroll = cardWidth * otcProducts.length;

        // If we've scrolled past the original set, reset to beginning
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        } else {
          container.scrollBy({
            left: cardWidth,
            behavior: "smooth",
          });
        }
      }
    }, 2000);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isAutoScrolling]);

  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = 280;
      const scrollPosition = index * cardWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handlePrevClick = () => {
    if (scrollContainerRef.current) {
      setIsAutoScrolling(false);
      const cardWidth = 240;
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: "smooth",
      });
      // Resume auto-scroll after 5 seconds
      setTimeout(() => setIsAutoScrolling(true), 3000);
    }
  };

  const handleNextClick = () => {
    if (scrollContainerRef.current) {
      setIsAutoScrolling(false);
      const cardWidth = 240;
      const container = scrollContainerRef.current;
      const maxScroll = cardWidth * otcProducts.length;

      if (container.scrollLeft >= maxScroll) {
        container.scrollLeft = 0;
      } else {
        container.scrollBy({
          left: cardWidth,
          behavior: "smooth",
        });
      }
      // Resume auto-scroll after 5 seconds
      setTimeout(() => setIsAutoScrolling(true), 5000);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/otc-product/${productId}`);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/otc-category/${categoryId}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={12} className="fill-secondary text-secondary" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          size={12}
          className="fill-secondary/50 text-secondary"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={12} className="text-white/40" />
      );
    }

    return stars;
  };

  return (
    <section className="py-12 px-4 relative overflow-hidden">
      {/* Enhanced Multi-layer Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-hover to-accent opacity-90"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-accent/30 via-transparent to-accent/20"></div>

      {/* Animated Floating Orbs */}
      <div className="absolute top-[-60px] right-[-40px] w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-[-80px] left-[-60px] w-[28rem] h-[28rem] bg-primary/25 rounded-full blur-3xl animate-float-delay"></div>
      <div className="absolute top-1/3 left-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float-gentle"></div>
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-float-slow"></div>

      {/* Additional Depth Layers */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float-gentle"></div>
      <div className="absolute bottom-1/3 left-2/3 w-56 h-56 bg-accent/10 rounded-full blur-2xl animate-float-delay"></div>

      {/* Medical Pattern Overlay */}
      <div className="absolute inset-0 medical-pattern opacity-10"></div>

      {/* Geometric Shapes for Visual Interest */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-white/20 rotate-45 animate-pulse"></div>
      <div className="absolute top-40 right-32 w-3 h-3 bg-secondary/30 rotate-12 animate-bounce"></div>
      <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-accent/40 rounded-full animate-ping"></div>
      <div className="absolute bottom-48 right-20 w-5 h-5 bg-white/15 rotate-45 animate-pulse"></div>

      {/* Floating Medical Icons */}
      <div className="absolute top-28 right-1/4 transform rotate-12 opacity-20">
        <Pill className="w-8 h-8 text-white animate-float-gentle" />
      </div>
      <div className="absolute bottom-40 left-1/3 transform -rotate-12 opacity-15">
        <Package className="w-6 h-6 text-secondary animate-float-delay" />
      </div>
      <div className="absolute top-1/2 right-16 transform rotate-45 opacity-10">
        <Heart className="w-7 h-7 text-accent animate-float-slow" />
      </div>
      <div className="absolute bottom-20 left-16 transform -rotate-30 opacity-20">
        <Shield className="w-5 h-5 text-primary animate-float-gentle" />
      </div>

      {/* Enhanced Glass Edge Highlights */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
      <div className="absolute left-0 top-[10%] bottom-[10%] w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
      <div className="absolute right-0 top-[15%] bottom-[15%] w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Light Rays Effect */}
      <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-white/30 to-transparent rotate-12 animate-pulse"></div>
      <div className="absolute top-0 right-1/3 w-px h-40 bg-gradient-to-b from-white/20 to-transparent -rotate-12 animate-pulse"></div>
      <div className="absolute bottom-0 left-1/3 w-px h-28 bg-gradient-to-t from-white/25 to-transparent rotate-6 animate-pulse"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Clean Header */}

        {/* Clean Categories Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up text-shadow-sm">
              <span className="text-gradient-secondary">Shop</span>{" "}
              <span className="text-white">By Category</span>
            </h2>
            <p className="text-muted text-lg md:text-sm font-medium">
              Find exactly what you need with our organized categories
            </p>
            <div className="w-16 h-0.5 bg-secondary mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 max-[100px]:grid-cols-1 sm:grid-cols-6 gap-4">
            {otcCategories.map((category) => (
              <div
                className={`relative bg-white/15 backdrop-blur-xl rounded-2xl shadow-xl border overflow-hidden transition-all duration-500 p-4 min-h-[40px] flex flex-col justify-center ${
                  hoveredCategory === category.id
                    ? "border-primary/50 bg-white/20 shadow-primary/20"
                    : "border-white/20 hover:bg-white/20 hover:shadow-2xl"
                }`}
                onClick={() => handleCategoryClick(category.id)}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Background Blurs */}
                <div className="absolute top-[-20px] right-[-15px] w-32 h-32 bg-primary/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700"></div>

                {/* Glass edge highlights */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30"></div>
                <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-black/5"></div>

                <div className="relative z-10 flex flex-row gap-4 items-center sm:gap-3 h-full">
                  {" "}
                  {/* Icon */}
                  <div
                    className={`inline-flex p-2 rounded-lg mb-2 sm:mb-0 transition-all duration-300 ${
                      hoveredCategory === category.id
                        ? "bg-primary text-accent-purple shadow-md scale-110"
                        : "bg-white/20 text-secondary-green"
                    }`}
                  >
                    {category.icon}
                  </div>
                  {/* Info */}
                  <div className="flex flex-row sm:flex-col gap-4 items-center sm:items-start">
                    <div>
                      <h4
                        className={`font-semibold text-xs mb-1 ${
                          hoveredCategory === category.id
                            ? "text-accent-purple"
                            : "text-secondary-green"
                        }`}
                      >
                        {category.name}
                      </h4>
                      <p className="text-light text-xs mb-1">
                        {category.description}
                      </p>
                    </div>
                    <div >
                      <span className="flex text-xs text-muted font-medium">
                        {category.count}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-10">
            <div className="relative">
              <h3 className="text-3xl md:text-2xl font-bold text-light mb-3 text-shadow-sm tracking-tight">
                Featured Products
              </h3>
              <p className="text-dark text-lg md:text-sm font-medium">
                Popular medications at
                <span className="text-secondary-green font-semibold">
                  {" "}
                  unbeatable prices
                </span>
              </p>
              <div className="w-12 h-0.5 bg-primary mt-3 rounded-full"></div>
            </div>

            {/* Clean Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevClick}
                className="p-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                aria-label="Previous product"
              >
                <ChevronLeft size={20} className="text-light" />
              </button>
              <button
                onClick={handleNextClick}
                className="p-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                aria-label="Next product"
              >
                <ChevronRight size={20} className="text-light" />
              </button>
            </div>
          </div>
        </div>

        {/* Clean Product Cards */}
        <div className="relative mb-12">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
          >
            {duplicatedProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className={`group cursor-pointer flex-shrink-0 w-56 transition-all duration-500 ${
                  hoveredProduct === product.id ? "scale-105 z-10" : ""
                }`}
                onClick={() => handleProductClick(product.id)}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div
                  className={`relative h-full bg-white/15 backdrop-blur-xl rounded-2xl shadow-xl border overflow-hidden transition-all duration-500 p-3 ${
                    hoveredProduct === product.id
                      ? "border-primary/50 bg-white/20 shadow-primary/20"
                      : "border-white/20 hover:bg-white/20 hover:shadow-2xl"
                  }`}
                >
                  {/* Background Effects */}
                  <div className="absolute top-[-20px] right-[-15px] w-32 h-32 bg-primary/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700"></div>

                  {/* Glass edge highlights */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30"></div>
                  <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-black/5"></div>

                  {/* Product Image - Larger and more prominent */}
                  <div className="flex justify-center mb-3">
                    <div className="w-36 h-36 bg-white/40 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20 transition-all duration-300 group-hover:scale-105">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Compact Product Info */}
                  <div className="text-center space-y-2 flex-grow">
                    <span className="text-xs text-secondary-green font-medium">
                      {product.category}
                    </span>

                    <h3 className="text-sm font-bold text-light truncate">
                      {product.name}
                    </h3>

                    <p className="text-light/70 text-xs leading-snug line-clamp-2 h-8">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-1">
                      {renderStars(product.rating)}
                      <span className="text-xs text-muted ml-1">
                        ({product.rating})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">From</span>
                      <span className="text-lg font-bold text-light">
                        {product.price}
                      </span>
                    </div>

                    {/* Button */}
                    <button
                      className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl transition-all duration-300 text-xs ${
                        hoveredProduct === product.id
                          ? "bg-primary text-white shadow-lg shadow-primary/30"
                          : "bg-white/20 text-light hover:bg-white/30"
                      }`}
                    >
                      <ShoppingCart size={14} />
                      Find Stores
                      <ChevronRight
                        size={12}
                        className={`transition-transform duration-300 ${
                          hoveredProduct === product.id ? "translate-x-1" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Auto-scroll indicator */}
          <div className="flex justify-center mt-6">
            <div className="bg-white/15 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 shadow-lg">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isAutoScrolling ? "bg-primary animate-pulse" : "bg-white/40"
                  }`}
                ></div>
                <span className="text-xs text-light/70">
                  {isAutoScrolling ? "Auto-scrolling" : "Paused"}
                </span>
              </div>
            </div>
          </div>

          {/* Clean Scroll Indicators */}
        </div>

        {/* Clean Call to Action */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-secondary to-primary text-white font-medium rounded-xl hover:from-secondary-hover hover:to-primary-hover transition-all duration-300 shadow-lg hover:shadow-xl">
            <ShoppingCart size={18} />
            Browse All Products
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default OtcProducts;
