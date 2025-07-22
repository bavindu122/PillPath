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
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const scrollContainerRef = useRef(null);
  const duplicatedProducts = [...otcProducts, ...otcProducts];

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const cardWidth = 240;
        const maxScroll = cardWidth * otcProducts.length;

        setCurrentIndex((prevIndex) => {
          let nextIndex = prevIndex + 1;
          if (container.scrollLeft >= maxScroll - cardWidth) {
            container.scrollLeft = 0;
            nextIndex = 0;
          } else {
            container.scrollBy({
              left: cardWidth,
              behavior: "smooth",
            });
          }
          return nextIndex;
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [otcProducts.length]);

  const handlePrevClick = () => {
    if (scrollContainerRef.current) {
      setIsAutoScrolling(false);
      const cardWidth = 240;
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: "smooth",
      });
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
      setTimeout(() => setIsAutoScrolling(true), 5000);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/otc-product/${productId}`);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/otc-category/${categoryId}`);
  };

  const handleFindStoresClick = (e, productId) => {
    e.stopPropagation(); // Prevent triggering the product click
    navigate(`/product-stores/${productId}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={12} className="fill-green-400 text-green-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          size={12}
          className="fill-green-400/50 text-green-400"
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
  const toggleCategories = () => {
    setIsCategoriesExpanded(!isCategoriesExpanded);
  };
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Dark background matching Statistics */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#030B17] via-[#0F172A] to-[#1E1B4B]"></div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        <div className="particles-container">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 animate-float-random"
              style={{
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 15 + 8}s`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-blue-500/10 rotate-45 opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full border-4 border-purple-500/10 -rotate-12 opacity-20"></div>
      <div className="absolute top-1/2 left-0 w-64 h-64 -translate-y-1/2 rounded-full radial-pulse-accent opacity-10"></div>

      {/* Floating Medical Icons */}
      <div className="absolute top-28 right-1/4 transform rotate-12 opacity-20">
        <Pill className="w-8 h-8 text-white animate-float-gentle" />
      </div>
      <div className="absolute bottom-40 left-1/3 transform -rotate-12 opacity-15">
        <Package className="w-6 h-6 text-green-400 animate-float-delay" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header matching Statistics style */}
        <div className="text-center mb-12">
          <h6 className="text-green-400 uppercase tracking-wider text-sm font-semibold mb-2 animate-fade-in-up">
            Our Products
          </h6>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up text-shadow-sm">
            <span className="text-gradient-primary">Shop</span>{" "}
            <span className="text-white">By Category</span>
          </h2>

          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-full mx-auto mb-4"></div>

          <p className="text-white text-base max-w-2xl mx-auto animate-fade-in-up delay-200">
            Find exactly what you need with our organized categories and
            featured products
          </p>
        </div>

        {/* Categories Section with darker theme styling */}
        <div className="mb-16">
          {/* Mobile Categories Header - Only visible on mobile */}
          <div className="block sm:hidden mb-6">
            <button
              onClick={toggleCategories}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold">Browse Categories</h3>
                  <p className="text-xs text-gray-300">
                    {otcCategories.length} categories available
                  </p>
                </div>
              </div>

              {/* Animated Arrow */}
              <div
                className={`transition-transform duration-300 ${
                  isCategoriesExpanded ? "rotate-180" : ""
                }`}
              >
                <ChevronRight className="w-5 h-5 text-white group-hover:text-blue-400" />
              </div>
            </button>
          </div>

          {/* Categories Grid */}
          <div
            className={`
              grid gap-6
              
              /* Desktop - Always visible, 6 columns */
              sm:grid-cols-6 sm:opacity-100 sm:max-h-none sm:overflow-visible
              
              /* Mobile - Collapsible behavior */
              grid-cols-2
              transition-all duration-500 ease-in-out
              ${
                isCategoriesExpanded
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden sm:opacity-100 sm:max-h-none sm:overflow-visible"
              }
            `}
          >
            {otcCategories.map((category, index) => (
              <div
                key={category.id}
                className={`
                  animate-fade-in-up delay-${(index + 1) * 100} 
                  rounded-xl bg-white/10 backdrop-blur-md border border-white/10 
                  p-3 sm:p-4 text-center hover:shadow-xl transition-all duration-500 
                  hover:-translate-y-2 group relative overflow-hidden cursor-pointer
                  ${
                    hoveredCategory === category.id
                      ? "border-blue-500/50 bg-white/20 shadow-blue-500/20"
                      : "hover:bg-white/20 hover:shadow-2xl"
                  }
                `}
                onClick={() => handleCategoryClick(category.id)}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={{
                  // Add staggered animation for mobile expansion
                  transitionDelay: isCategoriesExpanded
                    ? `${index * 100}ms`
                    : "0ms",
                }}
              >
                {/* Glass highlight effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon container - Responsive sizing */}
                <div
                  className={`
                  w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl 
                  bg-gradient-to-br from-blue-500 to-blue-600 
                  flex items-center justify-center text-white 
                  mb-2 sm:mb-3 group-hover:scale-110 transition-all duration-300 
                  shadow-lg relative z-10
                `}
                >
                  <div className="scale-75 sm:scale-100">{category.icon}</div>
                </div>

                {/* Category name - Responsive text */}
                <h4 className="text-xs sm:text-sm font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors duration-300 relative z-10 leading-tight">
                  {category.name}
                </h4>

                {/* Description - Hidden on mobile for space */}
                <p className="hidden sm:block text-gray-300 text-xs mb-2 relative z-10">
                  {category.description}
                </p>

                {/* Count */}
                <span className="text-xs text-green-400 font-medium relative z-10">
                  {category.count}
                </span>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 group-hover:w-full transition-all duration-700"></div>
              </div>
            ))}
          </div>

          {/* Mobile Categories Footer - Only visible when expanded */}
          <div
            className={`
              block sm:hidden mt-4 transition-all duration-300
              ${
                isCategoriesExpanded
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }
            `}
          >
            <div className="text-center">
              <button
                onClick={toggleCategories}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white text-sm hover:bg-white/20 transition-all duration-300"
              >
                Show Less
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Products Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-10">
            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-3 text-shadow-sm tracking-tight">
                Featured Products
              </h3>
              <p className="text-gray-300 text-sm font-medium">
                Popular medications at{" "}
                <span className="text-green-400 font-semibold">
                  unbeatable prices
                </span>
              </p>
              <div className="w-12 h-0.5 bg-blue-500 mt-3 rounded-full"></div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevClick}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                aria-label="Previous product"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={handleNextClick}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                aria-label="Next product"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Cards */}
        <div className="relative mb-12">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
          >
            {duplicatedProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className={`group cursor-pointer flex-shrink-0 w-64 transition-all duration-500 ${
                  hoveredProduct === product.id ? "scale-105 z-10" : ""
                }`}
                onClick={() => handleProductClick(product.id)}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/10 p-4 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden h-full">
                  {/* Glass highlight effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Product Image */}
                  <div className="flex justify-center mb-4">
                    <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20 transition-all duration-300 group-hover:scale-105">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="text-center space-y-2 relative z-10">
                    <span className="text-xs text-green-400 font-medium">
                      {product.category}
                    </span>

                    <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                      {product.name}
                    </h3>

                    <p className="text-gray-300 text-xs leading-snug line-clamp-2 h-8">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-1">
                      {renderStars(product.rating)}
                      <span className="text-xs text-gray-400 ml-1">
                        ({product.rating})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">From</span>
                      <span className="text-lg font-bold text-white">
                        {product.price}
                      </span>
                    </div>

                    {/* Button */}
                    <button
                      onClick={(e) => handleFindStoresClick(e, product.id)}
                      className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl transition-all duration-300 text-xs ${
                        hoveredProduct === product.id
                          ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      <ShoppingCart size={14} />
                      Find Stores
                      <ChevronRight size={12} />
                    </button>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 group-hover:w-full transition-all duration-700"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Auto-scroll indicator */}
          <div className="flex justify-center mt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 shadow-lg">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isAutoScrolling
                      ? "bg-blue-500 animate-pulse"
                      : "bg-white/40"
                  }`}
                ></div>
                <span className="text-xs text-gray-300">
                  {isAutoScrolling ? "Auto-scrolling" : "Paused"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl">
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
