import React, { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Ayesha Perera",
    role: "Colombo",
    text: "PillPath made it so easy to get my prescriptions delivered. The pharmacy matching is fast and I love the reminders!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Nuwan Silva",
    role: "Kandy",
    text: "I manage my whole family's meds with PillPath. The family profiles and refill reminders are a lifesaver.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Shanika Fernando",
    role: "Galle",
    text: "The OTC store is so convenient and the prices are great. Delivery was quick and support is excellent.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Rohan Wickramasinghe",
    role: "Negombo",
    text: "The medication reminders have been a game-changer for managing my daily medications. Highly recommended!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    name: "Priya Jayawardena",
    role: "Matara",
    text: "Fast delivery and excellent customer service. PillPath has made pharmacy visits a thing of the past.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
  },
];

const Testimonial = () => {
  const [hoveredTestimonial, setHoveredTestimonial] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={16} className="fill-yellow-400/50 text-yellow-400" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} className="text-white/30" />
      );
    }

    return stars;
  };

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Dark background matching OTC Products */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#030B17] via-[#0F172A] to-[#1E1B4B]"></div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        <div className="particles-container">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 animate-float-random"
              style={{
                width: `${Math.random() * 6 + 3}px`,
                height: `${Math.random() * 6 + 3}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 12 + 6}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-blue-500/10 rotate-45 opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full border-4 border-purple-500/10 -rotate-12 opacity-20"></div>
      <div className="absolute top-1/2 right-0 w-64 h-64 -translate-y-1/2 rounded-full radial-pulse-accent opacity-10"></div>

      {/* Floating Quote Icons */}
      <div className="absolute top-28 left-1/4 transform rotate-12 opacity-15">
        <Quote className="w-8 h-8 text-blue-400 animate-float-gentle" />
      </div>
      <div className="absolute bottom-40 right-1/3 transform -rotate-12 opacity-10">
        <Quote className="w-6 h-6 text-purple-400 animate-float-delay" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header matching OTC Products style */}
        <div className="text-center mb-12">
          <h6 className="text-green-400 uppercase tracking-wider text-sm font-semibold mb-2 animate-fade-in-up">
            Customer Reviews
          </h6>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up text-shadow-sm">
            <span className="text-gradient-primary">What Our</span>{" "}
            <span className="text-white">Users Say</span>
          </h2>

          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-full mx-auto mb-4"></div>

          <p className="text-white text-base max-w-2xl mx-auto animate-fade-in-up delay-200">
            Real stories from people who trust PillPath for their pharmacy needs
          </p>
        </div>

        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="relative">
            <h3 className="text-2xl font-bold text-white mb-3 text-shadow-sm tracking-tight">
              Customer Testimonials
            </h3>
            <p className="text-gray-300 text-sm font-medium">
              Trusted by thousands of{" "}
              <span className="text-green-400 font-semibold">happy customers</span>
            </p>
            <div className="w-12 h-0.5 bg-blue-500 mt-3 rounded-full"></div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevClick}
              className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={handleNextClick}
              className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className={`group cursor-pointer transition-all duration-500 ${
                hoveredTestimonial === index ? "scale-105 z-10" : ""
              }`}
              onMouseEnter={() => setHoveredTestimonial(index)}
              onMouseLeave={() => setHoveredTestimonial(null)}
            >
              <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/10 p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden h-full">
                {/* Glass highlight effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Quote icon */}
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <Quote className="w-8 h-8 text-blue-400" />
                </div>

                {/* Avatar section */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm p-1 shadow-lg border border-white/20 transition-all duration-300 group-hover:scale-105">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full rounded-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-3 relative z-10">
                  {/* Name and role */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                      {testimonial.name}
                    </h3>
                    <span className="text-xs text-green-400 font-medium">
                      {testimonial.role}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {renderStars(testimonial.rating)}
                    <span className="text-xs text-gray-400 ml-2">
                      ({testimonial.rating}.0)
                    </span>
                  </div>

                  {/* Testimonial text */}
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                    "{testimonial.text}"
                  </p>

                  {/* Verified badge */}
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs border border-green-500/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Verified Customer
                    </span>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 group-hover:w-full transition-all duration-700"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-green-400 mb-2">4.9/5</div>
            <div className="text-gray-300 text-sm">Average Rating</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-blue-400 mb-2">50,000+</div>
            <div className="text-gray-300 text-sm">Happy Customers</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
            <div className="text-gray-300 text-sm">Would Recommend</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl">
            <Star size={18} />
            Share Your Experience
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;