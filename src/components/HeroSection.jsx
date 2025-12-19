import React, { useState, useEffect } from "react";
import { FaArrowDown } from "react-icons/fa";

const Hero = () => {
  const [counters, setCounters] = useState({
    members: 0,
    years: 0,
    publications: 0,
    events: 0,
  });

  const [isVisible, setIsVisible] = useState(false);

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
      const duration = 2000; // 2 seconds
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
  return (
    <div id="hero-section" className="w-full relative h-[78vh] overflow-hidden">
      <img
        src="https://res.cloudinary.com/dxvovx7s2/image/upload/v1765966922/Picsart_25-12-17_15-22-58-498_qeejns.jpg"
        alt="hero section image"
        className="w-full object-contain"
      />
      <div className="flex items-center justify-center gap-10 border border-b-0 border-white rounded-tl-4xl backdrop-blur-sm w-2xl h-35 absolute bottom-0 right-0">
        <div className="flex flex-col items-center justify-center text-white text-shadow-lg text-shadow-[#336EAA]">
          <p className="text-3xl">{counters.members}+</p>
          <p className="text-lg">Active Members</p>
        </div>
        <div className="flex flex-col items-center justify-center text-white text-shadow-lg text-shadow-[#336EAA]">
          <p className="text-3xl">{counters.years}+</p>
          <p className="text-lg">Years of Service</p>
        </div>
        <div className="flex flex-col items-center justify-center text-white text-shadow-lg text-shadow-[#336EAA]">
          <p className="text-3xl">{counters.publications}+</p>
          <p className="text-lg">Publications</p>
        </div>
        <div className="flex flex-col items-center justify-center text-white text-shadow-lg text-shadow-[#336EAA]">
          <p className="text-3xl">{counters.events}+</p>
          <p className="text-lg">Annual Events</p>
        </div>
      </div>
      <div className="w-15 h-15 border border-[#336EAA] rounded-full absolute bottom-5 left-10 bg-white flex items-center justify-center text-[#336EAA] hover:text-white hover:bg-[#336EAA] hover:border-white transition-all duration-300 cursor-pointer">
        <FaArrowDown size={30} />
      </div>
    </div>
  );
};

export default Hero;
