import React, { useState, useEffect } from "react";
import { FaArrowDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useData } from "../context/DataContext";

const Hero = () => {
  const [counters, setCounters] = useState({
    members: 0,
    years: 0,
    publications: 0,
    events: 0,
  });

  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const {carousel} = useData();
  // Background images array
  const backgroundImages = [
    "https://res.cloudinary.com/dxvovx7s2/image/upload/v1765966922/Picsart_25-12-17_15-22-58-498_qeejns.jpg",
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"
  ];

  // Auto slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carousel.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval);
  }, [carousel.length]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const sectionElement = document.querySelector("#hero-section");
    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);

  // Counter animation
  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      const targetValues = {
        members: 200,
        years: 15,
        publications: 150,
        events: 12,
      };

      const incrementValues = {
        members: targetValues.members / steps,
        years: targetValues.years / steps,
        publications: targetValues.publications / steps,
        events: targetValues.events / steps,
      };

      let currentStep = 0;
      const counterInterval = setInterval(() => {
        currentStep++;
        setCounters((prev) => ({
          members: Math.min(
            Math.floor(incrementValues.members * currentStep),
            targetValues.members
          ),
          years: Math.min(
            Math.floor(incrementValues.years * currentStep),
            targetValues.years
          ),
          publications: Math.min(
            Math.floor(incrementValues.publications * currentStep),
            targetValues.publications
          ),
          events: Math.min(
            Math.floor(incrementValues.events * currentStep),
            targetValues.events
          ),
        }));

        if (currentStep >= steps) {
          clearInterval(counterInterval);
        }
      }, interval);

      return () => clearInterval(counterInterval);
    }
  }, [isVisible]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carousel.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carousel.length) % carousel.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div id="hero-section" className="w-full relative h-screen md:h-[78vh] overflow-hidden">
      {/* Background Images Carousel */}
      <div className="relative w-full h-full">
        {carousel.map((image, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`hero background ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {/* <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30 transition-all duration-300 z-10"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/30 transition-all duration-300 z-10"
        aria-label="Next slide"
      >
        <FaChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button> */}

      {/* Slide Indicators */}
      <div className="absolute bottom-20 md:bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {carousel.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white scale-125" 
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Stats Container - Made responsive */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-4 md:gap-6 lg:gap-10 border border-b-0 border-white rounded-tl-4xl backdrop-blur-sm w-full md:w-auto max-w-full md:max-w-2xl h-auto md:h-35 p-4 absolute bottom-0 md:right-0 md:rounded-tl-[40px] lg:rounded-tl-[60px] z-10 bg-black/30">
        <div className="flex flex-col items-center justify-center text-white text-shadow-lg text-shadow-[#336EAA] min-w-[120px] md:min-w-0">
          <p className="text-2xl md:text-3xl lg:text-4xl">{counters.members}+</p>
          <p className="text-sm md:text-base lg:text-lg text-center">Active Members</p>
        </div>
        <div className="flex flex-col items-center justify-center text-white text-shadow-lg text-shadow-[#336EAA] min-w-[120px] md:min-w-0">
          <p className="text-2xl md:text-3xl lg:text-4xl">{counters.years}+</p>
          <p className="text-sm md:text-base lg:text-lg text-center">Years of Service</p>
        </div>
        <div className="flex flex-col items-center justify-center text-white text-shadow-lg text-shadow-[#336EAA] min-w-[120px] md:min-w-0">
          <p className="text-2xl md:text-3xl lg:text-4xl">{counters.publications}+</p>
          <p className="text-sm md:text-base lg:text-lg text-center">Publications</p>
        </div>
        <div className="flex flex-col items-center justify-center text-white text-shadow-lg text-shadow-[#336EAA] min-w-[120px] md:min-w-0">
          <p className="text-2xl md:text-3xl lg:text-4xl">{counters.events}+</p>
          <p className="text-sm md:text-base lg:text-lg text-center">Annual Events</p>
        </div>
      </div>
      
      {/* Scroll Down Button */}
      <div className="w-12 h-12 md:w-15 md:h-15 border border-[#336EAA] rounded-full absolute bottom-4 left-4 md:bottom-5 md:left-10 bg-white flex items-center justify-center text-[#336EAA] hover:text-white hover:bg-[#336EAA] hover:border-white transition-all duration-300 cursor-pointer z-10">
        <FaArrowDown className="w-6 h-6 md:w-8 md:h-8" />
      </div>
    </div>
  );
};

export default Hero;
