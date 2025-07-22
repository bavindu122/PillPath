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
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  MapPin,
  Clock,
  Truck,
  Award,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/Layout/Navbar";
import { assets } from "../assets/assets";

// Import your actual images
import allergyReliefImg from "../assets/img/meds/allergy_relief.jpg";
import antacidImg from "../assets/img/meds/Antacid.jpg";
import coughSyrupImg from "../assets/img/meds/cough_syrup.jpg";
import ibuprofenImg from "../assets/img/meds/Ibuprofen.jpg";
import panadolImg from "../assets/img/meds/Panadol.jpg";
import paracetamolImg from "../assets/img/meds/paracetamol.webp";
import vitaminCImg from "../assets/img/meds/Vitamin_c.jpg";

const otcCategories = [
  {
    id: 1,
    name: "Pain Relief",
    description: "Headaches, muscle pain, fever relief",
    icon: <Thermometer size={18} />,
    count: "25+",
    color: "from-red-500 to-orange-500",
  },
  {
    id: 2,
    name: "Cold & Flu",
    description: "Cough, congestion, sore throat",
    icon: <Shield size={18} />,
    count: "18+",
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: 3,
    name: "Digestive Health",
    description: "Antacids, stomach relief",
    icon: <Heart size={18} />,
    count: "15+",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    name: "Vitamins",
    description: "Daily nutrition, supplements",
    icon: <Zap size={18} />,
    count: "30+",
    color: "from-yellow-500 to-amber-500",
  },
  {
    id: 5,
    name: "Allergy Relief",
    description: "Seasonal allergies, antihistamines",
    icon: <Sun size={18} />,
    count: "12+",
    color: "from-purple-500 to-violet-500",
  },
  {
    id: 6,
    name: "Skin Care",
    description: "Topical treatments, creams",
    icon: <Droplets size={18} />,
    count: "20+",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 7,
    name: "Eye Care",
    description: "Eye drops, vision support",
    icon: <Eye size={18} />,
    count: "8+",
    color: "from-cyan-500 to-teal-500",
  },
  {
    id: 8,
    name: "First Aid",
    description: "Bandages, antiseptics",
    icon: <Activity size={18} />,
    count: "16+",
    color: "from-indigo-500 to-blue-600",
  },
];

const otcProducts = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    description: "Fast-acting pain reliever and fever reducer",
    image: paracetamolImg,
    rating: 4.5,
    price: "Rs.8.99",
    originalPrice: "Rs.12.99",
    category: "Pain Relief",
    inStock: true,
    discount: "31%",
    brand: "Generic",
  },
  {
    id: 2,
    name: "Ibuprofen 200mg",
    description: "Anti-inflammatory pain relief for muscles and joints",
    image: ibuprofenImg,
    rating: 4.3,
    price: "Rs.12.99",
    originalPrice: "Rs.15.99",
    category: "Pain Relief",
    inStock: true,
    discount: "19%",
    brand: "Advil",
  },
  {
    id: 3,
    name: "Vitamin C 1000mg",
    description: "Immune system support with antioxidants",
    image: vitaminCImg,
    rating: 4.7,
    price: "Rs.15.99",
    originalPrice: "Rs.19.99",
    category: "Vitamins",
    inStock: true,
    discount: "20%",
    brand: "Nature Made",
  },
  {
    id: 4,
    name: "Cough Syrup",
    description: "Relieves persistent cough and throat irritation",
    image: coughSyrupImg,
    rating: 4.2,
    price: "Rs.9.99",
    originalPrice: "Rs.13.99",
    category: "Cold & Flu",
    inStock: true,
    discount: "29%",
    brand: "Robitussin",
  },
  {
    id: 5,
    name: "Antacid Tablets",
    description: "Fast relief from heartburn and indigestion",
    image: antacidImg,
    rating: 4.4,
    price: "Rs.7.99",
    originalPrice: "Rs.10.99",
    category: "Digestive",
    inStock: false,
    discount: "27%",
    brand: "Tums",
  },
  {
    id: 6,
    name: "Allergy Relief 24hr",
    description: "Long-lasting relief from seasonal allergies",
    image: allergyReliefImg,
    rating: 4.6,
    price: "Rs.14.99",
    originalPrice: "Rs.18.99",
    category: "Allergy",
    inStock: true,
    discount: "21%",
    brand: "Claritin",
  },
];

const features = [
  {
    icon: <Shield size={24} />,
    title: "FDA Approved",
    description: "All medications are FDA approved and safe",
  },
  {
    icon: <Truck size={24} />,
    title: "Fast Delivery",
    description: "Same-day delivery available in most areas",
  },
  {
    icon: <Award size={24} />,
    title: "Best Prices",
    description: "Competitive pricing with frequent discounts",
  },
  {
    icon: <Phone size={24} />,
    title: "24/7 Support",
    description: "Pharmacist consultation available anytime",
  },
];

const Otc = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Auto-scroll for featured products
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const cardWidth = 280;
        const maxScroll = cardWidth * otcProducts.length;

        if (container.scrollLeft >= maxScroll - cardWidth) {
          container.scrollLeft = 0;
          setCurrentIndex(0);
        } else {
          container.scrollBy({
            left: cardWidth,
            behavior: "smooth",
          });
          setCurrentIndex((prev) => prev + 1);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/otc-product/${productId}`);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
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

  const filteredProducts = otcProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030B17] via-[#0F172A] to-[#1E1B4B] relative overflow-hidden">
      <Navbar />

      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* Floating particles */}
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 animate-float-random"
              style={{
                width: `${Math.random() * 6 + 3}px`,
                height: `${Math.random() * 6 + 3}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 20 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Large floating elements */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-500/5 animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-green-500/5 animate-float-delay"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-purple-500/5 animate-float-gentle"></div>

        {/* Medical icons */}
        <div className="absolute top-32 right-1/4 transform rotate-12 opacity-10">
          <Pill className="w-12 h-12 text-white animate-float-gentle" />
        </div>
        <div className="absolute bottom-40 left-1/3 transform -rotate-12 opacity-10">
          <Package className="w-10 h-10 text-green-400 animate-float-delay" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-500/30">
                  <CheckCircle size={16} />
                  Over-the-Counter Medications
                </div>

                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  <span className="text-white">Your Health,</span>
                  <br />
                  <span className="text-gradient-primary">Our Priority</span>
                </h1>

                <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                  Discover a wide range of trusted over-the-counter medications,
                  vitamins, and health products. Quality healthcare solutions
                  delivered to your doorstep.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">200+</div>
                  <div className="text-gray-400 text-sm">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">50+</div>
                  <div className="text-gray-400 text-sm">Brands</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">24/7</div>
                  <div className="text-gray-400 text-sm">Support</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  <ShoppingCart size={20} />
                  Start Shopping
                  <ArrowRight size={16} />
                </button>
                <button 
                onClick={() => navigate("/find-pharmacy")}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300">
                  <MapPin size={20} />
                  Find Nearby Pharmacy
                </button>
              </div>
            </div>

            {/* Right Content - Granny Image */}
            <div className="relative animate-fade-in-up delay-300">
              <div className="relative z-10">
                {/* Main Image Container */}
                <div className="relative">
                  <img
                    src={assets.otc}
                    alt="Happy customer shopping for OTC medications"
                    className="w-full max-w-lg mx-auto "
                  />

                  {/* Floating Elements Around Image */}
                  <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-float-gentle">
                    <Pill className="w-6 h-6 text-white" />
                  </div>

                  <div className="absolute -top-3 -right-8 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-float-delay">
                    <Heart className="w-8 h-8 text-white" />
                  </div>

                  <div className="absolute -bottom-4 -left-8 w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-float-slow">
                    <Shield className="w-7 h-7 text-white" />
                  </div>

                  <div className="absolute -bottom-6 -right-6 w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg animate-float-gentle">
                    <Zap className="w-5 h-5 text-white" />
                  </div>

                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                    30% OFF
                  </div>
                </div>

                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-2xl blur-3xl -z-10 animate-pulse"></div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-1/4 -left-12 w-24 h-24 border-4 border-blue-500/20 rounded-full animate-spin-slow"></div>
              <div className="absolute bottom-1/4 -right-12 w-32 h-32 border-4 border-green-500/20 rounded-lg rotate-45 animate-float-gentle"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search medications, vitamins, or health products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {otcCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-blue-500 text-white"
                        : "bg-white/20 text-gray-400 hover:bg-white/30"
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-blue-500 text-white"
                        : "bg-white/20 text-gray-400 hover:bg-white/30"
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient-primary">Shop</span>{" "}
              <span className="text-white">By Category</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Find exactly what you need with our organized product categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {otcCategories.map((category, index) => (
              <div
                key={category.id}
                className={`
                  animate-fade-in-up delay-${(index + 1) * 100} 
                  rounded-xl bg-white/10 backdrop-blur-md border border-white/10 
                  p-6 text-center hover:shadow-xl transition-all duration-500 
                  hover:-translate-y-2 group relative overflow-hidden cursor-pointer
                  ${
                    hoveredCategory === category.id
                      ? "border-blue-500/50 bg-white/20 shadow-blue-500/20"
                      : "hover:bg-white/20 hover:shadow-2xl"
                  }
                `}
                onClick={() => handleCategoryClick(category.name)}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Glass highlight effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon container */}
                <div
                  className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg relative z-10`}
                >
                  {category.icon}
                </div>

                {/* Category name */}
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300 relative z-10">
                  {category.name}
                </h4>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-3 relative z-10">
                  {category.description}
                </p>

                {/* Count */}
                <span className="text-sm text-green-400 font-medium relative z-10">
                  {category.count} products
                </span>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 group-hover:w-full transition-all duration-700"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">
                Featured Products
              </h3>
              <p className="text-gray-300">
                Popular medications at{" "}
                <span className="text-green-400 font-semibold">
                  unbeatable prices
                </span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollBy({
                      left: -280,
                      behavior: "smooth",
                    });
                  }
                }}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollBy({
                      left: 280,
                      behavior: "smooth",
                    });
                  }
                }}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Products Scroll Container */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {otcProducts.map((product) => (
                <div
                  key={product.id}
                  className={`group cursor-pointer flex-shrink-0 w-72 transition-all duration-500 ${
                    hoveredProduct === product.id ? "scale-105 z-10" : ""
                  }`}
                  onClick={() => handleProductClick(product.id)}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/10 p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden h-full">
                    {/* Discount Badge */}
                    {product.discount && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                        -{product.discount}
                      </div>
                    )}


                    {/* Product Image */}
                    <div className="flex justify-center mb-6 mt-8">
                      <div className="w-40 h-40 bg-white/20 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 transition-all duration-300 group-hover:scale-105">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain rounded-lg"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-400 font-medium">
                          {product.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {product.brand}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                        {product.name}
                      </h3>

                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 h-10">
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(product.rating)}
                        </div>
                        <span className="text-sm text-gray-400">
                          ({product.rating})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-white">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <button
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                            product.inStock
                              ? hoveredProduct === product.id
                                ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg"
                                : "bg-white/20 text-white hover:bg-white/30"
                              : "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!product.inStock}
                        >
                          <ShoppingCart size={16} />
                          Buy Now
                        </button>
                        <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300">
                          <Heart size={16} className="text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Glass highlight effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 group-hover:w-full transition-all duration-700"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Why Choose PillPath?
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              We're committed to providing you with the best healthcare
              experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-all duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 backdrop-blur-md rounded-2xl border border-white/20 p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust PillPath for
              their healthcare needs. Start shopping today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300">
                <Phone size={20} />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Otc;