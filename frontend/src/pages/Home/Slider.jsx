import React, { useState, useEffect, useRef } from "react";
import Hero1 from "./Hero1";
import Hero2 from "./Hero2";
import Navbar from "../../components/Layout/Navbar";

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const totalSlides = 2; // Header and PharmacySlide
  const slideInterval = 10000; // 10 seconds
  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Function to reset and start timer
  const resetTimer = () => {
    // Clear existing timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    // Reset progress
    setProgress(0);

    // Start progress bar animation
    let startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const calculatedProgress = Math.min(
        (elapsedTime / slideInterval) * 100,
        100
      );
      setProgress(calculatedProgress);
    }, 50);

    // Set timer for slide change
    timerRef.current = setTimeout(() => {
      nextSlide();
    }, slideInterval);
  };

  // Initialize timer on component mount
  useEffect(() => {
    resetTimer();

    return () => {
      // Cleanup on unmount
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, []);

  // Handle pausing/resuming
  useEffect(() => {
    if (isPaused) {
      // Pause timers
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    } else {
      // Resume timers
      resetTimer();
    }
  }, [isPaused]);

  // Reset animations when slide changes
  useEffect(() => {
    const titleElements = document.querySelectorAll(".animate-title-entrance");
    const logoElements = document.querySelectorAll(".animate-logo-entrance");
    const fadeUpElements = document.querySelectorAll(".animate-fade-in-up");
    const fadeLeftElements = document.querySelectorAll(".animate-fade-in-left");
    const fadeRightElements = document.querySelectorAll(
      ".animate-fade-in-right"
    );
    const scaleInElements = document.querySelectorAll(".animate-scale-in");
    const fadeScaleElements = document.querySelectorAll(
      ".animate-fade-in-scale"
    );

    const allAnimatedElements = [
      ...titleElements,
      ...logoElements,
      ...fadeUpElements,
      ...fadeLeftElements,
      ...fadeRightElements,
      ...scaleInElements,
      ...fadeScaleElements,
    ];
    allAnimatedElements.forEach((el) => {
      el.style.animation = "none";
      el.offsetHeight; // Trigger reflow
      el.style.animation = null;
    });
  }, [currentSlide]);
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    resetTimer();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    resetTimer();
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    resetTimer();
  };

  return (
    <>
      <Navbar />
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          <div className="min-w-full">
            <Hero1 />
          </div>
          <div className="min-w-full">
            <Hero2 />
          </div>
        </div>

        {/* Modern Navigation Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-3 z-10">
          {[...Array(totalSlides)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`group relative flex items-center justify-center h-6 transition-all duration-300 ${
                currentSlide === i ? "w-12" : "w-6"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            >
              <span
                className={`absolute inset-0 rounded-full ${
                  currentSlide === i
                    ? "bg-secondary shadow-md shadow-secondary/40 scale-100"
                    : "bg-white/30 scale-75 group-hover:scale-90 group-hover:bg-white/50"
                } transition-all duration-300`}
              />
              {currentSlide === i && (
                <span className="relative text-[8px] font-medium text-white z-10">
                  {i + 1}/{totalSlides}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Timer Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-10">
          <div
            className="h-full bg-secondary transition-all ease-linear rounded-r-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-all duration-300 z-10"
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-all duration-300 z-10"
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </>
  );
};

export default Slider;
