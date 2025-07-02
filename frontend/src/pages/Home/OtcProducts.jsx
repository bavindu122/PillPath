import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Pill
} from 'lucide-react';

// Import your actual images
import allergyReliefImg from '../../assets/img/meds/allergy_relief.jpg';
import antacidImg from '../../assets/img/meds/Antacid.jpg';
import coughSyrupImg from '../../assets/img/meds/cough_syrup.jpg';
import ibuprofenImg from '../../assets/img/meds/Ibuprofen.jpg';
import panadolImg from '../../assets/img/meds/Panadol.jpg';
import paracetamolImg from '../../assets/img/meds/paracetamol.webp';
import vitaminCImg from '../../assets/img/meds/Vitamin_c.jpg';

const otcCategories = [
  {
    id: 1,
    name: 'Pain Relief',
    description: 'Headaches, muscle pain',
    icon: <Thermometer size={18} />,
    count: '25+'
  },
  {
    id: 2,
    name: 'Cold & Flu',
    description: 'Cough, congestion',
    icon: <Shield size={18} />,
    count: '18+'
  },
  {
    id: 3,
    name: 'Digestive Health',
    description: 'Antacids, relief',
    icon: <Heart size={18} />,
    count: '15+'
  },
  {
    id: 4,
    name: 'Vitamins',
    description: 'Daily nutrition',
    icon: <Zap size={18} />,
    count: '30+'
  },
  {
    id: 5,
    name: 'Allergy Relief',
    description: 'Seasonal allergies',
    icon: <Sun size={18} />,
    count: '12+'
  },
  {
    id: 6,
    name: 'Skin Care',
    description: 'Topical treatments',
    icon: <Droplets size={18} />,
    count: '20+'
  }
];

const otcProducts = [
  { 
    id: 1, 
    name: 'Paracetamol', 
    description: 'Pain reliever and fever reducer', 
    image: paracetamolImg,
    rating: 4.5,
    price: '$8.99',
    category: 'Pain Relief'
  },
  { 
    id: 2, 
    name: 'Ibuprofen', 
    description: 'Anti-inflammatory pain relief', 
    image: ibuprofenImg,
    rating: 4.3,
    price: '$12.99',
    category: 'Pain Relief'
  },
  { 
    id: 3, 
    name: 'Vitamin C', 
    description: 'Immune system support', 
    image: vitaminCImg,
    rating: 4.7,
    price: '$15.99',
    category: 'Vitamins'
  },
  { 
    id: 4, 
    name: 'Cough Syrup', 
    description: 'Relieves cough and throat irritation', 
    image: coughSyrupImg,
    rating: 4.2,
    price: '$9.99',
    category: 'Cold & Flu'
  },
  { 
    id: 5, 
    name: 'Antacid', 
    description: 'Relieves heartburn and indigestion', 
    image: antacidImg,
    rating: 4.4,
    price: '$7.99',
    category: 'Digestive'
  },
  { 
    id: 6, 
    name: 'Allergy Relief', 
    description: 'Reduces allergy symptoms', 
    image: allergyReliefImg,
    rating: 4.6,
    price: '$14.99',
    category: 'Allergy'
  }
];

const OtcProducts = () => {
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const scrollContainerRef = useRef(null);
  const autoScrollRef = useRef(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling) return;

    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % otcProducts.length;
        scrollToIndex(nextIndex);
        return nextIndex;
      });
    }, 4000);

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
        behavior: 'smooth'
      });
    }
  };

  const handlePrevClick = () => {
    setIsAutoScrolling(false);
    const newIndex = currentIndex === 0 ? otcProducts.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  const handleNextClick = () => {
    setIsAutoScrolling(false);
    const newIndex = (currentIndex + 1) % otcProducts.length;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
    setTimeout(() => setIsAutoScrolling(true), 5000);
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
        <Star key="half" size={12} className="fill-secondary/50 text-secondary" />
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
      {/* Clean background with stronger gradients for glass effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary-hover"></div>
      
      {/* Background blurs like RoleSelector */}
      <div className="absolute top-[-40px] right-[-30px] w-64 h-64 bg-secondary/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-[-50px] left-[-40px] w-80 h-80 bg-primary/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-accent/15 rounded-full blur-2xl"></div>
      
      {/* Glass edge highlights */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30"></div>
      <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-black/5"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Clean Header */}
        <div className="text-center mb-12">
          <div className="relative">
            {/* Glass edge highlights */}
            
            
            <h2 className="text-2xl md:text-3xl font-bold text-light mb-4">
              Over-the-Counter Products
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-secondary to-primary mx-auto mb-4 rounded-full"></div>
            <p className="text-light/80 max-w-xl mx-auto">
              Browse our selection of OTC medications and health products
            </p>
          </div>
        </div>

        {/* Clean Categories Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-light mb-2">
              Shop by Category
            </h3>
            <p className="text-light/30">
              Find what you need quickly
            </p>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {otcCategories.map((category) => (
              <div
                key={category.id}
                className={`group cursor-pointer transition-all duration-500 ${
                  hoveredCategory === category.id ? 'scale-105' : ''
                }`}
                onClick={() => handleCategoryClick(category.id)}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className={`relative bg-white/15 backdrop-blur-xl rounded-2xl shadow-xl border overflow-hidden transition-all duration-500 p-4 ${
                  hoveredCategory === category.id
                    ? 'border-primary/50 bg-white/20 shadow-primary/20'
                    : 'border-white/20 hover:bg-white/20 hover:shadow-2xl'
                }`}>
                  {/* Background Blurs */}
                  <div className="absolute top-[-20px] right-[-15px] w-32 h-32 bg-primary/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700"></div>
                  
                  {/* Glass edge highlights */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30"></div>
                  <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-black/5"></div>

                  <div className="text-center relative z-10">
                    <div className={`inline-flex p-2 rounded-lg mb-2 transition-all duration-300 ${
                      hoveredCategory === category.id 
                        ? 'bg-primary text-accent-purple shadow-md scale-110' 
                        : 'bg-white/20 text-secondary-green'
                    }`}>
                      {category.icon}
                    </div>

                    <h4 className={`font-semibold text-xs mb-1 ${hoveredCategory === category.id ? 'text-accent-purple' : 'text-secondary-green'}`}>

                      {category.name}
                    </h4>
                    <p className="text-light text-xs mb-1">
                      {category.description}
                    </p>
                    <span className="text-xs text-muted font-medium">
                      {category.count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="relative ">
              {/* Glass edge highlights */}
            
              
              <h3 className="text-xl font-bold text-light mb-1">
                Featured Products
              </h3>
              <p className="text-light/70 text-sm">
                Popular medications at competitive prices
              </p>
            </div>
            
            {/* Clean Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevClick}
                className="p-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Previous product"
              >
                <ChevronLeft size={18} className="text-light" />
              </button>
              <button
                onClick={handleNextClick}
                className="p-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Next product"
              >
                <ChevronRight size={18} className="text-light" />
              </button>
            </div>
          </div>
        </div>

        {/* Clean Product Cards */}
        <div className="relative mb-12">
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
          >
            {otcProducts.map((product) => (
              <div
                key={product.id}
                className={`group cursor-pointer flex-shrink-0 w-72 transition-all duration-500 ${
                  hoveredProduct === product.id ? 'scale-105' : ''
                }`}
                onClick={() => handleProductClick(product.id)}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className={`relative h-full bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border overflow-hidden transition-all duration-500 p-6 ${
                  hoveredProduct === product.id
                    ? 'border-primary/50 bg-white/20 shadow-primary/20'
                    : 'border-white/20 hover:bg-white/20 hover:shadow-2xl'
                }`}>
                  {/* Background Blurs */}
                  <div className="absolute top-[-40px] right-[-30px] w-64 h-64 bg-primary/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>

                  {/* Glass edge highlights */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30"></div>
                  <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-black/5"></div>

                  {/* Content Container */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Product Image */}
                    <div className="flex justify-center mb-4">
                      <div className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain rounded-lg"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="text-center space-y-3 flex-grow">
                      <span className="text-xs text-secondary-green font-medium">
                        {product.category}
                      </span>

                      <h3 className="text-lg font-bold text-light">
                        {product.name}
                      </h3>

                      <p className="text-light text-sm leading-relaxed">
                        {product.description}
                      </p>

                      {/* Clean Rating */}
                      <div className="flex items-center justify-center gap-1">
                        {renderStars(product.rating)}
                        <span className="text-sm text-muted ml-2">
                          ({product.rating})
                        </span>
                      </div>

                      {/* Clean Price */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted">
                          Starting from
                        </span>
                        <span className="text-2xl font-bold text-light">
                          {product.price}
                        </span>
                      </div>

                      {/* Clean Button */}
                      <button 
                        className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl transition-all duration-300 ${
                          hoveredProduct === product.id
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'bg-white/20 text-light hover:bg-white/30'
                        }`}
                      >
                        <ShoppingCart size={16} />
                        Find Stores
                        <ChevronRight size={14} className={`transition-transform duration-300 ${
                          hoveredProduct === product.id ? 'translate-x-1' : ''
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clean Scroll Indicators */}
          <div className="flex justify-center mt-8">
            <div className="bg-white/15 backdrop-blur-xl rounded-full p-3 border border-white/20 shadow-lg">
              {otcProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    scrollToIndex(index);
                    setIsAutoScrolling(false);
                    setTimeout(() => setIsAutoScrolling(true), 5000);
                  }}
                  className={`inline-block w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary w-8' 
                      : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Clean Call to Action */}
        <div className="text-center">
          <div className="inline-block relative bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 overflow-hidden">
            {/* Glass edge highlights */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30"></div>
            <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-black/5"></div>
            
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-secondary to-primary text-white font-medium rounded-xl hover:from-secondary-hover hover:to-primary-hover transition-all duration-300 shadow-lg hover:shadow-xl">
              <ShoppingCart size={18} />
              Browse All Products
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OtcProducts;