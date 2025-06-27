import React, { useState } from 'react';
import Header from './Header';
import PharmacySlide from './PharmacySlide';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-in-out" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        <div className="min-w-full">
          <Header />
        </div>
        <div className="min-w-full">
          <PharmacySlide />
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
        {[...Array(totalSlides)].map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === i ? 'bg-pButtonH' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Optional: Navigation Arrows */}
      <button 
        onClick={prevSlide} 
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/30 backdrop-blur-sm p-2 rounded-full"
        aria-label="Previous slide"
      >
        ◀
      </button>
      <button 
        onClick={nextSlide} 
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/30 backdrop-blur-sm p-2 rounded-full"
        aria-label="Next slide"
      >
        ▶
      </button>
    </div>
  );
};

export default Slider;